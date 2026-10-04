import React, { useState, useEffect } from 'react';
import { useParams, Link, useRouter } from '@/router';
import { getFullProductBySlug, getRelatedProducts, FullProduct } from '@/actions/products';
import { ProductCard } from '@/components/catalog/product-card';
import { formatCurrency } from '@/lib/utils';
import { applyDocumentSEO, generateBreadcrumbSchema, generateProductSchema } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  PhoneCall,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  Star,
  Info,
  Layers,
} from 'lucide-react';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<FullProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<FullProduct[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    getFullProductBySlug(slug).then((res) => {
      setIsLoading(false);
      if (res.success && res.data) {
        const prod = res.data;
        setProduct(prod);
        setSelectedImageIndex(0);

        // Default to first variant if exists
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariantId(prod.variants[0].id);
        }

        // Dynamic SEO & Structured Data
        applyDocumentSEO({
          title: prod.title,
          description: prod.description,
          canonicalPath: `/product/${prod.slug}`,
          image: prod.images?.[0],
          schema: generateProductSchema(prod),
        });

        // Related products
        getRelatedProducts(prod.id, prod.category_id, 4).then((relRes) => {
          if (relRes.success && relRes.data) {
            setRelatedProducts(relRes.data);
          }
        });
      }
    });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#6B7280]">Loading artisan piece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="text-xl font-bold text-[#171717]">Piece Not Found</h2>
        <p className="text-xs text-[#6B7280]">This item may no longer be available in our active catalog.</p>
        <Link href="/shop">
          <Button variant="primary" size="sm">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  // Active Variant Calculation
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  // Dynamic Price (Variant price override takes precedence over base price)
  const currentPrice = selectedVariant?.price_override ?? product.base_price;
  const compareAtPrice = product.compare_at_price;
  const hasDiscount = compareAtPrice && compareAtPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
    : 0;

  // Active Dynamic SKU
  const activeSku = selectedVariant?.sku || product.sku;

  // CRITICAL REQUIREMENT: Variant-Specific Inventory (Never one global stock when variants exist!)
  const variantInventory = selectedVariant
    ? product.inventory_by_variant[selectedVariant.id] || { quantity_on_hand: 0, quantity_reserved: 0, available: 0 }
    : { quantity_on_hand: product.inventory_quantity, quantity_reserved: 0, available: product.inventory_quantity };

  const availableStock = variantInventory.available;
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 3;

  // Extract distinct sizes & colors for selector grouping if attributes exist
  const sizes = Array.from(new Set(product.variants.map((v) => v.attributes.size).filter(Boolean)));
  const colors = Array.from(new Set(product.variants.map((v) => v.attributes.color).filter(Boolean)));

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    router.push('/checkout');
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B7280]">
        <Link href="/" className="hover:text-[#111111]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#111111]">Shop</Link>
        <span>/</span>
        <Link href={`/category/${product.category_id}`} className="hover:text-[#111111] capitalize">
          {product.categories?.[0]?.name || product.category_id}
        </Link>
        <span>/</span>
        <span className="text-[#171717] font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          {/* Main Hero Image with 12px radius */}
          <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-white border border-[#E5E7EB] shadow-sm">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={`${product.title} - View ${selectedImageIndex + 1}`}
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
            {hasDiscount && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-[6px] bg-[#111111] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Product thumbnail gallery">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-[9px] overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#111111] ring-2 ring-[#111111]/20'
                      : 'border-[#E5E7EB] hover:border-gray-400 opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                  aria-selected={selectedImageIndex === idx}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Variant Selectors */}
        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                {product.categories?.[0]?.name}
              </span>
              <span className="text-[#E5E7EB]">•</span>
              <span className="text-[11px] font-mono text-[#6B7280]">SKU: {activeSku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717]">
              {product.title}
            </h1>

            {/* Real Reviews Average Rating */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-2 text-xs pt-0.5">
                <div className="flex items-center text-[#D97706]">
                  {Array.from({ length: Math.round(product.average_rating) }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D97706]" />
                  ))}
                </div>
                <span className="font-semibold text-[#171717]">{product.average_rating.toFixed(1)}</span>
                <span className="text-[#6B7280]">({product.review_count} verified {product.review_count === 1 ? 'review' : 'reviews'})</span>
              </div>
            )}

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                {formatCurrency(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-[#6B7280] line-through font-medium">
                  {formatCurrency(compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed border-t border-b border-[#E5E7EB] py-4">
            {product.description}
          </p>

          {/* Variant Selectors (Size, Color) */}
          <div className="space-y-4">
            {/* Color Swatches / Selector */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#171717] uppercase tracking-wider text-[11px]">
                    Color: <span className="font-normal text-[#6B7280]">{selectedVariant?.attributes.color}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariantId === v.id;
                    const vStock = product.inventory_by_variant[v.id]?.available || 0;
                    const isVOutOfStock = vStock <= 0;

                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-3 py-1.5 rounded-[9px] text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                            : isVOutOfStock
                            ? 'bg-gray-100 text-gray-400 border-gray-200 line-through'
                            : 'bg-white text-[#171717] border-[#E5E7EB] hover:border-gray-400'
                        }`}
                        aria-label={`Select ${v.title}`}
                      >
                        {v.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dedicated Stock & Availability Badge (Based strictly on selected variant!) */}
            <div className="pt-1">
              {isOutOfStock ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#DC2626]">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                  <span>Out of Stock - Currently in Production</span>
                </div>
              ) : isLowStock ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D97706]">
                  <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                  <span>Low Stock — Only {availableStock} left in workshop</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                  <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                  <span>In Stock — {availableStock} ready for inspection & dispatch</span>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center border border-[#E5E7EB] rounded-[9px] bg-white h-11 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="px-3.5 py-2 text-[#171717] hover:bg-gray-100 rounded-l-[9px] disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-semibold text-[#171717] min-w-8 text-center" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(availableStock || 1, quantity + 1))}
                    disabled={isOutOfStock || quantity >= availableStock}
                    className="px-3.5 py-2 text-[#171717] hover:bg-gray-100 rounded-r-[9px] disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  size="lg"
                  className="flex-1 flex items-center justify-center gap-2 h-11"
                  aria-label="Add item to shopping cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                </Button>

                {/* Buy Now */}
                <Button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  size="lg"
                  variant="outline"
                  className="border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white h-11 px-5"
                  aria-label="Buy now and proceed to manual confirmation checkout"
                >
                  Buy Now
                </Button>
              </div>

              {addedNotice && (
                <div
                  role="status"
                  className="p-3 bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] rounded-[9px] text-xs font-semibold flex items-center gap-2 animate-in fade-in"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Added to cart. Ready for manual confirmation checkout.</span>
                </div>
              )}
            </div>
          </div>

          {/* Local Confirmation Guarantee Callout */}
          <Card className="bg-[#FAFAF8] border-[#E5E7EB] p-4 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <PhoneCall className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Manual Verification on Every Order
                </h4>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">
                  We verify your measurements and preferred delivery window before packing. No automated payment is processed until you confirm.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E7EB] text-[11px] text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#111111]" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
                <span>Hand-Inspected Seams</span>
              </div>
            </div>
          </Card>

          {/* Specifications Accordion / Details */}
          <div className="border-t border-[#E5E7EB] pt-4 space-y-3 text-xs">
            <h3 className="font-bold text-[#171717] uppercase tracking-wider text-[11px]">
              Artisan Craftsmanship & Materials
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[#6B7280]">
              {Object.entries(product.metadata).map(([k, v]) => (
                <div key={k}>
                  <dt className="capitalize font-semibold text-[#171717]">{k.replace(/_/g, ' ')}</dt>
                  <dd className="text-[11px] mt-0.5">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {product.reviews.length > 0 && (
        <section className="border-t border-[#E5E7EB] pt-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#171717]">
                Customer Reviews
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Verified reviews from patrons who purchased this specific piece.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#171717]">
              <Star className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
              <span>{product.average_rating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((rev) => (
              <Card key={rev.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#171717]">{rev.reviewer_name}</span>
                  <div className="flex items-center text-[#D97706]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#D97706]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed italic">
                  "{rev.review_text}"
                </p>
                <div className="flex items-center gap-1 text-[10px] text-[#15803D] font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Related Products Section (2-column on mobile) */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#E5E7EB] pt-10 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Curated Suggestions
              </span>
              <h2 className="text-xl font-bold tracking-tight text-[#171717]">
                You May Also Appreciate
              </h2>
            </div>
            <Link href={`/category/${product.category_id}`} className="text-xs font-semibold text-[#111111] hover:underline">
              View Collection →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                categoryName={rel.categories?.[0]?.name}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
