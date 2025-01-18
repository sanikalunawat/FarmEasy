import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc,setDoc } from 'firebase/firestore';

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

async function fetchAndDisplayData() {
    try {
        const querySnapshot = await getDocs(collection(db, 'my orders'));
        const tableBody = document.querySelector('tbody');
        const transactions = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        // Clear existing table rows
        tableBody.innerHTML = '';

        let totalSales = 0; // Variable to store total sales

        // Iterate through each document and append to the table
        querySnapshot.forEach(doc => {
            const order = doc.data();

            const userId = order.userId;
            const items = Object.values(order.items).map(item => item.title).join(', '); // Extracting titles from items
            const quantity = Object.values(order.items).reduce((acc, item) => acc + item.quantity, 0);
            const total = Object.values(order.items).reduce((acc, item) => acc + (item.subtotal || (item.pay * item.quantity)), 0); // Calculate total

            // Add to total sales
            totalSales += total;

            // Create a new table row
            const row = document.createElement('tr');

            // Populate the row with data
            row.innerHTML = `
                <td>${userId}</td>
                <td>${items}</td>
                <td>${quantity}</td>
                <td>${total}</td>
            `;

            // Append the row to the table body
            tableBody.appendChild(row);
        });

        const totalSalesElement = document.querySelector('.summary .total-sales');
        if (totalSalesElement) {
            totalSalesElement.textContent = `Total Sales: Rs  ${totalSales}`;
        } else {
            console.error('Total Sales element not found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayData();
});
