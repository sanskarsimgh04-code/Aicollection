import { ProductRow } from '@/types/database';
import { ActionResponse } from './types';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

// Seed catalog definition for immediate foundation preview without requiring pre-seeded database
export const SEED_PRODUCTS: ProductRow[] = [
  {
    id: 'prod_1',
    title: 'Heritage Cashmere Overcoat',
    slug: 'heritage-cashmere-overcoat',
    description: 'Masterfully tailored double-faced cashmere with bespoke horn buttons and structured silhouette.',
    price: 495.0,
    compare_at_price: 580.0,
    sku: 'A1-APP-001',
    inventory_quantity: 12,
    category_id: 'cat_apparel',
    images: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    is_featured: true,
    metadata: { material: '100% Mongolian Cashmere', fit: 'Tailored Regular' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_2',
    title: 'Artisan Full-Grain Leather Weekender',
    slug: 'artisan-leather-weekender',
    description: 'Hand-burnished vegetable-tanned Italian leather with solid brass hardware and water-resistant lining.',
    price: 380.0,
    compare_at_price: null,
    sku: 'A1-ACC-002',
    inventory_quantity: 8,
    category_id: 'cat_accessories',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    is_featured: true,
    metadata: { leather: 'Tuscan Full-Grain', warranty: 'Lifetime Craftsmanship' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_3',
    title: 'Hand-Thrown Matte Stoneware Set',
    slug: 'hand-thrown-matte-stoneware-set',
    description: 'Minimalist 4-piece ceramic dinner set hand-thrown in small batches with an organic satin glaze.',
    price: 165.0,
    compare_at_price: 195.0,
    sku: 'A1-HOM-003',
    inventory_quantity: 15,
    category_id: 'cat_home',
    images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    is_featured: false,
    metadata: { care: 'Dishwasher & Microwave Safe', origin: 'Local Pottery Studio' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_4',
    title: 'Solid Sterling Hammered Signet',
    slug: 'solid-sterling-hammered-signet',
    description: 'Recycled 925 sterling silver ring forged by hand with subtle textured hammer marks.',
    price: 140.0,
    compare_at_price: null,
    sku: 'A1-JWL-004',
    inventory_quantity: 20,
    category_id: 'cat_jewelry',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
    is_active: true,
    is_featured: true,
    metadata: { purity: '.925 Sterling Silver', finish: 'Satin Hammered' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getProducts(options?: {
  categorySlug?: string;
  query?: string;
  limit?: number;
}): Promise<ActionResponse<ProductRow[]>> {
  try {
    if (isSupabaseConfigured()) {
      const client = getSupabaseBrowserClient();
      if (client) {
        let queryBuilder = client.from('products').select('*').eq('is_active', true);
        if (options?.limit) queryBuilder = queryBuilder.limit(options.limit);
        const { data, error } = await queryBuilder;
        if (!error && data && data.length > 0) {
          return { success: true, data: data as ProductRow[] };
        }
      }
    }

    // Filter seed products if query or category provided
    let results = [...SEED_PRODUCTS];
    if (options?.query) {
      const q = options.query.toLowerCase();
      results = results.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return { success: true, data: results };
  } catch (error: any) {
    logger.error('Failed to get products', error);
    return {
      success: false,
      error: { message: error.message || 'Failed to retrieve products', code: 'PRODUCT_FETCH_ERROR' },
    };
  }
}

export async function getProductBySlug(slug: string): Promise<ActionResponse<ProductRow | null>> {
  try {
    if (isSupabaseConfigured()) {
      const client = getSupabaseBrowserClient();
      if (client) {
        const { data, error } = await client.from('products').select('*').eq('slug', slug).single();
        if (!error && data) {
          return { success: true, data: data as ProductRow };
        }
      }
    }

    const found = SEED_PRODUCTS.find((p) => p.slug === slug) || null;
    return { success: true, data: found };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'Product query failed', code: 'PRODUCT_NOT_FOUND' },
    };
  }
}
