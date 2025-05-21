'use client';

import { useEffect, useState } from 'react';
import { getOffers, Offer } from '../services/offerService';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import { format } from 'date-fns';
import InfoIcon from '@mui/icons-material/Info';

const statusColors = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'error'
} as const;

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { userData } = useAuth();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersData = await getOffers();
        setOffers(offersData);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const filteredOffers = offers.filter(offer => 
    statusFilter === 'all' || offer.status === statusFilter
  );

  const formatDate = (timestamp: any) => {
    try {
      return format(timestamp.toDate(), 'dd.MM.yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Offers
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Bikes</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOffers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell>{formatDate(offer.createdAt)}</TableCell>
                <TableCell>
                  {offer.customerName || 'N/A'}
                  {offer.customerEmail && (
                    <Typography variant="caption" display="block" color="textSecondary">
                      {offer.customerEmail}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {offer.bikes.map(bike => bike.modelName).join(', ')}
                </TableCell>
                <TableCell>
                  {offer.note || '-'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={offer.status} 
                    color={statusColors[offer.status]} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filteredOffers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No offers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 