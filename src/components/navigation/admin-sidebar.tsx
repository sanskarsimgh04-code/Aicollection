import React from 'react';
import { Link, usePathname } from '@/router';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  Tag,
  Warehouse,
  Image,
  Megaphone,
  Home,
  FileText,
  Sparkles,
  Search,
  BarChart3,
  Settings,
  Shield,
  History,
  Store,
  ArrowLeft,
} from 'lucide-react';

export const ADMIN_NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Operations & Commerce',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: 'Manual' },
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Inventory', href: '/admin/inventory', icon: Warehouse },
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Coupons', href: '/admin/coupons', icon: Tag },
      { label: 'Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    title: 'Storefront & Content',
    items: [
      { label: 'Homepage', href: '/admin/homepage', icon: Home },
      { label: 'Banners', href: '/admin/banners', icon: Image },
      { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
      { label: 'Pages', href: '/admin/pages', icon: FileText },
    ],
  },
  {
    title: 'Intelligence & Growth',
    items: [
      { label: 'AI Integration', href: '/admin/ai', icon: Sparkles },
      { label: 'SEO Manager', href: '/admin/seo', icon: Search },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Admin Users', href: '/admin/admin-users', icon: Shield },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col shrink-0 min-h-screen">
      {/* Brand & Store Link */}
      <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[7px] bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
            A1
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-[#171717]">Admin Portal</span>
            <p className="text-[10px] text-[#6B7280]">A1 Collection Control</p>
          </div>
        </Link>
        <Link
          href="/"
          className="p-1.5 rounded-[7px] text-[#6B7280] hover:text-[#111111] hover:bg-[#FAFAF8]"
          title="View Live Storefront"
        >
          <Store className="w-4 h-4" />
        </Link>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <h5 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]/80">
              {group.title}
            </h5>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-[9px] transition-colors ${
                      isActive
                        ? 'bg-[#111111] text-white'
                        : 'text-[#171717] hover:bg-[#FAFAF8] hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#FEF3C7] text-[#92400E]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Return */}
      <div className="p-4 border-t border-[#E5E7EB] bg-[#FAFAF8]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-medium text-[#6B7280] hover:text-[#111111]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </Link>
      </div>
    </aside>
  );
}
