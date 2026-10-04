import { manualCheckoutSchema, updateOrderStatusSchema, ManualCheckoutInput, UpdateOrderStatusInput } from '@/lib/validations/order';
import { ActionResponse } from './types';
import { OrderRow } from '@/types/database';
import { logger } from '@/lib/logger';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/status';
import { SITE_CONFIG } from '@/config/site';

/**
 * Places a new order awaiting manual confirmation by the shop owner.
 * Business workflow:
 * 1. Customer submits details.
 * 2. Order is created in 'awaiting_confirmation' state.
 * 3. Shop owner receives notice to contact customer (phone/WhatsApp).
 * 4. Confirmed -> Packed -> Out for delivery -> Delivered.
 */
export async function placeManualConfirmationOrder(
  input: ManualCheckoutInput
): Promise<ActionResponse<{ orderId: string; orderNumber: string; status: string }>> {
  try {
    // 1. Server-side schema validation
    const validated = manualCheckoutSchema.parse(input);

    // 2. Calculate totals from items
    const subtotal = validated.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const shippingFee = 0; // Local delivery / pickup policy
    const total = subtotal + shippingFee;

    const orderNumber = `A1-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    logger.info('Creating manual confirmation order', {
      module: 'OrderAction',
      orderNumber,
      customerEmail: validated.email,
      customerPhone: validated.phone,
      itemCount: validated.items.length,
      total,
      paymentMode: SITE_CONFIG.defaultPaymentMode,
    });

    // 3. Supabase integration when configured
    if (isSupabaseConfigured()) {
      const adminClient = getSupabaseAdminClient();
      if (adminClient) {
        const { error: dbError } = await (adminClient.from('orders') as any).insert({
          id: orderId,
          order_number: orderNumber,
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
          subtotal,
          discount_amount: 0,
          shipping_fee: shippingFee,
          total,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (dbError) {
          logger.error('Failed to insert order into Supabase database', dbError);
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
 * Updates an order status (admin action)
 * Transitions: awaiting_confirmation -> confirmed -> packed -> out_for_delivery -> delivered
 */
export async function updateOrderStatus(
  input: UpdateOrderStatusInput
): Promise<ActionResponse<{ orderId: string; newStatus: string }>> {
  try {
    const validated = updateOrderStatusSchema.parse(input);

    logger.info('Admin updating order status', {
      module: 'OrderAction',
      orderId: validated.orderId,
      newStatus: validated.status,
    });

    if (isSupabaseConfigured()) {
      const adminClient = getSupabaseAdminClient();
      if (adminClient) {
        const updates: Partial<OrderRow> = {
          status: validated.status,
          updated_at: new Date().toISOString(),
        };

        if (validated.status === 'confirmed') updates.confirmed_at = new Date().toISOString();
        if (validated.status === 'packed') updates.packed_at = new Date().toISOString();
        if (validated.status === 'out_for_delivery') updates.dispatched_at = new Date().toISOString();
        if (validated.status === 'delivered') updates.delivered_at = new Date().toISOString();

        await (adminClient.from('orders') as any).update(updates).eq('id', validated.orderId);
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
        code: 'ORDER_UPDATE_ERROR',
        details: error.issues,
      },
    };
  }
}
