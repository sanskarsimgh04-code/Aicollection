import { Link } from '@/router';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Home } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-[14px] bg-white border border-[#E5E7EB] flex items-center justify-center font-bold text-2xl text-[#171717] mb-6 shadow-sm">
        404
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-3 text-sm text-[#6B7280] max-w-md leading-relaxed">
        The page you are looking for doesn't exist or may have been moved. Explore our handcrafted collections or return home.
      </p>

      {/* Suggested Categories */}
      <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-lg">
        {SITE_CONFIG.categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="text-xs px-3 py-1.5 rounded-[9px] bg-white border border-[#E5E7EB] text-[#171717] hover:border-[#111111] transition-colors"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <Button variant="primary" className="flex items-center gap-2">
            <Home className="w-4 h-4" /> Go to Homepage
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="w-4 h-4" /> Browse Shop
          </Button>
        </Link>
      </div>
    </div>
  );
}
