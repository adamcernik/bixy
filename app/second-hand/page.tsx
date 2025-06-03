"use client";

import Link from "next/link";
import { useState } from "react";

export default function SecondHandPage() {
  // Gallery modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Gallery images
  const galleryImages = [
    "/images/outlet/wild-edge/IMG_8367.jpeg",
    "/images/outlet/wild-edge/IMG_8377.jpeg",
    "/images/outlet/wild-edge/IMG_8381.jpeg",
    "/images/outlet/wild-edge/IMG_8382.jpeg",
    "/images/outlet/wild-edge/IMG_8383.jpeg",
    "/images/outlet/wild-edge/IMG_8384.jpeg",
    "/images/outlet/wild-edge/IMG_8385.jpeg",
    "/images/outlet/wild-edge/IMG_8386.jpeg",
    "/images/outlet/wild-edge/IMG_8387.jpeg",
  ];

  const mainImage = "/images/outlet/wild-edge/IMG_8366.jpeg";

  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center text-blue-800">Second Hand & Ex-Demo Ebikes</h1>
        <p className="text-lg text-gray-700 mb-10 text-center">
          Discover great deals on quality used and ex-demo ebikes. All bikes have been professionally checked and serviced. Photos and detailed descriptions coming soon!
        </p>

        {/* Featured Bike: Bulls Wild Edge Team */}
        <section className="mb-12 bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-700">Bulls Wild Edge Team</h2>
          <p className="text-gray-700 mb-4">Full suspension professional bike. More information coming soon.</p>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={mainImage}
              alt="Bulls Wild Edge Team main image"
              className="w-full md:w-1/2 rounded-lg cursor-pointer object-cover max-h-96"
              onClick={() => { setModalOpen(true); setCurrentImgIdx(0); }}
            />
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {galleryImages.map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Gallery image ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded cursor-pointer border border-gray-200 hover:border-blue-500"
                    onClick={() => { setModalOpen(true); setCurrentImgIdx(idx + 1); }}
                  />
                ))}
              </div>
              <ul className="text-gray-600 text-sm list-disc pl-5">
                <li>Frame: Carbon (dummy info)</li>
                <li>Suspension: Full (dummy info)</li>
                <li>Size: L (dummy info)</li>
                <li>Condition: Excellent (dummy info)</li>
                <li>Price: To be announced</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Gallery Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none cursor-pointer"
              onClick={() => setModalOpen(false)}
              aria-label="Close gallery"
            >
              &times;
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl px-2 py-1 bg-black bg-opacity-40 rounded-full cursor-pointer"
              onClick={() => setCurrentImgIdx((currentImgIdx - 1 + 1 + galleryImages.length) % (galleryImages.length + 1))}
              aria-label="Previous image"
            >
              &#8592;
            </button>
            <img
              src={currentImgIdx === 0 ? mainImage : galleryImages[currentImgIdx - 1]}
              alt="Gallery large view"
              className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl px-2 py-1 bg-black bg-opacity-40 rounded-full cursor-pointer"
              onClick={() => setCurrentImgIdx((currentImgIdx + 1) % (galleryImages.length + 1))}
              aria-label="Next image"
            >
              &#8594;
            </button>
          </div>
        )}

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