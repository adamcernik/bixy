// Import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ4cdr8KZU-Z5Ohp04MzvIGLG_tGblxfE",
  authDomain: "bixy-stock.firebaseapp.com",
  projectId: "bixy-stock",
  storageBucket: "bixy-stock.appspot.com",
  messagingSenderId: "357634877813",
  appId: "1:357634877813:web:80fc5b029a1606c3200b3c",
  measurementId: "G-3DZEWTG2HW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to get all e-bikes
async function getEBikes() {
  try {
    const bikesCollection = collection(db, 'bikes');
    const snapshot = await getDocs(bikesCollection);
    const bikes = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(bike => bike.isEbike); // Only get e-bikes
    
    console.log('E-bikes:', bikes);
    return bikes;
  } catch (error) {
    console.error("Error fetching bikes:", error);
    return [];
  }
}

// Run the function
getEBikes(); 