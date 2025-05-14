'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { addBike, updateBike } from '../services/bikeService';
import { Bike } from '../models/Bike';
import { getAssetPath } from '../utils/pathUtils';

const initialBikeState: Bike = {
  manufacturer: 'Bulls', // Default value
  modelName: '',
  modelNumber: '',
  modelYear: new Date().getFullYear(),
  weight: 0,
  frameMaterial: '',
  imageUrl: 0, // JPEG file number
  link: '',
  location: '',
  battery: '',
  color: '',
  size: '',
  category: '',
  isEbike: false,
  pieces: 1,
  priceRetail: 0,
  priceAction: 0,
  priceReseller: 0,
  note: ''
};

const categoryOptions = ['MTB', 'Road', 'Gravel', 'City', 'Trekking', 'Kids', 'Other'];

interface AddBikeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editBike?: Bike;
}

// Function to get the image path for previewing
const getImagePath = (imageNumber: number) => {
  // Use the asset path utility for proper path handling
  return getAssetPath(`/jpeg/${imageNumber}.jpeg`);
};

// Function to get placeholder image for errors
const getPlaceholderImage = () => {
  return getAssetPath('/file.svg');
};

export default function AddBikeModal({ open, onClose, onSuccess, editBike }: AddBikeModalProps) {
  const [currentBike, setCurrentBike] = useState<Bike>(editBike || initialBikeState);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  
  const isEditMode = !!editBike;

  // Reset the form when the modal opens or editBike changes
  useEffect(() => {
    setCurrentBike(editBike || initialBikeState);
  }, [editBike, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCurrentBike(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setCurrentBike(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCurrentBike(prev => ({
      ...prev,
      imageUrl: parseInt(value) || 0
    }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode && currentBike.id) {
        await updateBike(currentBike.id, currentBike);
      } else {
        await addBike(currentBike);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving bike:", error);
    }
  };

  const handleClose = () => {
    // Reset form
    setCurrentBike(initialBikeState);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Bike' : 'Add New Bike'}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { 
              m: 1, 
              width: { 
                xs: 'calc(100% - 16px)', // Full width minus margin on mobile
                sm: '47%'               // Original width on larger screens
              }
            },
            display: 'flex',
            flexWrap: 'wrap',
            mt: 1
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Manufacturer"
            name="manufacturer"
            value={currentBike.manufacturer}
            onChange={handleInputChange}
            disabled={true} // Since it will always be Bulls
          />
          
          <TextField
            label="Model Name"
            name="modelName"
            value={currentBike.modelName}
            onChange={handleInputChange}
            required
          />
          
          <TextField
            label="Model Year"
            name="modelYear"
            type="number"
            value={currentBike.modelYear}
            onChange={handleInputChange}
            required
          />
          
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={currentBike.weight}
            onChange={handleInputChange}
          />
          
          <TextField
            label="Frame Material"
            name="frameMaterial"
            value={currentBike.frameMaterial}
            onChange={handleInputChange}
          />
          
          <Box sx={{ 
            m: 1, 
            width: { 
              xs: 'calc(100% - 16px)', // Full width minus margin on mobile
              sm: '97%'               // Original width on larger screens
            }
          }}>
            <TextField
              label="Image Number"
              name="imageUrl"
              type="number"
              value={currentBike.imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Enter image number"
              fullWidth
              helperText="Enter the number of the JPEG file in the jpeg folder"
              InputProps={{
                endAdornment: currentBike.imageUrl ? (
                  <a
                    href={getImagePath(currentBike.imageUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '8px', color: '#1976d2', textDecoration: 'none' }}
                  >
                    View image
                  </a>
                ) : null
              }}
            />
            {currentBike.imageUrl > 0 && (
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', height: '100px' }}>
                <img
                  src={getImagePath(currentBike.imageUrl)}
                  alt="Bike preview"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    setImagePreviewError(true);
                    // Replace with placeholder on error
                    (e.target as HTMLImageElement).src = getPlaceholderImage();
                    (e.target as HTMLImageElement).onerror = null; // Prevent infinite loops
                  }}
                  onLoad={() => setImagePreviewError(false)}
                />
              </Box>
            )}
          </Box>
          
          <TextField
            label="Location"
            name="location"
            value={currentBike.location}
            onChange={handleInputChange}
          />
          
          <TextField
            label="Battery"
            name="battery"
            value={currentBike.battery}
            onChange={handleInputChange}
          />
          
          <TextField
            label="Color"
            name="color"
            value={currentBike.color}
            onChange={handleInputChange}
          />
          
          <TextField
            label="Size"
            name="size"
            value={currentBike.size}
            onChange={handleInputChange}
          />
          
          <FormControl sx={{ 
            m: 1, 
            width: { 
              xs: 'calc(100% - 16px)', // Full width minus margin on mobile
              sm: '47%'               // Original width on larger screens
            }
          }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={currentBike.category}
              label="Category"
              onChange={handleSelectChange as any}
            >
              {categoryOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={currentBike.isEbike}
                onChange={handleInputChange}
                name="isEbike"
              />
            }
            label="E-Bike"
            sx={{ 
              m: 1, 
              width: { 
                xs: 'calc(100% - 16px)', // Full width minus margin on mobile
                sm: '47%'               // Original width on larger screens
              }
            }}
          />
          
          <TextField
            label="Model Number"
            name="modelNumber"
            value={currentBike.modelNumber}
            onChange={handleInputChange}
          />
          
          <TextField
            label="Product Link"
            name="link"
            value={currentBike.link}
            onChange={handleInputChange}
          />
          
          <TextField
            label="Pieces"
            name="pieces"
            type="number"
            value={currentBike.pieces}
            onChange={handleInputChange}
          />
          
          <TextField
            label="Retail Price"
            name="priceRetail"
            type="number"
            value={currentBike.priceRetail}
            onChange={handleInputChange}
          />
          
          <TextField
            label="Action Price"
            name="priceAction"
            type="number"
            value={currentBike.priceAction}
            onChange={handleInputChange}
          />
          
          <TextField
            label="Reseller Price"
            name="priceReseller"
            type="number"
            value={currentBike.priceReseller}
            onChange={handleInputChange}
          />
          
          <TextField
            label="Notes"
            name="note"
            value={currentBike.note}
            onChange={handleInputChange}
            multiline
            rows={4}
            sx={{ 
              m: 1, 
              width: { 
                xs: 'calc(100% - 16px)', // Full width minus margin on mobile
                sm: '97%'               // Original width on larger screens
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
} 