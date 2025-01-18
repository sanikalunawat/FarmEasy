import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged,signOut  } from 'firebase/auth';

// Initialize Firebase app
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
const auth = getAuth();

// Get HTML elements
const fullNameElement = document.getElementById('fullName');
const contactNoElement = document.getElementById('contactNo');
const emailIdElement = document.getElementById('emailId');
const addressElement = document.getElementById('address');
const roleElement = document.getElementById('role');
async function fetchUserDetails(userId) {
  try {
    // Reference to the users collection
    const q = query(collection(db, "users"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    // Check if any documents match the query
    if (!querySnapshot.empty) {
      // Get the first document from the query result
      const userDoc = querySnapshot.docs[0];

      // Get data from the document
      const userData = userDoc.data();

      // Update HTML elements with the fetched data
      fullNameElement.textContent = userData.fullname || 'N/A';
      contactNoElement.textContent = userData.phone || 'N/A';
      emailIdElement.textContent = userData.email || 'N/A';
      addressElement.textContent = userData.address || 'N/A';
      roleElement.textContent = userData.role || 'N/A';
    } else {
      console.error('User document does not exist');
      // Handle the case when the user document does not exist
      fullNameElement.textContent = 'N/A';
      contactNoElement.textContent = 'N/A';
      emailIdElement.textContent = 'N/A';
      addressElement.textContent = 'N/A';
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

// Check if a user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in, fetch their details
    fetchUserDetails(user.uid);
  } else {
    // User is not logged in, redirect to login page or handle accordingly
    window.location.href = 'login.html';
  }

  //logout
  const logoutButton = document.querySelector('.logoutButton');
    if (logoutButton) {
        
        logoutButton.addEventListener('click', function() {
            const auth = getAuth();
            signOut(auth)
                .then(() => {
                    console.log('User signed out successfully.');
                    window.location.href = 'login.html'; 
                })
                .catch((error) => {
                    console.error('Error signing out:', error.message);
                });
        });
    }
});
