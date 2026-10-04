import React, { ReactNode } from 'react';
import { AnnouncementBar } from '@/components/navigation/announcement-bar';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';

export function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
