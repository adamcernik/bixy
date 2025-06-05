'use client';

import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImageZoomModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

export default function ImageZoomModal({ open, onClose, imageSrc, imageAlt }: ImageZoomModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogContent className="relative p-0">
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <div className="flex items-center justify-center">
          <img 
            src={imageSrc} 
            alt={imageAlt} 
            className="w-full h-auto max-h-[90vh] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 