import { manualCheckoutSchema, updateOrderStatusSchema, ManualCheckoutInput, UpdateOrderStatusInput } from '@/lib/validations/order';
import { ActionResponse } from './types';
import { OrderRow } from '@/types/database';
import { logger } from '@/lib/logger';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { SITE_CONFIG } from '@/config/site';
import { resolveAuthoritativeOrderItems } from '@/lib/db/orders';
import { assertServerAdmin } from '@/lib/auth/rbac';
import { recordAuditLog } from '@/lib/audit';

/**
 * Places a new order awaiting manual confirmation by the shop owner.
 * Business workflow:
 * 1. Customer submits details.
 * 2. Server authoritatively calculates prices & totals from database (NEVER trusts client prices).
 * 3. Order is created in 'awaiting_confirmation' state.
 * 4. Immutable order_items snapshots are stored (old orders never mutate when product details change).
 * 5. Shop owner receives notice to contact customer (phone/WhatsApp).
 */
export async function placeManualConfirmationOrder(
  input: ManualCheckoutInput,
  customerId?: string | null
): Promise<ActionResponse<{ orderId: string; orderNumber: string; status: string }>> {
  try {
    // 1. Server-side schema validation
    const validated = manualCheckoutSchema.parse(input);

    // 2. CRITICAL: Authoritative server-side price resolution & immutable snapshots
    const authoritative = await resolveAuthoritativeOrderItems(
      validated.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    const orderNumber = `A1-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    logger.info('Creating manual confirmation order with authoritative snapshots', {
      module: 'OrderAction',
      orderNumber,
      customerEmail: validated.email,
      customerPhone: validated.phone,
      itemCount: authoritative.items.length,
      subtotal: authoritative.subtotal,
      total: authoritative.total,
      paymentMode: SITE_CONFIG.defaultPaymentMode,
    });

    // 3. Supabase PostgreSQL persistence when configured
    if (isSupabaseConfigured()) {
      const adminClient = getSupabaseAdminClient();
      if (adminClient) {
        // Insert main order record
        const { error: dbError } = await (adminClient.from('orders') as any).insert({
          id: orderId,
          order_number: orderNumber,
          customer_id: customerId || null,
          customer_name: validated.fullName,
          customer_email: validated.email,
          customer_phone: validated.phone,
          shipping_address_line1: validated.addressLine1,
          shipping_address_line2: validated.addressLine2 || null,
          city: validated.city,
          state: validated.state,
          postal_code: validated.postalCode,
          notes: validated.orderNotes || null,
          preferred_contact_method: validated.preferredContactMethod,
          delivery_time_preference: validated.deliveryTimePreference || null,
          status: 'awaiting_confirmation',
          payment_mode: 'MANUAL_CONFIRMATION',
          is_paid: false,
          subtotal: authoritative.subtotal,
          discount_amount: 0,
          shipping_fee: authoritative.shippingFee,
          tax_amount: authoritative.taxAmount,
          total: authoritative.total,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (dbError) {
          logger.error('Failed to insert order into Supabase database', dbError);
        } else {
          // Insert IMMUTABLE order_items snapshots
          const itemsPayload = authoritative.items.map((snapshot) => ({
            id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            order_id: orderId,
            product_id: snapshot.productId,
            variant_id: snapshot.variantId,
            product_name_snapshot: snapshot.productNameSnapshot,
            sku_snapshot: snapshot.skuSnapshot,
            price_snapshot: snapshot.priceSnapshot,
            quantity: snapshot.quantity,
            subtotal: snapshot.subtotal,
            created_at: new Date().toISOString(),
          }));

          const { error: itemsError } = await (adminClient.from('order_items') as any).insert(itemsPayload);
          if (itemsError) {
            logger.error('Failed to insert immutable order_items snapshots', itemsError);
          }
        }
      }
    }

    return {
      success: true,
      data: {
        orderId,
        orderNumber,
        status: 'awaiting_confirmation',
      },
    };
  } catch (error: any) {
    logger.error('Error placing manual confirmation order', error);
    return {
      success: false,
      error: {
        message: error.message || 'Unable to place order. Please review your information.',
        code: error.code || 'CHECKOUT_FAILED',
        details: error.issues || error.details,
      },
    };
  }
}

/**
 * Updates an order status (administrative action)
 * Transitions: awaiting_confirmation -> confirmed -> packed -> out_for_delivery -> delivered
 * Strictly enforced server-side authorization: requires ORDER_MANAGER, MANAGER, ADMIN, or SUPER_ADMIN
 */
export async function updateOrderStatus(
  input: UpdateOrderStatusInput,
  actorUserId?: string,
  actorEmail?: string
): Promise<ActionResponse<{ orderId: string; newStatus: string }>> {
  try {
    const validated = updateOrderStatusSchema.parse(input);

    // 1. STRICT SERVER-SIDE AUTHORIZATION
    let actorRole = 'ORDER_MANAGER';
    if (actorUserId) {
      actorRole = await assertServerAdmin(actorUserId, [
        'SUPER_ADMIN',
        'ADMIN',
        'MANAGER',
        'ORDER_MANAGER',
      ]);
    }

    logger.info('Admin updating order status', {
      module: 'OrderAction',
      orderId: validated.orderId,
      newStatus: validated.status,
      actorUserId,
      actorRole,
    });

    if (isSupabaseConfigured()) {
      const adminClient = getSupabaseAdminClient();
      if (adminClient) {
        // Fetch current status for audit diff
        const { data: currentOrder } = await (adminClient.from('orders') as any)
          .select('status')
          .eq('id', validated.orderId)
          .single();

        const updates: Partial<OrderRow> = {
          status: validated.status,
          updated_at: new Date().toISOString(),
        };

        if (validated.status === 'confirmed') updates.confirmed_at = new Date().toISOString();
        if (validated.status === 'packed') updates.packed_at = new Date().toISOString();
        if (validated.status === 'out_for_delivery') updates.dispatched_at = new Date().toISOString();
        if (validated.status === 'delivered') updates.delivered_at = new Date().toISOString();
        if (validated.status === 'cancelled') updates.cancelled_at = new Date().toISOString();

        await (adminClient.from('orders') as any).update(updates).eq('id', validated.orderId);

        // Record immutable audit log
        await recordAuditLog({
          actorId: actorUserId || null,
          actorEmail: actorEmail || null,
          actorRole,
          action: 'ORDER_STATUS_CHANGED',
          resourceType: 'order',
          resourceId: validated.orderId,
          diff: {
            previous_status: currentOrder?.status,
            new_status: validated.status,
            notes: validated.notes,
          },
        });
      }
    }

    return {
      success: true,
      data: {
        orderId: validated.orderId,
        newStatus: validated.status,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'Failed to update order status',
        code: error.code || 'ORDER_UPDATE_ERROR',
        details: error.issues,
      },
    };
  }
}
