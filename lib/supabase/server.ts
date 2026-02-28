import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
      const cookieStore = await cookies()

      return createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                  cookies: {
                        get(name: string) {
                              return cookieStore.get(name)?.value
                        },
                        set(name: string, value: string, options: CookieOptions) {
                              try {
                                    cookieStore.set({ name, value, ...options })
                              } catch (error) {
                                    // The `set` method was called from a Server Component.
                                    // This can be ignored if you have middleware refreshing
                                    // user sessions.
                              }
                        },
                        remove(name: string, options: CookieOptions) {
                              try {
                                    cookieStore.set({ name, value: '', ...options })
                              } catch (error) {
                                    // The `delete` method was called from a Server Component.
                                    // This can be ignored if you have middleware refreshing
                                    // user sessions.
                              }
                        },
                  },
            }
      )
}

/**
 * Creates an admin Supabase client using the service role key
 * This bypasses RLS policies and should only be used for server-side operations
 * that require elevated privileges (e.g., user profile creation during signup)
 */
export async function createAdminClient() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase environment variables for admin client')
      }

      return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                  autoRefreshToken: false,
                  persistSession: false,
            },
      })
}
