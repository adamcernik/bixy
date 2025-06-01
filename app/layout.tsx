import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import FooterWrapper from './components/FooterWrapper';
import { Analytics } from '@vercel/analytics/next';

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bixy - Bike Inventory Management",
  description: "Efficient bike inventory management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
        <FooterWrapper />
        <Analytics />
      </body>
    </html>
  );
}
