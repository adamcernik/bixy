import { useEffect, useState } from 'react';
import PromotedBikesAdmin from '../../components/PromotedBikesAdmin';
import { getBikes } from '../../services/bikeService';
import { Bike } from '../../models/Bike';

export default function AdminPromotedPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  useEffect(() => {
    getBikes().then(setBikes);
  }, []);
  return <PromotedBikesAdmin bikes={bikes} />;
} 