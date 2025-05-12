'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { 
  getCurrentUserData, 
  signInWithGoogle, 
  signOutUser, 
  UserData 
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Get additional user data from Firestore
        const userDataFromFirestore = await getCurrentUserData(user);
        setUserData(userDataFromFirestore);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const userData = await signInWithGoogle();
      setUserData(userData);
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUserData(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value = {
    user,
    userData,
    loading,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 