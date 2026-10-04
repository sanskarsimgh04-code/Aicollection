import { SITE_CONFIG } from '@/config/site';
import { FullProduct } from '@/actions/products';

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
      images: [{ url: image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}` }],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`],
    },
  };
}

/**
 * Dynamically applies SEO tags, canonical URL, and JSON-LD schema into the document head
 */
export function applyDocumentSEO(props: {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  schema?: Record<string, unknown>;
}) {
  if (typeof document === 'undefined') return;

  const meta = constructMetadata({
    title: props.title,
    description: props.description,
    canonicalPath: props.canonicalPath,
    image: props.image,
  });

  // Title
  document.title = meta.title;

  // Description
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement('meta');
    descTag.setAttribute('name', 'description');
    document.head.appendChild(descTag);
  }
  descTag.setAttribute('content', meta.description);

  // Canonical
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (!canonicalTag) {
    canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalTag);
  }
  canonicalTag.setAttribute('href', meta.canonical);

  // Open Graph Title & Description
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', meta.title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', meta.description);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', meta.canonical);

  if (meta.openGraph.images[0]?.url) {
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', meta.openGraph.images[0].url);
  }

  // Structured Data JSON-LD injection
  if (props.schema) {
    let scriptTag = document.getElementById('json-ld-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-structured-data';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(props.schema);
  }
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
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
 * Generates Schema.org JSON-LD structured data for a Product using REAL database information
 */
export function generateProductSchema(product: FullProduct) {
  const inStock = product.inventory_quantity > 0;
  const currentPrice = product.base_price || product.price;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images,
    sku: product.sku,
    category: product.category_id,
    offers: {
      '@type': 'Offer',
      price: currentPrice,
      priceCurrency: 'USD',
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE_CONFIG.url}/product/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
  };

  // Only include real reviews if present in database (NEVER fabricate fake reviews)
  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.map((r) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
      },
      author: {
        '@type': 'Person',
        name: r.reviewer_name,
      },
      datePublished: r.created_at,
      reviewBody: r.review_text,
    }));

    if (product.review_count > 0 && product.average_rating > 0) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.average_rating,
        reviewCount: product.review_count,
        bestRating: 5,
      };
    }
  }

  return schema;
}
