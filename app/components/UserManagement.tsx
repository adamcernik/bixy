'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Switch,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { updateUserAccess, getAllUsers, UserData } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../firebase/config';

interface UserManagementProps {
  open: boolean;
  onClose: () => void;
}

export default function UserManagement({ open, onClose }: UserManagementProps) {
  const { userData } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  
  // Check if current user is admin
  const isAdmin = userData?.isAdmin || userData?.email === ADMIN_EMAIL;
  
  const fetchUsers = async () => {
    setLoading(true);
    const fetchedUsers = await getAllUsers();
    setUsers(fetchedUsers);
    setLoading(false);
  };
  
  useEffect(() => {
    if (open && isAdmin) {
      fetchUsers();
    }
  }, [open, isAdmin]);
  
  const handleUpdateAccess = async (uid: string, hasAccess: boolean) => {
    const success = await updateUserAccess(uid, hasAccess);
    
    if (success) {
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.uid === uid ? { ...user, hasAccess } : user
        )
      );
      
      setSnackbar({
        open: true,
        message: `User ${hasAccess ? 'granted' : 'removed'} access successfully`,
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Failed to update user access',
        severity: 'error'
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle>
        User Management
        <IconButton 
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Registered</TableCell>
                  <TableCell align="center">Has Access</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={user.photoURL || undefined} 
                          alt={user.displayName}
                          sx={{ mr: 2, width: 32, height: 32 }}
                        >
                          {user.displayName?.charAt(0) || 'U'}
                        </Avatar>
                        <Typography variant="body2">
                          {user.displayName || 'Anonymous'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell align="center">
                      {user.isAdmin ? (
                        <Typography variant="body2" color="primary">
                          Admin
                        </Typography>
                      ) : (
                        <Switch
                          checked={user.hasAccess}
                          onChange={() => handleUpdateAccess(user.uid, !user.hasAccess)}
                          color="primary"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
} 