// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
let app: FirebaseApp;
let db: Firestore;

try {
  // Check if Firebase app has been initialized
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } else {
    app = getApps()[0];
    console.log("Using existing Firebase app");
  }
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log("Firestore initialized successfully");
  
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Analytics can only be used in browser environment
const analytics: Analytics | null = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { db }; 