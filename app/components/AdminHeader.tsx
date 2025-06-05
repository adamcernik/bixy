import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { key: 'inventory', label: 'Sklad', icon: <WarehouseIcon />, href: '/admin/inventory' },
  { key: 'export', label: 'Export', icon: <UploadFileIcon />, href: '/admin/export' },
  { key: 'promoted', label: 'Promo', icon: <LocalOfferIcon />, href: '/admin/promoted' },
  { key: 'users', label: 'Uživatelé', icon: <PeopleIcon />, href: '/admin/users' },
];

export default function AdminHeader({ activeSection }: { activeSection: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleMenuClick = (href: string) => {
    setDrawerOpen(false);
    router.push(href);
  };

  const handleAddBike = () => {
    setDrawerOpen(false);
    router.push('/admin/addbike');
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarMenuAnchor(event.currentTarget);
  };
  const handleAvatarClose = () => {
    setAvatarMenuAnchor(null);
  };
  const handleSignOut = async () => {
    await logout();
    setAvatarMenuAnchor(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        background: '#fff',
        color: 'inherit',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
        zIndex: 1201
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 4 } }}>
        {/* Left: Logo/Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 500, fontSize: 20, color: '#222', flex: { xs: 1, md: 'none' } }}
        >
          Biketime Sklad
        </Typography>
        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 4, flex: 1, justifyContent: 'flex-end', gap: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.key}
              color={activeSection === item.key ? 'primary' : 'inherit'}
              startIcon={item.icon}
              onClick={() => handleMenuClick(item.href)}
              sx={{ fontWeight: activeSection === item.key ? 'bold' : 400, fontSize: 16, px: 2 }}
            >
              {item.label}
            </Button>
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddBike}
            sx={{ ml: 2, fontWeight: 500, fontSize: 16 }}
          >
            Přidat
          </Button>
          {/* Avatar */}
          <Box sx={{ ml: 2 }}>
            <IconButton onClick={handleAvatarClick} size="small">
              <Avatar
                sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                src={user?.photoURL || undefined}
              >
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={avatarMenuAnchor}
              open={Boolean(avatarMenuAnchor)}
              onClose={handleAvatarClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled>{user?.email}</MenuItem>
              <MenuItem onClick={handleSignOut}>Odhlásit se</MenuItem>
            </Menu>
          </Box>
        </Box>
        {/* Hamburger for <=800px (md and below) */}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      {/* Drawer for mobile/tablet */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Box sx={{ p: 2, pt: 3 }}>
          <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 500, mb: 2 }}>
            Biketime Sklad
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {menuItems.map((item) => (
              <ListItem
                component="button"
                key={item.key}
                onClick={() => handleMenuClick(item.href)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            <ListItem component="button" onClick={handleAddBike}>
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary="Přidat" />
            </ListItem>
          </List>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Avatar
              sx={{ width: 36, height: 36, bgcolor: 'primary.main', mr: 1 }}
              src={user?.photoURL || undefined}
            >
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{user?.email}</Typography>
              <Button onClick={handleSignOut} color="primary" size="small" sx={{ mt: 0.5 }}>
                Odhlásit se
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
} 