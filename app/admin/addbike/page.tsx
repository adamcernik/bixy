"use client";
import AddBikeModal from '../../components/AddBikeModal';

export default function AddBikePage() {
  // Render the AddBikeModal as a full page (open always, no modal)
  return (
    <div className="max-w-2xl mx-auto p-4">
      <AddBikeModal open={true} onClose={() => { window.location.href = '/admin/inventory'; }} onSuccess={() => { window.location.href = '/admin/inventory'; }} />
    </div>
  );
} 