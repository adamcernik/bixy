'use client';

import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/catalog" className="text-2xl font-bold text-gray-900">
                Bixy
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/catalog" className="text-gray-600 hover:text-gray-900">
                Catalog
              </Link>
              <Link href="/catalog/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/catalog/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Simple Copyright Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Bixy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 