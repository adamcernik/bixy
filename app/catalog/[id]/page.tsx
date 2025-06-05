"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBikes } from "../../services/bikeService";
import { Bike } from "../../models/Bike";
import { getAssetPath } from "../../utils/pathUtils";
import SizeGuideModal from "../../components/SizeGuideModal";
import ImageZoomModal from "../../components/ImageZoomModal";
import Link from "next/link";

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
      <Link href="/catalog" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Zpět do katalogu</Link>
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
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">Elektrokolo</span>
            )}
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">{bike.category}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-gray-500 text-sm">Katalogové číslo</div>
              <div className="text-gray-900 font-medium">{bike.modelNumber}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Modelový rok</div>
              <div className="text-gray-900 font-medium">{bike.modelYear}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Materiál rámu</div>
              <div className="text-gray-900 font-medium">{bike.frameMaterial}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Barva</div>
              <div className="text-gray-900 font-medium">{bike.color}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Baterie</div>
              <div className="text-gray-900 font-medium">{bike.battery}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Velikosti</div>
              <div className="flex items-center">
                <span className="text-gray-900 font-medium">{groupedBikes.length > 1 ? 'více' : (bike.size || '-')}</span>
                <button 
                  onClick={handleOpenSizeGuide}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline text-sm font-semibold mb-2 cursor-pointer select-none"
                >
                  Tabulka velikostí
                </button>
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Ks</div>
              <div className="text-gray-900 font-medium">{groupedBikes.reduce((sum, b) => sum + (b.pieces || 0), 0)}</div>
            </div>
          </div>
          {/* Sizes Table */}
          {groupedBikes.length > 1 && (
            <div className="mb-4">
              <div className="text-gray-700 font-semibold mb-2">Dostupné velikosti</div>
              <table className="min-w-full text-sm border rounded">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left">Velikost</th>
                    <th className="px-3 py-2 text-left">Ks</th>
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
              <div className="text-yellow-800 font-semibold mb-1">Poznámka</div>
              <div className="text-yellow-700 text-sm">{bike.note}</div>
            </div>
          )}
          {/* Prices */}
          <div className="flex flex-col items-end mb-4">
            {/* Ceny skryty ve veřejném katalogu */}
          </div>
          {bike.link && (
            <a
              href={bike.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 ml-4 px-6 py-3 bg-transparent border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              Popis produktu
            </a>
          )}
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