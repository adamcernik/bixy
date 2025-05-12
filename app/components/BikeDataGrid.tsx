'use client';

import { useState, useEffect } from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridRenderCellParams,
  GridToolbar,
  GridRowParams,
  MuiEvent,
  GridEventListener,
  GridEditInputCell,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridCellModesModel,
  GridCellMode,
  GridCellModes,
  useGridApiContext,
  GridCellEditStopParams,
  GridCellParams
} from '@mui/x-data-grid';
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
  Typography,
  Snackbar,
  Alert,
  Select
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { getBikes, addBike, updateBike, deleteBike } from '../services/bikeService';
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

// Define color palette for bikes
const colorOptions = [
  { value: 'Black', color: '#000000' },
  { value: 'White', color: '#FFFFFF' },
  { value: 'Red', color: '#FF0000' },
  { value: 'Blue', color: '#0000FF' },
  { value: 'Green', color: '#008000' },
  { value: 'Yellow', color: '#FFFF00' },
  { value: 'Orange', color: '#FFA500' },
  { value: 'Purple', color: '#800080' },
  { value: 'Pink', color: '#FFC0CB' },
  { value: 'Brown', color: '#A52A2A' },
  { value: 'Grey', color: '#808080' },
  { value: 'Silver', color: '#C0C0C0' },
  { value: 'Gold', color: '#FFD700' },
  { value: 'Navy', color: '#000080' },
  { value: 'Teal', color: '#008080' },
  { value: 'Olive', color: '#808000' },
  { value: 'Maroon', color: '#800000' },
  { value: 'Aqua', color: '#00FFFF' },
  { value: 'Lime', color: '#00FF00' },
  { value: 'Beige', color: '#F5F5DC' },
  { value: 'Coral', color: '#FF7F50' },
  { value: 'Magenta', color: '#FF00FF' },
  { value: 'Mint', color: '#98FB98' },
  { value: 'Lavender', color: '#E6E6FA' },
  { value: 'Turquoise', color: '#40E0D0' },
  // Add more colors as needed
];

// Function to get color code from color name
const getColorCode = (colorName: string): string => {
  const colorOption = colorOptions.find(option => 
    option.value.toLowerCase() === colorName.toLowerCase()
  );
  return colorOption?.color || '#CCCCCC'; // Default to grey if color not found
};

const categoryOptions = ['MTB', 'Road', 'Gravel', 'City', 'Trekking', 'Kids', 'Other'];

interface BikeDataGridProps {
  openAddDialog?: boolean;
  setOpenAddDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}

// Add this helper function near the top of the file
const getImagePath = (imageNumber: number): string => {
  if (!imageNumber) return '';
  return getAssetPath(`/jpeg/${imageNumber}.jpeg`);
};

// Add a placeholder image function
const getPlaceholderImage = (): string => {
  return getAssetPath('/bixy-logo.svg');
};

export default function BikeDataGrid({ openAddDialog, setOpenAddDialog }: BikeDataGridProps) {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBike, setCurrentBike] = useState<Bike>(initialBikeState);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [editedValue, setEditedValue] = useState<any>(null);
  const [modifiedCells, setModifiedCells] = useState<Record<string, Set<string>>>({});

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const bikesData = await getBikes();
      setBikes(bikesData);
    } catch (error) {
      console.error("Error fetching bikes:", error);
      setSnackbar({
        open: true,
        message: 'Error fetching bikes data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  // Effect to handle openAddDialog prop
  useEffect(() => {
    if (openAddDialog) {
      handleOpen();
      // Reset the parent state
      if (setOpenAddDialog) {
        setOpenAddDialog(false);
      }
    }
  }, [openAddDialog, setOpenAddDialog]);

  const handleCellModesModelChange = (newCellModesModel: GridCellModesModel) => {
    setCellModesModel(newCellModesModel);
  };

  const handleCellEditStart = (params: any, event: MuiEvent) => {
    setEditedValue(params.row[params.field]);
    event.defaultMuiPrevented = false;
  };

  const handleCellEditStop = (params: GridCellEditStopParams, event: MuiEvent) => {
    if (params.reason === 'cellFocusOut' || params.reason === 'enterKeyDown') {
      event.defaultMuiPrevented = false;
    } else {
      event.defaultMuiPrevented = true;
    }
  };
  
  const handleDeleteClick = (id: string) => async () => {
    if (confirm('Are you sure you want to delete this bike?')) {
      try {
        await deleteBike(id);
        fetchBikes();
        setSnackbar({
          open: true,
          message: 'Bike deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error("Error deleting bike:", error);
        setSnackbar({
          open: true,
          message: 'Error deleting bike',
          severity: 'error'
        });
      }
    }
  };

  const handleOpen = (bike?: Bike) => {
    if (bike) {
      setCurrentBike(bike);
      setEditMode(true);
    } else {
      setCurrentBike(initialBikeState);
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCurrentBike(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCurrentBike(prev => ({
      ...prev,
      imageUrl: parseInt(value) || 0
    }));
  };

  const handleAddNewBike = async () => {
    try {
      if (editMode && currentBike.id) {
        await updateBike(currentBike.id, currentBike);
      } else {
        await addBike(currentBike);
      }
      fetchBikes();
      handleClose();
      setSnackbar({
        open: true,
        message: `Bike ${editMode ? 'updated' : 'added'} successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error("Error saving bike:", error);
      setSnackbar({
        open: true,
        message: `Error ${editMode ? 'updating' : 'adding'} bike`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const processRowUpdate = async (newRow: Bike) => {
    try {
      // Find the original row in the bikes array
      const originalRow = bikes.find(bike => bike.id === newRow.id);
      
      // Log for debugging
      console.log('Processing row update:', { newRow, originalRow, editedValue });
      
      // Check if we have an ID and original row exists
      if (newRow.id && originalRow) {
        // Flag to check if any value has changed
        let valueChanged = false;
        let changedFields: string[] = [];
        
        // Check each field to see if there are actual changes
        Object.entries(newRow).forEach(([key, value]) => {
          if (key === 'id') return;
          
          const originalValue = originalRow[key as keyof Bike];
          let isDifferent = false;
          
          // Compare based on data type
          if (typeof value === 'boolean') {
            isDifferent = value !== originalValue;
          } else if (typeof value === 'number') {
            isDifferent = value !== originalValue;
          } else {
            // For strings and other types, convert to string for comparison
            isDifferent = String(value || '') !== String(originalValue || '');
          }
              
          if (isDifferent) {
            console.log(`Field ${key} changed from ${originalValue} to ${value}`);
            valueChanged = true;
            changedFields.push(key);
            
            // Mark modified cells
            setModifiedCells(prev => {
              const newModifiedCells = { ...prev };
              if (!newModifiedCells[newRow.id!]) {
                newModifiedCells[newRow.id!] = new Set();
              }
              newModifiedCells[newRow.id!].add(key);
              return newModifiedCells;
            });
          }
        });
        
        // Only update Firebase and show toast if something actually changed
        if (valueChanged) {
          console.log("Value changed, updating Firebase");
          await updateBike(newRow.id, newRow);
          
          // Show success notification
          setSnackbar({
            open: true,
            message: 'Bike updated successfully',
            severity: 'success'
          });
          
          // Set timeout to clear the modified cells highlighting after 5 seconds
          setTimeout(() => {
            setModifiedCells(prev => {
              const newModifiedCells = { ...prev };
              if (newModifiedCells[newRow.id!]) {
                changedFields.forEach(field => {
                  newModifiedCells[newRow.id!].delete(field);
                });
                
                // If there are no more modified fields for this row, remove the row entry
                if (newModifiedCells[newRow.id!].size === 0) {
                  delete newModifiedCells[newRow.id!];
                }
              }
              return newModifiedCells;
            });
          }, 3000); // 3 seconds fade-out
        } else {
          console.log("No value changed, skipping update");
        }
      }
      
      // Reset the edited value for next edit
      setEditedValue(null);
      
      // Always return the new row to update the UI
      return newRow;
    } catch (error) {
      console.error("Error updating bike:", error);
      setSnackbar({
        open: true,
        message: 'Error updating bike',
        severity: 'error'
      });
      throw error;
    }
  };

  const handleToggleEbike = async (id: string, currentValue: boolean) => {
    try {
      const bikeToUpdate = bikes.find(bike => bike.id === id);
      if (bikeToUpdate) {
        const updatedBike = { ...bikeToUpdate, isEbike: !currentValue };
        await updateBike(id, updatedBike);
        fetchBikes();
        setSnackbar({
          open: true,
          message: `E-bike status ${!currentValue ? 'enabled' : 'disabled'}`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error("Error toggling e-bike status:", error);
      setSnackbar({
        open: true,
        message: 'Error updating e-bike status',
        severity: 'error'
      });
    }
  };

  const priceFormatter = (params: any) => {
    return params.value ? `${params.value.toLocaleString()} CZK` : '';
  };

  const yearFormatter = (params: any) => {
    return params.value;
  };

  const handleRowClick = (params: GridRowParams) => {
    // Open the full edit dialog on double-click
    const bike = params.row as Bike;
    if (bike) {
      handleOpen(bike);
    }
  };

  const handleColumnResize = (params: any) => {
    setColumnWidths(prev => ({
      ...prev,
      [params.colDef.field]: params.width
    }));
  };

  const handleCellClick = (params: GridCellParams) => {
    const field = params.field;
    const id = params.id;
    
    // Don't enter edit mode for these fields
    if (field === 'actions' || field === 'manufacturer' || field === 'isEbike' || field === 'imageUrl') {
      return;
    }
    
    // Enter edit mode for the clicked cell without affecting column widths
    setCellModesModel(prevModel => ({
      ...prevModel,
      [id]: {
        ...prevModel[id],
        [field]: { mode: GridCellModes.Edit }
      }
    }));
  };

  // Add a color selection component
  const ColorCell = (props: GridRenderCellParams) => {
    const { value } = props;
    
    if (!value) return <span>No color</span>;
    
    const colorCode = getColorCode(value);
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box 
          sx={{ 
            width: 18, 
            height: 18, 
            borderRadius: '50%', 
            backgroundColor: colorCode,
            border: '1px solid #AAAAAA',
            display: 'inline-block'
          }} 
        />
        <span>{value}</span>
      </Box>
    );
  };

  // Custom edit component for colors with color swatches
  const ColorEditCell = (props: any) => {
    const { id, value, field, api } = props;
    
    // Simplified handler to fix AbortError issues
    const handleValueChange = (event: any) => {
      const newValue = event.target.value;
      if (api && api.setEditCellValue) {
        api.setEditCellValue({ id, field, value: newValue });
      }
    };
    
    // Fall back to a regular input if rendering fails
    try {
      return (
        <Select
          value={value || ''}
          onChange={handleValueChange}
          fullWidth
          variant="standard"
          sx={{ 
            height: '100%',
            '& .MuiSelect-select': { 
              display: 'flex', 
              alignItems: 'center',
              paddingY: 0,
              height: '100%'
            }
          }}
        >
          {colorOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 16, 
                    height: 16, 
                    borderRadius: '50%', 
                    backgroundColor: option.color,
                    border: '1px solid #AAAAAA' 
                  }} 
                />
                <span>{option.value}</span>
              </Box>
            </MenuItem>
          ))}
        </Select>
      );
    } catch (e) {
      console.error('Error rendering ColorEditCell:', e);
      // Fallback to basic text input if Select fails
      return (
        <input
          type="text"
          value={value || ''}
          onChange={handleValueChange}
          style={{ width: '100%', height: '100%', padding: '0 8px' }}
        />
      );
    }
  };

  // Add a function to check if a cell has been modified
  const isCellModified = (id: string, field: string): boolean => {
    return modifiedCells[id]?.has(field) || false;
  };

  const columns: GridColDef[] = [
    { field: 'manufacturer', headerName: 'Manufacturer', width: columnWidths.manufacturer || 100 },
    { field: 'modelName', headerName: 'Model', width: columnWidths.modelName || 150, editable: true },
    { field: 'modelYear', headerName: 'Year', width: columnWidths.modelYear || 80, type: 'number', editable: true, valueFormatter: yearFormatter },
    { field: 'weight', headerName: 'Weight (kg)', width: columnWidths.weight || 100, type: 'number', editable: true },
    { field: 'frameMaterial', headerName: 'Frame Material', width: columnWidths.frameMaterial || 130, editable: true },
    { 
      field: 'imageUrl', 
      headerName: 'Image', 
      width: columnWidths.imageUrl || 120,
      editable: true,
      type: 'number',
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return 'No image';
        const imagePath = getImagePath(params.value as number);
        
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <img 
              src={imagePath} 
              alt="Bike" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '40px', 
                objectFit: 'contain',
                marginBottom: '4px'
              }} 
              onError={(e) => {
                // Replace with placeholder on error
                (e.target as HTMLImageElement).src = getPlaceholderImage();
                (e.target as HTMLImageElement).onerror = null; // Prevent infinite loops
              }}
            />
            <span style={{ fontSize: '11px' }}>
              {params.value}
            </span>
          </Box>
        );
      }
    },
    { field: 'location', headerName: 'Location', width: columnWidths.location || 120, editable: true },
    { field: 'battery', headerName: 'Battery', width: columnWidths.battery || 150, editable: true },
    { 
      field: 'color', 
      headerName: 'Color', 
      width: columnWidths.color || 120, 
      editable: true,
      type: 'singleSelect',
      valueOptions: colorOptions.map(option => option.value),
      renderCell: ColorCell,
      renderEditCell: ColorEditCell
    },
    { field: 'size', headerName: 'Size', width: columnWidths.size || 80, editable: true },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: columnWidths.category || 100, 
      editable: true,
      type: 'singleSelect',
      valueOptions: categoryOptions
    },
    { 
      field: 'isEbike', 
      headerName: 'E-Bike', 
      width: columnWidths.isEbike || 100,
      type: 'boolean',
      editable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Switch
            checked={params.value}
            onChange={() => handleToggleEbike(params.row.id as string, params.value as boolean)}
            onClick={(e) => e.stopPropagation()}
            color="primary"
            size="small"
          />
        );
      }
    },
    { field: 'pieces', headerName: 'Pieces', width: columnWidths.pieces || 80, type: 'number', editable: true },
    { 
      field: 'priceRetail', 
      headerName: 'Retail Price (CZK)', 
      width: columnWidths.priceRetail || 140, 
      type: 'number',
      editable: true,
      valueFormatter: priceFormatter
    },
    { 
      field: 'priceAction', 
      headerName: 'Action Price (CZK)', 
      width: columnWidths.priceAction || 140, 
      type: 'number',
      editable: true,
      valueFormatter: priceFormatter
    },
    { 
      field: 'priceReseller', 
      headerName: 'Reseller Price (CZK)', 
      width: columnWidths.priceReseller || 140, 
      type: 'number',
      editable: true,
      valueFormatter: priceFormatter
    },
    { field: 'note', headerName: 'Note', width: columnWidths.note || 200, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: columnWidths.actions || 70,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id as string)}
          color="inherit"
        />
      ],
    }
  ];

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <DataGrid
        rows={bikes}
        columns={columns}
        loading={loading}
        editMode="cell"
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellEditStart={handleCellEditStart}
        onCellEditStop={handleCellEditStop}
        onCellClick={handleCellClick}
        onColumnResize={handleColumnResize}
        columnVisibilityModel={{}}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error("Error processing row update:", error)}
        onRowDoubleClick={handleRowClick}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 50 },
          },
          sorting: {
            sortModel: [{ field: 'modelName', sort: 'asc' }],
          },
          columns: {
            columnVisibilityModel: {},
          }
        }}
        pageSizeOptions={[10, 20, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
        isCellEditable={(params) => {
          return params.field !== 'actions' && params.field !== 'manufacturer' && params.field !== 'isEbike' && params.field !== 'imageUrl';
        }}
        getCellClassName={(params) => {
          // Apply yellow background to modified cells
          if (isCellModified(params.id.toString(), params.field)) {
            return 'modified-cell';
          }
          return '';
        }}
        sx={{ 
          height: 'calc(100vh - 150px)',
          '& .modified-cell': {
            backgroundColor: 'rgba(255, 250, 160, 0.2)',
            transition: 'background-color 1.5s ease-out',
          },
          '& .MuiDataGrid-cell--editing': {
            backgroundColor: 'rgba(255, 231, 98, 0.25)', // More visible yellow for the entire cell
            padding: '0 !important',
            '& .MuiInputBase-root': {
              height: '100%',
              width: '100%',
              padding: 0,
              '.MuiInputBase-input': {
                padding: '0 8px',
                height: '100%',
              }
            },
            '& .MuiSelect-select': {
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8px',
            }
          },
          // Enhanced style for clickable cells
          '& .MuiDataGrid-cell:not(.MuiDataGrid-cell--editing):not([data-field="actions"]):not([data-field="manufacturer"]):not([data-field="isEbike"]):not([data-field="imageUrl"]):hover': {
            cursor: 'text',
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Bike' : 'Add New Bike'}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '47%' },
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
            
            <Box sx={{ m: 1, width: '97%' }}>
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
              placeholder="Brand and Wh power"
            />
            
            <TextField
              label="Color"
              name="color"
              select
              value={currentBike.color}
              onChange={handleInputChange}
            >
              {colorOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        backgroundColor: option.color,
                        border: '1px solid #AAAAAA' 
                      }} 
                    />
                    <span>{option.value}</span>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Size"
              name="size"
              value={currentBike.size}
              onChange={handleInputChange}
              helperText="Last two digits form the Product code"
            />
            
            <TextField
              label="Category"
              name="category"
              select
              value={currentBike.category}
              onChange={handleInputChange}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            
            <Box sx={{ m: 1, width: '47%', display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    name="isEbike"
                    checked={currentBike.isEbike}
                    onChange={handleInputChange}
                  />
                }
                label="E-Bike"
              />
            </Box>
            
            <TextField
              label="Pieces"
              name="pieces"
              type="number"
              value={currentBike.pieces}
              onChange={handleInputChange}
            />
            
            <TextField
              label="Retail Price (CZK)"
              name="priceRetail"
              type="number"
              value={currentBike.priceRetail}
              onChange={handleInputChange}
              helperText="Common for stores inc. VAT"
            />
            
            <TextField
              label="Action Price (CZK)"
              name="priceAction"
              type="number"
              value={currentBike.priceAction}
              onChange={handleInputChange}
              helperText="Special price for us"
            />
            
            <TextField
              label="Reseller Price (CZK)"
              name="priceReseller"
              type="number"
              value={currentBike.priceReseller}
              onChange={handleInputChange}
              helperText="Normal price for resellers"
            />
            
            <TextField
              label="Note"
              name="note"
              value={currentBike.note}
              onChange={handleInputChange}
              multiline
              rows={2}
              sx={{ width: '97%' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddNewBike} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
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
    </Box>
  );
} 