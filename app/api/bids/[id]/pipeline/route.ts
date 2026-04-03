/**
 * API Route: /api/bids/[id]/pipeline
 *
 * PUT - Move a bid to a new pipeline stage
 */

import { findBidById, mockBids, mockPipelineHistory } from '@/lib/data/mock-data'
import type { PipelineStage, BidPipelineHistory } from '@/types'

type RouteParams = { params: Promise<{ id: string }> }

// ---------------------------------------------------------------------------
// Valid stage transitions
// ---------------------------------------------------------------------------

const VALID_TRANSITIONS: Record<PipelineStage, PipelineStage[]> = {
  detectada: ['analizando', 'descartada'],
  analizando: ['aprobada', 'descartada'],
  aprobada: ['en_preparacion', 'descartada'],
  en_preparacion: ['presentada', 'descartada'],
  presentada: ['en_evaluacion', 'descartada'],
  en_evaluacion: ['fallo', 'descartada'],
  fallo: ['ganada', 'perdida', 'desierta'],
  ganada: [],
  perdida: [],
  desierta: [],
  descartada: ['detectada'], // Allow reactivation
}

const ALL_STAGES: PipelineStage[] = [
  'detectada', 'analizando', 'aprobada', 'en_preparacion',
  'presentada', 'en_evaluacion', 'fallo',
  'ganada', 'perdida', 'desierta', 'descartada',
]

// ---------------------------------------------------------------------------
// PUT /api/bids/[id]/pipeline
// ---------------------------------------------------------------------------

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    const newStage = body.stage as PipelineStage
    const reason = body.reason as string | undefined

    // Validate new stage
    if (!newStage || !ALL_STAGES.includes(newStage)) {
      return Response.json(
        {
          error: `Etapa inválida: "${newStage}". Valores permitidos: ${ALL_STAGES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Find the bid
    // TODO: Replace with supabase.from('bids').select('*').eq('id', id).single()
    const bid = findBidById(id)

    if (!bid) {
      return Response.json(
        { error: 'Licitación no encontrada' },
        { status: 404 }
      )
    }

    // Validate stage transition
    const allowedTransitions = VALID_TRANSITIONS[bid.pipeline_stage]
    if (!allowedTransitions.includes(newStage)) {
      return Response.json(
        {
          error: `Transición no permitida: ${bid.pipeline_stage} -> ${newStage}`,
          current_stage: bid.pipeline_stage,
          allowed_transitions: allowedTransitions,
        },
        { status: 422 }
      )
    }

    const now = new Date().toISOString()

    // Log the pipeline change
    // TODO: Replace with supabase.from('bid_pipeline_history').insert({...})
    const historyEntry: BidPipelineHistory = {
      id: `ph-${Date.now()}`,
      bid_id: id,
      organization_id: bid.organization_id,
      from_stage: bid.pipeline_stage,
      to_stage: newStage,
      changed_by: body.changed_by ?? null,
      reason: reason ?? null,
      created_at: now,
    }
    mockPipelineHistory.push(historyEntry)

    // Update the bid stage
    // TODO: Replace with supabase.from('bids').update({ pipeline_stage: newStage, updated_at: now }).eq('id', id).select().single()
    const bidIndex = mockBids.findIndex((b) => b.id === id)
    if (bidIndex !== -1) {
      mockBids[bidIndex] = {
        ...mockBids[bidIndex],
        pipeline_stage: newStage,
        updated_at: now,
      }
    }

    return Response.json({
      data: mockBids[bidIndex],
      transition: {
        from: bid.pipeline_stage,
        to: newStage,
        reason: reason ?? null,
        timestamp: now,
      },
    })
  } catch (error) {
    console.error('[PUT /api/bids/[id]/pipeline]', error)
    return Response.json(
      { error: 'Error al cambiar etapa del pipeline' },
      { status: 500 }
    )
  }
}
