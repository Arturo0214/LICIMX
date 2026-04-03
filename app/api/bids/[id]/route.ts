/**
 * API Route: /api/bids/[id]
 *
 * GET    - Get a single bid with all related data
 * PUT    - Update a bid
 * DELETE - Soft delete (archive) a bid
 */

import {
  findBidById,
  findDocumentsByBidId,
  findRequirementsByBidId,
  findScoresByBidId,
  findMilestonesByBidId,
  findTasksByBidId,
  findPipelineHistoryByBidId,
  mockBids,
} from '@/lib/data/mock-data'
import type { Bid, BidWithDetails } from '@/types'

type RouteParams = { params: Promise<{ id: string }> }

// ---------------------------------------------------------------------------
// GET /api/bids/[id]
// ---------------------------------------------------------------------------

export async function GET(
  _request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // TODO: Replace with supabase.from('bids').select('*, documents(*), requirements(*), scores(*), milestones(*), tasks(*), pipeline_history(*)').eq('id', id).single()
    const bid = findBidById(id)

    if (!bid) {
      return Response.json(
        { error: 'Licitación no encontrada' },
        { status: 404 }
      )
    }

    const bidWithDetails: BidWithDetails = {
      ...bid,
      documents: findDocumentsByBidId(id),
      requirements: findRequirementsByBidId(id),
      scores: findScoresByBidId(id),
      milestones: findMilestonesByBidId(id),
      tasks: findTasksByBidId(id),
      proposals: [],
      pipeline_history: findPipelineHistoryByBidId(id),
    }

    return Response.json({ data: bidWithDetails })
  } catch (error) {
    console.error('[GET /api/bids/[id]]', error)
    return Response.json(
      { error: 'Error al obtener licitación' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// PUT /api/bids/[id]
// ---------------------------------------------------------------------------

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    // TODO: Replace with supabase.from('bids').update({...body, updated_at: new Date().toISOString()}).eq('id', id).select().single()
    const bidIndex = mockBids.findIndex((b) => b.id === id)

    if (bidIndex === -1) {
      return Response.json(
        { error: 'Licitación no encontrada' },
        { status: 404 }
      )
    }

    // Prevent updating immutable fields
    const { id: _id, organization_id: _orgId, created_at: _createdAt, ...updatableFields } = body

    const updatedBid: Bid = {
      ...mockBids[bidIndex],
      ...updatableFields,
      updated_at: new Date().toISOString(),
    }

    mockBids[bidIndex] = updatedBid

    return Response.json({ data: updatedBid })
  } catch (error) {
    console.error('[PUT /api/bids/[id]]', error)
    return Response.json(
      { error: 'Error al actualizar licitación' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/bids/[id] (soft delete / archive)
// ---------------------------------------------------------------------------

export async function DELETE(
  _request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // TODO: Replace with supabase.from('bids').update({ pipeline_stage: 'descartada', updated_at: new Date().toISOString() }).eq('id', id).select().single()
    const bidIndex = mockBids.findIndex((b) => b.id === id)

    if (bidIndex === -1) {
      return Response.json(
        { error: 'Licitación no encontrada' },
        { status: 404 }
      )
    }

    // Soft delete: move to "descartada" stage
    mockBids[bidIndex] = {
      ...mockBids[bidIndex],
      pipeline_stage: 'descartada',
      updated_at: new Date().toISOString(),
    }

    return Response.json({
      data: mockBids[bidIndex],
      message: 'Licitación archivada exitosamente',
    })
  } catch (error) {
    console.error('[DELETE /api/bids/[id]]', error)
    return Response.json(
      { error: 'Error al archivar licitación' },
      { status: 500 }
    )
  }
}
