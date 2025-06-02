'use client';

import { Box, Typography, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';

export default function SignInMessage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 160px)',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 500,
          width: '100%',
          borderRadius: 2
        }}
      >
        <GoogleIcon sx={{ fontSize: 48, color: '#4285F4', mb: 2 }} />
        
        <Typography variant="h5" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Welcome to Adam Bikes Stock Management
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Please sign in with your Google account to access the inventory system.
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Contact administrator at{' '}
            <a 
              href="mailto:adam.cernik@gmail.com"
              style={{ color: '#4285F4', textDecoration: 'none' }}
            >
              adam.cernik@gmail.com
            </a>
            {' '}for access approval
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
} 