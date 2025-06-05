import { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, Alert } from '@mui/material';
import { Bike } from '../../models/Bike';
import { getPromotedBikes, setPromotedBikes } from '../../lib/services/promoted/promotedService';

interface PromotedBikesAdminProps {
  bikes: Bike[];
}

export default function PromotedBikesAdmin({ bikes }: PromotedBikesAdminProps) {
  const [promoted, setPromoted] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPromotedBikes()
      .then((modelNumbers) => setPromoted(modelNumbers))
      .catch(() => setError('Failed to load promoted bikes.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index: number, value: string) => {
    const updated = [...promoted];
    updated[index] = value;
    setPromoted(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await setPromotedBikes(promoted);
      setSuccess(true);
    } catch (e) {
      setError('Failed to save promoted bikes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3, background: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">Promoted Bikes</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select 3 bikes to promote on the homepage. You can change these at any time.
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Promoted bikes saved!</Alert>}
      {[0, 1, 2].map((idx) => (
        <FormControl fullWidth sx={{ mb: 2 }} key={idx}>
          <InputLabel>{`Promoted Bike ${idx + 1}`}</InputLabel>
          <Select
            value={promoted[idx]}
            label={`Promoted Bike ${idx + 1}`}
            onChange={(e) => handleChange(idx, e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {bikes.map((bike) => (
              <MenuItem key={bike.modelNumber} value={bike.modelNumber}>
                {bike.modelName} ({bike.modelNumber})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <Button variant="contained" color="primary" onClick={handleSave} fullWidth disabled={saving}>
        {saving ? 'Saving...' : 'Save Promoted Bikes'}
      </Button>
    </Box>
  );
} 