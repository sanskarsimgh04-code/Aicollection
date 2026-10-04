import { usePathname, Link } from '@/router';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { SITE_CONFIG } from '@/config/site';
import { Bell, ShieldCheck, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function AdminHeader() {
  const pathname = usePathname();
  const supabaseActive = isSupabaseConfigured();

  const getPageTitle = (path: string) => {
    const segment = path.split('/')[2] || 'dashboard';
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-[#171717]">{getPageTitle(pathname)}</h1>
        <span className="text-xs text-[#6B7280]">/</span>
        <span className="text-xs text-[#6B7280]">Admin</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Payment mode indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-[#FAFAF8] border border-[#E5E7EB] text-xs font-medium text-[#171717]">
          <span className="w-2 h-2 rounded-full bg-[#15803D]" />
          <span>Checkout: <strong>{SITE_CONFIG.defaultPaymentMode}</strong></span>
        </div>

        {/* Supabase status indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-[#FAFAF8] border border-[#E5E7EB] text-xs">
          <Database className="w-3.5 h-3.5 text-[#6B7280]" />
          <span className="text-[#6B7280]">DB:</span>
          {supabaseActive ? (
            <span className="text-[#15803D] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Supabase
            </span>
          ) : (
            <span className="text-[#D97706] font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Local Env
            </span>
          )}
        </div>

        {/* User badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="hidden md:block text-left text-xs">
            <p className="font-semibold text-[#171717]">Store Owner</p>
            <p className="text-[10px] text-[#6B7280]">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
