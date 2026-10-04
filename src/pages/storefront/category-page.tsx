import React, { useEffect, useState } from 'react';
import { useParams, Link } from '@/router';
import { SITE_CONFIG } from '@/config/site';
import { getProducts, FullProduct } from '@/actions/products';
import { ProductCard } from '@/components/catalog/product-card';
import { ProductGridSkeleton } from '@/components/loading/skeletons';
import { applyDocumentSEO, generateBreadcrumbSchema } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, PackageOpen } from 'lucide-react';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const category = SITE_CONFIG.categories.find((c) => c.slug === slug);
  const categoryName = category?.name || (slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Collection');

  useEffect(() => {
    // Dynamic SEO
    applyDocumentSEO({
      title: `${categoryName} Collection`,
      description: category?.description || `Explore our bespoke ${categoryName} collection at A1 Collection. Handcrafted local items with manual confirmation.`,
      canonicalPath: `/category/${slug}`,
      schema: generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Shop All', url: '/shop' },
        { name: categoryName, url: `/category/${slug}` },
      ]),
    });

    setIsLoading(true);
    getProducts({ categorySlug: slug }).then((res) => {
      setIsLoading(false);
      if (res.success && res.data) {
        setProducts(res.data.products);
      }
    });
  }, [slug, categoryName]);

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B7280]">
        <Link href="/" className="hover:text-[#111111]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#111111]">Shop All</Link>
        <span>/</span>
        <span className="text-[#171717] font-semibold">{categoryName}</span>
      </nav>

      {/* Category Header Card */}
      <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-6 sm:p-10 space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAFAF8] border border-[#E5E7EB] text-[11px] font-semibold text-[#111111]">
          <Sparkles className="w-3 h-3 text-[#15803D]" />
          <span>Curated Department</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
          {categoryName}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] max-w-2xl leading-relaxed">
          {category?.description || `Hand-inspected, sustainably made ${categoryName.toLowerCase()} crafted for enduring beauty.`}
        </p>
      </div>

      {/* Category Filter Pills Quick Switch */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Link
          href="/shop"
          className="px-3 py-1.5 rounded-[9px] text-xs font-semibold bg-[#FAFAF8] text-[#171717] hover:bg-gray-100 border border-[#E5E7EB]"
        >
          All Items
        </Link>
        {SITE_CONFIG.categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`px-3 py-1.5 rounded-[9px] text-xs font-semibold transition-colors ${
              c.slug === slug
                ? 'bg-[#111111] text-white shadow-sm'
                : 'bg-[#FAFAF8] text-[#171717] hover:bg-gray-100 border border-[#E5E7EB]'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Products Grid: 2-column mobile */}
      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-[12px] bg-[#FAFAF8] border border-[#E5E7EB] text-[#6B7280] mx-auto flex items-center justify-center">
            <PackageOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#171717]">No items in this category yet</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Our workshop is currently crafting the next seasonal release for {categoryName}.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="sm">
              Explore Other Categories
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
