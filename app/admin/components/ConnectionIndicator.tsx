'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Tooltip } from '@mui/material';

export function useDbStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocs(collection(db, 'bikes'));
        setStatus('connected');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    testConnection();
  }, []);

  return { status, error };
}

export default function ConnectionIndicator() {
  const { status, error } = useDbStatus();
  return (
    <Tooltip 
      title={
        status === 'loading' ? 'Testing database connection...' :
        status === 'connected' ? 'Connected to database' :
        `Error connecting to database: ${error}`
      }
      arrow
      placement="top"
    >
      <div 
        className={`w-3 h-3 rounded-full ${status === 'loading' ? 'bg-yellow-400 animate-pulse' : status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}
        style={{ cursor: 'help', width: 14, height: 14 }}
      />
    </Tooltip>
  );
} 