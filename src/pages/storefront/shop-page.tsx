import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from '@/router';
import { SITE_CONFIG } from '@/config/site';
import { getProducts, FullProduct } from '@/actions/products';
import { ProductCard } from '@/components/catalog/product-card';
import { ProductGridSkeleton } from '@/components/loading/skeletons';
import { applyDocumentSEO, generateBreadcrumbSchema } from '@/lib/seo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, ArrowUpDown, X, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

export function ShopPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'newest' | 'trending'>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const ITEMS_PER_PAGE = 8;

  // Apply SEO
  useEffect(() => {
    applyDocumentSEO({
      title: 'Shop All Handcrafted Collections',
      description: 'Explore our complete catalog of bespoke cashmere apparel, Tuscan leather accessories, and artisan ceramics with manual order confirmation.',
      canonicalPath: '/shop',
      schema: generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Shop All', url: '/shop' },
      ]),
    });
  }, []);

  // Fetch products based on category, query, sorting, and pagination
  useEffect(() => {
    setIsLoading(true);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    getProducts({
      categorySlug: selectedCategory,
      query: searchTerm,
      sortBy,
      offset,
      limit: ITEMS_PER_PAGE,
    }).then((res) => {
      setIsLoading(false);
      if (res.success && res.data) {
        setProducts(res.data.products);
        setTotalCount(res.data.totalCount);
      }
    });
  }, [selectedCategory, searchTerm, sortBy, currentPage]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Header */}
      <div className="border-b border-[#E5E7EB] pb-6">
        <nav aria-label="Breadcrumb" className="text-xs text-[#6B7280] mb-2 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#111111]">Home</Link>
          <span>/</span>
          <span className="text-[#171717] font-semibold">Shop All</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
          Shop Collection
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Explore our complete catalog. Handcrafted noble materials available for personal verification and local delivery.
        </p>
      </div>

      {/* Filter, Search, and Sort Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-[14px] border border-[#E5E7EB] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, material, or SKU..."
              className="w-full h-9 pl-9 pr-4 text-xs rounded-[9px] border border-[#E5E7EB] bg-[#FAFAF8] text-[#171717] placeholder:text-[#6B7280] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]"
              aria-label="Search catalog"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-[#6B7280] hover:text-[#111111]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
            <label htmlFor="shop-sort" className="sr-only">Sort products</label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="text-xs bg-[#FAFAF8] border border-[#E5E7EB] rounded-[9px] px-3 py-2 text-[#171717] focus:outline-none focus:border-[#111111]"
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="trending">Trending Now</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E7EB]/60">
          <span className="text-[11px] font-semibold text-[#6B7280] mr-1">Category:</span>
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#111111] text-white shadow-sm'
                : 'bg-[#FAFAF8] text-[#171717] hover:bg-gray-100'
            }`}
          >
            All Products
          </button>

          {SITE_CONFIG.categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => handleCategoryChange(c.slug)}
              className={`px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === c.slug
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-[#FAFAF8] text-[#171717] hover:bg-gray-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Indicators & Results Count */}
      <div className="flex items-center justify-between text-xs text-[#6B7280]">
        <span>
          Showing {products.length} of {totalCount} items
          {selectedCategory !== 'all' && ` in ${SITE_CONFIG.categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </span>

        {(selectedCategory !== 'all' || searchTerm) && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-[#111111] hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset Filters
          </button>
        )}
      </div>

      {/* Products Grid: 2-columns on mobile, 3 on tablet, 4 on desktop */}
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] text-[#6B7280] mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#171717]">No products found</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            We couldn't find any pieces matching your current filters. Try changing your search query or reset your filters.
          </p>
          <Button onClick={handleClearFilters} variant="primary" size="sm">
            Show All Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={product.categories?.[0]?.name}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#E5E7EB]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </Button>

          <span className="text-xs font-semibold text-[#171717]">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-xs"
          >
            Next <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
