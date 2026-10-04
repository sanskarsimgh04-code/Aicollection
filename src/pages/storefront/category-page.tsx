import React from 'react';
import { useParams, Link } from '@/router';
import { SITE_CONFIG } from '@/config/site';
import { SEED_PRODUCTS } from '@/actions/products';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const category = SITE_CONFIG.categories.find((c) => c.slug === slug);
  const products = SEED_PRODUCTS.filter(
    (p) => !slug || p.category_id.includes(slug) || slug === 'apparel' // Fallback to showcase products
  );

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
        <Link href="/shop" className="hover:text-[#111111] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> All Products
        </Link>
        <span>/</span>
        <span className="text-[#171717] font-medium capitalize">{category?.name || slug}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#171717]">
          {category?.name || 'Collection'}
        </h1>
        <p className="text-sm text-[#6B7280] max-w-2xl leading-relaxed">
          {category?.description || 'Browse our selected items in this category.'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
    </div>
  );
}
