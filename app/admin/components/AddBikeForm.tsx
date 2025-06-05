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
    <Box component="form" sx={{ maxWidth: 700, mx: 'auto', p: 2, '& .MuiTextField-root': { m: 1, width: { xs: 'calc(100% - 16px)', sm: '47%' } }, display: 'flex', flexWrap: 'wrap', mt: 1 }} noValidate autoComplete="off">
      <Typography variant="h5" sx={{ mb: 2, width: '100%' }}>Přidat nové kolo</Typography>
      <TextField label="Manufacturer" name="manufacturer" value={currentBike.manufacturer} onChange={handleInputChange} disabled />
      <TextField label="Model Name" name="modelName" value={currentBike.modelName} onChange={handleInputChange} required />
      <TextField label="Model Year" name="modelYear" type="number" value={currentBike.modelYear} onChange={handleInputChange} required />
      <TextField label="Weight (kg)" name="weight" type="number" value={currentBike.weight} onChange={handleInputChange} />
      <TextField label="Frame Material" name="frameMaterial" value={currentBike.frameMaterial} onChange={handleInputChange} />
      <Box sx={{ m: 1, width: { xs: 'calc(100% - 16px)', sm: '97%' } }}>
        <TextField label="Image Number" name="imageUrl" type="number" value={currentBike.imageUrl} onChange={handleImageUrlChange} placeholder="Enter image number" fullWidth helperText="Enter the number of the JPEG file in the jpeg folder" InputProps={{ endAdornment: currentBike.imageUrl ? (<a href={getImagePath(currentBike.imageUrl)} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px', color: '#1976d2', textDecoration: 'none' }}>View image</a>) : null }} />
        {currentBike.imageUrl > 0 && (
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', height: '100px' }}>
            <img src={getImagePath(currentBike.imageUrl)} alt="Bike preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} onError={e => { setImagePreviewError(true); (e.target as HTMLImageElement).src = getPlaceholderImage(); (e.target as HTMLImageElement).onerror = null; }} onLoad={() => setImagePreviewError(false)} />
          </Box>
        )}
      </Box>
      <TextField label="Location" name="location" value={currentBike.location} onChange={handleInputChange} />
      <TextField label="Battery" name="battery" value={currentBike.battery} onChange={handleInputChange} />
      <TextField label="Color" name="color" value={currentBike.color} onChange={handleInputChange} />
      <TextField label="Size" name="size" value={currentBike.size} onChange={handleInputChange} />
      <FormControl sx={{ m: 1, width: { xs: 'calc(100% - 16px)', sm: '47%' } }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select labelId="category-label" id="category" name="category" value={currentBike.category} label="Category" onChange={handleSelectChange as any}>
          {categoryOptions.map(option => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
        </Select>
      </FormControl>
      <FormControlLabel control={<Switch checked={currentBike.isEbike} onChange={handleInputChange} name="isEbike" />} label="E-Bike" sx={{ m: 1, width: { xs: 'calc(100% - 16px)', sm: '47%' } }} />
      <TextField label="Model Number" name="modelNumber" value={currentBike.modelNumber} onChange={handleInputChange} />
      <TextField label="Product Link" name="link" value={currentBike.link} onChange={handleInputChange} />
      <TextField label="Pieces" name="pieces" type="number" value={currentBike.pieces} onChange={handleInputChange} />
      <TextField label="Retail Price" name="priceRetail" type="number" value={currentBike.priceRetail} onChange={handleInputChange} />
      <TextField label="Action Price" name="priceAction" type="number" value={currentBike.priceAction} onChange={handleInputChange} />
      <TextField label="Reseller Price" name="priceReseller" type="number" value={currentBike.priceReseller} onChange={handleInputChange} />
      <TextField label="Notes" name="note" value={currentBike.note} onChange={handleInputChange} multiline rows={4} sx={{ m: 1, width: { xs: 'calc(100% - 16px)', sm: '97%' } }} />
      <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>Uložit</Button>
      </Box>
    </Box>
  );
} 