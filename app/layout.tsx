import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import AppFooter from './components/AppFooter';
import { Analytics } from '@vercel/analytics/next';
import Link from 'next/link';
import { getAssetPath } from './utils/pathUtils';

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Adam Bikes",
  description: "Bike inventory management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${geist.variable} font-sans`}>
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
        <AuthProvider>{children}</AuthProvider>
        <AppFooter />
        <Analytics />
      </body>
    </html>
  );
}
