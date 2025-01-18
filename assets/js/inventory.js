// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0pGEBA01P1KON0fE1wfKRjejnDj2OCuY",
  authDomain: "miniproject-8c47c.firebaseapp.com",
  projectId: "miniproject-8c47c",
  storageBucket: "miniproject-8c47c.appspot.com",
  messagingSenderId: "178975701060",
  appId: "1:178975701060:web:b4a5a45a02c0bdfc2c6411",
  measurementId: "G-7J80SKPLFV"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add item to inventory and dynamically add row to table
async function addItemToInventory(itemName, quantity, price) {
    try {
        // Add a new document with a generated id to the 'inventory' collection
        const docRef = await addDoc(collection(db, 'inventory'), {
            itemName: itemName,
            quantity: quantity,
            price: price
        });
        console.log("Item added successfully");
        
        // Dynamically add row to table
        const tbody = document.querySelector('tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${itemName}</td>
            <td>${quantity}</td>
            <td>${price}</td>
            <td>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        tbody.appendChild(newRow);
        
        // Add event listener for delete button in the new row
        const deleteBtn = newRow.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
          // Ask for confirmation before deleting
          const confirmDelete = window.confirm("Are you sure you want to delete this item?");
          if (confirmDelete) {
              deleteItem(docRef.id); // Delete item from database
              tbody.removeChild(newRow); // Remove row from table
          }
      });
    } catch (error) {
        console.error("Error adding item: ", error);
    }
}

// Function to delete item from inventory
async function deleteItem(itemId) {
    try {
        await deleteDoc(doc(db, 'inventory', itemId));
        console.log("Item deleted successfully");
    } catch (error) {
        console.error("Error deleting item: ", error);
    }
}

// Event listener for form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const itemName = form.elements.item_name.value;
        const quantity = parseInt(form.elements.quantity.value);
        const price = parseFloat(form.elements.price.value);
        addItemToInventory(itemName, quantity, price);
        form.reset(); // Reset the form after submission
    });
});
