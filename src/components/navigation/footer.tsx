import { Link } from '@/router';
import { SITE_CONFIG } from '@/config/site';
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const policyLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Return Policy', href: '/return-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
  ];

  return (
    <footer className="bg-white border-t border-[#E5E7EB] text-[#171717] mt-auto">
      {/* Local Shop Guarantee Banner */}
      <div className="border-b border-[#E5E7EB] bg-[#FAFAF8] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[9px] bg-white border border-[#E5E7EB] text-[#111111] shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#171717]">Manual Order Confirmation</h4>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                We review every order personally and contact you via Phone/WhatsApp to confirm details before dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[9px] bg-white border border-[#E5E7EB] text-[#111111] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#171717]">Artisan Craftsmanship</h4>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Hand-inspected, locally curated items sourced with strict quality and ethical standards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[9px] bg-white border border-[#E5E7EB] text-[#111111] shrink-0">
              <Clock className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#171717]">Flexible Local Delivery</h4>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Specify your preferred delivery time slot or pick up directly from our local workshop.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-[7px] bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
                A1
              </div>
              <span className="font-bold text-base tracking-tight text-[#171717]">
                A1 COLLECTION
              </span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="pt-2 text-xs text-[#6B7280] space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span>{SITE_CONFIG.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span>{SITE_CONFIG.contact.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                <span>{SITE_CONFIG.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Catalog */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Collections</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="text-[#6B7280] hover:text-[#111111] transition-colors">
                  All Products
                </Link>
              </li>
              {SITE_CONFIG.categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="text-[#6B7280] hover:text-[#111111] transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-[#6B7280] hover:text-[#111111] transition-colors">
                  About Our Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#6B7280] hover:text-[#111111] transition-colors">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#6B7280] hover:text-[#111111] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-[#6B7280] hover:text-[#111111] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="text-[#6B7280] hover:text-[#111111] transition-colors font-medium">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Policies</h4>
            <ul className="space-y-2 text-xs">
              {policyLinks.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="text-[#6B7280] hover:text-[#111111] transition-colors">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-4">
          <p>© {new Date().getFullYear()} A1 Collection. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Checkout Architecture: <strong>{SITE_CONFIG.defaultPaymentMode}</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
