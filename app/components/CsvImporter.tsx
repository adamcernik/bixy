'use client';

import { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { addBike } from '../services/bikeService';
import { Bike } from '../models/Bike';

export default function CsvImporter() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState<string>('auto');
  const [debugInfo, setDebugInfo] = useState<{skipped: number, total: number, reasons: Record<string, number>}>({
    skipped: 0,
    total: 0,
    reasons: {}
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
      setDebugInfo({
        skipped: 0,
        total: 0,
        reasons: {}
      });
    }
  };

  const handleDelimiterChange = (e: SelectChangeEvent) => {
    setDelimiter(e.target.value);
  };

  // Detect the delimiter from the file content
  const detectDelimiter = (content: string): string => {
    const firstLine = content.split('\n')[0];
    
    // Count occurrences of common delimiters
    const delimiters = [',', ';', '\t'];
    const counts = delimiters.map(d => {
      return {
        delimiter: d,
        count: (firstLine.match(new RegExp(d === '\t' ? '\t' : `\\${d}`, 'g')) || []).length
      };
    });
    
    // Find the delimiter with the most occurrences
    const detected = counts.sort((a, b) => b.count - a.count)[0];
    return detected.count > 0 ? detected.delimiter : ','; // Default to comma if no delimiter found
  };

  const addSkipReason = (reason: string) => {
    setDebugInfo(prev => {
      const newReasons = { ...prev.reasons };
      newReasons[reason] = (newReasons[reason] || 0) + 1;
      return {
        ...prev,
        skipped: prev.skipped + 1,
        reasons: newReasons
      };
    });
  };

  const processCSV = (csvText: string, csvDelimiter: string) => {
    // Split the CSV into lines
    const lines = csvText.split(/\r?\n/); // Handle both Windows and Unix line endings
    
    // Reset debug info
    setDebugInfo({
      skipped: 0,
      total: lines.length - 1, // Exclude header row
      reasons: {}
    });
    
    // Get headers from the first non-empty line
    let headerLine = 0;
    while (headerLine < lines.length && !lines[headerLine].trim()) {
      headerLine++;
    }
    
    if (headerLine >= lines.length) {
      throw new Error('CSV file appears to be empty');
    }
    
    const headers = lines[headerLine].split(csvDelimiter).map(header => header.trim());
    console.log('Headers detected:', headers);
    
    // Parse the data
    const data: Bike[] = [];
    
    for (let i = headerLine + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        addSkipReason('Empty line');
        continue; // Skip empty lines
      }
      
      // Try to handle quoted values properly
      let values: string[] = [];
      let currentValue = '';
      let inQuotes = false;
      
      // Simple CSV parser that handles quoted values
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"' && (j === 0 || line[j-1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === csvDelimiter && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue.trim());
      
      // Post-process values to remove quotes
      values = values.map(value => {
        if (value.startsWith('"') && value.endsWith('"')) {
          return value.substring(1, value.length - 1).trim();
        }
        return value.trim();
      });
      
      // Check if we have the right number of columns
      if (values.length !== headers.length) {
        addSkipReason(`Column count mismatch (found ${values.length}, expected ${headers.length})`);
        console.warn(`Line ${i+1}: Wrong number of columns (found ${values.length}, expected ${headers.length})`);
        console.warn(`Line content: ${line}`);
        continue;
      }
      
      // Create a bike object from the CSV row
      const bike: Partial<Bike> = {
        manufacturer: 'Bulls', // Default value
      };
      
      // Track if we have at least the model name
      let hasModelName = false;
      
      // Map CSV headers to Bike properties
      headers.forEach((header, index) => {
        const value = values[index];
        if (!value) return; // Skip empty values
        
        const headerLower = header.toLowerCase().trim();
        
        switch(headerLower) {
          case 'model':
          case 'modelname':
          case 'name':
            bike.modelName = value;
            hasModelName = true;
            break;
          case 'modelnumber':
          case 'model_number':
          case 'model-number':
          case 'productcode':
          case 'product_code':
          case 'product-code':
          case 'code':
            bike.modelNumber = value;
            break;
          case 'year':
          case 'modelyear':
            bike.modelYear = parseInt(value) || new Date().getFullYear();
            break;
          case 'weight':
          case 'kg':
            bike.weight = parseFloat(value.replace(',', '.')) || 0;
            break;
          case 'material':
          case 'framematerial':
          case 'frame':
            bike.frameMaterial = value;
            break;
          case 'image':
          case 'imageurl':
          case 'img':
          case 'url':
          case 'imagenumber':
          case 'image_number':
          case 'image-number':
            bike.imageUrl = parseInt(value) || 0;
            break;
          case 'link':
          case 'productlink':
          case 'product_link':
          case 'product-link':
          case 'producturl':
          case 'product_url':
          case 'product-url':
            bike.link = value;
            break;
          case 'location':
          case 'store':
          case 'warehouse':
            bike.location = value;
            break;
          case 'battery':
          case 'batt':
          case 'wh':
            bike.battery = value;
            break;
          case 'color':
          case 'colour':
            bike.color = value;
            break;
          case 'size':
          case 'framesize':
            bike.size = value;
            break;
          case 'category':
          case 'cat':
          case 'type':
            bike.category = value;
            break;
          case 'isebike':
          case 'ebike':
          case 'electric':
          case 'e-bike':
            bike.isEbike = value.toLowerCase() === 'true' || 
                           value === '1' || 
                           value.toLowerCase() === 'yes' || 
                           value.toLowerCase() === 'y' ||
                           value.toLowerCase() === 'e'; // Accept more variations
            break;
          case 'pieces':
          case 'quantity':
          case 'amount':
          case 'count':
          case 'qty':
            bike.pieces = parseInt(value) || 1;
            break;
          case 'priceretail':
          case 'retail':
          case 'price':
          case 'msrp':
            bike.priceRetail = parseFloat(value.replace(/[, ]/g, '')) || 0;
            break;
          case 'priceaction':
          case 'action':
          case 'sale':
          case 'discount':
            bike.priceAction = parseFloat(value.replace(/[, ]/g, '')) || 0;
            break;
          case 'pricereseller':
          case 'reseller':
          case 'wholesale':
          case 'dealer':
            bike.priceReseller = parseFloat(value.replace(/[, ]/g, '')) || 0;
            break;
          case 'note':
          case 'notes':
          case 'description':
          case 'desc':
          case 'comment':
            bike.note = value;
            break;
          default:
            console.warn(`Unknown header: "${header}" with value: "${value}"`);
        }
      });
      
      // Fill in any missing required fields with defaults
      const completeBike: Bike = {
        manufacturer: 'Bulls',
        modelName: bike.modelName || '',
        modelNumber: bike.modelNumber || '',
        modelYear: bike.modelYear || new Date().getFullYear(),
        weight: bike.weight || 0,
        frameMaterial: bike.frameMaterial || '',
        imageUrl: bike.imageUrl || 0,
        link: bike.link || '',
        location: bike.location || '',
        battery: bike.battery || '',
        color: bike.color || '',
        size: bike.size || '',
        category: bike.category || '',
        isEbike: bike.isEbike || false,
        pieces: bike.pieces || 1,
        priceRetail: bike.priceRetail || 0,
        priceAction: bike.priceAction || 0,
        priceReseller: bike.priceReseller || 0,
        note: bike.note || ''
      };
      
      // Only add bikes that have at least a model name
      if (hasModelName && completeBike.modelName) {
        data.push(completeBike);
      } else {
        addSkipReason('Missing model name');
        console.warn(`Line ${i+1}: Missing model name`);
      }
    }
    
    return data;
  };

  const importBikes = async (bikes: Bike[]) => {
    let imported = 0;
    let errors = 0;
    
    for (let i = 0; i < bikes.length; i++) {
      try {
        await addBike(bikes[i]);
        imported++;
        setProgress(Math.round((i + 1) / bikes.length * 100));
      } catch (err) {
        errors++;
        console.error(`Error importing bike ${bikes[i].modelName}:`, err);
      }
    }
    
    return { imported, errors };
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);
    
    try {
      // Read the file
      const text = await file.text();
      console.log(`CSV file size: ${text.length} characters`);
      
      // Auto-detect delimiter if set to 'auto'
      const useDelimiter = delimiter === 'auto' ? detectDelimiter(text) : delimiter;
      console.log(`Using delimiter: "${useDelimiter}" (${useDelimiter === '\t' ? 'tab' : useDelimiter})`);
      
      // Process the CSV
      const bikes = processCSV(text, useDelimiter);
      console.log(`Found ${bikes.length} valid bikes in CSV`);
      
      if (bikes.length === 0) {
        throw new Error('No valid bike data found in the CSV file');
      }
      
      // Import the bikes
      const { imported, errors } = await importBikes(bikes);
      
      setSuccess(`Successfully imported ${imported} bikes out of ${bikes.length} (${errors} errors). ${debugInfo.skipped} entries were skipped from the original CSV.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('CSV import error:', err);
    } finally {
      setIsLoading(false);
      setFile(null);
      // Reset the file input
      const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const generateSampleCsv = () => {
    const headers = [
      'modelName', 'modelNumber', 'modelYear', 'weight', 'frameMaterial', 
      'imageUrl', 'link', 'location', 'battery', 'color', 'size', 
      'category', 'isEbike', 'pieces', 'priceRetail', 
      'priceAction', 'priceReseller', 'note'
    ];
    
    const sampleData = [
      [
        'Wild Cross 1', 'WC1-2023', '2023', '15.5', 'Aluminum', 
        '1234', 'https://bulls.com/wild-cross-1', 'Store A', 'Bosch PowerTube 625Wh', 'Red', 'M', 
        'MTB', 'true', '2', '59990', 
        '54990', '49990', 'Demo model with slight wear'
      ],
      [
        'Lacuba EVO 8', 'LE8-2024', '2024', '22.3', 'Carbon', 
        'https://example.com/bike2.jpg', 'https://bulls.com/lacuba-evo-8', 'Warehouse', 'Bosch PowerTube 750Wh', 'Black', 'L', 
        'City', 'true', '1', '72990', 
        '68990', '62990', 'New arrival'
      ]
    ];
    
    let csvContent = headers.join(',') + '\n';
    
    for (const row of sampleData) {
      csvContent += row.join(',') + '\n';
    }
    
    return csvContent;
  };

  const downloadSampleCsv = () => {
    const csvContent = generateSampleCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'bulls_bikes_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: 'white', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      mb: 3,
      color: 'black'
    }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, color: 'black' }}>
        CSV Importer
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200, color: 'black' }}>
          <InputLabel id="delimiter-label" sx={{ color: 'black' }}>CSV Delimiter</InputLabel>
          <Select
            labelId="delimiter-label"
            value={delimiter}
            onChange={handleDelimiterChange}
            label="CSV Delimiter"
            sx={{ color: 'black' }}
          >
            <MenuItem value="auto">Auto-detect</MenuItem>
            <MenuItem value=",">Comma (,)</MenuItem>
            <MenuItem value=";">Semicolon (;)</MenuItem>
            <MenuItem value="\t">Tab</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
        <Button 
          variant="outlined" 
          component="label" 
          sx={{ 
            borderColor: 'primary.main',
            color: 'primary.main' 
          }}
        >
          Select CSV File
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            hidden
          />
        </Button>
        
        <Typography variant="body1" color="textSecondary" sx={{ color: 'black' }}>
          {file ? file.name : 'No file selected'}
        </Typography>
        
        <Button 
          onClick={downloadSampleCsv} 
          variant="outlined" 
          sx={{ 
            ml: 'auto',
            borderColor: 'primary.main',
            color: 'primary.main'
          }}
        >
          Download Sample CSV
        </Button>
      </Box>
      
      <Button 
        onClick={handleSubmit} 
        variant="contained" 
        disabled={!file || isLoading}
        sx={{ mb: 3 }}
      >
        {isLoading ? 'Importing...' : 'Import Data'}
      </Button>
      
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <CircularProgress variant="determinate" value={progress} size={24} />
          <Typography variant="body2" color="textSecondary" sx={{ color: 'black' }}>
            Importing {progress}%
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {debugInfo.total > 0 && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1, color: 'black' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}>
            Import Summary
          </Typography>
          <Typography variant="body2" sx={{ color: 'black' }}>
            Total rows: {debugInfo.total}
          </Typography>
          <Typography variant="body2" sx={{ color: 'black' }}>
            Successfully imported: {debugInfo.total - debugInfo.skipped}
          </Typography>
          <Typography variant="body2" sx={{ color: 'black' }}>
            Skipped rows: {debugInfo.skipped}
          </Typography>
          
          {Object.keys(debugInfo.reasons).length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
                Reasons for skipped rows:
              </Typography>
              <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                {Object.entries(debugInfo.reasons).map(([reason, count]) => (
                  <li key={reason}>
                    <Typography variant="body2" sx={{ color: 'black' }}>
                      {reason}: {count}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
} 