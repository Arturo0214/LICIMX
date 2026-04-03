import { NextResponse } from 'next/server'

// Legacy callback route - no longer needed with cookie-based auth
// Kept for backwards compatibility, redirects to login
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/login`)
}
