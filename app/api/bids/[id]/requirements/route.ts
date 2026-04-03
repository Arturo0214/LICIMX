/**
 * API Route: /api/bids/[id]/requirements
 *
 * GET   - List requirements for a bid
 * POST  - Add a new requirement
 * PATCH - Update a requirement (toggle met status)
 */

import { findBidById, findRequirementsByBidId, mockRequirements } from '@/lib/data/mock-data'
import type { BidRequirement, RequirementCategory } from '@/types'

type RouteParams = { params: Promise<{ id: string }> }

// ---------------------------------------------------------------------------
// GET /api/bids/[id]/requirements
// ---------------------------------------------------------------------------

export async function GET(
  _request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Verify bid exists
    // TODO: Replace with supabase.from('bids').select('id').eq('id', id).single()
    const bid = findBidById(id)

    if (!bid) {
      return Response.json(
        { error: 'Licitación no encontrada' },
        { status: 404 }
      )
    }

    // TODO: Replace with supabase.from('bid_requirements').select('*').eq('bid_id', id).order('is_mandatory', { ascending: false }).order('category')
    const requirements = findRequirementsByBidId(id)

    return Response.json({ data: requirements })
  } catch (error) {
    console.error('[GET /api/bids/[id]/requirements]', error)
    return Response.json(
      { error: 'Error al obtener requisitos' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// POST /api/bids/[id]/requirements
// ---------------------------------------------------------------------------

const VALID_CATEGORIES: RequirementCategory[] = [
  'documental', 'tecnico', 'legal', 'financiero', 'experiencia', 'administrativo',
]

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Verify bid exists
    // TODO: Replace with supabase.from('bids').select('id, organization_id').eq('id', id).single()
    const bid = findBidById(id)

    if (!bid) {
      return Response.json(
        { error: 'Licitación no encontrada' },
        { status: 404 }
      )
    }

    // Validate required fields
    if (!body.description) {
      return Response.json(
        { error: 'El campo "description" es requerido' },
        { status: 400 }
      )
    }

    if (!body.category || !VALID_CATEGORIES.includes(body.category)) {
      return Response.json(
        { error: `Categoría inválida. Valores permitidos: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // TODO: Replace with supabase.from('bid_requirements').insert({...}).select().single()
    const newRequirement: BidRequirement = {
      id: `req-${Date.now()}`,
      bid_id: id,
      organization_id: bid.organization_id,
      category: body.category,
      description: body.description,
      is_met: body.is_met ?? null,
      compliance_notes: body.compliance_notes ?? null,
      source_reference: body.source_reference ?? null,
      is_mandatory: body.is_mandatory ?? true,
      assigned_to: body.assigned_to ?? null,
      created_at: now,
      updated_at: now,
    }

    mockRequirements.push(newRequirement)

    return Response.json({ data: newRequirement }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/bids/[id]/requirements]', error)
    return Response.json(
      { error: 'Error al crear requisito' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/bids/[id]/requirements
// ---------------------------------------------------------------------------

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Verify bid exists
    const bid = findBidById(id)

    if (!bid) {
      return Response.json(
        { error: 'Licitación no encontrada' },
        { status: 404 }
      )
    }

    // requirement_id is required for PATCH
    if (!body.requirement_id) {
      return Response.json(
        { error: 'El campo "requirement_id" es requerido' },
        { status: 400 }
      )
    }

    // TODO: Replace with supabase.from('bid_requirements').update({...}).eq('id', body.requirement_id).eq('bid_id', id).select().single()
    const reqIndex = mockRequirements.findIndex(
      (r) => r.id === body.requirement_id && r.bid_id === id
    )

    if (reqIndex === -1) {
      return Response.json(
        { error: 'Requisito no encontrado para esta licitación' },
        { status: 404 }
      )
    }

    // Allow updating is_met, compliance_notes, assigned_to
    const updatedRequirement: BidRequirement = {
      ...mockRequirements[reqIndex],
      ...(body.is_met !== undefined && { is_met: body.is_met }),
      ...(body.compliance_notes !== undefined && { compliance_notes: body.compliance_notes }),
      ...(body.assigned_to !== undefined && { assigned_to: body.assigned_to }),
      ...(body.description !== undefined && { description: body.description }),
      updated_at: new Date().toISOString(),
    }

    mockRequirements[reqIndex] = updatedRequirement

    return Response.json({ data: updatedRequirement })
  } catch (error) {
    console.error('[PATCH /api/bids/[id]/requirements]', error)
    return Response.json(
      { error: 'Error al actualizar requisito' },
      { status: 500 }
    )
  }
}
