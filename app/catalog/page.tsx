'use client';

import { useEffect, useState } from 'react';
import { getBikes } from '../services/bikeService';
import { Bike } from '../models/Bike';
import { getAssetPath } from '../utils/pathUtils';

export default function CatalogPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const bikesData = await getBikes();
        setBikes(bikesData);
      } catch (error) {
        console.error('Error fetching bikes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Bikes</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bikes.map((bike) => (
          <div
            key={bike.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative aspect-[4/3]">
              <img
                src={getAssetPath(`/retail-images/${bike.imageUrl}.jpg`)}
                alt={bike.modelName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {bike.modelName}
              </h2>
              <p className="text-gray-600 mb-2">{bike.manufacturer}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  {bike.priceAction?.toLocaleString()} CZK
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 