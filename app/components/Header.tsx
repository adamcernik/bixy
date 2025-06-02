'use client';

import Link from 'next/link';
import { getAssetPath } from '../utils/pathUtils';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src={getAssetPath('/adam-bikes-electric-cycling-logo.svg')}
                alt="Adam Bikes Logo"
                className="h-12 w-auto"
              />
            </Link>
          </div>
          <nav className="flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Catalog
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/stock" className="text-gray-600 hover:text-gray-900">
              Stock Management
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 