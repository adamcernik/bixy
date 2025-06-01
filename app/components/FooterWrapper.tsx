'use client';

import { usePathname } from 'next/navigation';
import AppFooter from './AppFooter';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  if (pathname === '/catalog') {
    return null;
  }

  return <AppFooter />;
} 