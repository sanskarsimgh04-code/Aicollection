import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 bg-white p-3 rounded-[14px] border border-[#E5E7EB]">
      {/* Product Image Skeleton with 12px radius */}
      <Skeleton className="h-64 w-full rounded-[12px]" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-24 rounded-[9px]" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrdersTableSkeleton() {
  return (
    <div className="space-y-3 bg-white p-6 rounded-[14px] border border-[#E5E7EB]">
      <div className="flex justify-between items-center pb-4">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-9 w-24 rounded-[9px]" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-[#E5E7EB]/50">
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20 rounded-[9px]" />
        </div>
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium text-[#6B7280]">Loading A1 Collection...</p>
    </div>
  );
}
