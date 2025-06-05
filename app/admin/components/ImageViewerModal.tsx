'use client';

import { Dialog, DialogTitle, DialogContent, IconButton, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import LinkIcon from '@mui/icons-material/Link';
import { getAssetPath } from '../../utils/pathUtils';

interface ImageViewerModalProps {
  open: boolean;
  onClose: () => void;
  imageNumber: number;
  modelName: string;
  productLink?: string;
}

export default function ImageViewerModal({ open, onClose, imageNumber, modelName, productLink }: ImageViewerModalProps) {
  const imagePath = imageNumber ? getAssetPath(`/jpeg/${imageNumber}.jpeg`) : '';
  
  const handleDownload = () => {
    if (!imagePath) return;
    
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = `${modelName || 'bike'}-${imageNumber}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { 
          position: 'relative',
          backgroundColor: 'white'
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'black'
      }}>
        {modelName || 'Bike Image'}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {productLink && (
            <Button 
              variant="outlined" 
              startIcon={<LinkIcon />} 
              href={productLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mr: 1 }}
            >
              Product Link
            </Button>
          )}
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />} 
            onClick={handleDownload}
            sx={{ mr: 1 }}
          >
            Download
          </Button>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        <Box sx={{ 
          width: '100%', 
          height: '70vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 2
        }}>
          {imagePath ? (
            <img 
              src={imagePath} 
              alt={`${modelName || 'Bike'} - Image ${imageNumber}`}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
          ) : (
            <Box sx={{ p: 4, color: 'text.secondary' }}>No image available</Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
} 