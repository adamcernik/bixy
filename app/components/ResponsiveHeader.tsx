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
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { getAssetPath } from '../utils/pathUtils';

interface ResponsiveHeaderProps {
  dbConnected?: boolean;
  onTabChange: (index: number) => void;
  activeTab: number;
  onAddNewBike: () => void;
  onOpenUserManagement: () => void;
}

export default function ResponsiveHeader({
  dbConnected = true,
  onTabChange,
  activeTab, 
  onAddNewBike,
  onOpenUserManagement
}: ResponsiveHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  
  const { user, userData, logout } = useAuth();
  const isAdmin = userData?.isAdmin;
  const pathname = usePathname();

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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

  const handleMenuItemClick = (index: number) => {
    onTabChange(index);
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { text: 'Inventory', icon: <InventoryIcon />, onClick: () => handleMenuItemClick(0) },
    { text: 'CSV Upload', icon: <UploadFileIcon />, onClick: () => handleMenuItemClick(1) },
    { 
      text: 'Add New Bike', 
      icon: <AddIcon />, 
      onClick: () => {
        onAddNewBike();
        setMobileMenuOpen(false);
      } 
    },
  ];

  if (isAdmin) {
    menuItems.push({
      text: 'Users',
      icon: <PeopleIcon />,
      onClick: () => {
        onOpenUserManagement();
        setMobileMenuOpen(false);
      }
    });
  }

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <img 
          src={getAssetPath('/bixy-logo-black.svg')}
          alt="Bixy Logo" 
          width={40} 
          height={32}
          style={{ objectFit: 'contain' }}
        />
        <Typography variant="h6" component="div">
          Bixy Stock
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={item.onClick}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={2} 
      sx={{ 
        backgroundColor: '#fff',
        color: 'inherit'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and app name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={getAssetPath('/bixy-logo-black.svg')}
            alt="Bixy Logo" 
            width={40} 
            height={32}
            style={{ objectFit: 'contain' }}
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              ml: 1, 
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            Bixy Stock
          </Typography>
        </Box>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Button 
            color="inherit" 
            onClick={() => onTabChange(0)}
            sx={{ 
              fontWeight: activeTab === 0 ? 'bold' : 'normal',
              backgroundColor: activeTab === 0 ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: activeTab === 0 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.04)'
              },
              color: 'inherit'
            }}
            startIcon={<InventoryIcon />}
          >
            Inventory
          </Button>
          <Button 
            color="inherit" 
            onClick={() => onTabChange(1)}
            sx={{ 
              fontWeight: activeTab === 1 ? 'bold' : 'normal',
              backgroundColor: activeTab === 1 ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: activeTab === 1 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.04)'
              },
              color: 'inherit'
            }}
            startIcon={<UploadFileIcon />}
          >
            CSV Upload
          </Button>
          <Button 
            color="primary" 
            variant="contained" 
            onClick={onAddNewBike}
            startIcon={<AddIcon />}
            size="small"
            sx={{ mx: 1 }}
          >
            New Bike
          </Button>
          
          {isAdmin && (
            <Button 
              color="inherit" 
              onClick={onOpenUserManagement}
              startIcon={<PeopleIcon />}
            >
              Users
            </Button>
          )}
          
          <IconButton 
            color="inherit" 
            edge="end" 
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'primary.main'
              }}
              src={user?.photoURL || undefined}
            >
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
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

        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleMobileMenuToggle}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={handleMobileMenuToggle}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
} 