import React, { useState } from 'react';
import { useRouter } from '@/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { placeManualConfirmationOrder } from '@/actions/order';
import { SEED_PRODUCTS } from '@/actions/products';
import { formatCurrency } from '@/lib/utils';
import { PhoneCall, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [deliveryTimePreference, setDeliveryTimePreference] = useState('Afternoon (2 PM - 6 PM)');
  const [orderNotes, setOrderNotes] = useState('');

  // Sample checkout item
  const item = SEED_PRODUCTS[0];
  const total = item.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await placeManualConfirmationOrder({
      fullName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      preferredContactMethod,
      deliveryTimePreference,
      orderNotes,
      items: [
        {
          productId: item.id,
          title: item.title,
          quantity: 1,
          unitPrice: item.price,
        },
      ],
    });

    setIsSubmitting(false);

    if (result.success) {
      router.push(`/order/${result.data.orderId}`);
    } else {
      setErrorMessage(result.error.message);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="awaiting_confirmation" className="text-xs">
            Manual Order Confirmation
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#171717]">Checkout</h1>
        <p className="text-sm text-[#6B7280]">
          Enter your delivery details. We will contact you immediately to confirm before dispatch.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-[9px] bg-red-50 border border-red-200 text-[#DC2626] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Customer & Delivery Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Details Card */}
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              1. Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                required
              />
              <Input
                label="Phone Number (for confirmation) *"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
            <Input
              label="Email Address (for order receipts) *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eleanor@example.com"
              required
            />
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717]">
                Preferred Confirmation Channel
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['whatsapp', 'phone', 'email'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPreferredContactMethod(method)}
                    className={`py-2 px-3 rounded-[9px] text-xs font-semibold capitalize border transition-colors cursor-pointer ${
                      preferredContactMethod === method
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#171717] border-[#E5E7EB] hover:bg-gray-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Delivery Address Card */}
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
              2. Delivery Address
            </h2>
            <Input
              label="Street Address *"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="123 Artisan Way"
              required
            />
            <Input
              label="Apartment, Suite, Unit (optional)"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Apt 4B"
            />
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="City *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Downtown"
                required
              />
              <Input
                label="State *"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="CA"
                required
              />
              <Input
                label="Postal Code *"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="90210"
                required
              />
            </div>
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717]">
                Delivery Preference
              </label>
              <select
                value={deliveryTimePreference}
                onChange={(e) => setDeliveryTimePreference(e.target.value)}
                className="w-full h-10 rounded-[9px] border border-[#E5E7EB] bg-white px-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
              >
                <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                <option value="Afternoon (2 PM - 6 PM)">Afternoon (2 PM - 6 PM)</option>
                <option value="Evening (6 PM - 8 PM)">Evening (6 PM - 8 PM)</option>
                <option value="Workshop Pickup">Self Pickup at Workshop</option>
              </select>
            </div>
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717]">
                Special Instructions / Sizing Notes (optional)
              </label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special packaging requests, gate codes, or delivery notes..."
                rows={3}
                className="w-full rounded-[9px] border border-[#E5E7EB] bg-white p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </Card>
        </div>

        {/* Order Summary & Confirm Action */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#171717] border-b border-[#E5E7EB] pb-3">
              Order Review
            </h3>

            <div className="flex gap-3 items-center py-2">
              <div className="w-12 h-12 rounded-[9px] overflow-hidden bg-gray-100 shrink-0">
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-semibold text-[#171717] truncate">{item.title}</p>
                <p className="text-[#6B7280]">1 × {formatCurrency(item.price)}</p>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-[#6B7280]">
                <span>Subtotal</span>
                <span className="font-medium text-[#171717]">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>Delivery</span>
                <span className="font-medium text-[#15803D]">Complimentary</span>
              </div>
              <div className="border-t border-[#E5E7EB] pt-2 flex justify-between text-sm font-bold text-[#171717]">
                <span>Estimated Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              Place Order for Confirmation
            </Button>

            <div className="p-3 bg-[#FAFAF8] rounded-[9px] border border-[#E5E7EB] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#171717]">
                <PhoneCall className="w-3.5 h-3.5 text-[#15803D]" />
                <span>What happens next?</span>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Your order is set to <em>awaiting confirmation</em>. Our local team will reach out via {preferredContactMethod} to confirm before packing.
              </p>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
