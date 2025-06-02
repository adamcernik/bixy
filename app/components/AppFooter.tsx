'use client';

import { usePathname } from 'next/navigation';
import { Box, Container, Typography, Link } from '@mui/material';
import { getAssetPath } from '../utils/pathUtils';

export default function AppFooter() {
  const pathname = usePathname();
  const isAdminPage = pathname === '/stock';

  return (
    <Box component="footer" className="bg-white py-8">
      <Container maxWidth="lg">
        <Box className="text-center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Adam Bikes. All rights reserved.
          </Typography>
          
          {isAdminPage && (
            <Box className="mt-2 space-y-1">
              <Typography variant="body2" color="text.secondary">
                <Link href="mailto:info@adambikes.com" color="inherit" underline="hover">
                  info@adambikes.com
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Database: {process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                App Version: {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
} 