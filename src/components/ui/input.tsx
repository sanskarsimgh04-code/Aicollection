import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[#171717]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-[9px] border border-[#E5E7EB] bg-white px-3.5 py-2 text-sm text-[#171717] placeholder:text-[#6B7280]',
            'focus:border-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111] disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
