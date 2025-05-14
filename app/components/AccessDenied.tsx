'use client';

import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  CircularProgress
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
            bgcolor: 'primary.main',
            width: 56,
            height: 56
          }}
        >
          <LockIcon fontSize="large" />
        </Avatar>
        
        <Typography variant="h5" component="h1" sx={{ mb: 2, mt: 2, fontWeight: 'bold' }}>
          Registration Successful
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Hello <strong>{userData?.displayName || 'User'}</strong>,
          <br />
          Your account has been registered successfully.
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Waiting for administrator approval. This usually takes a short while.
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
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