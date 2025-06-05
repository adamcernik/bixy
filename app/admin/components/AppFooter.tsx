'use client';

import { usePathname } from 'next/navigation';
import { Box, Container, Typography, Link } from '@mui/material';
import { getAssetPath } from '../../utils/pathUtils';

export default function AppFooter() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <Box component="footer" className="bg-white py-8">
      <Container maxWidth="lg">
        <Box className="text-center">
          {isAdminPage ? (
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Adam Bikes -{' '}
              <Link href="mailto:mail@adamcernik.cz" color="inherit" underline="hover">
                mail@adamcernik.cz
              </Link>
              {' - '}
              <Link href="https://adambikes.cz" color="inherit" underline="hover" target="_blank" rel="noopener noreferrer">
                adambikes.cz
              </Link>
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Adam Bikes. Všechna práva vyhrazena.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
} 