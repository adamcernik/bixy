'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../context/AuthContext';
import { getAssetPath } from '../utils/pathUtils';

const menuItems = [
  { key: 'inventory', label: 'Inventory', icon: <InventoryIcon /> },
  { key: 'csv', label: 'CSV Upload', icon: <UploadFileIcon /> },
  { key: 'promoted', label: 'Promoted', icon: <AddIcon /> },
  { key: 'users', label: 'Users', icon: <PeopleIcon /> },
];

export default function ResponsiveHeader({
  activeSection,
  setActiveSection,
  onAddNewBike
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onAddNewBike: () => void;
}) {
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const { user, userData, logout } = useAuth();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  return (
    <AppBar position="sticky" elevation={2} sx={{ backgroundColor: '#fff', color: 'inherit' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and app name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={getAssetPath('/images/adam-bikes-electric-cycling-logo.svg')}
            alt="Adam Bikes Logo"
            width={40}
            height={32}
            style={{ objectFit: 'contain' }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Adam Bikes Admin
          </Typography>
        </Box>
        {/* Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {menuItems.map((item) => (
            <Button
              key={item.key}
              color={activeSection === item.key ? 'primary' : 'inherit'}
              startIcon={item.icon}
              onClick={() => setActiveSection(item.key)}
              sx={{ fontWeight: activeSection === item.key ? 'bold' : 'normal' }}
            >
              {item.label}
            </Button>
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddNewBike}
            sx={{ ml: 2 }}
          >
            Add Bike
          </Button>
          <IconButton color="inherit" onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
            <Avatar
              sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
              src={user?.photoURL || undefined}
            >
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {user && (
              <MenuItem disabled>
                <Typography variant="body2" color="textSecondary">
                  {user.email}
                </Typography>
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 