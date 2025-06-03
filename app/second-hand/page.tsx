"use client";

import Link from "next/link";

export default function SecondHandPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center text-blue-800">Second Hand & Ex-Demo Ebikes</h1>
        <p className="text-lg text-gray-700 mb-10 text-center">
          Discover great deals on quality used and ex-demo ebikes. All bikes have been professionally checked and serviced. Photos and detailed descriptions coming soon!
        </p>
        <ul className="space-y-6">
          {/* Placeholder for used/test bikes */}
          <li className="bg-gray-50 rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Bike #1</h2>
              <p className="text-gray-600 mb-2">Description and photo coming soon.</p>
            </div>
            <Link href="#" className="text-blue-600 hover:underline font-semibold mt-4 md:mt-0">View Details</Link>
          </li>
          <li className="bg-gray-50 rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Bike #2</h2>
              <p className="text-gray-600 mb-2">Description and photo coming soon.</p>
            </div>
            <Link href="#" className="text-blue-600 hover:underline font-semibold mt-4 md:mt-0">View Details</Link>
          </li>
          {/* Add more bikes as needed */}
        </ul>
      </div>
    </main>
  );
} 