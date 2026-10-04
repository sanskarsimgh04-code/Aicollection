/**
 * Supabase Database Type Definitions
 * Maps 1:1 to PostgreSQL tables for A1 Collection
 */

import { OrderStatus, PaymentMode } from '@/config/site';

export interface Database {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<ProductRow, 'id'>>;
      };
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<CategoryRow, 'id'>>;
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<OrderRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<OrderRow, 'id'>>;
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Omit<OrderItemRow, 'id'> & { id?: string };
        Update: Partial<Omit<OrderItemRow, 'id'>>;
      };
      customers: {
        Row: CustomerRow;
        Insert: Omit<CustomerRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<CustomerRow, 'id'>>;
      };
      coupons: {
        Row: CouponRow;
        Insert: Omit<CouponRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<CouponRow, 'id'>>;
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: Omit<AuditLogRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<AuditLogRow, 'id'>>;
      };
    };
  };
}

export interface ProductRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  sku: string;
  inventory_quantity: number;
  category_id: string;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
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
  notes: string | null;
  preferred_contact_method: 'phone' | 'whatsapp' | 'email';
  delivery_time_preference: string | null;
  status: OrderStatus;
  payment_mode: PaymentMode;
  is_paid: boolean;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total: number;
  confirmed_at: string | null;
  packed_at: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  title: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface CustomerRow {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  total_orders_count: number;
  created_at: string;
}

export interface CouponRow {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  value: number;
  min_order_amount: number | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  actor_id: string | null;
  actor_role: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}
