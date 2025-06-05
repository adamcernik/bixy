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
          Vítejte v systému správy zásob Adam Bikes
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Přihlaste se pomocí svého Google účtu pro přístup k systému.
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Pro schválení přístupu kontaktujte administrátora na{' '}
            <a 
              href="mailto:adam.cernik@gmail.com"
              style={{ color: '#4285F4', textDecoration: 'none' }}
            >
              adam.cernik@gmail.com
            </a>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
} 