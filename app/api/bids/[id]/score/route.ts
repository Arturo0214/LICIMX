/**
 * API Route: /api/bids/[id]/score
 *
 * POST - Calculate or recalculate the score for a bid
 */

import { calculateScore, type ScoringInput } from '@/lib/scoring/engine'
import { findBidById, mockBids } from '@/lib/data/mock-data'

type RouteParams = { params: Promise<{ id: string }> }

// ---------------------------------------------------------------------------
// POST /api/bids/[id]/score
// ---------------------------------------------------------------------------

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Verify bid exists
    // TODO: Replace with supabase.from('bids').select('id').eq('id', id).single()
    const bid = findBidById(id)

    if (!bid) {
      return Response.json(
        { error: 'Licitación no encontrada' },
        { status: 404 }
      )
    }

    // Validate scoring inputs
    const requiredFields: (keyof ScoringInput)[] = [
      'fit_score',
      'requirements_met',
      'doc_complexity',
      'estimated_margin',
      'competition_level',
      'prior_experience',
      'entity_history',
      'time_available',
      'legal_risk',
      'effort_ratio',
    ]

    const missingFields = requiredFields.filter(
      (field) => body[field] === undefined || body[field] === null
    )

    if (missingFields.length > 0) {
      return Response.json(
        {
          error: `Campos de scoring faltantes: ${missingFields.join(', ')}`,
          required_fields: requiredFields,
        },
        { status: 400 }
      )
    }

    const scoringInput: ScoringInput = {
      fit_score: Number(body.fit_score),
      requirements_met: Number(body.requirements_met),
      doc_complexity: Number(body.doc_complexity),
      estimated_margin: Number(body.estimated_margin),
      competition_level: Number(body.competition_level),
      prior_experience: Number(body.prior_experience),
      entity_history: Number(body.entity_history),
      time_available: Number(body.time_available),
      legal_risk: Number(body.legal_risk),
      effort_ratio: Number(body.effort_ratio),
    }

    // Calculate score using the scoring engine
    const result = calculateScore(scoringInput, body.custom_weights)

    // TODO: Replace with supabase.from('bids').update({ total_score, score_level, auto_discarded }).eq('id', id)
    // TODO: Also insert individual score records into bid_scores table
    const bidIndex = mockBids.findIndex((b) => b.id === id)
    if (bidIndex !== -1) {
      mockBids[bidIndex] = {
        ...mockBids[bidIndex],
        total_score: result.total_score,
        score_level: result.level,
        auto_discarded: result.auto_discard,
        updated_at: new Date().toISOString(),
      }
    }

    return Response.json({
      data: {
        bid_id: id,
        ...result,
      },
    })
  } catch (error) {
    console.error('[POST /api/bids/[id]/score]', error)
    return Response.json(
      { error: 'Error al calcular score' },
      { status: 500 }
    )
  }
}
