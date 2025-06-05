'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import { AuthProvider } from '../context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // Determine active section from pathname
  const section = pathname?.split('/')[2] || 'inventory';
  const [activeSection, setActiveSection] = useState(section);

  useEffect(() => {
    setActiveSection(section);
  }, [section]);

  const handleAddNewBike = () => {
    router.push('/admin/addbike');
  };

  return (
    <AuthProvider>
      <AdminHeader activeSection={activeSection} />
      <div className="w-full p-4">
        {children}
      </div>
    </AuthProvider>
  );
} 