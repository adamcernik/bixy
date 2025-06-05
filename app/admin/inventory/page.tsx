'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ConnectionIndicator from '../../components/ConnectionIndicator';
import UserAvatar from '../../components/UserAvatar';
import AccessDenied from '../../components/AccessDenied';
import SignInMessage from '../../components/SignInMessage';
import ResponsiveHeader from '../../components/ResponsiveHeader';
import { Box, Tabs, Tab, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getAssetPath } from '../../utils/pathUtils';
import { Bike } from '../../models/Bike';
import { getBikes, addBike, updateBike, deleteBike } from '../../services/bikeService';
import PromotedBikesAdmin from '../../components/PromotedBikesAdmin';

// Dynamically import the BikeDataGrid component to avoid server-side rendering issues with Firebase
const BikeDataGrid = dynamic(() => import('../../components/BikeDataGrid'), {
  ssr: false,
  loading: () => <p>Loading bike inventory...</p>
});

// Dynamically import the UserManagement component
const UserManagement = dynamic(() => import('../../components/UserManagement'), {
  ssr: false
});

// Dynamically import the AddBikeModal component
const AddBikeModal = dynamic(() => import('../../components/AddBikeModal'), {
  ssr: false
});

export default function StockPage() {
  const [error, setError] = useState<Error | null>(null);
  const [activeSection, setActiveSection] = useState<string>('inventory');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | undefined>(undefined);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, userData, loading: authLoading, isAdmin } = useAuth();
  const hasAccess = userData?.hasAccess || isAdmin;

  const pathname = usePathname();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check database connection
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        // We'll use the ConnectionIndicator's logic but just to set state
        const { db } = await import('../../firebase/config');
        const { collection, getDocs } = await import('firebase/firestore');
        await getDocs(collection(db, 'bikes'));
      } catch (err) {
        console.error("Firebase connection error:", err);
      }
    };

    checkDbConnection();
  }, []);

  // Global error handler for Firebase errors
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
      if (event.error?.toString().includes("Firebase") || event.error?.toString().includes("Firestore")) {
        setError(event.error);
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);

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

  // Function to handle Add New Bike button click
  const handleAddNewBike = () => {
    setEditingBike(undefined); // Clear any editing bike
    setOpenAddDialog(true);
  };

  const handleCloseAddBikeModal = () => {
    setOpenAddDialog(false);
    setEditingBike(undefined); // Clear the editing bike when closing
  };

  const handleEditBike = (bike: Bike) => {
    setEditingBike(bike);
    setOpenAddDialog(true);
  };

  const handleBikeAddSuccess = () => {
    // If we're on the data grid page, refresh it
    if (activeSection === 'inventory') {
      // The BikeDataGrid will handle its own refresh when the modal is closed
    }
  };

  // Show loading state while checking auth
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

  // Show access denied if not authenticated or not authorized
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
        {activeSection === 'inventory' && (
          <div>
            <BikeDataGrid
              openAddDialog={false}
              setOpenAddDialog={setOpenAddDialog}
              onEditBike={handleEditBike}
            />
          </div>
        )}
        {activeSection === 'users' && isAdmin && (
          <UserManagement open={true} onClose={() => {}} />
        )}
        {activeSection === 'promoted' && isAdmin && (
          <PromotedBikesAdmin bikes={bikes} />
        )}
      </div>
      <AddBikeModal
        open={openAddDialog}
        onClose={handleCloseAddBikeModal}
        onSuccess={handleBikeAddSuccess}
        editBike={editingBike}
      />
    </main>
  );
} 