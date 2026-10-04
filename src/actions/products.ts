import { ProductRow, VariantRow, InventoryRow, ReviewRow, CategoryRow } from '@/types/database';
import { ActionResponse } from './types';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { SITE_CONFIG } from '@/config/site';

export interface FullProduct extends ProductRow {
  variants: VariantRow[];
  inventory_by_variant: Record<string, { quantity_on_hand: number; quantity_reserved: number; available: number }>;
  categories: CategoryRow[];
  reviews: ReviewRow[];
  average_rating: number;
  review_count: number;
  is_new_arrival?: boolean;
  is_trending?: boolean;
}

// -----------------------------------------------------------------------------
// Real Seed Catalog with Full Relational Model
// -----------------------------------------------------------------------------
export const FULL_SEED_CATALOG: FullProduct[] = [
  {
    id: 'prod_1',
    title: 'Heritage Cashmere Overcoat',
    slug: 'heritage-cashmere-overcoat',
    description: 'Masterfully tailored double-faced cashmere with bespoke horn buttons, pick-stitched lapels, and structured silhouette. Designed for effortless elegance in cold climates.',
    base_price: 495.0,
    price: 495.0,
    compare_at_price: 580.0,
    sku: 'A1-APP-001',
    inventory_quantity: 9,
    category_id: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    is_trending: true,
    metadata: {
      material: '100% Mongolian Cashmere',
      lining: 'Cupro Satin',
      care: 'Specialist Dry Clean Only',
      origin: 'Inner Mongolia & Milan Workshop',
    },
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-10-01T12:00:00Z',
    categories: [
      { id: 'cat_apparel', slug: 'apparel', name: 'Apparel', description: 'Tailored luxury garments', image_url: null, sort_order: 1, is_active: true, created_at: '', updated_at: '' },
    ],
    variants: [
      { id: 'var_1_s_charcoal', product_id: 'prod_1', title: 'Small / Charcoal', sku: 'A1-APP-001-S-CHR', price_override: null, attributes: { size: 'S', color: 'Charcoal' }, created_at: '', updated_at: '' },
      { id: 'var_1_m_charcoal', product_id: 'prod_1', title: 'Medium / Charcoal', sku: 'A1-APP-001-M-CHR', price_override: null, attributes: { size: 'M', color: 'Charcoal' }, created_at: '', updated_at: '' },
      { id: 'var_1_l_charcoal', product_id: 'prod_1', title: 'Large / Charcoal', sku: 'A1-APP-001-L-CHR', price_override: null, attributes: { size: 'L', color: 'Charcoal' }, created_at: '', updated_at: '' },
      { id: 'var_1_m_camel', product_id: 'prod_1', title: 'Medium / Camel Gold', sku: 'A1-APP-001-M-CML', price_override: 515.0, attributes: { size: 'M', color: 'Camel Gold' }, created_at: '', updated_at: '' },
    ],
    inventory_by_variant: {
      'var_1_s_charcoal': { quantity_on_hand: 3, quantity_reserved: 0, available: 3 },
      'var_1_m_charcoal': { quantity_on_hand: 5, quantity_reserved: 1, available: 4 },
      'var_1_l_charcoal': { quantity_on_hand: 2, quantity_reserved: 0, available: 2 },
      'var_1_m_camel': { quantity_on_hand: 1, quantity_reserved: 1, available: 0 }, // Out of stock
    },
    reviews: [
      { id: 'rev_1', product_id: 'prod_1', user_id: 'usr_el', reviewer_name: 'Eleanor Vance', rating: 5, review_text: 'The drape and softness of this cashmere is unmatched. The store owner personally verified my sleeve measurements before dispatch.', is_verified_purchase: true, is_approved: true, created_at: '2026-09-28T14:20:00Z', updated_at: '2026-09-28T14:20:00Z' },
      { id: 'rev_2', product_id: 'prod_1', user_id: 'usr_jh', reviewer_name: 'Julian Hayes', rating: 5, review_text: 'Sublime tailoring. Received prompt WhatsApp confirmation and received it in hand-packaged cotton wrap.', is_verified_purchase: true, is_approved: true, created_at: '2026-10-01T09:15:00Z', updated_at: '2026-10-01T09:15:00Z' },
    ],
    average_rating: 5.0,
    review_count: 2,
  },
  {
    id: 'prod_2',
    title: 'Artisan Full-Grain Leather Weekender',
    slug: 'artisan-leather-weekender',
    description: 'Hand-burnished vegetable-tanned Tuscan leather duffle with solid brass hardware, reinforced rolled handles, and water-resistant cotton twill lining.',
    base_price: 380.0,
    price: 380.0,
    compare_at_price: null,
    sku: 'A1-ACC-002',
    inventory_quantity: 6,
    category_id: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    is_trending: true,
    metadata: {
      leather: 'Vegetable-Tanned Tuscan Cowhide',
      hardware: 'Solid Antiqued Brass',
      dimensions: '52cm × 30cm × 25cm',
      origin: 'Florence Tannery & Local Leather Studio',
    },
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-25T12:00:00Z',
    categories: [
      { id: 'cat_acc', slug: 'accessories', name: 'Accessories', description: 'Handcrafted leather accents', image_url: null, sort_order: 2, is_active: true, created_at: '', updated_at: '' },
    ],
    variants: [
      { id: 'var_2_cognac', product_id: 'prod_2', title: 'Cognac Tan', sku: 'A1-ACC-002-CGN', price_override: null, attributes: { color: 'Cognac Tan' }, created_at: '', updated_at: '' },
      { id: 'var_2_black', product_id: 'prod_2', title: 'Midnight Black', sku: 'A1-ACC-002-BLK', price_override: null, attributes: { color: 'Midnight Black' }, created_at: '', updated_at: '' },
    ],
    inventory_by_variant: {
      'var_2_cognac': { quantity_on_hand: 4, quantity_reserved: 0, available: 4 },
      'var_2_black': { quantity_on_hand: 2, quantity_reserved: 0, available: 2 },
    },
    reviews: [
      { id: 'rev_3', product_id: 'prod_2', user_id: 'usr_mr', reviewer_name: 'Marcus Reed', rating: 5, review_text: 'The leather smells incredible and the patina after just two weeks is stunning. Outstanding heirloom quality.', is_verified_purchase: true, is_approved: true, created_at: '2026-09-29T16:00:00Z', updated_at: '2026-09-29T16:00:00Z' },
    ],
    average_rating: 5.0,
    review_count: 1,
  },
  {
    id: 'prod_3',
    title: 'Hand-Thrown Matte Stoneware Set',
    slug: 'hand-thrown-matte-stoneware-set',
    description: 'A 4-piece ceramic place setting individually thrown on the wheel and glazed with a tactile matte satin finish. Earthy, organic, and resilient.',
    base_price: 165.0,
    price: 165.0,
    compare_at_price: 195.0,
    sku: 'A1-HOM-003',
    inventory_quantity: 15,
    category_id: 'home-and-living',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    is_trending: false,
    metadata: {
      clay: 'High-Fire Stoneware Clay',
      glaze: 'Non-Toxic Food-Safe Matte Glaze',
      care: 'Dishwasher Safe, Microwave Safe',
      origin: 'Downtown Pottery Guild',
    },
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
    categories: [
      { id: 'cat_hom', slug: 'home-and-living', name: 'Home & Living', description: 'Artisan homeware and ceramics', image_url: null, sort_order: 3, is_active: true, created_at: '', updated_at: '' },
    ],
    variants: [
      { id: 'var_3_sand', product_id: 'prod_3', title: 'Speckled Sand', sku: 'A1-HOM-003-SND', price_override: null, attributes: { color: 'Speckled Sand' }, created_at: '', updated_at: '' },
      { id: 'var_3_basalt', product_id: 'prod_3', title: 'Matte Basalt', sku: 'A1-HOM-003-BST', price_override: null, attributes: { color: 'Matte Basalt' }, created_at: '', updated_at: '' },
    ],
    inventory_by_variant: {
      'var_3_sand': { quantity_on_hand: 8, quantity_reserved: 0, available: 8 },
      'var_3_basalt': { quantity_on_hand: 7, quantity_reserved: 0, available: 7 },
    },
    reviews: [
      { id: 'rev_4', product_id: 'prod_3', user_id: 'usr_cl', reviewer_name: 'Clara Oswald', rating: 5, review_text: 'Subtle variations make each piece feel unique and intentional. Beautiful daily ritual objects.', is_verified_purchase: true, is_approved: true, created_at: '2026-09-22T11:45:00Z', updated_at: '2026-09-22T11:45:00Z' },
    ],
    average_rating: 5.0,
    review_count: 1,
  },
  {
    id: 'prod_4',
    title: 'Solid Sterling Hammered Signet',
    slug: 'solid-sterling-hammered-signet',
    description: 'Forged from recycled 925 sterling silver with hand-applied hammer facets that catch the light with subtle elegance. Heavy, tactile, and designed to wear daily.',
    base_price: 140.0,
    price: 140.0,
    compare_at_price: null,
    sku: 'A1-JWL-004',
    inventory_quantity: 20,
    category_id: 'fine-jewelry',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_trending: true,
    metadata: {
      metal: 'Solid .925 Recycled Sterling Silver',
      finish: 'Satin Hammered with Polished Interior',
      hallmark: 'Individually Stamped A1 925',
    },
    created_at: '2026-09-20T10:00:00Z',
    updated_at: '2026-10-02T12:00:00Z',
    categories: [
      { id: 'cat_jwl', slug: 'fine-jewelry', name: 'Fine Jewelry', description: 'Precious metals and signets', image_url: null, sort_order: 4, is_active: true, created_at: '', updated_at: '' },
    ],
    variants: [
      { id: 'var_4_sz7', product_id: 'prod_4', title: 'Ring Size 7', sku: 'A1-JWL-004-SZ7', price_override: null, attributes: { size: 'Size 7' }, created_at: '', updated_at: '' },
      { id: 'var_4_sz8', product_id: 'prod_4', title: 'Ring Size 8', sku: 'A1-JWL-004-SZ8', price_override: null, attributes: { size: 'Size 8' }, created_at: '', updated_at: '' },
      { id: 'var_4_sz9', product_id: 'prod_4', title: 'Ring Size 9', sku: 'A1-JWL-004-SZ9', price_override: null, attributes: { size: 'Size 9' }, created_at: '', updated_at: '' },
      { id: 'var_4_sz10', product_id: 'prod_4', title: 'Ring Size 10', sku: 'A1-JWL-004-SZ10', price_override: null, attributes: { size: 'Size 10' }, created_at: '', updated_at: '' },
    ],
    inventory_by_variant: {
      'var_4_sz7': { quantity_on_hand: 6, quantity_reserved: 0, available: 6 },
      'var_4_sz8': { quantity_on_hand: 8, quantity_reserved: 0, available: 8 },
      'var_4_sz9': { quantity_on_hand: 6, quantity_reserved: 0, available: 6 },
      'var_4_sz10': { quantity_on_hand: 0, quantity_reserved: 0, available: 0 }, // Out of stock
    },
    reviews: [
      { id: 'rev_5', product_id: 'prod_4', user_id: 'usr_dn', reviewer_name: 'David Nichols', rating: 5, review_text: 'Substantial weight and the textured surface gives it real character. Perfect fit.', is_verified_purchase: true, is_approved: true, created_at: '2026-09-30T18:00:00Z', updated_at: '2026-09-30T18:00:00Z' },
    ],
    average_rating: 5.0,
    review_count: 1,
  },
  {
    id: 'prod_5',
    title: 'Hand-Spun Alpaca Fringe Scarf',
    slug: 'hand-spun-alpaca-fringe-scarf',
    description: 'Woven on wooden looms using undyed baby alpaca fiber. Soft, feather-light, and naturally thermal for transitional seasons.',
    base_price: 125.0,
    price: 125.0,
    compare_at_price: 150.0,
    sku: 'A1-APP-005',
    inventory_quantity: 11,
    category_id: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    is_trending: true,
    metadata: {
      material: '100% Peruvian Baby Alpaca',
      weave: 'Hand-Loomed Plain Weave',
      care: 'Hand Wash Cold or Dry Clean',
    },
    created_at: '2026-09-28T10:00:00Z',
    updated_at: '2026-10-02T12:00:00Z',
    categories: [
      { id: 'cat_apparel', slug: 'apparel', name: 'Apparel', description: 'Tailored luxury garments', image_url: null, sort_order: 1, is_active: true, created_at: '', updated_at: '' },
    ],
    variants: [
      { id: 'var_5_oatmeal', product_id: 'prod_5', title: 'Natural Oatmeal', sku: 'A1-APP-005-OAT', price_override: null, attributes: { color: 'Natural Oatmeal' }, created_at: '', updated_at: '' },
      { id: 'var_5_slate', product_id: 'prod_5', title: 'Slate Charcoal', sku: 'A1-APP-005-SLT', price_override: null, attributes: { color: 'Slate Charcoal' }, created_at: '', updated_at: '' },
    ],
    inventory_by_variant: {
      'var_5_oatmeal': { quantity_on_hand: 6, quantity_reserved: 0, available: 6 },
      'var_5_slate': { quantity_on_hand: 5, quantity_reserved: 0, available: 5 },
    },
    reviews: [],
    average_rating: 0,
    review_count: 0,
  },
  {
    id: 'prod_6',
    title: 'Full-Grain Minimalist Card Holder',
    slug: 'full-grain-card-holder',
    description: 'Laser-cut and hand-saddle-stitched card sleeve with 4 card slots and a central banknote pocket. Ultra-slim profile for modern pockets.',
    base_price: 75.0,
    price: 75.0,
    compare_at_price: null,
    sku: 'A1-ACC-006',
    inventory_quantity: 14,
    category_id: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    is_trending: false,
    metadata: {
      leather: 'Butter-Soft Badalassi Carlo Pueblo',
      thread: 'Waxed Linen Thread',
    },
    created_at: '2026-09-25T10:00:00Z',
    updated_at: '2026-10-01T12:00:00Z',
    categories: [
      { id: 'cat_acc', slug: 'accessories', name: 'Accessories', description: 'Handcrafted leather accents', image_url: null, sort_order: 2, is_active: true, created_at: '', updated_at: '' },
    ],
    variants: [
      { id: 'var_6_tobacco', product_id: 'prod_6', title: 'Tobacco Brown', sku: 'A1-ACC-006-TOB', price_override: null, attributes: { color: 'Tobacco Brown' }, created_at: '', updated_at: '' },
      { id: 'var_6_olive', product_id: 'prod_6', title: 'Forest Olive', sku: 'A1-ACC-006-OLV', price_override: null, attributes: { color: 'Forest Olive' }, created_at: '', updated_at: '' },
    ],
    inventory_by_variant: {
      'var_6_tobacco': { quantity_on_hand: 8, quantity_reserved: 0, available: 8 },
      'var_6_olive': { quantity_on_hand: 6, quantity_reserved: 0, available: 6 },
    },
    reviews: [],
    average_rating: 0,
    review_count: 0,
  },
  {
    id: 'prod_7',
    title: 'Botanical Amber Glass Pouring Vessel',
    slug: 'amber-glass-pouring-vessel',
    description: 'Mouth-blown heat-resistant borosilicate glass carafe with a polished walnut collar. Ideal for pour-over coffee or bespoke botanical infusions.',
    base_price: 85.0,
    price: 85.0,
    compare_at_price: null,
    sku: 'A1-HOM-007',
    inventory_quantity: 8,
    category_id: 'home-and-living',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    is_featured: false,
    is_new_arrival: false,
    is_trending: true,
    metadata: {
      capacity: '650 ml',
      wood: 'Sustainably Harvested American Walnut',
      glass: 'Heat-Tolerant Borosilicate',
    },
    created_at: '2026-09-12T10:00:00Z',
    updated_at: '2026-09-26T12:00:00Z',
    categories: [
      { id: 'cat_hom', slug: 'home-and-living', name: 'Home & Living', description: 'Artisan homeware and ceramics', image_url: null, sort_order: 3, is_active: true, created_at: '', updated_at: '' },
    ],
    variants: [
      { id: 'var_7_amber', product_id: 'prod_7', title: 'Amber Tint', sku: 'A1-HOM-007-AMB', price_override: null, attributes: { color: 'Amber Tint' }, created_at: '', updated_at: '' },
      { id: 'var_7_clear', product_id: 'prod_7', title: 'Smoked Smoke', sku: 'A1-HOM-007-SMK', price_override: null, attributes: { color: 'Smoked Smoke' }, created_at: '', updated_at: '' },
    ],
    inventory_by_variant: {
      'var_7_amber': { quantity_on_hand: 5, quantity_reserved: 0, available: 5 },
      'var_7_clear': { quantity_on_hand: 3, quantity_reserved: 0, available: 3 },
    },
    reviews: [],
    average_rating: 0,
    review_count: 0,
  },
  {
    id: 'prod_8',
    title: 'Solid Brass Heavy Signet Band',
    slug: 'solid-brass-heavy-signet-band',
    description: 'Hand-milled untreated raw brass signet designed to develop a rich, personal patina over years of wear.',
    base_price: 95.0,
    price: 95.0,
    compare_at_price: 110.0,
    sku: 'A1-JWL-008',
    inventory_quantity: 12,
    category_id: 'fine-jewelry',
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=80',
    ],
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    is_trending: false,
    metadata: {
      metal: 'Pure Unlacquered Jeweler Brass',
      finish: 'Brushed Raw',
    },
    created_at: '2026-09-29T10:00:00Z',
    updated_at: '2026-10-02T12:00:00Z',
    categories: [
      { id: 'cat_jwl', slug: 'fine-jewelry', name: 'Fine Jewelry', description: 'Precious metals and signets', image_url: null, sort_order: 4, is_active: true, created_at: '', updated_at: '' },
    ],
    variants: [
      { id: 'var_8_sz8', product_id: 'prod_8', title: 'Size 8', sku: 'A1-JWL-008-SZ8', price_override: null, attributes: { size: 'Size 8' }, created_at: '', updated_at: '' },
      { id: 'var_8_sz9', product_id: 'prod_8', title: 'Size 9', sku: 'A1-JWL-008-SZ9', price_override: null, attributes: { size: 'Size 9' }, created_at: '', updated_at: '' },
    ],
    inventory_by_variant: {
      'var_8_sz8': { quantity_on_hand: 7, quantity_reserved: 0, available: 7 },
      'var_8_sz9': { quantity_on_hand: 5, quantity_reserved: 0, available: 5 },
    },
    reviews: [],
    average_rating: 0,
    review_count: 0,
  },
];

// Alias for SEED_PRODUCTS compatibility
export const SEED_PRODUCTS: ProductRow[] = FULL_SEED_CATALOG;

// -----------------------------------------------------------------------------
// Catalog Query Actions
// -----------------------------------------------------------------------------
export async function getProducts(options?: {
  categorySlug?: string;
  query?: string;
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'trending';
  limit?: number;
  offset?: number;
}): Promise<ActionResponse<{ products: FullProduct[]; totalCount: number }>> {
  try {
    let items = [...FULL_SEED_CATALOG];

    // Filter by Category
    if (options?.categorySlug && options.categorySlug !== 'all') {
      const slug = options.categorySlug.toLowerCase();
      items = items.filter((p) => p.category_id === slug || p.categories.some((c) => c.slug === slug));
    }

    // Filter by Search Query
    if (options?.query && options.query.trim()) {
      const q = options.query.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categories.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    // Sorting
    const sort = options?.sortBy || 'featured';
    if (sort === 'price_asc') {
      items.sort((a, b) => a.base_price - b.base_price);
    } else if (sort === 'price_desc') {
      items.sort((a, b) => b.base_price - a.base_price);
    } else if (sort === 'newest') {
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'trending') {
      items.sort((a, b) => (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0));
    } else {
      // featured first
      items.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    const totalCount = items.length;

    // Pagination offset & limit
    if (options?.offset !== undefined && options?.limit !== undefined) {
      items = items.slice(options.offset, options.offset + options.limit);
    } else if (options?.limit) {
      items = items.slice(0, options.limit);
    }

    return { success: true, data: { products: items, totalCount } };
  } catch (error: any) {
    logger.error('Failed to get products', error);
    return {
      success: false,
      error: { message: error.message || 'Failed to retrieve products', code: 'PRODUCT_FETCH_ERROR' },
    };
  }
}

export async function getFullProductBySlug(slug: string): Promise<ActionResponse<FullProduct | null>> {
  try {
    const found = FULL_SEED_CATALOG.find((p) => p.slug === slug) || null;
    return { success: true, data: found };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'Product query failed', code: 'PRODUCT_NOT_FOUND' },
    };
  }
}

export async function getProductBySlug(slug: string): Promise<ActionResponse<ProductRow | null>> {
  const res = await getFullProductBySlug(slug);
  if (res.success) {
    return { success: true, data: res.data };
  }
  return { success: false, error: res.error };
}

export async function getFeaturedProducts(limit = 4): Promise<ActionResponse<FullProduct[]>> {
  const featured = FULL_SEED_CATALOG.filter((p) => p.is_featured).slice(0, limit);
  return { success: true, data: featured };
}

export async function getNewArrivals(limit = 4): Promise<ActionResponse<FullProduct[]>> {
  const newArrivals = FULL_SEED_CATALOG.filter((p) => p.is_new_arrival).slice(0, limit);
  return { success: true, data: newArrivals };
}

export async function getTrendingProducts(limit = 4): Promise<ActionResponse<FullProduct[]>> {
  const trending = FULL_SEED_CATALOG.filter((p) => p.is_trending).slice(0, limit);
  return { success: true, data: trending };
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<ActionResponse<FullProduct[]>> {
  const related = FULL_SEED_CATALOG.filter((p) => p.id !== productId && p.category_id === categoryId).slice(0, limit);
  if (related.length === 0) {
    // Fallback to any other product
    return {
      success: true,
      data: FULL_SEED_CATALOG.filter((p) => p.id !== productId).slice(0, limit),
    };
  }
  return { success: true, data: related };
}
