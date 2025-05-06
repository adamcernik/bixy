'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [collections, setCollections] = useState<string[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // First, let's check if we can access Firestore at all
        console.log("Testing Firebase connection...");
        
        // Try to get all collections
        const collectionsSnapshot = await getDocs(collection(db, 'bikes'));
        console.log("Connection successful", collectionsSnapshot);
        
        setStatus('success');
        setCollections(['bikes']);
      } catch (err) {
        console.error("Firebase connection error:", err);
        setStatus('error');
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Firebase Connection Test</h2>
      
      {status === 'loading' && <p>Testing connection to Firebase...</p>}
      
      {status === 'success' && (
        <div className="bg-green-100 p-3 rounded">
          <p className="text-green-800 font-semibold">✅ Connected successfully to Firebase!</p>
          <p>Available collections: {collections.length ? collections.join(', ') : 'None found'}</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-100 p-3 rounded">
          <p className="text-red-800 font-semibold">❌ Error connecting to Firebase</p>
          <p className="text-red-600">{error}</p>
          <div className="mt-3 text-sm">
            <p className="font-bold">Common solutions:</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Check if Firestore database is created in Firebase console</li>
              <li>Verify your Firebase security rules allow read/write</li>
              <li>Confirm your Firebase project credentials are correct</li>
              <li>Make sure your IP is not blocked by Firebase</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
} 