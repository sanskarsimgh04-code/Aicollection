import React, { useState } from 'react';
import { Link } from '@/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SEED_PRODUCTS } from '@/actions/products';
import { SITE_CONFIG } from '@/config/site';
import { formatCurrency } from '@/lib/utils';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  let filtered = SEED_PRODUCTS;
  if (selectedCategory !== 'all') {
    filtered = filtered.filter((p) => p.category_id.includes(selectedCategory));
  }

  if (sortBy === 'price_asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#171717]">Shop Collection</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Explore our complete catalog. All items are available for manual confirmation and local delivery.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-[14px] border border-[#E5E7EB]">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#111111] text-white'
                : 'bg-[#FAFAF8] text-[#171717] hover:bg-gray-100'
            }`}
          >
            All Items
          </button>
          {SITE_CONFIG.categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === c.slug
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#FAFAF8] text-[#171717] hover:bg-gray-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown className="w-4 h-4 text-[#6B7280]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-[#FAFAF8] border border-[#E5E7EB] rounded-[9px] px-3 py-1.5 text-[#171717] focus:outline-none focus:border-[#111111]"
          >
            <option value="featured">Featured First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
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
                  View Details
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
