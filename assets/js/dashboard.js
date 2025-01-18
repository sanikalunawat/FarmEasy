import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', async function () {
    const feedbackList = document.querySelector('.has-scrollbar');

    try {
        const feedbackCollection = collection(db, 'feedback');
        const querySnapshot = await getDocs(feedbackCollection);

        querySnapshot.forEach((doc) => {
            const feedback = doc.data();
            const listItem = `
                <li class="testi-item">
                    <div class="testi-card">
                        <div class="card-header">
                            <img src="./assets/images/quote-left.png" width="25" height="25" aria-hidden="true" alt="">
                            <img src="./assets/images/Profilepicture.jpg" width="100" height="100" aria-hidden="true" alt="" style="border-radius: 50%;">

                            <img src="./assets/images/quote-right.png" width="25" height="25" aria-hidden="true" alt="">
                        </div>
                        <div class="rating-wrapper">
                            ${generateStarIcons(feedback.rating)}
                        </div>
                        <blockquote class="card-text">${feedback.review}</blockquote>
                        <h3 class="card-title">Anonymous</h3>
                        <p class="card-subtitle">customer</p>
                    </div>
                </li>
            `;
            feedbackList.innerHTML += listItem;
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
    }
});

function generateStarIcons(rating) {
    let stars = '';
    for (let i = 0; i < rating; i++) {
        stars += '<ion-icon name="star"></ion-icon>';
    }
    return stars;
}