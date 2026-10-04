import { z } from 'zod';

export const paymentModeSchema = z.enum(['MANUAL_CONFIRMATION', 'ONLINE_PAYMENT', 'BOTH']);

export const orderStatusSchema = z.enum([
  'awaiting_confirmation',
  'confirmed',
  'packed',
  'out_for_delivery',
  'delivered',
  'cancelled',
]);

export const orderItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  title: z.string().min(1, 'Product title is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  unitPrice: z.number().nonnegative('Unit price must be non-negative'),
});

export const manualCheckoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  phone: z
    .string()
    .trim()
    .min(7, 'Please provide a valid phone number for confirmation')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Invalid phone number format'),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address for order notifications'),
  addressLine1: z
    .string()
    .trim()
    .min(5, 'Delivery address is required')
    .max(150, 'Address is too long'),
  addressLine2: z.string().trim().max(100).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City is required').max(80),
  state: z.string().trim().min(2, 'State or Province is required').max(80),
  postalCode: z.string().trim().min(2, 'Postal code is required').max(20),
  preferredContactMethod: z.enum(['phone', 'whatsapp', 'email']).default('whatsapp'),
  deliveryTimePreference: z.string().trim().max(100).optional().or(z.literal('')),
  orderNotes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional().or(z.literal('')),
  items: z.array(orderItemInputSchema).min(1, 'Order must contain at least one item'),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  status: orderStatusSchema,
  notes: z.string().max(300).optional(),
});

export type ManualCheckoutInput = z.infer<typeof manualCheckoutSchema>;
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
