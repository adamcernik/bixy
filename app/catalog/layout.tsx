'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getAssetPath } from '../utils/pathUtils';

interface CatalogLayoutProps {
  children: ReactNode;
}

export default function CatalogLayout({ children }: CatalogLayoutProps) {
  const pathname = usePathname();
  const { user, userData } = useAuth();
  const hasAccess = userData?.hasAccess || userData?.isAdmin;

  return (
    <Box className="min-h-screen bg-white">
      {/* Main content */}
      <Box className="flex-grow">
        {children}
      </Box>
    </Box>
  );
} 