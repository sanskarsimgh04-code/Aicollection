import React from 'react';
import { Link } from '@/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SEED_PRODUCTS } from '@/actions/products';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';

export function CartPage() {
  // Demonstration cart with seed product
  const cartItems = [
    {
      product: SEED_PRODUCTS[0],
      quantity: 1,
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = 0; // Local shop complimentary pickup/delivery
  const total = subtotal + shippingFee;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#171717]">Your Cart</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Review your selected items before requesting personalized order confirmation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-[14px] border border-[#E5E7EB] flex gap-4 items-center"
            >
              <div className="w-20 h-20 rounded-[12px] overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#171717] truncate">{product.title}</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{product.sku}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-[#6B7280]">Qty: {quantity}</span>
                  <span className="font-semibold text-[#171717]">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Local shop note */}
          <div className="p-4 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
            <div className="text-xs text-[#6B7280] space-y-1">
              <span className="font-semibold text-[#171717] block">Manual Confirmation Policy</span>
              <p>
                No payment is taken immediately online. Once submitted, our store manager contacts you to confirm sizing, preferred delivery window, and final confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="p-6 space-y-6">
          <h3 className="text-base font-semibold text-[#171717] border-b border-[#E5E7EB] pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#6B7280]">
              <span>Subtotal</span>
              <span className="text-[#171717] font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>Local Delivery / Pickup</span>
              <span className="text-[#15803D] font-medium">Free</span>
            </div>
            <div className="border-t border-[#E5E7EB] pt-3 flex justify-between font-bold text-base text-[#171717]">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button size="lg" className="w-full flex items-center justify-center gap-2">
              Proceed to Confirmation <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <p className="text-[11px] text-center text-[#6B7280]">
            Awaiting Confirmation workflow • Direct shop contact
          </p>
        </Card>
      </div>
    </div>
  );
}
