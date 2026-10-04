-- ==============================================================================
-- A1 Collection - Seed Default Database Settings & Catalog Baseline
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Default Business Settings (Database-controlled)
-- ------------------------------------------------------------------------------
INSERT INTO public.settings (key, category, value, description)
VALUES
  (
    'store_profile',
    'store',
    '{"name": "A1 Collection", "tagline": "Curated Elegance, Crafted for Your Lifestyle", "currency": "USD"}'::jsonb,
    'Store identity and general profile'
  ),
  (
    'contact_info',
    'contact',
    '{"phone": "+1 (555) 019-2834", "email": "hello@a1collection.com", "address": "142 Artisan Boulevard, Suite 10, Downtown", "hours": "Mon - Sat: 10:00 AM - 8:00 PM | Sun: 12:00 PM - 6:00 PM"}'::jsonb,
    'Public contact channels and boutique showroom hours'
  ),
  (
    'checkout_configuration',
    'checkout',
    '{"mode": "MANUAL_CONFIRMATION", "require_phone": true, "preferred_channels": ["whatsapp", "phone", "email"], "auto_notify_owner": true}'::jsonb,
    'Primary checkout architecture and verification channel rules'
  ),
  (
    'shipping_configuration',
    'shipping',
    '{"default_fee": 0.00, "free_shipping_threshold": 0.00, "local_delivery_available": true, "pickup_available": true, "time_slots": ["Morning (10 AM - 1 PM)", "Afternoon (2 PM - 6 PM)", "Evening (6 PM - 8 PM)"]}'::jsonb,
    'Local delivery time windows and pickup specifications'
  ),
  (
    'tax_configuration',
    'tax',
    '{"rate_percent": 0.0, "prices_include_tax": true, "tax_label": "Local Sales Tax"}'::jsonb,
    'Boutique taxation settings'
  ),
  (
    'homepage_configuration',
    'homepage',
    '{"hero_heading": "Curated Elegance, Crafted for Your Lifestyle.", "hero_subheading": "We personally inspect, pack, and manually confirm every single order with you to ensure perfection.", "show_announcement": true, "announcement_text": "Local shop exclusive • Personalized manual order confirmation on all orders • Handcrafted with care"}'::jsonb,
    'Storefront hero narrative and announcement banner configuration'
  ),
  (
    'seo_defaults',
    'seo',
    '{"meta_title": "A1 Collection - Premium Local Shop", "meta_description": "A1 Collection is a premium local-shop e-commerce destination featuring curated collections, handcrafted goods, and personalized manual order confirmation.", "og_image": "/og-image.jpg"}'::jsonb,
    'Default OpenGraph and search engine meta configuration'
  )
ON CONFLICT (key) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. Default Baseline Categories
-- ------------------------------------------------------------------------------
INSERT INTO public.categories (slug, name, description, sort_order, is_active)
VALUES
  ('apparel', 'Apparel', 'Timeless tailored pieces and premium natural fabrics', 1, true),
  ('accessories', 'Accessories', 'Leather goods, handcrafted belts, and artisan accents', 2, true),
  ('home-and-living', 'Home & Living', 'Handcrafted stoneware, linens, and scented candles', 3, true),
  ('fine-jewelry', 'Fine Jewelry', 'Minimalist solid silver and gold artisan pieces', 4, true)
ON CONFLICT (slug) DO NOTHING;
