'use client';

import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Checkbox, FormControlLabel, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

interface Column {
  id: string;
  label: string;
  defaultChecked: boolean;
}

const columns: Column[] = [
  { id: 'modelNumber', label: 'Model Number', defaultChecked: true },
  { id: 'size', label: 'Size', defaultChecked: true },
  { id: 'modelName', label: 'Model Name', defaultChecked: true },
  { id: 'battery', label: 'Battery', defaultChecked: true },
  { id: 'pieces', label: 'Pieces', defaultChecked: true },
  { id: 'note', label: 'Note', defaultChecked: true },
  { id: 'priceRetail', label: 'Price Retail', defaultChecked: true },
  { id: 'priceAdam', label: 'Price Adam', defaultChecked: true },
  { id: 'priceAction', label: 'Price Action', defaultChecked: true },
];

export default function ExportPage() {
  const router = useRouter();
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: col.defaultChecked }), {})
  );

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          columns: Object.entries(selectedColumns)
            .filter(([_, selected]) => selected)
            .map(([id]) => id)
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bike-inventory-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      // TODO: Add error handling UI
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Export Inventory
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Select Columns to Export
          </Typography>
          <Stack spacing={1}>
            {columns.map((column) => (
              <FormControlLabel
                key={column.id}
                control={
                  <Checkbox
                    checked={selectedColumns[column.id]}
                    onChange={() => handleColumnToggle(column.id)}
                  />
                }
                label={column.label}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExport}
            disabled={!Object.values(selectedColumns).some(Boolean)}
          >
            Export Excel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 