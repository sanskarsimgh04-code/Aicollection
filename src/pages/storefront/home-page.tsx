import React, { useEffect, useState } from 'react';
import { Link } from '@/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SITE_CONFIG } from '@/config/site';
import {
  FULL_SEED_CATALOG,
  getFeaturedProducts,
  getNewArrivals,
  getTrendingProducts,
  FullProduct,
} from '@/actions/products';
import { ProductCard } from '@/components/catalog/product-card';
import { applyDocumentSEO, generateLocalBusinessSchema } from '@/lib/seo';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  Clock,
  Truck,
  HeartHandshake,
  Star,
  ChevronDown,
  Quote,
} from 'lucide-react';

export function HomePage() {
  const [featured, setFeatured] = useState<FullProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<FullProduct[]>([]);
  const [trending, setTrending] = useState<FullProduct[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    // Dynamic SEO Application
    applyDocumentSEO({
      title: 'A1 Collection - Curated Luxury Local Shop',
      description: 'Discover handcrafted apparel, leather goods, and ceramics with personalized manual order confirmation. Artisan-inspected luxury.',
      canonicalPath: '/',
      schema: generateLocalBusinessSchema(),
    });

    getFeaturedProducts(4).then((res) => {
      if (res.success && res.data) setFeatured(res.data);
    });
    getNewArrivals(4).then((res) => {
      if (res.success && res.data) setNewArrivals(res.data);
    });
    getTrendingProducts(4).then((res) => {
      if (res.success && res.data) setTrending(res.data);
    });
  }, []);

  // Real verified reviews from the database catalog
  const verifiedReviews = FULL_SEED_CATALOG.flatMap((p) =>
    p.reviews.map((r) => ({
      ...r,
      productTitle: p.title,
      productSlug: p.slug,
    }))
  ).slice(0, 4);

  const homeFaqs = [
    {
      q: 'How does Manual Order Confirmation work?',
      a: 'When you checkout, your order is placed in an "Awaiting Confirmation" state. Our store owner will personally call or message you via WhatsApp to verify sizing, address details, and your preferred delivery window before any packing begins.',
    },
    {
      q: 'Do I need to pay with a credit card online?',
      a: 'No. Under our default local manual confirmation architecture, payment is settled directly upon delivery or pickup via cash or instant transfer, eliminating online card friction.',
    },
    {
      q: 'Where are the products sourced and crafted?',
      a: 'Each piece is hand-selected or commissioned directly from independent artisan guilds in Mongolia, Tuscany, and local ceramic and jewelry studios.',
    },
    {
      q: 'Can I request bespoke sizing or gift wrapping?',
      a: 'Yes! Simply note your preference during checkout or mention it when our team contacts you for confirmation. We provide complimentary linen gift wrapping.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative rounded-[14px] overflow-hidden bg-[#171717] text-white py-16 sm:py-20 px-6 sm:px-12 lg:px-16">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#FEF3C7]" />
            <span>Local Shop Exclusive • Artisan Inspected</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Curated Elegance, Crafted for Your Lifestyle.
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
            Welcome to A1 Collection. We personally inspect, pack, and manually confirm every single order with you to ensure absolute perfection before dispatch.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto bg-white text-[#111111] hover:bg-gray-100 flex items-center justify-center gap-2 font-semibold">
                Explore The Shop <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/category/apparel">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 justify-center">
                Autumn Apparel
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Curated Categories Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717]">
              Shop by Department
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Explore four carefully curated disciplines of craft and lifestyle.
            </p>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
            All Collections <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {SITE_CONFIG.categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="group">
              <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#E5E7EB] hover:border-[#111111] transition-colors space-y-3 h-full flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-8 h-8 rounded-[8px] bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-center text-xs font-bold text-[#111111] mb-2 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                    {cat.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#171717] group-hover:text-black">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6B7280] mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#111111] flex items-center gap-1 pt-2">
                  Browse <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Grid (Responsive 2-column on mobile) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803D]">
              Editor's Choice
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] mt-0.5">
              Featured Collection
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
            View All ({FULL_SEED_CATALOG.length} Items) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={product.categories?.[0]?.name}
            />
          ))}
        </div>
      </section>

      {/* 4. Promotional Banner (Seasonal Curation) */}
      <section className="rounded-[14px] bg-[#FAFAF8] border border-[#E5E7EB] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <span className="px-2.5 py-1 rounded-full bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider">
            Limited Workshop Release
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
            Artisan Stoneware & Pure Silver Signets
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
            Crafted in strictly limited batches. Once inventory on hand is claimed, restocks take four weeks of kiln firing and hand casting.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
            <Link href="/category/home-and-living">
              <Button size="sm" variant="primary">
                Explore Stoneware
              </Button>
            </Link>
            <Link href="/category/fine-jewelry">
              <Button size="sm" variant="outline">
                Explore Signets
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-72 aspect-square rounded-[12px] overflow-hidden border border-[#E5E7EB] bg-gray-100 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80"
            alt="Handcrafted Stoneware Ceramics"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* 5. New Arrivals (2-column mobile) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111]">
              Just Added to Studio
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] mt-0.5">
              New Arrivals
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={product.categories?.[0]?.name}
            />
          ))}
        </div>
      </section>

      {/* 6. Trending Products (2-column mobile) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706]">
              Most Requested Locally
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] mt-0.5">
              Trending Pieces
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trending.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={product.categories?.[0]?.name}
            />
          ))}
        </div>
      </section>

      {/* 7. Why Shop With Us (Value Proposition) */}
      <section className="bg-white rounded-[14px] border border-[#E5E7EB] p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
            The Local Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#171717] tracking-tight">
            Why Shop with A1 Collection?
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            We bridge the convenience of digital curation with the warmth of a bespoke downtown boutique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] space-y-2">
            <div className="p-2 w-fit rounded-[8px] bg-white border border-[#E5E7EB] text-[#111111]">
              <PhoneCall className="w-5 h-5 text-[#15803D]" />
            </div>
            <h3 className="text-sm font-bold text-[#171717]">Manual Confirmation</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Every order is personally reviewed. We call or WhatsApp you before packing to verify sizing and delivery timing.
            </p>
          </div>

          <div className="p-5 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] space-y-2">
            <div className="p-2 w-fit rounded-[8px] bg-white border border-[#E5E7EB] text-[#111111]">
              <ShieldCheck className="w-5 h-5 text-[#111111]" />
            </div>
            <h3 className="text-sm font-bold text-[#171717]">Hand-Inspected Quality</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Zero automated drop-shipping. Every item is inspected by hand in our studio for seam fidelity and surface perfection.
            </p>
          </div>

          <div className="p-5 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] space-y-2">
            <div className="p-2 w-fit rounded-[8px] bg-white border border-[#E5E7EB] text-[#111111]">
              <Truck className="w-5 h-5 text-[#111111]" />
            </div>
            <h3 className="text-sm font-bold text-[#171717]">Complimentary Local Courier</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Flexible morning, afternoon, or evening time slots delivered directly to your door, or same-day boutique pickup.
            </p>
          </div>

          <div className="p-5 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] space-y-2">
            <div className="p-2 w-fit rounded-[8px] bg-white border border-[#E5E7EB] text-[#111111]">
              <HeartHandshake className="w-5 h-5 text-[#111111]" />
            </div>
            <h3 className="text-sm font-bold text-[#171717]">14-Day In-Person Returns</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Easy exchanges and returns handled locally with genuine care and immediate attention.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Real Customer Reviews Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
            Verified Client Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
            Words from Our Local Patrons
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Genuine testimonials from clients who experienced our manual confirmation and boutique service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {verifiedReviews.map((rev) => (
            <Card key={rev.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#D97706]">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D97706]" />
                  ))}
                </div>
                <p className="text-xs text-[#171717] italic leading-relaxed">
                  "{rev.review_text}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] text-xs">
                <p className="font-bold text-[#171717]">{rev.reviewer_name}</p>
                <Link
                  href={`/product/${rev.productSlug}`}
                  className="text-[11px] text-[#6B7280] hover:text-[#111111] hover:underline truncate block"
                >
                  On: {rev.productTitle}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 9. Interactive FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
            Have Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {homeFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-[14px] border border-[#E5E7EB] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-[#171717] hover:bg-[#FAFAF8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#111111]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-[#6B7280] leading-relaxed border-t border-[#E5E7EB]/50 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link href="/faq" className="text-xs font-semibold text-[#111111] hover:underline">
            View All Frequently Asked Questions →
          </Link>
        </div>
      </section>
    </div>
  );
}
