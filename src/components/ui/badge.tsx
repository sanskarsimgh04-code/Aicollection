import React from 'react';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/config/site';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'destructive' | 'outline' | 'secondary' | OrderStatus;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const statusStyles: Record<string, string> = {
    default: 'bg-[#111111] text-white',
    success: 'bg-[#15803D] text-white',
    destructive: 'bg-[#DC2626] text-white',
    secondary: 'bg-[#F3F4F6] text-[#171717]',
    outline: 'border border-[#E5E7EB] text-[#171717] bg-white',

    // Specific order workflow status styles
    awaiting_confirmation: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
    confirmed: 'bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]',
    packed: 'bg-[#E0E7FF] text-[#3730A3] border border-[#C7D2FE]',
    out_for_delivery: 'bg-[#FCE7F3] text-[#9D174D] border border-[#FBCFE8]',
    delivered: 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]',
    cancelled: 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors',
        statusStyles[variant] || statusStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
