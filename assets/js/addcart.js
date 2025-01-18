import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB0pGEBA01P1KON0fE1wfKRjejnDj2OCuY",
    authDomain: "miniproject-8c47c.firebaseapp.com",
    projectId: "miniproject-8c47c",
    storageBucket: "miniproject-8c47c.appspot.com",
    messagingSenderId: "178975701060",
    appId: "1:178975701060:web:b4a5a45a02c0bdfc2c6411",
    measurementId: "G-7J80SKPLFV"
  };

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

function getCurrentUserID() {
    const user = auth.currentUser;
    if (user) {
        return user.uid;
    } else 
    {
        return null; 
    }
}

document.addEventListener('DOMContentLoaded', function () {

const q = collection(db, 'cart');
onSnapshot(q, (snapshot) => {
    let cart = [];
    snapshot.docs.forEach((doc) => {
        cart.push({...doc.data(), id: doc.id });
    });
    console.log(cart);
    });

    var addToCartButtons = document.querySelectorAll('.btn.btn-primary');
    var addToWishlistButtons = document.querySelectorAll('.product-btn');
    var purchaseButton = document.querySelector('.panel-btn');
    var removeItemButtons = document.querySelectorAll('.item-close-btn');
    var quantityInputs = document.querySelectorAll('.item-quantity');

    addToCartButtons.forEach(function (button) {
        button.addEventListener('click', addToCart);
    });

    addToWishlistButtons.forEach(function (button) {
        button.addEventListener('click', addToWishlist);
    });

    purchaseButton.addEventListener('click', purchase);

    removeItemButtons.forEach(function (button) {
        button.addEventListener('click', removeItemButton);
    });

    quantityInputs.forEach(function(input) {
        input.addEventListener('input', updatequantity);
    });

    updateCart(); 
});


function purchase(event) {
    var pbutton = event.target;
    var confirmed = window.confirm('DO YOU WANT TO PROCEED WITH THE ORDER?');

    if (confirmed) {
        // Save items in the cart as a single order in the "my orders" collection
        const userID = getCurrentUserID();
        const orderData = {};
        const cartItems = document.querySelectorAll('[data-side-panel="cart"] .panel-item');

        cartItems.forEach((cartItem, index) => {
            const title = cartItem.querySelector('.item-title').innerText;
            const pay = parseFloat(cartItem.querySelector('.price').textContent);
            const quantity = parseInt(cartItem.querySelector('.item-quantity').value);
            const imageSrc = cartItem.querySelector('.item-banner img').src;
            const subtotal = pay * quantity;

            // Store item details in the orderData object with unique keys
            orderData[`item${index}`] = {
                title: title,
                pay: pay,
                quantity: quantity,
                subtotal: subtotal,
                imageSrc: imageSrc
            };
        });

        // Add a new document with a unique ID to the "my orders" collection
        const orderRef = collection(db, 'my orders'); // Correctly reference the collection
        addDoc(orderRef, {
            userId: userID,
            items: orderData
        }).then((docRef) => {
            console.log("Order saved successfully with ID: ", docRef.id);
            // Redirect to a success page or perform any other action
             window.location.href = 'cart.html';
        }).catch((error) => {
            console.error("Error saving order: ", error);
        });
        

        // Clear the cart after placing the order
        const cartList = document.querySelector('[data-side-panel="cart"] .panel-list');
        cartList.innerHTML = '';
        updateCart();
    }
}



function removeItemButton(event) {
    var buttonClick = event.target;
    var parentElement = buttonClick.closest('.panel-item'); 
    var confirmed = window.confirm('Do You Want To Remove Element From Cart');
    if (confirmed) {
        var inputElement = parentElement.querySelector('.item-quantity');
        var quantity = parseInt(inputElement.value);
        if (quantity > 1) {
            inputElement.value = quantity - 1;
        } else {
            parentElement.remove();
        }
        const userID = getCurrentUserID();
        const title = parentElement.querySelector('.item-title').innerText;

        // Create a reference to the document
        const eventRef = doc(db, 'cart', title + userID);

        deleteDoc(eventRef)
            .then(() => {
                console.log("Document successfully deleted!");
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });

        updateCart();
    }
}

function updatequantity(event) {
    var input = event.target;
    var parentElement = input.closest('.panel-item'); // Find the parent item
    var title = parentElement.querySelector('.item-title').innerText;
    var price = parseFloat(parentElement.querySelector('.price').textContent);
    var quantity = parseInt(input.value);
    var subtotal = price * quantity;

    // Update quantity and subtotal fields in Firestore
    const userID = getCurrentUserID();
    const query = db.collection("cart").where("title", "==", title).where("userId", "==", userID);

    query.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Update the quantity and subtotal fields
                doc.ref.update({
                    quantity: quantity,
                    subtotal: subtotal
                }).then(() => {
                    console.log("Document successfully updated!");
                }).catch((error) => {
                    console.error("Error updating document: ", error);
                });
            });
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
    
    // Update the UI
    updateCart();
}


function addToCart(event) {
    console.log(auth.currentUser)
    var button = event.target;
    var productCard = button.closest('.product-card');
    console.log('Product Card:', productCard);
    var titleElement = productCard.querySelector('.card-title');
    console.log('Title Element:', titleElement);
    var payElement = productCard.querySelector('.price');
    console.log('Pay Element:', payElement);
    var imageElement = productCard.querySelector('.card-banner img');
    console.log('Image Element:', imageElement);

    if (!titleElement || !payElement || !imageElement) {
        console.error('Required elements not found');
        return;
    }

    var title = titleElement.innerText;
    var pay = parseFloat(payElement.textContent.match(/\d+\.\d+/)); // Extracting numeric value from payElement
    var imageSrc = imageElement.src;

    var cartItems = document.querySelectorAll('[data-side-panel="cart"] .panel-item');
    var itemAlreadyInCart = false;
    cartItems.forEach(function (cartItem) {
        var cartTitle = cartItem.querySelector('.item-title').innerText;
        if (cartTitle === title) {
            itemAlreadyInCart = true;
            var confirmed = window.confirm('This item is already in your cart. Do you want to add it again?');
            if (confirmed) {
                var inputElement = cartItem.querySelector('.item-quantity');
                var quantity = parseInt(inputElement.value) + 1;
                inputElement.value = quantity;
                updateCart();
            }
        }
    });

    if (!itemAlreadyInCart) {
        addItemToCart(title, pay, imageSrc);
    }
}

function addItemToCart(title, pay, imageSrc) {
    const userID = getCurrentUserID();
    const quantity = 1;
    const subtotal = pay * quantity; // Calculate subtotal
    addDoc(collection(db, 'cart'), {
        userId: userID,
        title: title,
        pay: pay,
        quantity: quantity,
        subtotal:subtotal,
        imageSrc: imageSrc
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        updateCart();
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

    // Adding item to UI
    var cartRow = document.createElement('li');
    cartRow.classList.add('panel-item');
    var cartItemList = document.querySelector('[data-side-panel="cart"] .panel-list');

    var cartRowContent = `
    <div class="panel-card">
        <figure class="item-banner">
            <img src="${imageSrc}" width="46" height="46" loading="lazy">
        </figure>
        <div>
            <p class="item-title">${title}</p>
            <input type="number" class="item-quantity" value="1">
            <div class="price">${pay}</div> 
        </div>
        <button class="item-close-btn" aria-label="Remove item">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    </div>`;

    cartRow.innerHTML = cartRowContent;
    cartItemList.appendChild(cartRow);

    cartRow.querySelector('.item-close-btn').addEventListener('click', removeItemButton);
}

function addToWishlist(event) {
    var button = event.target;
    var productCard = button.closest('.product-card');
    var titleElement = productCard.querySelector('.card-title');
    var payElement = productCard.querySelector('.price');
    var imageElement = productCard.querySelector('.card-banner img');
    var title = titleElement.innerText;
    var pay = payElement.innerText;
    var imageSrc = imageElement.src;

    var wishItems = document.querySelectorAll('[data-side-panel="whishlist"] .panel-item');
    var itemAlreadyInWishlist = false;
    
    wishItems.forEach(function (wishItem) {
        var wishTitle = wishItem.querySelector('.item-title').innerText;
        if (wishTitle === title) {
            itemAlreadyInWishlist = true;
            alert('This item is already in your wishlist.');
        }
    });

    if (!itemAlreadyInWishlist) {
        addItemToWishlistPanel(title, pay, imageSrc);
        alert('Item added to wishlist.');
    }
}

function addItemToWishlistPanel(title, pay, imageSrc) {

    const userID = getCurrentUserID();
    addDoc(collection(db, 'wishlist'), {
        userId: userID,
        title: title,
        pay: pay,
        imageSrc: imageSrc
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

    // Adding item to UI
    var payNumeric = parseFloat(pay.replace(/[^\d.]/g, '').replace(/^\.|\.+$/g, ""));
    var wishRow = document.createElement('li');
    wishRow.classList.add('panel-item');

    var wishItemList = document.querySelector('[data-side-panel="whishlist"] .panel-list');

    var wishRowContent = `
    <div class="panel-card">
        <figure class="item-banner">
            <img src="${imageSrc}" width="46" height="46" loading="lazy">
        </figure>
        <div>
            <p class="item-title">${title}</p>
            <span class="price">${pay}</span>
            <button class="btn btn-primary">Add to Cart</button>
        </div>
        <button class="item-close-btn" aria-label="Remove item">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    </div>`;

    wishRow.innerHTML = wishRowContent;

    wishRow.querySelector('.item-close-btn').addEventListener('click', function() {
        wishRow.remove(); // Remove the parent element when the close button is clicked
    });

    wishItemList.appendChild(wishRow);
   
    var addToCartButton = wishRow.querySelector('.btn.btn-primary');
    addToCartButton.addEventListener('click', function() {
        var cartItems = document.querySelectorAll('[data-side-panel="cart"] .panel-item');
        var itemAlreadyInCart = false;
        cartItems.forEach(function (cartItem) {
            var cartTitle = cartItem.querySelector('.item-title').innerText;
            if (cartTitle === title) {
                itemAlreadyInCart = true;
                var confirmed = window.confirm('This item is already in your cart. Do you want to add it again?');
                if (confirmed) {
                    var inputElement = cartItem.querySelector('.item-quantity');
                    var quantity = parseInt(inputElement.value) + 1;
                    inputElement.value = quantity;
                    updateCart();
                }
            }
        });

        if (!itemAlreadyInCart) {
            addItemToCart(title, payNumeric, imageSrc); // Use payNumeric instead of pay
            var alertMessage = 'The item "' + title + '" has been added to your cart.';
            alert(alertMessage);
            wishRow.remove();
            updateCart();
        }
    });
}

function updateCart() {
    var cartItems = document.querySelectorAll('[data-side-panel="cart"] .panel-item');
    var itemSubtotal = 0;

    cartItems.forEach(function (cartItem) {
        var priceElement = cartItem.querySelector('.price');
        var quantityElement = cartItem.querySelector('.item-quantity');
        var price = parseFloat(priceElement.textContent);
        var title = cartItem.querySelector('.item-title').innerText;
        var quantity = parseInt(quantityElement.value);
        var imageSrc = cartItem.querySelector('.item-banner img').src;
        itemSubtotal += price * quantity;
    });

    var subtotalElement = document.querySelector('.subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = 'Subtotal      R.s  ' + itemSubtotal.toFixed(2);
    }
}

