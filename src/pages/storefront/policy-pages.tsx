import React from 'react';
import { usePathname } from '@/router';
import { Card } from '@/components/ui/card';
import { SITE_CONFIG } from '@/config/site';

interface PolicyData {
  title: string;
  lastUpdated: string;
  sections: { heading: string; body: string }[];
}

export function PolicyPage() {
  const pathname = usePathname();

  const getPolicyContent = (): PolicyData => {
    switch (pathname) {
      case '/terms-and-conditions':
        return {
          title: 'Terms & Conditions',
          lastUpdated: 'October 2026',
          sections: [
            {
              heading: '1. Order Placement & Confirmation',
              body: 'Orders placed on A1 Collection are subject to manual confirmation by our store owner. An order submitted on our storefront constitutes an inquiry until formally verified and accepted by phone or message.',
            },
            {
              heading: '2. Pricing & Currency',
              body: 'All prices are listed in USD. Delivery fees for local service are complimentary unless specialized long-distance courier arrangements are agreed upon during confirmation.',
            },
            {
              heading: '3. Intellectual Property',
              body: 'All designs, images, and content are the sole property of A1 Collection and may not be reproduced without written permission.',
            },
          ],
        };

      case '/shipping-policy':
        return {
          title: 'Shipping & Delivery Policy',
          lastUpdated: 'October 2026',
          sections: [
            {
              heading: '1. Local White-Glove Dispatch',
              body: 'Because A1 Collection operates as a boutique local shop, our delivery is handled by our internal courier team to ensure garments and delicate pieces arrive in pristine condition.',
            },
            {
              heading: '2. Scheduling & Confirmation',
              body: 'Delivery windows (Morning, Afternoon, or Evening) are confirmed directly with each customer before departure from our workshop.',
            },
            {
              heading: '3. Boutique Pickup',
              body: 'Customers may also elect to pick up their orders directly from our storefront during business hours.',
            },
          ],
        };

      case '/return-policy':
        return {
          title: 'Return Policy',
          lastUpdated: 'October 2026',
          sections: [
            {
              heading: '1. Return Window',
              body: 'We accept returns of unused, undamaged items with tags attached within 14 days of delivery.',
            },
            {
              heading: '2. Inspection Process',
              body: 'Upon receipt, our workshop team will inspect the piece to ensure pristine condition before issuing store credit or exchange.',
            },
          ],
        };

      case '/refund-policy':
        return {
          title: 'Refund Policy',
          lastUpdated: 'October 2026',
          sections: [
            {
              heading: '1. Refund Processing',
              body: 'Since orders are manually confirmed and paid locally or via direct transfer, approved refunds are remitted via the original payment channel within 3-5 business days of item inspection.',
            },
          ],
        };

      case '/cookie-policy':
        return {
          title: 'Cookie Policy',
          lastUpdated: 'October 2026',
          sections: [
            {
              heading: '1. Minimal & Privacy-Conscious',
              body: 'A1 Collection prioritizes customer privacy. We use only essential functional session cookies strictly required for the operation of your shopping cart and user authentication.',
            },
          ],
        };

      case '/privacy-policy':
      default:
        return {
          title: 'Privacy Policy',
          lastUpdated: 'October 2026',
          sections: [
            {
              heading: '1. Information We Collect',
              body: 'We collect your name, phone number, email address, and delivery location exclusively to process your manual order confirmation and fulfill delivery.',
            },
            {
              heading: '2. Zero Third-Party Advertising',
              body: 'We never sell, rent, or trade your personal information to third-party ad networks or data brokers.',
            },
            {
              heading: '3. Security of Data',
              body: 'All communications and database records are safeguarded by enterprise-grade cryptographic standards.',
            },
          ],
        };
    }
  };

  const policy = getPolicyContent();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="border-b border-[#E5E7EB] pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#171717]">{policy.title}</h1>
        <p className="text-xs text-[#6B7280] mt-1">Last Updated: {policy.lastUpdated}</p>
      </div>

      <Card className="p-8 space-y-6">
        {policy.sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-sm font-bold text-[#171717]">{section.heading}</h3>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">{section.body}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
