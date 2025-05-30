"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBikes } from "../../services/bikeService";
import { Bike } from "../../models/Bike";
import { getAssetPath } from "../../utils/pathUtils";
import SizeGuideModal from "../../components/SizeGuideModal";
import ImageZoomModal from "../../components/ImageZoomModal";

export default function BikeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupedBikes, setGroupedBikes] = useState<Bike[]>([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const bikes = await getBikes();
        const found = bikes.find((b) => b.id === id);
        setBike(found || null);
        if (found) {
          const modelPrefix = found.modelNumber.slice(0, -2);
          const sameModelBikes = bikes.filter(b => b.modelNumber.startsWith(modelPrefix));
          setGroupedBikes(sameModelBikes);
        }
      } catch (error) {
        setBike(null);
        setGroupedBikes([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBike();
  }, [id]);

  const handleOpenSizeGuide = () => {
    setSizeGuideOpen(true);
  };

  const handleCloseSizeGuide = () => {
    setSizeGuideOpen(false);
  };
  
  const handleOpenImageModal = () => {
    setImageModalOpen(true);
  };
  
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const getImageUrl = (bike: Bike | null) => {
    if (!bike) return '';
    return getAssetPath(`/jpeg/${bike.imageUrl}.jpeg`);
  };

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
        <div className="w-full lg:w-1/2">
          <div className="w-full" onClick={handleOpenImageModal}>
            <img
              src={getImageUrl(bike)}
              alt={bike.modelName}
              className="w-full h-auto object-contain cursor-pointer"
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
              <div className="text-gray-500 text-sm">Color</div>
              <div className="text-gray-900 font-medium">{bike.color}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Battery</div>
              <div className="text-gray-900 font-medium">{bike.battery}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Sizes</div>
              <div className="flex items-center">
                <span className="text-gray-900 font-medium">{groupedBikes.length > 1 ? 'more' : (bike.size || '-')}</span>
                <button 
                  onClick={handleOpenSizeGuide}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Size guide
                </button>
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Pieces</div>
              <div className="text-gray-900 font-medium">{groupedBikes.reduce((sum, b) => sum + (b.pieces || 0), 0)}</div>
            </div>
          </div>
          {/* Sizes Table */}
          {groupedBikes.length > 1 && (
            <div className="mb-4">
              <div className="text-gray-700 font-semibold mb-2">Available Sizes</div>
              <table className="min-w-full text-sm border rounded">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left">Size</th>
                    <th className="px-3 py-2 text-left">Pieces</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedBikes.reduce((acc, bike) => {
                    const size = bike.size || '-';
                    if (!acc[size]) acc[size] = 0;
                    acc[size] += bike.pieces || 0;
                    return acc;
                  }, {} as Record<string, number>))
                    .sort(([sizeA], [sizeB]) => {
                      const numA = parseInt(sizeA) || 0;
                      const numB = parseInt(sizeB) || 0;
                      return numA - numB;
                    })
                    .map(([size, pieces]) => (
                      <tr key={size}>
                        <td className="px-3 py-2">{size}</td>
                        <td className="px-3 py-2">{pieces}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          {bike.note && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <div className="text-yellow-800 font-semibold mb-1">Note</div>
              <div className="text-yellow-700 text-sm">{bike.note}</div>
            </div>
          )}
          {/* Prices */}
          <div className="flex flex-col items-end mb-4">
            {bike.priceRetail > 0 && (
              <span className="text-gray-400 text-base line-through mb-1">{bike.priceRetail.toLocaleString()} CZK</span>
            )}
            {bike.priceAction > 0 && (
              <span className="text-3xl font-bold text-green-700">{bike.priceAction.toLocaleString()} CZK</span>
            )}
          </div>
          <button
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            onClick={() => router.back()}
          >
            Back to Catalog
          </button>
        </div>
      </div>
      
      {/* Size Guide Modal */}
      <SizeGuideModal 
        open={sizeGuideOpen} 
        onClose={handleCloseSizeGuide} 
      />
      
      {/* Image Zoom Modal */}
      <ImageZoomModal
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        imageSrc={getImageUrl(bike)}
        imageAlt={bike?.modelName || 'Bike Image'}
      />
    </div>
  );
} 