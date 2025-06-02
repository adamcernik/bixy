'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ConnectionIndicator from '../components/ConnectionIndicator';
import UserAvatar from '../components/UserAvatar';
import AccessDenied from '../components/AccessDenied';
import SignInMessage from '../components/SignInMessage';
import ResponsiveHeader from '../components/ResponsiveHeader';
import { Box, Tabs, Tab, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { getAssetPath } from '../utils/pathUtils';
import { Bike } from '../models/Bike';

// Dynamically import the BikeDataGrid component to avoid server-side rendering issues with Firebase
const BikeDataGrid = dynamic(() => import('../components/BikeDataGrid'), {
  ssr: false,
  loading: () => <p>Loading bike inventory...</p>
});

// Dynamically import the CsvImporter component
const CsvImporter = dynamic(() => import('../components/CsvImporter'), {
  ssr: false,
  loading: () => <p>Loading CSV importer...</p>
});

// Dynamically import the UserManagement component
const UserManagement = dynamic(() => import('../components/UserManagement'), {
  ssr: false
});

// Dynamically import the AddBikeModal component
const AddBikeModal = dynamic(() => import('../components/AddBikeModal'), {
  ssr: false
});

export default function StockPage() {
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showBikeGrid, setShowBikeGrid] = useState(true);
  const [showCsvImporter, setShowCsvImporter] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUserManagement, setOpenUserManagement] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | undefined>(undefined);

  const { user, userData, loading } = useAuth();
  const hasAccess = userData?.hasAccess || userData?.isAdmin;
  const isAdmin = userData?.isAdmin;

  const pathname = usePathname();
  const basePath = process.env.NODE_ENV === 'production' ? '/bixy' : '';

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (index === 0) {
      setShowBikeGrid(true);
      setShowCsvImporter(false);
    } else {
      setShowBikeGrid(false);
      setShowCsvImporter(true);
    }
  };

  // Check database connection
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        // We'll use the ConnectionIndicator's logic but just to set state
        const { db } = await import('../firebase/config');
        const { collection, getDocs } = await import('firebase/firestore');
        await getDocs(collection(db, 'bikes'));
        setDbConnected(true);
      } catch (err) {
        console.error("Firebase connection error:", err);
        setDbConnected(false);
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
    if (showBikeGrid && activeTab === 0) {
      // The BikeDataGrid will handle its own refresh when the modal is closed
    }
  };

  const handleOpenUserManagement = () => {
    setOpenUserManagement(true);
  };

  const handleCloseUserManagement = () => {
    setOpenUserManagement(false);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="w-full flex justify-center items-center h-screen">
          <div className="text-center">
            <img 
              src={getAssetPath('/adam-bikes-electric-cycling-logo.svg')}
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

  if (error) {
    return (
      <main className="flex min-h-screen flex-col">
        <ResponsiveHeader 
          dbConnected={false}
          onTabChange={handleTabChange}
          activeTab={activeTab}
          onAddNewBike={handleAddNewBike}
          onOpenUserManagement={handleOpenUserManagement}
        />
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

  // Show login screen or access denied if not authenticated or authorized
  if (!user || (user && !hasAccess)) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="w-full p-6">
          {/* Header with logo and title */}
          <div className="flex items-center mb-4">
            <div className="flex items-center flex-grow">
              <img 
                src={getAssetPath('/adam-bikes-electric-cycling-logo.svg')}
                alt="Adam Bikes Logo" 
                width={80} 
                height={64}
                style={{ objectFit: 'contain' }}
              />
              <h1 className="text-3xl font-bold ml-4">Adam Bikes Stock Management</h1>
              <div className="ml-2">
                <ConnectionIndicator />
              </div>
              <div className="ml-auto">
                <UserAvatar />
              </div>
            </div>
          </div>
          
          {/* Show access denied if logged in but not authorized */}
          {user && !hasAccess ? <AccessDenied /> : <SignInMessage />}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <ResponsiveHeader 
        dbConnected={dbConnected}
        onTabChange={handleTabChange}
        activeTab={activeTab}
        onAddNewBike={handleAddNewBike}
        onOpenUserManagement={handleOpenUserManagement}
      />
      
      <div className="w-full p-4">
        {/* Content area */}
        <div>
          {showBikeGrid && (
            <div className="h-[calc(100vh-100px)]">
              <BikeDataGrid 
                openAddDialog={false} 
                setOpenAddDialog={setOpenAddDialog} 
                onEditBike={handleEditBike}
              />
            </div>
          )}
          
          {showCsvImporter && (
            <div>
              <CsvImporter />
            </div>
          )}
        </div>
      </div>
      
      {/* Global Add Bike Modal */}
      <AddBikeModal 
        open={openAddDialog} 
        onClose={handleCloseAddBikeModal} 
        onSuccess={handleBikeAddSuccess}
        editBike={editingBike}
      />
      
      {/* User Management Dialog */}
      <UserManagement 
        open={openUserManagement} 
        onClose={handleCloseUserManagement} 
      />
    </main>
  );
} 