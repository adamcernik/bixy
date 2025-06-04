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
          Registrace úspěšná
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Dobrý den <strong>{userData?.displayName || 'Uživatel'}</strong>,<br />
          Váš účet byl úspěšně zaregistrován.
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Čeká se na schválení administrátorem. Obvykle to trvá jen krátkou chvíli.
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          color="primary"
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Odhlásit se
        </Button>
      </Paper>
    </Box>
  );
} 