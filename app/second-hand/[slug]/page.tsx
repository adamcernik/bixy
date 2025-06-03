"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Dummy data for second hand bikes
const secondHandBikes = [
  {
    slug: "wild-edge",
    name: "Bulls Wild Edge Team",
    mainImage: "/images/outlet/wild-edge/IMG_8366.jpeg",
    gallery: [
      "/images/outlet/wild-edge/IMG_8367.jpeg",
      "/images/outlet/wild-edge/IMG_8377.jpeg",
      "/images/outlet/wild-edge/IMG_8381.jpeg",
      "/images/outlet/wild-edge/IMG_8382.jpeg",
      "/images/outlet/wild-edge/IMG_8383.jpeg",
      "/images/outlet/wild-edge/IMG_8384.jpeg",
      "/images/outlet/wild-edge/IMG_8385.jpeg",
      "/images/outlet/wild-edge/IMG_8386.jpeg",
      "/images/outlet/wild-edge/IMG_8387.jpeg",
    ],
    description: "Full suspension professional bike. More information coming soon.",
    price: "65 000 CZK",
    info: [
      "Frame: Carbon (dummy info)",
      "Suspension: Full (dummy info)",
      "Size: L (dummy info)",
      "Condition: Excellent (dummy info)"
    ]
  },
  // Add more bikes here as needed
];

export default function SecondHandDetailPage() {
  const { slug } = useParams();
  const bike = secondHandBikes.find((b) => b.slug === slug);
  const [mainImg, setMainImg] = React.useState(bike?.mainImage || "");

  if (!bike) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bike not found</h1>
          <Link href="/second-hand" className="text-blue-600 hover:underline">Back to Second Hand Bikes</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/second-hand" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Second Hand Bikes</Link>
        <div className="flex flex-col md:flex-row gap-8 items-start bg-gray-50 rounded-lg shadow p-6">
          {/* Left: Images */}
          <div className="flex-1 flex flex-col items-center">
            <img
              src={mainImg}
              alt={bike.name}
              className="w-full max-w-xl rounded-lg object-cover max-h-[500px] mb-4"
            />
            <div className="grid grid-cols-4 gap-2 w-full max-w-xl mt-2">
              {[bike.mainImage, ...bike.gallery].map((img, idx) => (
                <div key={img} className="relative aspect-video">
                  <img
                    src={img}
                    alt={`Gallery image ${idx + 1}`}
                    className={`w-full h-16 object-cover rounded cursor-pointer border border-gray-200 hover:border-blue-500 ${mainImg === img ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setMainImg(img)}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Right: Info */}
          <div className="flex-1 flex flex-col justify-center items-start md:pl-8 mt-8 md:mt-0">
            <h1 className="text-3xl font-bold mb-2 text-blue-700">{bike.name}</h1>
            <p className="text-gray-700 mb-4">{bike.description}</p>
            <div className="text-2xl font-bold text-green-700 mb-2">{bike.price}</div>
            <ul className="text-gray-600 text-base list-disc pl-5 mb-4">
              {bike.info.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 