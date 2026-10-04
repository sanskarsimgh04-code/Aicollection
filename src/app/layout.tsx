import React, { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { RouterProvider } from '@/router';

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <RouterProvider>
        <div className="min-h-screen bg-[#FAFAF8] text-[#171717] flex flex-col font-sans selection:bg-[#111111] selection:text-white">
          {children}
        </div>
      </RouterProvider>
    </ErrorBoundary>
  );
}
