'use client';

import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function AccessDenied() {
  const { userData, logout } = useAuth();
  
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
        <Avatar 
          sx={{ 
            m: 1, 
            bgcolor: 'error.main',
            width: 56,
            height: 56
          }}
        >
          <LockIcon fontSize="large" />
        </Avatar>
        
        <Typography variant="h5" component="h1" sx={{ mb: 2, mt: 2, fontWeight: 'bold' }}>
          Access Restricted
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Hello <strong>{userData?.displayName || 'User'}</strong>,
          <br />
          Your account needs approval before you can access this inventory system.
        </Typography>
        
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          The administrator has been notified about your registration. Once your access is
          approved, you will be able to view and manage the inventory.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Sign Out
        </Button>
      </Paper>
    </Box>
  );
} 