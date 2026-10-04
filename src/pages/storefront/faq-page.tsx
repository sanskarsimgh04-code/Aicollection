import React from 'react';
import { Card } from '@/components/ui/card';
import { SITE_CONFIG } from '@/config/site';

export function FAQPage() {
  const faqs = [
    {
      q: 'How does Manual Order Confirmation work?',
      a: 'When you place an order on A1 Collection, your order is created in an "Awaiting Confirmation" state. Our shop owner or head curator will personally reach out to you via your preferred channel (WhatsApp or Phone call) to verify details, discuss sizing, and schedule your delivery window before packing.',
    },
    {
      q: 'Do I pay online immediately?',
      a: 'Under our default Manual Confirmation architecture, you do not pay via online card gateway at checkout. Payment is settled securely via local bank transfer or cash upon delivery/pickup once your order is confirmed.',
    },
    {
      q: 'What are the delivery options and time slots?',
      a: 'We provide complimentary local delivery in designated morning, afternoon, and evening windows, as well as direct pickup from our boutique workshop at 142 Artisan Boulevard.',
    },
    {
      q: 'Can I request bespoke sizing or gift packaging?',
      a: 'Yes! During checkout, simply use the "Special Instructions" box, or mention your requests directly when our shop manager contacts you for confirmation.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer an inspection window upon delivery. Unworn and unaltered items with original artisan tags may be returned within 14 days of delivery.',
    },
  ];

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#171717]">Frequently Asked Questions</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Everything you need to know about our local shop model and manual confirmation checkout.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Card key={idx} className="p-6 space-y-2">
            <h3 className="text-base font-semibold text-[#171717]">{faq.q}</h3>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">{faq.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
