'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import UserRetentionBar from '@/components/UserRetentionBar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && (
        <div className="print:hidden">
          <Navbar />
          <UserRetentionBar />
        </div>
      )}
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && (
        <div className="print:hidden">
          <Footer />
        </div>
      )}
      {!isAdminRoute && (
        <div className="print:hidden">
          <MobileBottomNav />
        </div>
      )}
    </>
  );
}
