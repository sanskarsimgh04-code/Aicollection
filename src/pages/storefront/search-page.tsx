import React, { useState } from 'react';
import { Link } from '@/router';
import { SEED_PRODUCTS } from '@/actions/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';

export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = searchTerm.trim()
    ? SEED_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : SEED_PRODUCTS;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#171717]">Search Catalog</h1>
        <p className="text-sm text-[#6B7280]">
          Find bespoke garments, handcrafted leather, and unique artisan homeware.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-xl mx-auto">
        <SearchIcon className="absolute left-3.5 top-3 w-5 h-5 text-[#6B7280]" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, material, or SKU..."
          className="pl-11 h-12 text-base rounded-[9px] shadow-sm"
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 text-xs text-[#6B7280]">
        <span>
          Showing {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          {searchTerm ? ` for "${searchTerm}"` : ''}
        </span>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
