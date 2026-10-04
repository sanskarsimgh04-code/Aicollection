import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { isSupabaseConfigured } from './status';
import { logger } from '@/lib/logger';

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Creates or retrieves the singleton client-side Supabase instance.
 * Safe against missing environment variables: returns null if not configured
 * so calling code can gracefully handle unconfigured state without throwing fatal runtime errors.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (browserClient) return browserClient;

  if (!isSupabaseConfigured()) {
    logger.warn('Supabase browser credentials are not configured in environment variables.');
    return null;
  }

  const supabaseUrl =
    (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) || '';
  const supabaseAnonKey =
    (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) || '';

  try {
    browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return browserClient;
  } catch (err) {
    logger.error('Failed to initialize Supabase browser client', err);
    return null;
  }
}
