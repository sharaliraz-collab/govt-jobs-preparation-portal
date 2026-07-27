'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
