import { z } from 'zod';

/**
 * Server-side Environment Variables Schema
 * Contains all secrets - NEVER import this file in client-side components!
 */
export const serverEnvSchema = z.object({
  APP_URL: z.string().url().default('http://localhost:3000'),
  PAYMENT_MODE: z.enum(['MANUAL_CONFIRMATION', 'ONLINE_PAYMENT', 'BOTH']).default('MANUAL_CONFIRMATION'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional(),
  GEMINI_API_KEY: z.string().optional(),
});

/**
 * Client-safe Environment Variables Schema
 * Only contains public, non-sensitive variables.
 */
export const clientEnvSchema = z.object({
  APP_URL: z.string().default('http://localhost:3000'),
  PAYMENT_MODE: z.enum(['MANUAL_CONFIRMATION', 'ONLINE_PAYMENT', 'BOTH']).default('MANUAL_CONFIRMATION'),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validates and returns client-safe environment variables.
 * Safe to call anywhere in the application.
 */
export function getClientEnv(): ClientEnv {
  const rawClientEnv = {
    APP_URL:
      (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_APP_URL || process.env?.VITE_APP_URL || process.env?.APP_URL)) ||
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
    PAYMENT_MODE:
      (typeof process !== 'undefined' && (process.env?.VITE_PAYMENT_MODE || process.env?.PAYMENT_MODE)) ||
      'MANUAL_CONFIRMATION',
    SUPABASE_URL:
      (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_URL || process.env?.VITE_SUPABASE_URL)) ||
      undefined,
    SUPABASE_ANON_KEY:
      (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY)) ||
      undefined,
  };

  const parsed = clientEnvSchema.safeParse(rawClientEnv);
  if (!parsed.success) {
    console.error('Invalid client environment configuration:', parsed.error.format());
    return {
      APP_URL: 'http://localhost:3000',
      PAYMENT_MODE: 'MANUAL_CONFIRMATION',
    };
  }

  return parsed.data;
}

/**
 * Validates and returns server environment variables.
 * Call only from server-side code (Express server, server actions, route handlers).
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL: Attempted to access server environment variables from browser client context.');
  }

  const rawServerEnv = {
    APP_URL: process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    PAYMENT_MODE: (process.env.PAYMENT_MODE as any) || 'MANUAL_CONFIRMATION',
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    EMAIL_PROVIDER_API_KEY: process.env.EMAIL_PROVIDER_API_KEY,
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  };

  const parsed = serverEnvSchema.safeParse(rawServerEnv);
  if (!parsed.success) {
    console.warn('Server environment warnings:', parsed.error.format());
    return rawServerEnv as ServerEnv;
  }

  return parsed.data;
}
