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
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import { getAssetPath } from '../../utils/pathUtils';
import { useRouter } from 'next/navigation';

const menuItems = [
  { key: 'inventory', label: 'Inventory', icon: <InventoryIcon />, href: '/admin/inventory' },
  { key: 'export', label: 'Export', icon: <UploadFileIcon />, href: '/admin/export' },
  { key: 'promoted', label: 'Promoted', icon: <AddIcon />, href: '/admin/promoted' },
  { key: 'users', label: 'Users', icon: <PeopleIcon />, href: '/admin/users' },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const router = useRouter();

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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSectionChange = (section: string, href?: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    if (href) router.push(href);
  };

  return (
    <AppBar position="sticky" elevation={2} sx={{ backgroundColor: '#fff', color: 'inherit' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left: Headline */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', color: '#000D25', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            Biketime Sklad
          </Typography>
        </Box>

        {/* Desktop menu aligned right, hamburger and profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 2, justifyContent: 'flex-end' }}>
          {/* Desktop menu (hidden on sm and below) */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.key}
                color={activeSection === item.key ? 'primary' : 'inherit'}
                startIcon={item.icon}
                href={item.href}
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
          </Box>
          {/* Hamburger Icon for tablet and mobile, right side */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuToggle}
            sx={{ display: { sm: 'flex', md: 'none' }, ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
          {/* Profile menu */}
          <Box>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
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
        </Box>
      </Toolbar>

      {/* Mobile menu drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.key}
                component="a"
                href={item.href}
                sx={{
                  cursor: 'pointer',
                  bgcolor: activeSection === item.key ? 'action.selected' : 'inherit'
                }}
                onClick={() => handleSectionChange(item.key, item.href)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            <ListItem
              component="a"
              href="/admin/addbike"
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary="Add Bike" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
} 