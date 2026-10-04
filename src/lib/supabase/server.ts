import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { isSupabaseAdminConfigured, isSupabaseConfigured } from './status';
import { logger } from '@/lib/logger';
import { UnauthorizedError } from '@/lib/errors';

/**
 * Creates an admin/service-role Supabase client with elevated database privileges.
 * STRICT: Only executable on server-side.
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> | null {
  if (typeof window !== 'undefined') {
    throw new UnauthorizedError('Service role client cannot be instantiated in client-side environment');
  }

  if (!isSupabaseAdminConfigured()) {
    logger.warn('Supabase service role credentials not configured on server.');
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  try {
    return createClient<Database>(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch (err) {
    logger.error('Failed to initialize Supabase admin client', err);
    return null;
  }
}

/**
 * Creates a server-side Supabase client scoped to an authenticated user's access token.
 */
export function getSupabaseServerClient(accessToken?: string): SupabaseClient<Database> | null {
  if (typeof window !== 'undefined') {
    throw new UnauthorizedError('Server client cannot be instantiated in client-side context');
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  try {
    return createClient<Database>(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      },
    });
  } catch (err) {
    logger.error('Failed to initialize Supabase server client', err);
    return null;
  }
}
