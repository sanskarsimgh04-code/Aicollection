import React from 'react';
import { Link, usePathname, useParams } from '@/router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Package, MapPin, ArrowRight, PhoneCall } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { SEED_PRODUCTS } from '@/actions/products';

export function AccountPage() {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();

  // If viewing specific order detail in account
  if (pathname.includes('/account/orders/') && id) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <Link href="/account/orders" className="hover:text-[#111111]">
            ← Back to Order History
          </Link>
        </div>

        <div className="bg-white p-6 rounded-[14px] border border-[#E5E7EB] space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#171717]">Order #{id}</h1>
            <Badge variant="awaiting_confirmation">Awaiting Confirmation</Badge>
          </div>
          <p className="text-xs text-[#6B7280]">
            Placed with manual order confirmation. Our team contacted you for delivery window verification.
          </p>
          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Item: {SEED_PRODUCTS[0].title}</span>
            <span className="font-bold text-[#171717]">{formatCurrency(SEED_PRODUCTS[0].price)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Account orders list view
  const isOrdersTab = pathname.includes('/account/orders');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#171717]">Customer Account</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Manage your orders, personal preferences, and confirmation details.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E5E7EB] pb-2">
        <Link
          href="/account"
          className={`px-4 py-2 rounded-[9px] text-xs font-semibold transition-colors ${
            !isOrdersTab ? 'bg-[#111111] text-white' : 'text-[#6B7280] hover:text-[#111111]'
          }`}
        >
          Profile Overview
        </Link>
        <Link
          href="/account/orders"
          className={`px-4 py-2 rounded-[9px] text-xs font-semibold transition-colors ${
            isOrdersTab ? 'bg-[#111111] text-white' : 'text-[#6B7280] hover:text-[#111111]'
          }`}
        >
          My Orders
        </Link>
      </div>

      {isOrdersTab ? (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-[14px] border border-[#E5E7EB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-4">
              <div>
                <span className="text-xs font-bold text-[#171717]">Order #A1-948210</span>
                <p className="text-xs text-[#6B7280] mt-0.5">Placed Oct 3, 2026</p>
              </div>
              <Badge variant="awaiting_confirmation">Awaiting Confirmation</Badge>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-[#6B7280]">
                <span>1 item • {formatCurrency(495.0)}</span>
              </div>
              <Link href="/account/orders/A1-948210">
                <Button variant="outline" size="sm">
                  View Order Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <User className="w-5 h-5 text-[#111111]" />
            <h3 className="text-sm font-semibold text-[#171717]">Contact Profile</h3>
            <p className="text-xs text-[#6B7280]">
              Personal details used to confirm your local delivery requests.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <Package className="w-5 h-5 text-[#111111]" />
            <h3 className="text-sm font-semibold text-[#171717]">Orders</h3>
            <p className="text-xs text-[#6B7280]">
              Track recent orders and active delivery status.
            </p>
            <Link href="/account/orders" className="text-xs font-semibold text-[#111111] block pt-2">
              View History →
            </Link>
          </Card>

          <Card className="p-6 space-y-3">
            <MapPin className="w-5 h-5 text-[#111111]" />
            <h3 className="text-sm font-semibold text-[#171717]">Saved Addresses</h3>
            <p className="text-xs text-[#6B7280]">
              Default shipping locations for quick manual checkout.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
