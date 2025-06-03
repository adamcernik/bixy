"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Dummy data for second hand bikes
const secondHandBikes = [
  {
    slug: "wild-edge",
    name: "Bulls Wild Edge Trail",
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
    description: "Full suspension professional bike. Více informací níže.",
    price: "65 000 CZK",
    info: [
      "Rám | super lite carbon fibre, monocoque, tapered headtube, internal cable routing, teleskope seatpost ready, boost tru axle",
      "Velikost rámu | M / L / XL",
      "Vidlice | RockShox Sid Select+ RL‑R, 110 mm",
      "Zadní tlumič | RockShox SidLuxe Sel+ RL‑R",
      "Řazení páky | Shimano Deore XT RD-M8100, Shadow Plus",
      "Počet rychlostí | 12-speed",
      "Přesmykač | Shimano Deore XT SL-M8100",
      "Kliky | Shimano Deore XT FC-M8100, 32T",
      "Brzdy | Shimano Deore XT BR-M8100 hydraulic disc, 180/180 mm",
      "Řídítka | Race Face Turbine",
      "Představec | Race Face Turbine",
      "Sedlovka | Limotec Alpha 1 Light dropper post RH 44 100 mm hub, RH 48 125 mm hub, RH 54 150 mm hub",
      "Sedlo | Selle Royal Vivo",
      "Zapletená kola | DT-Swiss X‑1900 Spline",
      "Pláště | Schwalbe Wicked Will Evo, Super Ground TLE, 62 – 622/29 x 2,4"
    ]
  },
  // Add more bikes here as needed
];

export default function SecondHandDetailPage() {
  const { slug } = useParams();
  const bike = secondHandBikes.find((b) => b.slug === slug);
  const images = [bike?.mainImage, ...(bike?.gallery || [])];
  const [mainImg, setMainImg] = React.useState(bike?.mainImage || "");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalIdx, setModalIdx] = React.useState(0);

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
            <div className="relative w-full max-w-xl mb-4">
              <img
                src={mainImg}
                alt={bike.name}
                className="w-full rounded-lg object-cover max-h-[500px] cursor-pointer"
                onClick={() => { setModalOpen(true); setModalIdx(images.indexOf(mainImg)); }}
              />
              {/* Zoom icon overlay */}
              <button
                className="absolute bottom-4 right-4 bg-black bg-opacity-60 rounded-full p-2 text-white cursor-pointer hover:bg-opacity-80 z-10"
                onClick={() => { setModalOpen(true); setModalIdx(images.indexOf(mainImg)); }}
                aria-label="Zoom image"
                style={{ lineHeight: 0 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 w-full max-w-xl mt-2">
              {images.map((img, idx) => (
                <div key={img} className="relative aspect-video">
                  <img
                    src={img}
                    alt={`Gallery image ${idx + 1}`}
                    className={`w-full h-16 object-cover rounded cursor-pointer border border-gray-200 hover:border-blue-500 ${mainImg === img ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => { setMainImg(img || ""); setModalOpen(true); setModalIdx(idx); }}
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
              onClick={() => setModalIdx((modalIdx - 1 + images.length) % images.length)}
              aria-label="Previous image"
            >
              &#8592;
            </button>
            <img
              src={images[modalIdx]}
              alt="Gallery large view"
              className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl px-2 py-1 bg-black bg-opacity-40 rounded-full cursor-pointer"
              onClick={() => setModalIdx((modalIdx + 1) % images.length)}
              aria-label="Next image"
            >
              &#8594;
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 