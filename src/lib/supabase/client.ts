import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';
import { env, isSupabaseConfigured } from '@/lib/validations/env';

/**
 * Creates a browser-side Supabase client with typed schema.
 * Reuses the singleton instance in the browser.
 */
let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (!isSupabaseConfigured()) {
    console.warn(
      '[Supabase Client] Supabase credentials are not configured. Running in unconfigured/mock mode.',
    );
  }

  if (typeof window !== 'undefined' && clientInstance) {
    return clientInstance;
  }

  const client = createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  );

  if (typeof window !== 'undefined') {
    clientInstance = client;
  }

  return client;
}
