import { OrderStatus, PaymentMode } from '@/config/site';
import { ProductRow, CategoryRow, OrderRow, OrderItemRow } from './database';

export * from './database';

export interface CartItem {
  productId: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

export interface ManualConfirmationCheckoutInput {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  preferredContactMethod: 'phone' | 'whatsapp' | 'email';
  deliveryTimePreference?: string;
  orderNotes?: string;
}

export interface UserSession {
  id: string;
  email: string;
  role: 'customer' | 'admin' | 'staff';
  fullName?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}
