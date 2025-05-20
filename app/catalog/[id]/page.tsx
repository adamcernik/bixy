"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBikes } from "../../services/bikeService";
import { Bike } from "../../models/Bike";
import { getAssetPath } from "../../utils/pathUtils";

export default function BikeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const bikes = await getBikes();
        const found = bikes.find((b) => b.id === id);
        setBike(found || null);
      } catch (error) {
        setBike(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBike();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Bike not found</h1>
        <button
          className="text-blue-600 hover:underline"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-white">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="aspect-square w-full max-w-md flex items-center justify-center">
            <img
              src={getAssetPath(`/jpeg/${bike.imageUrl}.jpeg`)}
              alt={bike.modelName}
              className="w-full h-auto max-h-[500px] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAssetPath('/jpeg/placeholder.jpeg');
              }}
            />
          </div>
        </div>
        {/* Info */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{bike.modelName}</h1>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-lg text-gray-700 font-medium">{bike.manufacturer}</span>
            {bike.isEbike && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">E-bike</span>
            )}
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">{bike.category}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-gray-500 text-sm">Model Number</div>
              <div className="text-gray-900 font-medium">{bike.modelNumber}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Model Year</div>
              <div className="text-gray-900 font-medium">{bike.modelYear}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Frame Material</div>
              <div className="text-gray-900 font-medium">{bike.frameMaterial}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Weight</div>
              <div className="text-gray-900 font-medium">{bike.weight} kg</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Color</div>
              <div className="text-gray-900 font-medium">{bike.color}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Battery</div>
              <div className="text-gray-900 font-medium">{bike.battery}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Sizes</div>
              <div className="text-gray-900 font-medium">{bike.size || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Pieces</div>
              <div className="text-gray-900 font-medium">{bike.pieces ?? '-'}</div>
            </div>
          </div>
          {bike.note && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <div className="text-yellow-800 font-semibold mb-1">Note</div>
              <div className="text-yellow-700 text-sm">{bike.note}</div>
            </div>
          )}
          <button
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            onClick={() => router.back()}
          >
            Back to Catalog
          </button>
        </div>
      </div>
    </div>
  );
} 