import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from '@/router';
import { FULL_SEED_CATALOG, FullProduct } from '@/actions/products';
import { ProductCard } from '@/components/catalog/product-card';
import { applyDocumentSEO, generateBreadcrumbSchema } from '@/lib/seo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, X, PackageOpen } from 'lucide-react';

export function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    applyDocumentSEO({
      title: searchTerm ? `Search: "${searchTerm}"` : 'Search Catalog',
      description: 'Search our handcrafted collections of cashmere apparel, full-grain leather, and artisan ceramics.',
      canonicalPath: '/search',
      schema: generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Search', url: '/search' },
      ]),
    });
  }, [searchTerm]);

  const filtered = searchTerm.trim()
    ? FULL_SEED_CATALOG.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          p.categories.some((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase().trim()))
      )
    : FULL_SEED_CATALOG;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">Search Collection</h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Find tailored cashmere, Tuscan leather weekender duffles, and artisan pottery.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-xl mx-auto">
        <SearchIcon className="absolute left-3.5 top-3 w-5 h-5 text-[#6B7280]" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by piece title, material, or SKU..."
          className="w-full h-11 pl-11 pr-10 text-xs sm:text-sm rounded-[9px] border border-[#E5E7EB] bg-white text-[#171717] placeholder:text-[#6B7280] shadow-sm focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
          aria-label="Search catalog"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3 text-[#6B7280] hover:text-[#111111]"
            aria-label="Clear search input"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 text-xs text-[#6B7280]">
        <span>
          Showing {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          {searchTerm ? ` for "${searchTerm}"` : ''}
        </span>
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-[#111111] hover:underline font-semibold"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Results Grid (2-column mobile) */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] text-[#6B7280] mx-auto flex items-center justify-center">
            <PackageOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#171717]">No matches found</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            We couldn't find any items matching "{searchTerm}". Try a different term or browse our categories.
          </p>
          <Button onClick={() => setSearchTerm('')} variant="primary" size="sm">
            View All Pieces
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={product.categories?.[0]?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
