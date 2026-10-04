/**
 * Checks whether Supabase connection parameters are provided.
 */
export function isSupabaseConfigured(): boolean {
  const url =
    (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    undefined;
  const anonKey =
    (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) ||
    undefined;

  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);
}

export function isSupabaseAdminConfigured(): boolean {
  const url =
    (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    undefined;
  const serviceKey =
    (typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) || undefined;

  return Boolean(url && serviceKey && url.startsWith('http') && serviceKey.length > 10);
}
