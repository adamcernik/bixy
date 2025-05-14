// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAZ4cdr8KZU-Z5Ohp04MzvIGLG_tGblxfE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bixy-stock.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bixy-stock",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bixy-stock.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "357634877813",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:357634877813:web:80fc5b029a1606c3200b3c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3DZEWTG2HW"
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

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
  
  // Initialize Authentication
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  console.log("Firebase Auth initialized successfully");
  
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Analytics can only be used in browser environment
const analytics: Analytics | null = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Admin user email (the only one with full admin privileges)
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "adam.cernik@gmail.com";

export { db, auth, googleProvider }; 