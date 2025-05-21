'use client';

import { useEffect, useState, useMemo } from 'react';
import { getBikes } from '../services/bikeService';
import { Bike } from '../models/Bike';
import { getAssetPath } from '../utils/pathUtils';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

// Available categories for filtering
const categories = ['MTB', 'Road', 'Gravel', 'City', 'Trekking', 'Kids', 'Other'];

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

export default function CatalogPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('price-desc');
  const [showOnlyEbikes, setShowOnlyEbikes] = useState(true);
  const [selectedBattery, setSelectedBattery] = useState<string>('');
  const { userData } = useAuth();
  const isAdmin = userData?.isAdmin;
  const [selectedBikeIds, setSelectedBikeIds] = useState<string[]>([]);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [offerNote, setOfferNote] = useState('');

  // Get unique battery types from bikes
  const batteryOptions = useMemo(() => {
    const batteries = new Set<string>();
    bikes.forEach(bike => {
      if (bike.battery) batteries.add(bike.battery);
    });
    return Array.from(batteries).sort();
  }, [bikes]);

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

  const getImageUrl = (bike: Bike) => {
    // Convert imageUrl to string and use it directly as the filename
    const imageNumber = bike.imageUrl.toString();
    return getAssetPath(`/jpeg/${imageNumber}.jpeg`);
  };

  // Filter and sort bikes (before grouping)
  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        bike.modelName.toLowerCase().includes(searchLower) ||
        bike.manufacturer.toLowerCase().includes(searchLower) ||
        bike.modelNumber.toLowerCase().includes(searchLower);
      // Category filter
      const matchesCategory = !selectedCategory || bike.category === selectedCategory;
      // Battery filter
      const matchesBattery = !selectedBattery || bike.battery === selectedBattery;
      // E-bike filter
      const matchesEbike = !showOnlyEbikes || bike.isEbike;
      return matchesSearch && matchesCategory && matchesBattery && matchesEbike;
    });
  }, [bikes, searchQuery, selectedCategory, selectedBattery, showOnlyEbikes]);

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

  // Helper to get all selected bikes
  const selectedBikes = useMemo(() => {
    return bikes.filter(bike => typeof bike.id === 'string' && selectedBikeIds.includes(bike.id));
  }, [bikes, selectedBikeIds]);

  // Handle card checkbox toggle
  const handleCardCheckbox = (id?: string) => {
    const safeId = id ?? '';
    if (!safeId) return;
    setSelectedBikeIds(prev => prev.includes(safeId) ? prev.filter(bid => bid !== safeId) : [...prev, safeId]);
  };

  // Handle Offer button click
  const handleOfferClick = () => {
    setOfferDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setOfferDialogOpen(false);
    setOfferNote('');
  };

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
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search bikes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
      
      {/* Offer Button for Admin */}
      {isAdmin && selectedBikeIds.length > 0 && (
        <div className="mb-4 flex justify-end">
          <Button variant="contained" color="primary" onClick={handleOfferClick}>
            Offer
          </Button>
        </div>
      )}
      
      {/* Bike Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedGroupedBikes.map((group) => {
          const firstBike = group[0];
          const sizes = group.map(b => b.size).filter(Boolean).sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0));
          const totalGroupPieces = group.reduce((sum, b) => sum + (b.pieces || 0), 0);
          return (
            <div key={firstBike.modelNumber.slice(0, -2)} className="relative">
              {/* Admin Checkbox */}
              {isAdmin && typeof firstBike.id === 'string' && (
                <input
                  type="checkbox"
                  className="absolute top-2 left-2 z-10 w-5 h-5"
                  checked={selectedBikeIds.includes(firstBike.id)}
                  onChange={() => handleCardCheckbox(firstBike.id)}
                  onClick={e => e.stopPropagation()}
                />
              )}
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
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {firstBike.modelName}
                  </h2>
                  <p className="text-gray-600 mb-2">{firstBike.manufacturer}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Sizes: {sizes.join(', ') || '-'}</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Pieces: {totalGroupPieces}</span>
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
              setSearchQuery('');
              setSelectedCategory('');
              setShowOnlyEbikes(true);
            }}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Offer Dialog */}
      <Dialog open={offerDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Offer</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <strong>Selected Bikes:</strong>
            <ul className="list-disc ml-6">
              {selectedBikes.map(bike => (
                <li key={bike.id ?? ''}>{bike.modelName} ({bike.modelNumber})</li>
              ))}
            </ul>
          </div>
          <TextField
            label="Note for Customer"
            multiline
            minRows={3}
            fullWidth
            value={offerNote}
            onChange={e => setOfferNote(e.target.value)}
            placeholder="Add a note for the customer..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" color="primary" disabled={selectedBikes.length === 0}>
            Create Offer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 