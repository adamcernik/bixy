'use client';
import { useRouter } from 'next/navigation';
import AddBikeModal from '../../components/AddBikeModal';
import { useState } from 'react';

export default function AdminAddBikePage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    router.push('/admin/inventory');
  };

  const handleSuccess = () => {
    setOpen(false);
    router.push('/admin/inventory');
  };

  return (
    <AddBikeModal open={open} onClose={handleClose} onSuccess={handleSuccess} />
  );
} 