'use client';

import { useEffect, useState, useMemo } from 'react';
import { getBikes } from './services/bikeService';
import { getPromotedBikes } from './services/promotedService';
import { Bike } from './models/Bike';
import { getAssetPath } from './utils/pathUtils';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';

// Available categories for filtering
const categories = ['MTB', 'Road', 'Gravel', 'City', 'Trekking', 'Kids', 'Other'];

// Height range options
const heightRanges = [
  { value: '', label: 'All Heights' },
  { value: '150-165', label: '150-165 cm' },
  { value: '160-175', label: '160-175 cm' },
  { value: '170-185', label: '170-185 cm' },
  { value: '180-195', label: '180-195 cm' },
  { value: '190-205', label: '190-205 cm' },
  { value: '200-210', label: '200-210 cm' }
];

// Size to height range mapping
const sizeToHeightRange: Record<string, string[]> = {
  '150-165': ['33', '34', '35', '36', '37'],
  '160-175': ['38', '39', '40', '41', '42', '43'],
  '170-185': ['43', '44', '45', '46', '47'],
  '180-195': ['47', '48', '49', '50', '51', '52'],
  '190-205': ['51', '52', '53', '54', '55', '56'],
  '200-210': ['53', '54', '55', '56', '57', '58', '59', '60']
};

// Sort options
const sortOptions = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'size-asc', label: 'Size: Small to Large' },
  { value: 'size-desc', label: 'Size: Large to Small' },
];

// Helper to get model prefix (model number without last two digits)
const getModelPrefix = (modelNumber: string) => modelNumber.slice(0, -2);

// Group bikes by model prefix
const groupBikesByModel = (bikes: Bike[]) => {
  const groups: Record<string, Bike[]> = {};
  bikes.forEach(bike => {
    const prefix = getModelPrefix(bike.modelNumber);
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(bike);
  });
  return Object.values(groups);
};

// Helper to get battery color based on value
const getBatteryColor = (battery: string) => {
  const match = battery.match(/(\d+)/);
  const value = match ? parseInt(match[1]) : 0;
  if (value >= 800) return 'bg-red-600';
  if (value >= 600) return 'bg-orange-500';
  return 'bg-yellow-400';
};

export default function HomePage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [promotedModelNumbers, setPromotedModelNumbers] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedHeightRange, setSelectedHeightRange] = useState<string>('');
  const [sortBy, setSortBy] = useState('price-desc');
  const [showOnlyEbikes, setShowOnlyEbikes] = useState(true);
  const [selectedBattery, setSelectedBattery] = useState<string>('');
  const { userData } = useAuth();
  const isAdmin = userData?.isAdmin;

  // Get unique battery types from bikes
  const batteryOptions = useMemo(() => {
    const batteries = new Set<string>();
    bikes.forEach(bike => {
      if (bike.battery) batteries.add(bike.battery);
    });
    return Array.from(batteries).sort();
  }, [bikes]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [allBikes, promoted] = await Promise.all([
        getBikes(),
        getPromotedBikes()
      ]);
      setBikes(allBikes);
      setPromotedModelNumbers(promoted);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Get promoted bikes by model number, fallback to latest bikes
  const promotedBikes = useMemo(() => {
    const found = promotedModelNumbers
      .map((modelNumber) => bikes.find((b) => b.modelNumber === modelNumber))
      .filter(Boolean) as Bike[];
    if (found.length < 3) {
      // Fill with latest bikes (not already in found)
      const latest = bikes
        .filter((b) => !found.some((f) => f.modelNumber === b.modelNumber))
        .slice(0, 3 - found.length);
      return [...found, ...latest];
    }
    return found;
  }, [bikes, promotedModelNumbers]);

  const getImageUrl = (bike: Bike) => {
    // Convert imageUrl to string and use it directly as the filename
    const imageNumber = bike.imageUrl.toString();
    return getAssetPath(`/jpeg/${imageNumber}.jpeg`);
  };

  // Filter and sort bikes (before grouping)
  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      // Category filter
      const matchesCategory = !selectedCategory || bike.category === selectedCategory;
      
      // Battery filter
      const matchesBattery = !selectedBattery || bike.battery === selectedBattery;
      
      // E-bike filter
      const matchesEbike = !showOnlyEbikes || bike.isEbike;

      // Height range filter
      const matchesHeight = !selectedHeightRange || 
        (bike.size && sizeToHeightRange[selectedHeightRange]?.some(size => {
          const bikeSize = parseInt(bike.size);
          const rangeSize = parseInt(size);
          return !isNaN(bikeSize) && !isNaN(rangeSize) && bikeSize === rangeSize;
        }));

      return matchesCategory && matchesBattery && matchesEbike && matchesHeight;
    });
  }, [bikes, selectedCategory, selectedBattery, showOnlyEbikes, selectedHeightRange]);

  // Group filtered bikes by model prefix
  const groupedBikes = useMemo(() => groupBikesByModel(filteredBikes), [filteredBikes]);

  // Sort groups by the first bike in each group
  const sortedGroupedBikes = useMemo(() => {
    return groupedBikes.sort((a, b) => {
      const firstA = a[0];
      const firstB = b[0];
      switch (sortBy) {
        case 'price-asc':
          return (firstA.priceAction || 0) - (firstB.priceAction || 0);
        case 'price-desc':
          return (firstB.priceAction || 0) - (firstA.priceAction || 0);
        case 'name-asc':
          return firstA.modelName.localeCompare(firstB.modelName);
        case 'name-desc':
          return firstB.modelName.localeCompare(firstA.modelName);
        case 'size-asc': {
          const aSize = Math.min(...a.map(bike => parseInt(bike.size) || 0));
          const bSize = Math.min(...b.map(bike => parseInt(bike.size) || 0));
          return aSize - bSize;
        }
        case 'size-desc': {
          const aSize = Math.max(...a.map(bike => parseInt(bike.size) || 0));
          const bSize = Math.max(...b.map(bike => parseInt(bike.size) || 0));
          return bSize - aSize;
        }
        default:
          return 0;
      }
    });
  }, [groupedBikes, sortBy]);

  // Calculate total pieces (sum of pieces for all grouped bikes)
  const totalPieces = useMemo(() => {
    return sortedGroupedBikes.reduce((sum, group) => sum + group.reduce((gSum, bike) => gSum + (bike.pieces || 0), 0), 0);
  }, [sortedGroupedBikes]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={getAssetPath('/images/hero-placeholder.jpg')}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 drop-shadow-lg">Headline</h1>
          <p className="text-lg md:text-2xl mb-6 text-gray-700 drop-shadow">This is a short description of Adam Bikes. Edit this text to make it your own.</p>
          <Link href="/catalog">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition-colors">
              Show Me The Bikes
            </button>
          </Link>
        </div>
      </section>

      {/* Promoted Bikes Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Bikes</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promotedBikes.map((bike, idx) => (
              <div key={bike.id || idx} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <img
                  src={getAssetPath(`/jpeg/${bike.imageUrl}.jpeg`)}
                  alt={bike.modelName}
                  className="w-full h-48 object-contain mb-4 bg-gray-50 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAssetPath('/jpeg/placeholder.jpeg');
                  }}
                />
                <h3 className="text-xl font-semibold mb-2 text-center">{bike.modelName}</h3>
                <p className="text-gray-600 mb-2 text-center">{bike.manufacturer}</p>
                <p className="text-gray-800 font-bold mb-4 text-center">{bike.priceRetail ? `${bike.priceRetail} Kč` : 'Contact for price'}</p>
                <Link href={`/catalog/${bike.id}`} className="text-blue-600 hover:underline font-semibold">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Bikes</h1>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Height Range Filter */}
            <div>
              <select
                value={selectedHeightRange}
                onChange={(e) => setSelectedHeightRange(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {heightRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Battery Filter */}
            <div>
              <select
                value={selectedBattery}
                onChange={(e) => setSelectedBattery(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Batteries</option>
                {batteryOptions.map(battery => (
                  <option key={battery} value={battery}>{battery}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* E-bike Toggle */}
            <div className="flex items-center space-x-2 col-span-full lg:col-span-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyEbikes}
                  onChange={(e) => setShowOnlyEbikes(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">E-bikes only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-600 flex flex-wrap gap-4 items-center">
          <span>Showing {sortedGroupedBikes.length} of {groupBikesByModel(bikes).length} models</span>
          <span className="font-semibold">Total in stock: {totalPieces}</span>
        </div>
        
        {/* Bike Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedGroupedBikes.map((group) => {
            const firstBike = group[0];
            const sizes = group.map(b => b.size).filter(Boolean).sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0));
            const totalGroupPieces = group.reduce((sum, b) => sum + (b.pieces || 0), 0);
            return (
              <div key={firstBike.modelNumber.slice(0, -2)} className="relative">
                <Link
                  href={`/catalog/${firstBike.id}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 block cursor-pointer"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="relative aspect-square bg-white flex items-center justify-center">
                    <img
                      src={getImageUrl(firstBike)}
                      alt={firstBike.modelName}
                      className="w-full h-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getAssetPath('/jpeg/placeholder.jpeg');
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {firstBike.battery && (
                        <span className={`${getBatteryColor(firstBike.battery)} text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1`}>
                          {firstBike.isEbike && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4 inline-block">
                              <path d="M11.3 1.046A1 1 0 0 1 13 2v5h3a1 1 0 0 1 .8 1.6l-7 10A1 1 0 0 1 8 18v-5H5a1 1 0 0 1-.8-1.6l7-10a1 1 0 0 1 .1-.094z" />
                            </svg>
                          )}
                          {firstBike.battery}
                        </span>
                      )}
                      {firstBike.frameMaterial?.toLowerCase() === 'carbon' && (
                        <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-semibold">
                          Carbon
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {firstBike.modelName}
                    </h2>
                    <p className="text-gray-600 mb-2">{firstBike.manufacturer}</p>
                    <div className="mb-2">
                      <table className="w-full text-xs border-collapse">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-1 px-2 text-left border text-gray-700">Size</th>
                            <th className="py-1 px-2 text-left border text-gray-700">Pieces</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(group.reduce((acc, bike) => {
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
                                <td className="py-1 px-2 border text-gray-700">{size}</td>
                                <td className="py-1 px-2 border text-gray-700">{pieces}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-col items-end mt-4">
                      {firstBike.priceRetail > 0 && (
                        <span className="text-gray-400 text-sm line-through mb-1">{firstBike.priceRetail.toLocaleString()} CZK</span>
                      )}
                      {firstBike.priceAction > 0 && (
                        <span className="text-2xl font-bold text-green-700">{firstBike.priceAction.toLocaleString()} CZK</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* No results message */}
        {sortedGroupedBikes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bikes found matching your criteria</p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setShowOnlyEbikes(true);
              }}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
