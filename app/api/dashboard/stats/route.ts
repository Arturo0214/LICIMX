/**
 * API Route: /api/dashboard/stats
 *
 * GET - Return dashboard statistics
 */

import { mockDashboardStats } from '@/lib/data/mock-data'

// ---------------------------------------------------------------------------
// GET /api/dashboard/stats
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    // TODO: Replace with multiple Supabase queries:
    // const { count: totalBids } = await supabase.from('bids').select('*', { count: 'exact', head: true })
    // const { count: activePipeline } = await supabase.from('bids').select('*', { count: 'exact', head: true }).not('pipeline_stage', 'in', '("ganada","perdida","desierta","descartada")')
    // const { data: wonBids } = await supabase.from('bids').select('awarded_amount').eq('result', 'ganada')
    // const { data: finishedBids } = await supabase.from('bids').select('result').not('result', 'is', null)
    // const { data: upcomingDeadlines } = await supabase.from('milestones').select('*').gte('date', new Date().toISOString()).eq('is_completed', false).order('date').limit(5)
    // const { data: highPriority } = await supabase.from('bids').select('*').eq('score_level', 'alta').not('pipeline_stage', 'in', '("ganada","perdida","desierta","descartada")')

    return Response.json({ data: mockDashboardStats })
  } catch (error) {
    console.error('[GET /api/dashboard/stats]', error)
    return Response.json(
      { error: 'Error al obtener estadísticas del dashboard' },
      { status: 500 }
    )
  }
}
