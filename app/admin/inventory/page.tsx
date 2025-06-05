'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AccessDenied from '../components/AccessDenied';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getAssetPath } from '../../utils/pathUtils';
import { Bike } from '../../models/Bike';
import { getBikes } from '../../services/bike/bikeService';
import PromotedBikesAdmin from '../components/PromotedBikesAdmin';

const BikeDataGrid = dynamic(() => import('../components/BikeDataGrid'), {
  ssr: false,
  loading: () => <p>Loading bike inventory...</p>
});

export default function StockPage() {
  const [error, setError] = useState<Error | null>(null);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, userData, loading: authLoading, isAdmin } = useAuth();
  const hasAccess = userData?.hasAccess || isAdmin;

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(`/login?from=${pathname}`);
      return;
    }
    if (user && !hasAccess) {
      router.push('/');
      return;
    }
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
  }, [user, hasAccess, router, pathname]);

  if (authLoading) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="w-full flex justify-center items-center h-screen">
          <div className="text-center">
            <img 
              src={getAssetPath('/images/adam-bikes-electric-cycling-logo.svg')}
              alt="Adam Bikes Logo" 
              width={80} 
              height={64}
              style={{ objectFit: 'contain', margin: '0 auto' }}
            />
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user || (user && !hasAccess)) {
    return <AccessDenied />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error connecting to database</p>
            <p>{error.message}</p>
            <p className="mt-2">Please check your Firebase configuration and make sure you have the correct permissions.</p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="w-full p-4">
        <BikeDataGrid />
        {isAdmin && <PromotedBikesAdmin bikes={bikes} />}
      </div>
    </main>
  );
} 