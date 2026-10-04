import React from 'react';
import { Link } from '@/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SITE_CONFIG } from '@/config/site';
import { SEED_PRODUCTS } from '@/actions/products';
import { ArrowRight, CheckCircle2, Shield, Sparkles, PhoneCall } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative rounded-[14px] overflow-hidden bg-[#171717] text-white py-16 px-6 sm:px-12 lg:px-16">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#FEF3C7]" />
            <span>Local Shop Exclusive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Curated Elegance, Crafted for Your Lifestyle.
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Welcome to A1 Collection. We personally inspect, pack, and manually confirm every single order with you to ensure perfection.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto bg-white text-[#111111] hover:bg-gray-100 flex items-center gap-2 font-semibold">
                Explore The Shop <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                Our Story & Philosophy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Manual Confirmation Process Highlight */}
      <section className="bg-white rounded-[14px] border border-[#E5E7EB] p-8 sm:p-10 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
            The A1 Local Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight">
            How Manual Order Confirmation Works
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            No impersonal bots or automated mishaps. Direct, attentive service from local shopkeepers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-[#171717]">Select & Checkout</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Add your desired items to cart and submit your delivery address and contact preference.
            </p>
          </div>

          <div className="p-4 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-[#171717]">Personal Verification</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Our shop owner contacts you via Phone or WhatsApp to verify order details, sizing, and delivery time.
            </p>
          </div>

          <div className="p-4 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-[#171717]">Hand-Packed With Care</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Once confirmed, your order is carefully packaged with signature wrap in our local studio.
            </p>
          </div>

          <div className="p-4 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h3 className="text-sm font-bold text-[#171717]">Local Delivery or Pickup</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Dispatched with real-time status updates right to your doorstep or ready for pickup.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#171717]">Featured Collection</h2>
            <p className="text-sm text-[#6B7280] mt-1">Hand-picked artisan goods in limited quantities.</p>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
            View All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEED_PRODUCTS.map((product) => (
            <Card key={product.id} className="group overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-square w-full overflow-hidden bg-gray-100 rounded-t-[14px]">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4 space-y-1.5">
                  <div className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">
                    {product.sku}
                  </div>
                  <h3 className="text-sm font-semibold text-[#171717] line-clamp-1 group-hover:text-black">
                    <Link href={`/product/${product.slug}`}>{product.title}</Link>
                  </h3>
                  <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between mt-auto">
                <span className="text-sm font-bold text-[#171717]">
                  {formatCurrency(product.price)}
                </span>
                <Link href={`/product/${product.slug}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#171717]">Curated Categories</h2>
          <p className="text-sm text-[#6B7280] mt-1">Explore our distinctive product departments.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_CONFIG.categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="group">
              <div className="p-6 rounded-[14px] bg-white border border-[#E5E7EB] hover:border-[#111111] transition-colors space-y-2 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#171717] group-hover:text-black">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#111111] flex items-center gap-1 pt-4">
                  Shop Category <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
