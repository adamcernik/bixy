'use client';

import { usePathname } from 'next/navigation';

export default function AppFooter() {
  const pathname = usePathname();
  const isAdminPage = pathname === '/stock';

  if (!isAdminPage) {
    return (
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Adam Bikes. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500 text-sm">
          <div>© {new Date().getFullYear()} Adam Bikes. All rights reserved.</div>
          <div className="mt-2">
            <a href="mailto:adam@adambikes.cz" className="text-blue-600 hover:text-blue-800">
              adam@adambikes.cz
            </a>
          </div>
          <div className="mt-2">
            Database: {process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}
          </div>
          <div className="mt-1">
            Version: {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}
          </div>
        </div>
      </div>
    </footer>
  );
} 