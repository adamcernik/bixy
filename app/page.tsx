'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ConnectionIndicator from './components/ConnectionIndicator';
import { Box, Tabs, Tab, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { usePathname } from 'next/navigation';

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

export default function Home() {
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showBikeGrid, setShowBikeGrid] = useState(true);
  const [showCsvImporter, setShowCsvImporter] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const pathname = usePathname();
  const basePath = pathname.startsWith('/bixy') ? '/bixy' : '';

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

  if (error) {
    return (
      <main className="flex min-h-screen flex-col p-6">
        <div className="w-full">
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <Image 
                src={`${basePath}/bixy-logo.svg`}
                alt="Bixy Logo" 
                width={80} 
                height={64} 
                priority
                className="object-contain"
              />
              <h1 className="text-3xl font-bold ml-4">Bixy Stock Management</h1>
              <div className="ml-2">
                <ConnectionIndicator />
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

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="w-full">
        {/* Header with logo and title */}
        <div className="flex items-center mb-4">
          <div className="flex items-center flex-grow">
            <Image 
              src={`${basePath}/bixy-logo.svg`}
              alt="Bixy Logo" 
              width={80} 
              height={64} 
              priority
              className="object-contain"
            />
            <h1 className="text-3xl font-bold ml-4">Bixy Stock Management</h1>
            <div className="ml-2">
              <ConnectionIndicator />
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
            borderColor: 'divider'
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="inventory tabs"
              sx={{ 
                flexGrow: 1,
                '& .MuiTab-root': { 
                  color: '#555555',
                  '&.Mui-selected': { color: '#1976d2' } 
                }
              }}
            >
              <Tab label="View Inventory" />
              <Tab label="Import from CSV" />
            </Tabs>
            
            {/* Only show Add New Bike button when on the inventory tab */}
            {activeTab === 0 && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddNewBike}
                sx={{ ml: 2 }}
              >
                Add New Bike
              </Button>
            )}
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
    </main>
  );
}
