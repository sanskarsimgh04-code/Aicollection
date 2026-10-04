import { SITE_CONFIG } from '@/config/site';

export interface MetaProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = SITE_CONFIG.description,
  canonicalPath = '',
  image = '/og-image.jpg',
  type = 'website',
  noIndex = false,
}: MetaProps = {}) {
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`;

  const canonicalUrl = `${SITE_CONFIG.url}${canonicalPath}`;

  return {
    title: fullTitle,
    description,
    canonical: canonicalUrl,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [{ url: `${SITE_CONFIG.url}${image}` }],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${SITE_CONFIG.url}${image}`],
    },
  };
}

/**
 * Generates Schema.org JSON-LD structured data for A1 Collection as a LocalBusiness / Store
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.contact.address,
      addressLocality: 'Downtown',
      addressCountry: 'US',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '12:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
  };
}

/**
 * Generates Schema.org JSON-LD structured data for a Product
 */
export function generateProductSchema(product: {
  title: string;
  description: string;
  price: number;
  sku: string;
  image: string;
  inStock: boolean;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_CONFIG.url}/product/${product.slug}`,
    },
  };
}
