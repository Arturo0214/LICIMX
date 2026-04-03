/**
 * API Route: /api/scoring/config
 *
 * GET - Get current scoring configuration (weights)
 * PUT - Update scoring weights
 */

import { mockScoringConfig } from '@/lib/data/mock-data'
import { validateWeights } from '@/lib/scoring/config'
import type { ScoringWeights } from '@/lib/scoring/engine'

// ---------------------------------------------------------------------------
// GET /api/scoring/config
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    // TODO: Replace with supabase.from('scoring_configs').select('*').eq('is_default', true).single()

    return Response.json({ data: mockScoringConfig })
  } catch (error) {
    console.error('[GET /api/scoring/config]', error)
    return Response.json(
      { error: 'Error al obtener configuración de scoring' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// PUT /api/scoring/config
// ---------------------------------------------------------------------------

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body.weights || typeof body.weights !== 'object') {
      return Response.json(
        { error: 'El campo "weights" es requerido y debe ser un objeto' },
        { status: 400 }
      )
    }

    // Validate that weights sum to 100
    const validation = validateWeights(body.weights as ScoringWeights)

    if (!validation.valid) {
      return Response.json(
        {
          error: validation.message,
          current_total: validation.total,
        },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // TODO: Replace with supabase.from('scoring_configs').update({ weights: body.weights, updated_at: now }).eq('id', mockScoringConfig.id).select().single()
    mockScoringConfig.weights = body.weights
    if (body.name) mockScoringConfig.name = body.name
    if (body.description !== undefined) mockScoringConfig.description = body.description
    if (body.discard_rules) mockScoringConfig.discard_rules = body.discard_rules
    mockScoringConfig.updated_at = now

    return Response.json({
      data: mockScoringConfig,
      message: 'Configuración de scoring actualizada',
    })
  } catch (error) {
    console.error('[PUT /api/scoring/config]', error)
    return Response.json(
      { error: 'Error al actualizar configuración de scoring' },
      { status: 500 }
    )
  }
}
