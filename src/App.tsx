import React from 'react';
import { RootLayout } from '@/app/layout';
import { StorefrontLayout } from '@/app/(storefront)/layout';
import { AdminLayout } from '@/app/(admin)/layout';
import { usePathname } from '@/router';

// Storefront Pages
import { HomePage } from '@/pages/storefront/home-page';
import { ShopPage } from '@/pages/storefront/shop-page';
import { CategoryPage } from '@/pages/storefront/category-page';
import { ProductDetailPage } from '@/pages/storefront/product-detail-page';
import { SearchPage } from '@/pages/storefront/search-page';
import { CartPage } from '@/pages/storefront/cart-page';
import { CheckoutPage } from '@/pages/storefront/checkout-page';
import { OrderStatusPage } from '@/pages/storefront/order-status-page';
import { AccountPage } from '@/pages/storefront/account-page';
import { AboutPage } from '@/pages/storefront/about-page';
import { ContactPage } from '@/pages/storefront/contact-page';
import { FAQPage } from '@/pages/storefront/faq-page';
import { PolicyPage } from '@/pages/storefront/policy-pages';

// Admin Pages
import { AdminPageView } from '@/pages/admin/admin-pages';

// Auth Guards
import { ProtectedAccountRoute, ProtectedAdminRoute } from '@/components/auth/protected-route';

// 404
import { NotFoundPage } from '@/app/not-found';

function RouterSwitch() {
  const pathname = usePathname();

  // Admin Route Group (Protected)
  if (pathname.startsWith('/admin')) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <AdminPageView />
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  // Storefront Route Group
  let content = <NotFoundPage />;

  if (pathname === '/') {
    content = <HomePage />;
  } else if (pathname === '/shop') {
    content = <ShopPage />;
  } else if (pathname.startsWith('/category/')) {
    content = <CategoryPage />;
  } else if (pathname.startsWith('/product/')) {
    content = <ProductDetailPage />;
  } else if (pathname === '/search') {
    content = <SearchPage />;
  } else if (pathname === '/cart') {
    content = <CartPage />;
  } else if (pathname === '/checkout') {
    content = <CheckoutPage />;
  } else if (pathname.startsWith('/order/')) {
    content = <OrderStatusPage />;
  } else if (pathname === '/account' || pathname.startsWith('/account/')) {
    content = (
      <ProtectedAccountRoute>
        <AccountPage />
      </ProtectedAccountRoute>
    );
  } else if (pathname === '/about') {
    content = <AboutPage />;
  } else if (pathname === '/contact') {
    content = <ContactPage />;
  } else if (pathname === '/faq') {
    content = <FAQPage />;
  } else if (
    pathname === '/privacy-policy' ||
    pathname === '/terms-and-conditions' ||
    pathname === '/shipping-policy' ||
    pathname === '/return-policy' ||
    pathname === '/refund-policy' ||
    pathname === '/cookie-policy'
  ) {
    content = <PolicyPage />;
  }

  return <StorefrontLayout>{content}</StorefrontLayout>;
}

export default function App() {
  return (
    <RootLayout>
      <RouterSwitch />
    </RootLayout>
  );
}
