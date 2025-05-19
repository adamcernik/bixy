'use client';

import { useEffect, useState } from 'react';

export default function RetailPage() {
  const [bikes, setBikes] = useState<any[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

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

  function getImageUrl(bike: any) {
    if (imageErrors.has(bike.id)) {
      return '/retail-images/placeholder.jpeg';
    }

    const imageNumber = typeof bike.imageUrl === 'string' 
      ? bike.imageUrl 
      : bike.imageUrl.toString();

    // Map of known image numbers to their correct filenames
    const imageMap: { [key: string]: string } = {
      '847045': '84704944', // SONIC EVO TR - I
      '667082': '66705544', // SONIC EVO AMSL1
      '840186': '84602541', // Sturmvogel EVO 5F
      '666069': '68016541', // SONIC EVO EN1
      '830529': '83061741', // Copperhead EVO 2
      '84605041': '84605041', // SONIC EVO AM1
      '84704944': '84704944', // SONIC EVO AM1 White
      '83054237': '83054237', // Copperhead EVO 2 Wave
      '83054337': '83054337', // Copperhead EVO 2 Wave
      '68016741': '68016741', // SONIC EVO EN1
      '84705744': '84705744', // SONIC EVO AM1
      '84706144': '84706144', // SONIC EVO AM1
      '84605841': '84605841', // SONIC EVO AM1
    };

    const correctImage = imageMap[imageNumber] || imageNumber;
    return `/retail-images/${correctImage}.jpeg`;
  }

  function handleImageError(bikeId: string) {
    setImageErrors(prev => new Set([...prev, bikeId]));
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
                src={getImageUrl(bike)}
                alt={bike.modelName}
                className="w-full h-full object-contain"
                onError={() => handleImageError(bike.id)}
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