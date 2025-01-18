import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import getAuth to access the current user
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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
const auth = getAuth(app); // Initialize Firebase Authentication

document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.stars input');
    const reviewText = document.getElementById('reviewText');
    const submitReviewBtn = document.getElementById('submitReview');

    submitReviewBtn.addEventListener('click', async function() {
        const rating = getRating();
        const review = reviewText.value.trim();
        const user = auth.currentUser; // Get the current user

        if (!user) {
            alert('Please log in to submit feedback.');
            return;
        }

        if (rating === 0) {
            alert('Please select a rating.');
            return;
        }

        if (review === '') {
            alert('Please write your review.');
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'feedback'), {
                userId: user.uid, // Include the user ID in the feedback data
                rating: rating,
                review: review
            });
            console.log('Feedback saved with ID: ', docRef.id);
            // Clear the form after submission
            resetForm();
            alert('Thank you for your feedback!');
        } catch (error) {
            console.error('Error saving feedback: ', error);
            alert('An error occurred while saving your feedback. Please try again later.');
        }
    });

    function getRating() {
        let rating = 0;
        stars.forEach(function(star) {
            if (star.checked) {
                rating = parseInt(star.value);
            }
        });
        console.log('Current rating:', rating); // Log the current rating value
        return rating;
    }
    
    function resetForm() {
        stars.forEach(function(star) {
            star.checked = false;
        });
        reviewText.value = '';
    }
});
