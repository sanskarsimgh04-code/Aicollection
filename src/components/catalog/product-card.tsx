import React from 'react';
import { Link } from '@/router';
import { ProductRow } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: ProductRow;
  categoryName?: string;
  onQuickBuy?: (product: ProductRow) => void;
}

export function ProductCard({ product, categoryName, onQuickBuy }: ProductCardProps) {
  const currentPrice = product.base_price || product.price;
  const compareAtPrice = product.compare_at_price;
  const hasDiscount = compareAtPrice && compareAtPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
    : 0;

  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80';

  return (
    <article
      className="group relative flex flex-col justify-between bg-white rounded-[14px] border border-[#E5E7EB] p-3 sm:p-4 transition-all duration-200 hover:border-[#111111]/40 hover:shadow-sm"
      aria-label={product.title}
    >
      <div>
        {/* Product Image Frame with 12px radius */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-[#FAFAF8]">
          <Link
            href={`/product/${product.slug}`}
            className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
            tabIndex={0}
            aria-label={`View details for ${product.title}`}
          >
            <img
              src={imageUrl}
              alt={product.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
            {hasDiscount && (
              <span className="px-2 py-0.5 rounded-[6px] bg-[#111111] text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                Save {discountPercent}%
              </span>
            )}
            {product.is_featured && !hasDiscount && (
              <span className="px-2 py-0.5 rounded-[6px] bg-white/90 backdrop-blur-sm border border-[#E5E7EB] text-[#171717] text-[10px] font-bold uppercase tracking-wider">
                Curated
              </span>
            )}
          </div>
        </div>

        {/* Product Metadata */}
        <div className="mt-3 space-y-1">
          {categoryName && (
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
              {categoryName}
            </p>
          )}

          <h3 className="text-xs sm:text-sm font-semibold text-[#171717] line-clamp-1 group-hover:text-black">
            <Link
              href={`/product/${product.slug}`}
              className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-[4px]"
            >
              {product.title}
            </Link>
          </h3>

          <p className="text-[11px] sm:text-xs text-[#6B7280] line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & Primary Action */}
      <div className="mt-3 pt-2.5 border-t border-[#E5E7EB]/60 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-[#171717]">
            {formatCurrency(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] sm:text-xs text-[#6B7280] line-through -mt-0.5">
              {formatCurrency(compareAtPrice)}
            </span>
          )}
        </div>

        <Link href={`/product/${product.slug}`}>
          <Button
            size="sm"
            variant="outline"
            className="text-[11px] sm:text-xs h-7 sm:h-8 px-2.5 sm:px-3 font-semibold rounded-[9px] hover:bg-[#111111] hover:text-white transition-colors"
            aria-label={`Buy ${product.title} now`}
          >
            Buy Now
          </Button>
        </Link>
      </div>
    </article>
  );
}
