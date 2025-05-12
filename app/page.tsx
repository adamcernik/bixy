'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ConnectionIndicator from './components/ConnectionIndicator';
import UserAvatar from './components/UserAvatar';
import AccessDenied from './components/AccessDenied';
import { Box, Tabs, Tab, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import { usePathname } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { getAssetPath } from './utils/pathUtils';

// Dynamically import the BikeDataGrid component to avoid server-side rendering issues with Firebase
const BikeDataGrid = dynamic(() => import('./components/BikeDataGrid'), {
  ssr: false,
  loading: () => <p>Loading bike inventory...</p>
});

// Dynamically import the CsvImporter component
const CsvImporter = dynamic(() => import('./components/CsvImporter'), {
  ssr: false,
  loading: () => <p>Loading CSV importer...</p>
});

// Dynamically import the UserManagement component
const UserManagement = dynamic(() => import('./components/UserManagement'), {
  ssr: false
});

export default function Home() {
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showBikeGrid, setShowBikeGrid] = useState(true);
  const [showCsvImporter, setShowCsvImporter] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUserManagement, setOpenUserManagement] = useState(false);

  const { user, userData, loading } = useAuth();
  const hasAccess = userData?.hasAccess || userData?.isAdmin;
  const isAdmin = userData?.isAdmin;

  const pathname = usePathname();
  const basePath = process.env.NODE_ENV === 'production' ? '/bixy' : '';

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      setShowBikeGrid(true);
      setShowCsvImporter(false);
    } else {
      setShowBikeGrid(false);
      setShowCsvImporter(true);
    }
  };

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
    // If BikeDataGrid component has a ref or method to open the add dialog
    // we would call it here
    setOpenAddDialog(true);
    // This state change can be observed by child components
  };

  const handleOpenUserManagement = () => {
    setOpenUserManagement(true);
  };

  const handleCloseUserManagement = () => {
    setOpenUserManagement(false);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col p-6">
        <div className="w-full">
          <div className="flex items-center mb-4">
            <div className="flex items-center flex-grow">
              <img 
                src={getAssetPath('/bixy-logo.svg')}
                alt="Bixy Logo" 
                width={80} 
                height={64}
                style={{ objectFit: 'contain' }}
              />
              <h1 className="text-3xl font-bold ml-4">Bixy Stock Management</h1>
            </div>
          </div>
          <div className="flex justify-center items-center h-[calc(100vh-150px)]">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col p-6">
        <div className="w-full">
          <div className="flex items-center mb-4">
            <div className="flex items-center flex-grow">
              <img 
                src={getAssetPath('/bixy-logo.svg')}
                alt="Bixy Logo" 
                width={80} 
                height={64}
                style={{ objectFit: 'contain' }}
              />
              <h1 className="text-3xl font-bold ml-4">Bixy Stock Management</h1>
              <div className="ml-2">
                <ConnectionIndicator />
              </div>
              <div className="ml-auto">
                <UserAvatar />
              </div>
            </div>
          </div>
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
      <main className="flex min-h-screen flex-col p-6">
        <div className="w-full">
          {/* Header with logo and title */}
          <div className="flex items-center mb-4">
            <div className="flex items-center flex-grow">
              <img 
                src={getAssetPath('/bixy-logo.svg')}
                alt="Bixy Logo" 
                width={80} 
                height={64}
                style={{ objectFit: 'contain' }}
              />
              <h1 className="text-3xl font-bold ml-4">Bixy Stock Management</h1>
              <div className="ml-2">
                <ConnectionIndicator />
              </div>
              <div className="ml-auto">
                <UserAvatar />
              </div>
            </div>
          </div>
          
          {/* Show access denied if logged in but not authorized */}
          {user && !hasAccess && <AccessDenied />}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col p-6 bg-gradient-to-b dark:from-gray-900 dark:to-black">
      <div className="w-full">
        {/* Header with logo and title */}
        <div className="flex items-center mb-4">
          <div className="flex items-center flex-grow">
            <img 
              src={getAssetPath('/bixy-logo.svg')}
              alt="Bixy Logo" 
              width={80} 
              height={64}
              style={{ objectFit: 'contain' }}
            />
            <h1 className="text-3xl font-bold ml-4 dark:text-white">Bixy Stock Management</h1>
            <div className="ml-2">
              <ConnectionIndicator />
            </div>
            <div className="ml-auto">
              <UserAvatar />
            </div>
          </div>
        </div>
        
        {/* Tabs navigation and Add button inline */}
        <div className="flex items-center mb-4">
          <Box sx={{ 
            display: 'flex', 
            width: '100%', 
            alignItems: 'center',
            borderBottom: 1, 
            borderColor: 'divider',
            '.MuiTab-root': {
              color: theme => theme.palette.mode === 'dark' ? '#999999' : '#555555',
              '&.Mui-selected': { 
                color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2' 
              }
            }
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="inventory tabs"
              sx={{ 
                flexGrow: 1,
              }}
            >
              <Tab label="View Inventory" />
              <Tab label="Import from CSV" />
            </Tabs>
            
            {/* Admin actions */}
            <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
              {isAdmin && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleOpenUserManagement}
                  startIcon={<PeopleIcon />}
                >
                  Users
                </Button>
              )}
            </Box>
          </Box>
        </div>
        
        {/* Content area */}
        <div>
          {showBikeGrid && (
            <div className="h-[calc(100vh-200px)]">
              <BikeDataGrid openAddDialog={openAddDialog} setOpenAddDialog={setOpenAddDialog} />
            </div>
          )}
          
          {showCsvImporter && (
            <div>
              <CsvImporter />
            </div>
          )}
        </div>
      </div>
      
      {/* User Management Dialog */}
      <UserManagement 
        open={openUserManagement} 
        onClose={handleCloseUserManagement} 
      />
    </main>
  );
}
