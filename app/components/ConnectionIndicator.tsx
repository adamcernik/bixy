'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Tooltip } from '@mui/material';

export default function ConnectionIndicator() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test Firebase connection
        const collectionsSnapshot = await getDocs(collection(db, 'bikes'));
        setStatus('connected');
      } catch (err) {
        console.error("Firebase connection error:", err);
        setStatus('error');
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    testConnection();
  }, []);

  return (
    <Tooltip 
      title={
        status === 'loading' ? 'Testing database connection...' :
        status === 'connected' ? 'Connected to database' :
        `Error connecting to database: ${error}`
      }
      arrow
      placement="bottom"
    >
      <div 
        className={`
          w-3 h-3 rounded-full 
          ${status === 'loading' ? 'bg-yellow-400 animate-pulse' : 
            status === 'connected' ? 'bg-green-500' : 
            'bg-red-500'}
        `}
        style={{ cursor: 'help' }}
      />
    </Tooltip>
  );
} 