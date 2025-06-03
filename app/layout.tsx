import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import AppFooter from './components/AppFooter';
import { Analytics } from '@vercel/analytics/next';
import Header from './components/Header';
import { usePathname } from 'next/navigation';

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
  // Only show the public header on non-admin pages
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAdminPage = pathname.startsWith('/stock');

  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${geist.variable} font-sans`}>
        {!isAdminPage && <Header />}
        <AuthProvider>{children}</AuthProvider>
        <AppFooter />
        <Analytics />
      </body>
    </html>
  );
}
