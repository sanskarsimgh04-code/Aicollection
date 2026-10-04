import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SITE_CONFIG } from '@/config/site';
import { ShieldCheck, HeartHandshake, Sparkles, MapPin } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
          Our Heritage
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
          About A1 Collection
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
          Rooted in artisanal excellence, personal touch, and the warm hospitality of our local storefront.
        </p>
      </div>

      <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-8 sm:p-10 space-y-6 text-[#171717] leading-relaxed">
        <h2 className="text-xl font-bold tracking-tight">The Modern Local Shop</h2>
        <p className="text-sm text-[#6B7280]">
          A1 Collection was founded with a singular conviction: online shopping should not feel cold, impersonal, or automated. In an era of anonymous warehouses and unverified drop-shipping, we take an entirely opposite approach.
        </p>
        <p className="text-sm text-[#6B7280]">
          Every garment, leather bag, piece of jewelry, and ceramic item in our catalog is hand-selected and inspected in our downtown shop. When you place an order with us, a real person—the shop owner or artisan curator—personally contacts you to confirm sizing, material care, and your preferred delivery window.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#E5E7EB]">
          <div className="space-y-2">
            <HeartHandshake className="w-6 h-6 text-[#111111]" />
            <h3 className="text-sm font-bold text-[#171717]">Personal Relationship</h3>
            <p className="text-xs text-[#6B7280]">
              Direct communication between customer and curator on every single order.
            </p>
          </div>

          <div className="space-y-2">
            <Sparkles className="w-6 h-6 text-[#111111]" />
            <h3 className="text-sm font-bold text-[#171717]">Curated Quality</h3>
            <p className="text-xs text-[#6B7280]">
              Limited edition releases crafted from noble materials and built to endure.
            </p>
          </div>

          <div className="space-y-2">
            <MapPin className="w-6 h-6 text-[#111111]" />
            <h3 className="text-sm font-bold text-[#171717]">Local Community</h3>
            <p className="text-xs text-[#6B7280]">
              Proudly operating out of {SITE_CONFIG.contact.address}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
