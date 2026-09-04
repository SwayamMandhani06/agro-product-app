import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV, isBackendConfigured } from '@/lib/config/env';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns the Supabase browser client if configured.
 * Returns null if running in mock-only mode without environment credentials.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isBackendConfigured()) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseInstance;
}
