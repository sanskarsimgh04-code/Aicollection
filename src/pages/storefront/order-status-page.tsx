import React, { useState } from 'react';
import { useParams, Link } from '@/router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ORDER_LIFECYCLE_STEPS, OrderStatus } from '@/config/site';
import { CheckCircle2, Clock, Package, Truck, Home, PhoneCall, ArrowLeft } from 'lucide-react';
import { SEED_PRODUCTS } from '@/actions/products';
import { formatCurrency } from '@/lib/utils';

export function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  // Default status for a newly placed order is 'awaiting_confirmation'
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('awaiting_confirmation');

  const orderNumber = id?.startsWith('ord_') ? `A1-${id.slice(-6).toUpperCase()}` : `A1-849201`;
  const product = SEED_PRODUCTS[0];

  const currentStepIndex = ORDER_LIFECYCLE_STEPS.findIndex((s) => s.status === currentStatus);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
              Order Details
            </span>
            <Badge variant={currentStatus} className="text-xs capitalize">
              {currentStatus.replace('_', ' ')}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
            {orderNumber}
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Placed on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <Link href="/shop">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 self-start">
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Manual Confirmation Status Notice */}
      <div className="p-4 rounded-[14px] bg-[#FEF3C7]/60 border border-[#FDE68A] flex items-start gap-3">
        <PhoneCall className="w-5 h-5 text-[#92400E] shrink-0 mt-0.5" />
        <div className="text-xs text-[#92400E] space-y-1">
          <span className="font-bold text-sm block text-[#92400E]">
            Awaiting Confirmation from Store Owner
          </span>
          <p className="leading-relaxed">
            Thank you! Your order was received. Our team will contact you via Phone or WhatsApp shortly to verify your delivery details and order specifics before packing.
          </p>
        </div>
      </div>

      {/* 5-Step Order Lifecycle Stepper */}
      <Card className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717] mb-6">
          Order Progress
        </h3>

        <div className="relative">
          <div className="space-y-6">
            {ORDER_LIFECYCLE_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.status} className="flex items-start gap-4">
                  {/* Step icon circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-[#15803D] text-white'
                        : isCurrent
                        ? 'bg-[#111111] text-white ring-4 ring-[#111111]/10'
                        : 'bg-gray-100 text-[#6B7280]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-semibold ${
                          isCurrent ? 'text-[#171717]' : isCompleted ? 'text-[#15803D]' : 'text-[#6B7280]'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] bg-[#111111] text-white px-2 py-0.5 rounded-full font-bold">
                          Current Stage
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Items in order */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
          Ordered Items
        </h3>

        <div className="flex items-center gap-4 py-3 border-b border-[#E5E7EB]">
          <div className="w-16 h-16 rounded-[12px] overflow-hidden bg-gray-100 shrink-0">
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[#171717]">{product.title}</h4>
            <p className="text-xs text-[#6B7280]">{product.sku}</p>
            <p className="text-xs text-[#171717] font-semibold mt-1">1 × {formatCurrency(product.price)}</p>
          </div>
        </div>

        <div className="pt-2 text-xs space-y-1 text-[#6B7280]">
          <div className="flex justify-between">
            <span>Payment Mode</span>
            <span className="text-[#171717] font-medium">Manual Confirmation (Cash / Local transfer on delivery)</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="text-[#171717] font-bold text-sm">{formatCurrency(product.price)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
