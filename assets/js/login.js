import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc ,doc,getDocs,query,where} from 'firebase/firestore';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,updateProfile ,
    onAuthStateChanged
} from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyB0pGEBA01P1KON0fE1wfKRjejnDj2OCuY",
    authDomain: "miniproject-8c47c.firebaseapp.com",
    projectId: "miniproject-8c47c",
    storageBucket: "miniproject-8c47c.appspot.com",
    messagingSenderId: "178975701060",
    appId: "1:178975701060:web:b4a5a45a02c0bdfc2c6411",
    measurementId: "G-7J80SKPLFV"
  };

initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//database
function saveUserRole(userId, role,fullName,phoneNo,address,email) {
    console.log(userId)
    addDoc(collection(db, 'users'), {
        uid: userId,
        role: role,
        fullname:fullName,
        phone:phoneNo,
        address:address,
        email:email,
    })
    .then((docRef) => {
        console.log('User role saved with ID: ', docRef.id);
        window.location.href = 'login.html';
    })
    .catch((error) => {
        console.error('Error saving user role: ', error);
    });
    
}

// Signup Form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName= signupForm.fullName.value;
        const phoneNo = signupForm.phoneNo.value; 
        const address = signupForm.address.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        const confirmpassword = signupForm.confirmPassword.value;
        const userType = signupForm.userType.value;
    
        if (password !== confirmpassword) {
            alert("Passwords do not match");
            return; // Prevent form submission if passwords don't match
        }
        console.log(email)
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up successfully
                const user = userCredential.user;
                const userEmail = userCredential.user.email; // Retrieve the email from userCredential
                saveUserRole(user.uid, userType, fullName, phoneNo, address, userEmail);
                console.log('User signed up:', user);
                signupForm.reset();
              
            })
            .catch((error) => {
                console.log(email)
                console.log(error)
                console.error('Error signing up:', error.message);
            });
    });
  }


// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        console.log(email)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User logged in:', user);
                // Fetch user role after login
                getUserRole(user.uid);
            })
            .catch((error) => {
                console.error('Error logging in:', error.message);
            });
    });
}
async function getUserRole(userId) {
    try {
        const q = query(collection(db, "users"), where("uid", "==", userId)); // Query based on "uid"
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            // Assuming there's only one document per user, but you might need additional logic if multiple documents exist
            const doc = querySnapshot.docs[0];
            console.log('User role:', doc.data().role);
           
            // Redirect user based on role
            if (doc.data().role === 'farmer') {
                window.location.href = 'farmerdashboard.html';
            } 
            else if (doc.data().role === 'customer') {
                window.location.href = 'index.html';
            } 
        } 

        else {
            console.log('User document not found');
        }
    } catch (error) {
        console.error('Error getting user document:', error);
    }
}

// // Auth State Change
// onAuthStateChanged(auth, (user) => {
//     console.log('User status changed:', user);
// });
