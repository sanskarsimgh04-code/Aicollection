/**
 * Supabase Database Type Definitions
 * Normalized Relational Schema for A1 Collection
 */

import { OrderStatus, PaymentMode } from '@/config/site';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'ORDER_MANAGER'
  | 'CONTENT_MANAGER';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<ProfileRow, 'id'>>;
      };
      admin_users: {
        Row: AdminUserRow;
        Insert: Omit<AdminUserRow, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<AdminUserRow, 'id'>>;
      };
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<CategoryRow, 'id'>>;
      };
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<ProductRow, 'id'>>;
      };
      product_categories: {
        Row: ProductCategoryRow;
        Insert: ProductCategoryRow;
        Update: Partial<ProductCategoryRow>;
      };
      product_images: {
        Row: ProductImageRow;
        Insert: Omit<ProductImageRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<ProductImageRow, 'id'>>;
      };
      variants: {
        Row: VariantRow;
        Insert: Omit<VariantRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<VariantRow, 'id'>>;
      };
      inventory: {
        Row: InventoryRow;
        Insert: Omit<InventoryRow, 'id' | 'updated_at'> & { id?: string; updated_at?: string };
        Update: Partial<Omit<InventoryRow, 'id'>>;
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<OrderRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<OrderRow, 'id'>>;
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Omit<OrderItemRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<OrderItemRow, 'id'>>;
      };
      reviews: {
        Row: ReviewRow;
        Insert: Omit<ReviewRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<ReviewRow, 'id'>>;
      };
      coupons: {
        Row: CouponRow;
        Insert: Omit<CouponRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<CouponRow, 'id'>>;
      };
      cms_content: {
        Row: CMSContentRow;
        Insert: Omit<CMSContentRow, 'id' | 'updated_at'> & { id?: string; updated_at?: string };
        Update: Partial<Omit<CMSContentRow, 'id'>>;
      };
      settings: {
        Row: SettingRow;
        Insert: Omit<SettingRow, 'id' | 'updated_at'> & { id?: string; updated_at?: string };
        Update: Partial<Omit<SettingRow, 'id'>>;
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: Omit<AuditLogRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: never; // Audit logs are strictly immutable (append-only)
      };
    };
  };
}

export interface ProfileRow {
  id: string; // references auth.users(id)
  email: string;
  full_name: string | null;
  phone: string | null;
  default_shipping_address: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserRow {
  id: string; // references auth.users(id)
  role: AdminRole;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  base_price: number;
  price: number; // Canonical price accessor
  compare_at_price: number | null;
  sku: string;
  is_active: boolean;
  is_featured: boolean;
  category_id: string; // Associated primary category
  images: string[]; // Associated image URLs
  inventory_quantity: number; // Aggregated on-hand inventory
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProductCategoryRow {
  product_id: string;
  category_id: string;
  created_at?: string;
}

export interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface VariantRow {
  id: string;
  product_id: string;
  title: string;
  sku: string;
  price_override: number | null;
  attributes: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface InventoryRow {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity_on_hand: number;
  quantity_reserved: number;
  low_stock_threshold: number;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  preferred_contact_method: 'phone' | 'whatsapp' | 'email';
  delivery_time_preference: string | null;
  notes: string | null;
  status: OrderStatus;
  payment_mode: PaymentMode;
  is_paid: boolean;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  tax_amount: number;
  total: number;
  confirmed_at: string | null;
  packed_at: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Immutable Order Item Snapshot
 * Guaranteed to never mutate when product details or prices change
 */
export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name_snapshot: string;
  sku_snapshot: string;
  price_snapshot: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface ReviewRow {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  reviewer_name: string;
  review_text: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponRow {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  value: number;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  usage_limit: number | null;
  times_used: number;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CMSContentRow {
  id: string;
  key: string;
  section: string;
  content: Record<string, unknown>;
  is_published: boolean;
  updated_by: string | null;
  updated_at: string;
}

export interface SettingRow {
  id: string;
  key: string;
  category: 'store' | 'contact' | 'checkout' | 'shipping' | 'tax' | 'homepage' | 'seo';
  value: Record<string, unknown>;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

export interface AuditLogRow {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  actor_role: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  diff: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
