"use client";
import { useRouter } from 'next/navigation';
import AddBikeForm from '../../components/AddBikeForm';

export default function AddBikePage() {
  const router = useRouter();
  return (
    <div className="max-w-2xl mx-auto p-4">
      <AddBikeForm onSuccess={() => router.push('/admin/inventory')} />
    </div>
  );
} 