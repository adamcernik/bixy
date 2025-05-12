'use client';

import { useState } from 'react';
import { 
  Avatar, 
  Box, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function UserAvatar() {
  const { user, userData, loginWithGoogle, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  // Get first name from display name
  const getFirstName = () => {
    if (userData?.displayName) {
      return userData.displayName.split(' ')[0];
    }
    return '';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {!user ? (
        <Button
          variant="outlined"
          color="inherit"
          onClick={loginWithGoogle}
          startIcon={<AccountCircle />}
          sx={{ 
            color: '#fff',
            borderColor: '#fff',
            '&:hover': { 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#fff' 
            }
          }}
        >
          Sign In
        </Button>
      ) : (
        <>
          <Tooltip title="Account settings">
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenu}>
              <Typography
                variant="body1"
                sx={{
                  mr: 1,
                  color: '#fff',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {getFirstName()}
              </Typography>
              <IconButton
                size="medium"
                color="inherit"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                sx={{ p: 0 }}
              >
                {userData?.photoURL ? (
                  <Avatar 
                    alt={userData.displayName} 
                    src={userData.photoURL}
                    sx={{ width: 36, height: 36, border: '2px solid white' }}
                  />
                ) : (
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: '#1976d2',
                      color: '#fff',
                      border: '2px solid white'
                    }}
                  >
                    {userData?.displayName?.charAt(0) || 'U'}
                  </Avatar>
                )}
              </IconButton>
            </Box>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} sx={{ color: '#000' }}>
              Signed in as: {userData?.email}
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: '#000' }}>
              Logout
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
} 