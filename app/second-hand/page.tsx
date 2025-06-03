"use client";

import Link from "next/link";
import { useState } from "react";

// Dummy data for second hand bikes
const secondHandBikes = [
  {
    slug: "wild-edge",
    name: "Bulls Wild Edge Team",
    mainImage: "/images/outlet/wild-edge/IMG_8366.jpeg",
    description: "Full suspension professional bike. More information coming soon.",
    price: "65 000 CZK",
  },
  // Add more bikes here as needed
];

export default function SecondHandPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center text-blue-800">Second Hand & Ex-Demo Ebikes</h1>
        <p className="text-lg text-gray-700 mb-10 text-center">
          Discover great deals on quality used and ex-demo ebikes. All bikes have been professionally checked and serviced.
        </p>
        <ul className="space-y-8">
          {secondHandBikes.map((bike) => (
            <li key={bike.slug} className="bg-gray-50 rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
              <Link href={`/second-hand/${bike.slug}`} className="block w-full md:w-1/3">
                <img
                  src={bike.mainImage}
                  alt={bike.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 md:mb-0 hover:opacity-90 transition cursor-pointer"
                />
              </Link>
              <div className="flex-1 flex flex-col items-start">
                <Link href={`/second-hand/${bike.slug}`} className="hover:underline text-xl font-bold text-blue-700 mb-2 cursor-pointer">
                  {bike.name}
                </Link>
                <p className="text-gray-700 mb-2">{bike.description}</p>
                <div className="text-lg font-bold text-green-700">{bike.price}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
} 