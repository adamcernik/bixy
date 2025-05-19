'use client';

import { useEffect, useState } from 'react';

export default function RetailPage() {
  const bikes = [
    {
        id: "1",
        modelName: "Bulls E-Core Evo 1",
        size: "M",
        priceRetail: 89990,
        imageUrl: "/retail-images/83061741.jpeg"
    },
    {
        id: "2",
        modelName: "Bulls E-Core Evo 2",
        size: "L",
        priceRetail: 99990,
        imageUrl: "/retail-images/83054337.jpeg"
    },
    {
        id: "3",
        modelName: "Bulls E-Core Evo 3",
        size: "M",
        priceRetail: 109990,
        imageUrl: "/retail-images/83054237.jpeg"
    },
    {
        id: "4",
        modelName: "Bulls E-Core Evo 4",
        size: "L",
        priceRetail: 119990,
        imageUrl: "/retail-images/68016741.jpeg"
    },
    {
        id: "5",
        modelName: "Bulls E-Core Evo 5",
        size: "M",
        priceRetail: 129990,
        imageUrl: "/retail-images/68016541.jpeg"
    },
    {
        id: "6",
        modelName: "Bulls E-Core Evo 6",
        size: "L",
        priceRetail: 139990,
        imageUrl: "/retail-images/66705544.jpeg"
    },
    {
        id: "7",
        modelName: "Bulls E-Core Evo 7",
        size: "M",
        priceRetail: 149990,
        imageUrl: "/retail-images/84704944.jpeg"
    },
    {
        id: "8",
        modelName: "Bulls E-Core Evo 8",
        size: "L",
        priceRetail: 159990,
        imageUrl: "/retail-images/84602541.jpeg"
    },
    {
        id: "9",
        modelName: "Bulls E-Core Evo 9",
        size: "M",
        priceRetail: 169990,
        imageUrl: "/retail-images/84705744.jpeg"
    },
    {
        id: "10",
        modelName: "Bulls E-Core Evo 10",
        size: "L",
        priceRetail: 179990,
        imageUrl: "/retail-images/84605841.jpeg"
    },
    {
        id: "11",
        modelName: "Bulls E-Core Evo 11",
        size: "M",
        priceRetail: 189990,
        imageUrl: "/retail-images/84706144.jpeg"
    },
    {
        id: "12",
        modelName: "Bulls E-Core Evo 12",
        size: "L",
        priceRetail: 199990,
        imageUrl: "/retail-images/84605041.jpeg"
    }
  ];

  function formatPrice(price: number) {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK'
    }).format(price);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Bixy E-Bikes Catalog</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bikes.map(bike => (
          <div key={bike.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="aspect-[4/3] relative">
              <img 
                src={bike.imageUrl} 
                alt={bike.modelName} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{bike.modelName}</h2>
              <div className="flex justify-between items-center mt-4">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Size {bike.size}
                </span>
                <span className="text-2xl font-semibold text-blue-600">
                  {formatPrice(bike.priceRetail)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 