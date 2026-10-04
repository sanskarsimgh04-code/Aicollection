import React, { useState } from 'react';
import { useParams, Link } from '@/router';
import { SEED_PRODUCTS } from '@/actions/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, CheckCircle2, Shield, Truck, PhoneCall, ShoppingBag } from 'lucide-react';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const product = SEED_PRODUCTS.find((p) => p.slug === slug) || SEED_PRODUCTS[0];

  const handleAddToCart = () => {
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
        <Link href="/shop" className="hover:text-[#111111] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
        <span>/</span>
        <span className="text-[#171717] font-medium truncate">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image Gallery with 12px radius */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-[12px] bg-white border border-[#E5E7EB]">
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-[11px] font-mono">
                {product.sku}
              </Badge>
              {product.inventory_quantity > 0 ? (
                <Badge variant="success" className="text-[11px]">
                  In Stock ({product.inventory_quantity} available)
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-[11px]">
                  Out of Stock
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-extrabold text-[#171717]">
                {formatCurrency(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="text-base text-[#6B7280] line-through">
                  {formatCurrency(product.compare_at_price)}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-[#6B7280] leading-relaxed border-t border-b border-[#E5E7EB] py-4">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#E5E7EB] rounded-[9px] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-[#171717] hover:bg-gray-100 rounded-l-[9px]"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-[#171717]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-[#171717] hover:bg-gray-100 rounded-r-[9px]"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </Button>

              <Link href="/checkout">
                <Button size="lg" variant="outline" className="border-[#111111] text-[#111111]">
                  Order Now
                </Button>
              </Link>
            </div>

            {addedNotice && (
              <div className="p-3 bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] rounded-[9px] text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Added to cart. Ready for manual confirmation checkout.</span>
              </div>
            )}
          </div>

          {/* Local Confirmation Guarantee Card */}
          <Card className="bg-[#FAFAF8] border-[#E5E7EB] p-4 space-y-3">
            <div className="flex items-start gap-3">
              <PhoneCall className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Manual Order Verification
                </h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  No automated credit card processing required. When you submit your order, our shop owner personally calls or WhatsApps you to confirm delivery timing, address, and special requests.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E7EB] text-[11px] text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#111111]" />
                <span>Local Pickup or Courier</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#111111]" />
                <span>Hand-Inspected Guarantee</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
