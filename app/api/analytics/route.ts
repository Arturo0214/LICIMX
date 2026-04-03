/**
 * API Route: /api/analytics
 *
 * GET - Return analytics data
 *   - Win rate by entity
 *   - Results by month
 *   - Distribution by sector
 *   - Amounts by quarter
 */

import { mockAnalytics } from '@/lib/data/mock-data'

// ---------------------------------------------------------------------------
// GET /api/analytics
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    // TODO: Replace with aggregated Supabase queries:
    //
    // Win rate by entity:
    // const { data: entityStats } = await supabase.rpc('win_rate_by_entity', { org_id: orgId })
    //
    // Results by month:
    // const { data: monthlyResults } = await supabase.rpc('results_by_month', { org_id: orgId })
    //
    // Distribution by sector:
    // const { data: sectorDist } = await supabase.rpc('distribution_by_sector', { org_id: orgId })
    //
    // Amounts by quarter:
    // const { data: quarterAmounts } = await supabase.rpc('amounts_by_quarter', { org_id: orgId })

    return Response.json({
      data: {
        win_rate_by_entity: mockAnalytics.win_rate_by_entity,
        results_by_month: mockAnalytics.results_by_month,
        distribution_by_sector: mockAnalytics.distribution_by_sector,
        amounts_by_quarter: mockAnalytics.amounts_by_quarter,
      },
    })
  } catch (error) {
    console.error('[GET /api/analytics]', error)
    return Response.json(
      { error: 'Error al obtener datos de analítica' },
      { status: 500 }
    )
  }
}
