/**
 * Site Configuration for A1 Collection
 * Premium local-shop e-commerce website
 */

export type PaymentMode = 'MANUAL_CONFIRMATION' | 'ONLINE_PAYMENT' | 'BOTH';

export type OrderStatus =
  | 'awaiting_confirmation'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export const ORDER_LIFECYCLE_STEPS: {
  status: OrderStatus;
  label: string;
  description: string;
}[] = [
  {
    status: 'awaiting_confirmation',
    label: 'Awaiting Confirmation',
    description: 'Order placed by customer. Shop owner will contact customer to verify details.',
  },
  {
    status: 'confirmed',
    label: 'Order Confirmed',
    description: 'Shop owner confirmed availability, address, and delivery slot with the customer.',
  },
  {
    status: 'packed',
    label: 'Packed & Ready',
    description: 'Items carefully checked, packed, and prepared for dispatch.',
  },
  {
    status: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Courier or shop delivery agent is on the way to the customer.',
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Order successfully handed over to customer.',
  },
];

export const SITE_CONFIG = {
  name: 'A1 Collection',
  shortName: 'A1',
  tagline: 'Curated Elegance, Crafted for Your Lifestyle',
  description:
    'A1 Collection is a premium local-shop e-commerce destination featuring curated collections, handcrafted goods, and personalized manual order confirmation.',
  url: process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  defaultPaymentMode: (process.env.PAYMENT_MODE || 'MANUAL_CONFIRMATION') as PaymentMode,
  contact: {
    email: 'hello@a1collection.com',
    phone: '+1 (555) 019-2834',
    address: '142 Artisan Boulevard, Suite 10, Downtown',
    hours: 'Mon - Sat: 10:00 AM - 8:00 PM | Sun: 12:00 PM - 6:00 PM',
  },
  announcement: {
    enabled: true,
    text: 'Local shop exclusive • Personalized manual order confirmation on all orders • Handcrafted with care',
  },
  links: {
    shop: '/shop',
    about: '/about',
    contact: '/contact',
    faq: '/faq',
    cart: '/cart',
    checkout: '/checkout',
    account: '/account',
    privacy: '/privacy-policy',
    terms: '/terms-and-conditions',
    shipping: '/shipping-policy',
    returns: '/return-policy',
    refund: '/refund-policy',
    cookies: '/cookie-policy',
    admin: '/admin/dashboard',
  },
  categories: [
    { name: 'Apparel', slug: 'apparel', description: 'Timeless tailored pieces and premium fabrics' },
    { name: 'Accessories', slug: 'accessories', description: 'Leather goods, handcrafted belts, and accents' },
    { name: 'Home & Living', slug: 'home-and-living', description: 'Handcrafted stoneware, linens, and scented candles' },
    { name: 'Fine Jewelry', slug: 'fine-jewelry', description: 'Minimalist solid silver and gold artisan pieces' },
  ],
} as const;
