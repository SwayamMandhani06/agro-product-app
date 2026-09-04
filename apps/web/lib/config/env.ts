/**
 * AgriTrade Web Environment Configuration
 * 
 * Provides type-safe access to environment variables with fallback detection.
 */
export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  APP_ENV: process.env.NODE_ENV ?? 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

/**
 * Checks whether valid Supabase credentials have been configured.
 * When false, the application gracefully operates in high-fidelity mock mode.
 */
export function isBackendConfigured(): boolean {
  return Boolean(
    ENV.SUPABASE_URL &&
    ENV.SUPABASE_ANON_KEY &&
    !ENV.SUPABASE_URL.includes('your-project-id')
  );
}
