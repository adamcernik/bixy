import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import AppFooter from './public/components/AppFooter';
import { Analytics } from '@vercel/analytics/next';
import PublicHeaderWrapper from './public/components/PublicHeaderWrapper';

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Adam Bikes",
  description: "Bike inventory management system",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000'
      },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  other: {
    'msapplication-TileColor': '#da532c',
    'msapplication-TileImage': '/ms-icon-144x144.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans`}>
        <PublicHeaderWrapper />
        <AuthProvider>{children}</AuthProvider>
        <AppFooter />
        <Analytics />
      </body>
    </html>
  );
}
