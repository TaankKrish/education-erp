import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';
import { env, isSupabaseConfigured } from '@/lib/validations/env';

/**
 * Creates a server-side Supabase client for Server Components, Server Actions, and Route Handlers.
 * Handles reading and writing session cookies securely.
 */
export async function createClient() {
  const cookieStore = await cookies();

  if (!isSupabaseConfigured()) {
    console.warn(
      '[Supabase Server] Supabase credentials are not configured. Running in unconfigured/mock mode.',
    );
  }

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    },
  );
}

/**
 * Creates an administrative Supabase client using the SERVICE ROLE key.
 * CAUTION: Bypasses Row Level Security (RLS). Use exclusively in trusted backend
 * workflows, such as webhook processing or initial tenant provisioning.
 */
export async function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.');
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignored from Server Component context
          }
        },
      },
    },
  );
}
