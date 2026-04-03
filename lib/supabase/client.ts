/**
 * LICIMX - Browser Supabase Client
 *
 * Creates a Supabase client for use in Client Components (browser).
 * Uses @supabase/ssr's `createBrowserClient` to handle cookie-based auth
 * in a Next.js App Router environment.
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * Returns a Supabase client configured for browser-side usage.
 *
 * Call this inside Client Components, event handlers, or any code that
 * runs exclusively in the browser.
 *
 * @example
 * ```ts
 * const supabase = createClient()
 * const { data } = await supabase.from('bids').select('*')
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
