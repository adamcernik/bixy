'use client';
import React from 'react';
import { signInWithGoogle, signOutUser } from '../lib/services/auth/authService';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { user, userData } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Přihlášení do administrace</h1>
        {user ? (
          <>
            <div className="flex flex-col items-center mb-4">
              <span className="text-lg font-semibold text-green-700 mb-2">Signed in as</span>
              <span className="text-blue-900 font-bold">{user.displayName || user.email}</span>
            </div>
            <Link href="/admin/inventory" className="w-full mb-2">
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 mb-2">
                Přejít do skladu
              </button>
            </Link>
            <button
              onClick={signOutUser}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
            >
              Odhlásit se
            </button>
          </>
        ) : (
          <>
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 mb-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.125s2.75-6.125 6.125-6.125c1.922 0 3.211.82 3.953 1.523l2.703-2.648c-1.727-1.617-3.953-2.617-6.656-2.617-5.523 0-10 4.477-10 10s4.477 10 10 10c5.758 0 9.578-4.039 9.578-9.758 0-.656-.07-1.148-.156-1.523z" fill="#FFC107"></path>
                  <path d="M3.152 7.345l3.289 2.414c.898-1.789 2.617-2.938 4.559-2.938 1.125 0 2.188.391 3.008 1.164l2.844-2.773c-1.617-1.523-3.711-2.412-5.852-2.412-3.617 0-6.672 2.344-7.789 5.545z" fill="#FF3D00"></path>
                  <path d="M12 22c2.43 0 4.672-.805 6.414-2.18l-2.953-2.414c-.82.617-1.867.992-3.461.992-2.789 0-5.148-1.883-5.992-4.414l-3.289 2.547c1.617 3.203 5.086 5.469 9.281 5.469z" fill="#4CAF50"></path>
                  <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.125s2.75-6.125 6.125-6.125c1.922 0 3.211.82 3.953 1.523l2.703-2.648c-1.727-1.617-3.953-2.617-6.656-2.617-5.523 0-10 4.477-10 10s4.477 10 10 10c5.758 0 9.578-4.039 9.578-9.758 0-.656-.07-1.148-.156-1.523z" fill="none"></path>
                </g>
              </svg>
              Přihlásit se přes Google
            </button>
            <p className="text-gray-500 text-sm mt-4 text-center">Pro přístup do administrace je nutné přihlášení Google účtem.</p>
          </>
        )}
      </div>
    </div>
  );
} 