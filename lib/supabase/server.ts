/**
 * LICIMX - Server Supabase Client
 *
 * Creates a Supabase client for use in Server Components, Route Handlers,
 * Server Actions, and Middleware.  Uses @supabase/ssr's `createServerClient`
 * with the Next.js cookies() API for cookie-based auth.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Returns a Supabase client configured for server-side usage.
 *
 * Must be called inside an async Server Component, Route Handler,
 * or Server Action where `cookies()` is available.
 *
 * @example
 * ```ts
 * const supabase = await createClient()
 * const { data } = await supabase.from('bids').select('*')
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // `setAll` can fail when called from a Server Component.
            // This is expected — the middleware will handle refreshing
            // the session cookie on the next request.
          }
        },
      },
    },
  )
}
