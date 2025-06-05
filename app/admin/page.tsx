'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/inventory');
  }, [router]);
  return null;
} 