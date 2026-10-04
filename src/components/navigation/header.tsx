import React, { useState } from 'react';
import { Link, usePathname } from '@/router';
import { SITE_CONFIG } from '@/config/site';
import { ShoppingBag, Search, User, Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Apparel', href: '/category/apparel' },
    { label: 'Accessories', href: '/category/accessories' },
    { label: 'Home & Living', href: '/category/home-and-living' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E5E7EB] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#171717] hover:text-black focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-2">
              <div className="w-8 h-8 rounded-[8px] bg-[#111111] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
                A1
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-[#171717]">
                  A1 COLLECTION
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#6B7280] font-medium -mt-1">
                  Local Shop
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#111111] ${
                    isActive ? 'text-[#111111] font-semibold' : 'text-[#6B7280]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/search" aria-label="Search Catalog">
              <Button variant="ghost" size="icon" className="text-[#171717]">
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/account" aria-label="Customer Account">
              <Button variant="ghost" size="icon" className="text-[#171717]">
                <User className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/cart" aria-label="Shopping Cart">
              <Button variant="primary" size="sm" className="relative flex items-center gap-2 px-3 sm:px-4">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-semibold">Cart</span>
                <span className="bg-white text-[#111111] text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  0
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E5E7EB] bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-[9px] text-base font-medium text-[#171717] hover:bg-[#FAFAF8]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-[9px] text-xs font-semibold text-[#6B7280] hover:text-[#111111]"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
