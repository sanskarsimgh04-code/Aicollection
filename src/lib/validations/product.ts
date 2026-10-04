import { z } from 'zod';

export const productFilterSchema = z.object({
  category: z.string().optional(),
  query: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'featured']).default('featured'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(120),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});

export const searchParamsSchema = z.object({
  q: z.string().trim().min(1, 'Search query cannot be empty').max(100),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export type ProductFilterInput = z.infer<typeof productFilterSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type SearchParamsInput = z.infer<typeof searchParamsSchema>;
