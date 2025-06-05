'use client';

import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAssetPath } from '../../utils/pathUtils';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicPage = pathname.startsWith('/products');

  return (
    <>
      {isPublicPage ? null : null}
      {children}
    </>
  );
} 