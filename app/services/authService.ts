'use client';

import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  getDocs,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db, ADMIN_EMAIL } from '../firebase/config';

// Define the User model with access permission
export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  hasAccess: boolean;
  isAdmin: boolean;
  lastLogin: Timestamp;
  createdAt: Timestamp;
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserData | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in the database
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    const now = Timestamp.now();
    
    // If this is the admin, give full access
    const isAdmin = user.email === ADMIN_EMAIL;
    
    if (!userSnap.exists()) {
      // Create a new user document
      const userData: UserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL,
        // Automatically grant access to admin, others need approval
        hasAccess: isAdmin,
        isAdmin: isAdmin,
        lastLogin: now,
        createdAt: now
      };
      
      await setDoc(userRef, userData);
      return userData;
    } else {
      // Update the lastLogin time
      const userData = userSnap.data() as UserData;
      await updateDoc(userRef, { lastLogin: now });
      return userData;
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return null;
  }
};

// Sign out
export const signOutUser = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    return false;
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (user: User): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error getting current user data:", error);
    return null;
  }
};

// Get all users (for admin only)
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    
    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserData);
    });
    
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

// Update user access (admin only)
export const updateUserAccess = async (
  uid: string, 
  hasAccess: boolean
): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { hasAccess });
    return true;
  } catch (error) {
    console.error("Error updating user access:", error);
    return false;
  }
}; 