'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getAssetPath } from '../utils/pathUtils';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { label: 'Katalog', href: '/catalog' },
  { label: 'Služby', href: '/services' },
  { label: 'Příběh', href: '/about' },
  { label: 'Second Hand', href: '/second-hand' },
  { label: 'Kontakt', href: '/contact' },
];

const adminMenuItems = [
  { label: 'Inventory', href: '/admin/inventory' },
  { label: 'Export', href: '/admin/export' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center cursor-pointer select-none">
              <img
                src={getAssetPath('/images/adam-bikes-electric-cycling-logo.svg')}
                alt="Adam Bikes Logo"
                width={176}
                height={28}
                style={{ objectFit: 'contain' }}
                className="cursor-pointer select-none"
              />
            </Link>
          </div>
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-gray-600 hover:text-gray-900 cursor-pointer select-none">
                {item.label}
              </Link>
            ))}
            {isAdmin && adminMenuItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-gray-600 hover:text-gray-900 cursor-pointer select-none">
                {item.label}
              </Link>
            ))}
          </nav>
          {/* Hamburger Icon for Mobile */}
          <button
            className="md:hidden flex items-center px-3 py-2 border rounded text-gray-600 border-gray-400 hover:text-gray-900 hover:border-gray-900 cursor-pointer select-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden bg-white border-t border-gray-200 py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer select-none"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && adminMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer select-none"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
} 