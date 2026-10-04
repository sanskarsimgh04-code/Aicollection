import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { SEED_PRODUCTS } from '@/actions/products';
import { OrderItemRow } from '@/types/database';

export interface RawOrderItemRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface AuthoritativeOrderSnapshot {
  items: Array<{
    productId: string;
    variantId: string | null;
    productNameSnapshot: string;
    skuSnapshot: string;
    priceSnapshot: number;
    quantity: number;
    subtotal: number;
  }>;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
}

/**
 * Resolves authoritative order prices directly from database/catalog.
 * NEVER trusts client-supplied prices!
 * Guarantees immutable snapshots for order_items.
 */
export async function resolveAuthoritativeOrderItems(
  requestedItems: RawOrderItemRequest[]
): Promise<AuthoritativeOrderSnapshot> {
  if (!requestedItems || requestedItems.length === 0) {
    throw new ValidationError('An order must contain at least one item');
  }

  const adminClient = getSupabaseAdminClient();
  const snapshots: AuthoritativeOrderSnapshot['items'] = [];
  let calculatedSubtotal = 0;

  for (const item of requestedItems) {
    if (!item.productId) {
      throw new ValidationError('Invalid product ID in order request');
    }
    if (!item.quantity || item.quantity <= 0) {
      throw new ValidationError(`Quantity for product ${item.productId} must be greater than zero`);
    }

    let productTitle = '';
    let productSku = '';
    let authoritativePrice = 0;

    // 1. Fetch from Supabase database when configured
    if (isSupabaseConfigured() && adminClient) {
      const { data: product, error } = await (adminClient.from('products') as any)
        .select('id, title, sku, base_price, is_active')
        .eq('id', item.productId)
        .single();

      if (error || !product || !product.is_active) {
        throw new NotFoundError('Product', item.productId);
      }

      productTitle = product.title;
      productSku = product.sku;
      authoritativePrice = Number(product.base_price);

      // Check variant price override if variantId is provided
      if (item.variantId) {
        const { data: variant } = await (adminClient.from('variants') as any)
          .select('title, sku, price_override')
          .eq('id', item.variantId)
          .eq('product_id', item.productId)
          .single();

        if (variant) {
          productTitle = `${productTitle} - ${variant.title}`;
          productSku = variant.sku;
          if (variant.price_override !== null && variant.price_override !== undefined) {
            authoritativePrice = Number(variant.price_override);
          }
        }
      }
    } else {
      // Fallback to verified seed catalog in local environment
      const seedProduct = SEED_PRODUCTS.find((p) => p.id === item.productId);
      if (!seedProduct || !seedProduct.is_active) {
        throw new NotFoundError('Product', item.productId);
      }

      productTitle = seedProduct.title;
      productSku = seedProduct.sku;
      authoritativePrice = seedProduct.price;
    }

    const itemSubtotal = Number((authoritativePrice * item.quantity).toFixed(2));
    calculatedSubtotal += itemSubtotal;

    // Create immutable snapshot
    snapshots.push({
      productId: item.productId,
      variantId: item.variantId || null,
      productNameSnapshot: productTitle,
      skuSnapshot: productSku,
      priceSnapshot: authoritativePrice,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  const shippingFee = 0.00; // Complimentary local delivery
  const taxAmount = 0.00;
  const total = Number((calculatedSubtotal + shippingFee + taxAmount).toFixed(2));

  return {
    items: snapshots,
    subtotal: calculatedSubtotal,
    shippingFee,
    taxAmount,
    total,
  };
}
