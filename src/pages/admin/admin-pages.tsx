import React from 'react';
import { usePathname, Link } from '@/router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SITE_CONFIG, ORDER_LIFECYCLE_STEPS } from '@/config/site';
import { formatCurrency } from '@/lib/utils';
import { SEED_PRODUCTS } from '@/actions/products';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
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
  PhoneCall,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  RefreshCw,
} from 'lucide-react';

interface ModuleConfig {
  title: string;
  description: string;
  icon: any;
  category: string;
  stats?: { label: string; value: string; badge?: string }[];
}

const ADMIN_MODULES: Record<string, ModuleConfig> = {
  '/admin': {
    title: 'Admin Overview',
    description: 'System-wide summary of commerce operations and management modules.',
    icon: LayoutDashboard,
    category: 'Overview',
  },
  '/admin/dashboard': {
    title: 'Operations Dashboard',
    description: 'Real-time overview of incoming orders awaiting manual confirmation, active catalog, and store status.',
    icon: LayoutDashboard,
    category: 'Overview',
    stats: [
      { label: 'Orders Awaiting Confirmation', value: '3', badge: 'Action Required' },
      { label: 'Active Catalog Items', value: '4' },
      { label: 'Payment Architecture', value: SITE_CONFIG.defaultPaymentMode },
      { label: 'Local Delivery Fleet', value: 'Active' },
    ],
  },
  '/admin/orders': {
    title: 'Order Management',
    description: 'Manage manual confirmation workflow: customer verification, packing, and dispatch scheduling.',
    icon: ShoppingBag,
    category: 'Operations',
    stats: [
      { label: 'Awaiting Call', value: '2', badge: 'High Priority' },
      { label: 'Confirmed Today', value: '5' },
      { label: 'Out for Delivery', value: '1' },
      { label: 'Delivered', value: '18' },
    ],
  },
  '/admin/products': {
    title: 'Product Catalog',
    description: 'Curate luxury collections, manage specifications, pricing, materials, and artisan attribution.',
    icon: Package,
    category: 'Commerce',
    stats: [
      { label: 'Published Items', value: '4' },
      { label: 'Drafts', value: '0' },
      { label: 'Collections', value: '4' },
    ],
  },
  '/admin/inventory': {
    title: 'Inventory & Stock Management',
    description: 'Track workshop unit quantities, low-stock alerts, and restocking notifications.',
    icon: Warehouse,
    category: 'Commerce',
    stats: [
      { label: 'Total Units in Workshop', value: '55' },
      { label: 'Low Stock Alerts', value: '1' },
      { label: 'Out of Stock', value: '0' },
    ],
  },
  '/admin/customers': {
    title: 'Customer Directory',
    description: 'Direct contact records, preferred communication channels (Phone/WhatsApp), and order history.',
    icon: Users,
    category: 'Commerce',
  },
  '/admin/reviews': {
    title: 'Customer Reviews',
    description: 'Moderation of verified buyer reviews and client testimonials.',
    icon: Star,
    category: 'Commerce',
  },
  '/admin/coupons': {
    title: 'Coupons & Incentives',
    description: 'Configure percentage discounts, seasonal incentives, and VIP local promotion codes.',
    icon: Tag,
    category: 'Commerce',
  },
  '/admin/banners': {
    title: 'Hero Banners & Visuals',
    description: 'Manage seasonal campaign visual banners and editorial photography.',
    icon: Image,
    category: 'Content',
  },
  '/admin/announcements': {
    title: 'Announcement Bars',
    description: 'Customize top notification banners for workshop hours, local delivery alerts, and news.',
    icon: Megaphone,
    category: 'Content',
  },
  '/admin/homepage': {
    title: 'Homepage Layout Builder',
    description: 'Configure hero positioning, curated product grids, and featured artisan stories.',
    icon: Home,
    category: 'Content',
  },
  '/admin/pages': {
    title: 'Static Pages & Policies',
    description: 'Manage legal policies, about us narrative, and boutique visit guides.',
    icon: FileText,
    category: 'Content',
  },
  '/admin/ai': {
    title: 'Server-side AI Integration',
    description: 'Gemini-assisted product description polishing, SEO tag generation, and automated customer inquiry triage.',
    icon: Sparkles,
    category: 'Intelligence',
  },
  '/admin/seo': {
    title: 'SEO Manager & Structured Data',
    description: 'Manage Schema.org LocalBusiness, OpenGraph cards, sitemap synchronization, and meta keywords.',
    icon: Search,
    category: 'Growth',
  },
  '/admin/analytics': {
    title: 'Privacy-Conscious Analytics',
    description: 'Cookieless performance metrics, local order conversion rates, and boutique traffic analysis.',
    icon: BarChart3,
    category: 'Intelligence',
  },
  '/admin/settings': {
    title: 'Store Settings',
    description: 'Configure store operating hours, local delivery zones, manual confirmation notification numbers, and payment modes.',
    icon: Settings,
    category: 'Administration',
  },
  '/admin/admin-users': {
    title: 'Admin Users & Roles',
    description: 'Control access permissions for store owners, order coordinators, and courier staff.',
    icon: Shield,
    category: 'Administration',
  },
  '/admin/audit-logs': {
    title: 'Security & Audit Logs',
    description: 'Cryptographically accountable log of order status transitions, catalog edits, and administrative sign-ins.',
    icon: History,
    category: 'Administration',
  },
};

export function AdminPageView() {
  const pathname = usePathname();
  const currentModule = ADMIN_MODULES[pathname] || ADMIN_MODULES['/admin/dashboard'];
  const Icon = currentModule.icon;

  // Specific Order management preview demonstrating manual confirmation workflow
  if (pathname === '/admin/orders') {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
              {currentModule.category}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717]">{currentModule.title}</h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">{currentModule.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {currentModule.stats?.map((stat, i) => (
            <Card key={i} className="p-4 space-y-1">
              <span className="text-xs text-[#6B7280]">{stat.label}</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#171717]">{stat.value}</span>
                {stat.badge && (
                  <Badge variant="awaiting_confirmation" className="text-[10px]">
                    {stat.badge}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Orders Table with Manual Confirmation Action */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
                Active Orders
              </h2>
              <p className="text-xs text-[#6B7280]">
                Workflow: Awaiting Confirmation → Confirmed → Packed → Out for Delivery → Delivered
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Checkout Mode: {SITE_CONFIG.defaultPaymentMode}
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                  <th className="py-2.5 font-semibold">Order ID</th>
                  <th className="py-2.5 font-semibold">Customer</th>
                  <th className="py-2.5 font-semibold">Contact / Method</th>
                  <th className="py-2.5 font-semibold">Items & Total</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]/60">
                <tr className="hover:bg-[#FAFAF8]">
                  <td className="py-3 font-mono font-medium text-[#171717]">A1-849201</td>
                  <td className="py-3">
                    <p className="font-semibold text-[#171717]">Eleanor Vance</p>
                    <p className="text-[#6B7280]">Downtown Apt 4B</p>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-[#15803D]" />
                      <span className="font-medium">+1 (555) 019-4820</span>
                    </div>
                    <span className="text-[10px] text-[#6B7280]">Preferred: WhatsApp</span>
                  </td>
                  <td className="py-3">
                    <p className="text-[#171717]">1 × Heritage Cashmere Overcoat</p>
                    <p className="font-semibold">{formatCurrency(495.0)}</p>
                  </td>
                  <td className="py-3">
                    <Badge variant="awaiting_confirmation">
                      Awaiting Confirmation
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="primary" size="sm" className="text-xs h-7 px-3">
                      Verify & Confirm
                    </Button>
                  </td>
                </tr>

                <tr className="hover:bg-[#FAFAF8]">
                  <td className="py-3 font-mono font-medium text-[#171717]">A1-739102</td>
                  <td className="py-3">
                    <p className="font-semibold text-[#171717]">Julian Hayes</p>
                    <p className="text-[#6B7280]">Artisan District</p>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-[#15803D]" />
                      <span className="font-medium">+1 (555) 018-9921</span>
                    </div>
                    <span className="text-[10px] text-[#6B7280]">Preferred: Phone</span>
                  </td>
                  <td className="py-3">
                    <p className="text-[#171717]">1 × Artisan Leather Weekender</p>
                    <p className="font-semibold">{formatCurrency(380.0)}</p>
                  </td>
                  <td className="py-3">
                    <Badge variant="confirmed">
                      Confirmed
                    </Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="outline" size="sm" className="text-xs h-7 px-3">
                      Mark as Packed
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  // Generic Module Placeholder View
  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
            {currentModule.category}
          </span>
          <span className="text-xs text-[#6B7280]">•</span>
          <span className="text-xs text-[#6B7280] font-mono">{pathname}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#171717] flex items-center gap-3">
          <Icon className="w-6 h-6 text-[#111111]" />
          <span>{currentModule.title}</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">{currentModule.description}</p>
      </div>

      {/* Stats if available */}
      {currentModule.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {currentModule.stats.map((stat, i) => (
            <Card key={i} className="p-4 space-y-1">
              <span className="text-xs text-[#6B7280]">{stat.label}</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#171717]">{stat.value}</span>
                {stat.badge && (
                  <Badge variant="awaiting_confirmation" className="text-[10px]">
                    {stat.badge}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Foundation Card */}
      <Card className="p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] text-[#111111] mx-auto flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-base font-semibold text-[#171717]">{currentModule.title} Foundation Ready</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            This module route is registered and typed. Architecture connects to Supabase database schema and server-action authorization layers.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> View Orders
            </Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button variant="primary" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
