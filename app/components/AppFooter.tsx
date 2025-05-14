'use client';
import { Box, Typography, Link } from '@mui/material';
import ConnectionIndicator, { useDbStatus } from './ConnectionIndicator';

export default function AppFooter() {
  const { status } = useDbStatus();
  let statusText = 'Checking...';
  let statusColor = '#888';
  if (status === 'connected') {
    statusText = 'Database: Connected';
    statusColor = '#22c55e';
  } else if (status === 'error') {
    statusText = 'Database: Error';
    statusColor = '#ef4444';
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 30,
        bgcolor: '#f8fafc',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        zIndex: 1300,
        fontSize: 14,
        color: '#222',
        justifyContent: 'space-between',
        minHeight: 30,
        maxHeight: 30,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ConnectionIndicator />
        <Typography variant="body2" sx={{ color: statusColor, fontWeight: 500, ml: 1 }}>
          {statusText}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: '#666', fontSize: 13 }}>
        Admin: <Link href="mailto:adam.cernik@gmail.com" sx={{ color: '#4285F4', textDecoration: 'none' }}>adam.cernik@gmail.com</Link>
      </Typography>
    </Box>
  );
} 