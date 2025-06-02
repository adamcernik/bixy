import type { Metadata, Viewport } from "next/types";

export const metadata: Metadata = {
  title: "Adam Bikes Stock Management",
  description: "Inventory management system for Bulls bikes",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" }
    ],
    apple: [
      { url: "/apple-touch-icon.png" }
    ]
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1.0
}; 