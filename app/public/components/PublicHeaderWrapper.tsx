'use client';

import Header from './Header';
import { usePathname } from 'next/navigation';

export default function PublicHeaderWrapper() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  if (isAdminPage) return null;
  return <Header />;
} 