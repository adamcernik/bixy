'use client';

import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ open, onClose }: SizeGuideModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
    >
      <DialogContent className="relative">
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="absolute top-2 right-2"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <div className="pt-4">
          <h2 className="text-2xl font-bold mb-4">Size Guide</h2>
          
          <div className="overflow-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-6 py-3 text-left text-gray-900 font-semibold">
                    Height
                  </th>
                  <th className="border border-gray-300 px-6 py-3 text-left text-gray-900 font-semibold">
                    Recommended Frame Size
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-3">150-165 cm</td>
                  <td className="border border-gray-300 px-6 py-3">33-37 cm (XS)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-3">160-175 cm</td>
                  <td className="border border-gray-300 px-6 py-3">38-43 cm (S)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-3">170-185 cm</td>
                  <td className="border border-gray-300 px-6 py-3">43-47 cm (M)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-3">180-195 cm</td>
                  <td className="border border-gray-300 px-6 py-3">47-52 cm (L)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-3">190-205 cm</td>
                  <td className="border border-gray-300 px-6 py-3">51-56 cm (XL)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-3">200-210 cm</td>
                  <td className="border border-gray-300 px-6 py-3">53-60 cm (XXL)</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            This guide helps you find the right bike size based on your height.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 