'use client';

import { Inter } from 'next/font/google';
import { getAssetPath } from '../utils/pathUtils';

const inter = Inter({ subsets: ['latin'] });

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Adam Bikes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 