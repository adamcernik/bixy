'use client';

import { useEffect, useState } from 'react';

export default function RetailPage() {
  const [bikes, setBikes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/retail-bikes.json')
      .then(res => res.json())
      .then(data => setBikes(data));
  }, []);

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
                src={typeof bike.imageUrl === 'string' ? bike.imageUrl : `/retail-images/${bike.imageUrl}.jpeg`} 
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