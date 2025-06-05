"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AddBikeForm from "../../components/AddBikeForm";
import { getBikes, updateBike } from "../../lib/services/bike/bikeService";
import { Bike } from "../../models/Bike";

export default function EditBikePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBike = async () => {
      const bikes = await getBikes();
      const found = bikes.find((b) => b.id === id);
      setBike(found || null);
      setLoading(false);
    };
    if (id) fetchBike();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!bike) return <div className="p-8 text-center text-red-600">Bike not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <AddBikeForm
        initialBike={bike}
        onSave={async (updatedBike) => {
          await updateBike(bike.id!, updatedBike);
          router.push("/admin/inventory");
        }}
        isEdit
      />
    </div>
  );
} 