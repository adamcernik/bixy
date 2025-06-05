"use client";
import { useState } from 'react';
import { Box, Button, TextField, FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import { addBike, updateBike } from '../../lib/services/bike/bikeService';
import { Bike } from '../../models/Bike';
import { getAssetPath } from '../../utils/pathUtils';

const initialBikeState: Bike = {
  manufacturer: 'Bulls',
  modelName: '',
  modelNumber: '',
  modelYear: new Date().getFullYear(),
  weight: 0,
  frameMaterial: '',
  imageUrl: 0,
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

const getImagePath = (imageNumber: number) => getAssetPath(`/jpeg/${imageNumber}.jpeg`);
const getPlaceholderImage = () => getAssetPath('/file.svg');

export default function AddBikeForm({ onSuccess }: { onSuccess: () => void }) {
  const [currentBike, setCurrentBike] = useState<Bike>(initialBikeState);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCurrentBike(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setCurrentBike(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCurrentBike(prev => ({ ...prev, imageUrl: parseInt(value) || 0 }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await addBike(currentBike);
      onSuccess();
    } catch (error) {
      console.error("Error saving bike:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="form" sx={{ maxWidth: 700, mx: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }} noValidate autoComplete="off">
      <Typography variant="h5" sx={{ mb: 2, width: '100%' }}>Přidat nové kolo</Typography>
      {/* Row 1: Model number, Battery */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField label="Model Number" name="modelNumber" value={currentBike.modelNumber} onChange={handleInputChange} required fullWidth />
        <TextField label="Battery" name="battery" value={currentBike.battery} onChange={handleInputChange} fullWidth />
      </Box>
      {/* Row 2: Model name */}
      <TextField label="Model Name" name="modelName" value={currentBike.modelName} onChange={handleInputChange} required fullWidth />
      {/* Row 3: Color, Size, Frame Material */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField label="Color" name="color" value={currentBike.color} onChange={handleInputChange} fullWidth />
        <TextField label="Size" name="size" value={currentBike.size} onChange={handleInputChange} fullWidth />
        <TextField label="Frame Material" name="frameMaterial" value={currentBike.frameMaterial} onChange={handleInputChange} fullWidth />
      </Box>
      {/* Row 4: Pieces, Category, Image Number */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField label="Pieces" name="pieces" type="number" value={currentBike.pieces} onChange={handleInputChange} fullWidth />
        <FormControl fullWidth>
          <InputLabel id="category-label">Category</InputLabel>
          <Select labelId="category-label" id="category" name="category" value={currentBike.category} label="Category" onChange={handleSelectChange as any}>
            {categoryOptions.map(option => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
          </Select>
        </FormControl>
        <TextField label="Image Number" name="imageUrl" type="number" value={currentBike.imageUrl} onChange={handleImageUrlChange} placeholder="Enter image number" fullWidth helperText="JPEG file number in the jpeg folder" />
      </Box>
      {/* Image preview */}
      {currentBike.imageUrl > 0 && (
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', height: '100px' }}>
          <img src={getImagePath(currentBike.imageUrl)} alt="Bike preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} onError={e => { setImagePreviewError(true); (e.target as HTMLImageElement).src = getPlaceholderImage(); (e.target as HTMLImageElement).onerror = null; }} onLoad={() => setImagePreviewError(false)} />
        </Box>
      )}
      {/* Row 5: Year, Weight, Location */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField label="Year" name="modelYear" type="number" value={currentBike.modelYear} onChange={handleInputChange} required fullWidth />
        <TextField label="Weight (kg)" name="weight" type="number" value={currentBike.weight} onChange={handleInputChange} fullWidth />
        <TextField label="Location" name="location" value={currentBike.location} onChange={handleInputChange} fullWidth />
      </Box>
      {/* Row 6: All 3 price inputs */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField label="Retail Price" name="priceRetail" type="number" value={currentBike.priceRetail} onChange={handleInputChange} fullWidth />
        <TextField label="Adam Price" name="priceAction" type="number" value={currentBike.priceAction} onChange={handleInputChange} fullWidth />
        <TextField label="Reseller Price" name="priceReseller" type="number" value={currentBike.priceReseller} onChange={handleInputChange} fullWidth />
      </Box>
      {/* Product URL */}
      <TextField label="Product URL" name="link" value={currentBike.link} onChange={handleInputChange} fullWidth />
      {/* Notes */}
      <TextField label="Notes" name="note" value={currentBike.note} onChange={handleInputChange} multiline rows={4} fullWidth />
      {/* Save button */}
      <Button variant="contained" color="primary" onClick={handleSave} disabled={saving} sx={{ width: '100%', mt: 2, fontWeight: 'bold', fontSize: 20, py: 1.5 }}>SAVE</Button>
    </Box>
  );
} 