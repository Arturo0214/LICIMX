/**
 * API Route: /api/bids
 *
 * GET  - List bids with filtering, sorting, and pagination
 * POST - Create a new bid
 */

import { type NextRequest } from 'next/server'
import { mockBids } from '@/lib/data/mock-data'
import type { Bid, PipelineStage, BidType } from '@/types'

// ---------------------------------------------------------------------------
// GET /api/bids
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const stage = searchParams.get('stage') as PipelineStage | null
    const sector = searchParams.get('sector')
    const bidType = searchParams.get('type') as BidType | null
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') ?? 'updated_at'
    const order = (searchParams.get('order') ?? 'desc') as 'asc' | 'desc'
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))

    // TODO: Replace with supabase.from('bids').select('*')
    let filtered: Bid[] = [...mockBids]

    // Filter by pipeline stage
    if (stage) {
      // TODO: Replace with .eq('pipeline_stage', stage)
      filtered = filtered.filter((b) => b.pipeline_stage === stage)
    }

    // Filter by sector (tag-based for mock)
    if (sector) {
      // TODO: Replace with .contains('tags', [sector])
      filtered = filtered.filter(
        (b) => b.tags?.some((t) => t.toLowerCase().includes(sector.toLowerCase()))
      )
    }

    // Filter by bid type
    if (bidType) {
      // TODO: Replace with .eq('bid_type', bidType)
      filtered = filtered.filter((b) => b.bid_type === bidType)
    }

    // Search by title, procedure number, or contracting entity
    if (search) {
      // TODO: Replace with .or(`title.ilike.%${search}%,procedure_number.ilike.%${search}%,contracting_entity.ilike.%${search}%`)
      const term = search.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.procedure_number.toLowerCase().includes(term) ||
          b.contracting_entity.toLowerCase().includes(term)
      )
    }

    // Sort
    // TODO: Replace with .order(sort, { ascending: order === 'asc' })
    filtered.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sort]
      const bVal = (b as unknown as Record<string, unknown>)[sort]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      const comparison = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal))

      return order === 'desc' ? -comparison : comparison
    })

    // Paginate
    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    // TODO: Replace with .range(offset, offset + limit - 1)
    const data = filtered.slice(offset, offset + limit)

    return Response.json({
      data,
      pagination: {
        page,
        per_page: limit,
        total,
        total_pages: totalPages,
      },
    })
  } catch (error) {
    console.error('[GET /api/bids]', error)
    return Response.json(
      { error: 'Error al obtener licitaciones' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// POST /api/bids
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ['procedure_number', 'title', 'contracting_entity', 'bid_type'] as const
    const missing = required.filter((field) => !body[field])

    if (missing.length > 0) {
      return Response.json(
        { error: `Campos requeridos faltantes: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate bid_type enum
    const validBidTypes: BidType[] = ['publica', 'invitacion', 'adjudicacion_directa']
    if (!validBidTypes.includes(body.bid_type)) {
      return Response.json(
        { error: `Tipo de licitación inválido. Valores permitidos: ${validBidTypes.join(', ')}` },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // TODO: Replace with supabase.from('bids').insert({...}).select().single()
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      organization_id: 'org-mock-001',
      procedure_number: body.procedure_number,
      title: body.title,
      description: body.description ?? null,
      contracting_entity: body.contracting_entity,
      buying_unit: body.buying_unit ?? null,
      bid_type: body.bid_type,
      pipeline_stage: 'detectada',
      source_url: body.source_url ?? null,
      source_portal: body.source_portal ?? null,
      estimated_amount: body.estimated_amount ?? null,
      currency: body.currency ?? 'MXN',
      minimum_amount: body.minimum_amount ?? null,
      maximum_amount: body.maximum_amount ?? null,
      guarantee_amount: body.guarantee_amount ?? null,
      published_at: body.published_at ?? null,
      clarification_meeting_at: body.clarification_meeting_at ?? null,
      proposal_deadline: body.proposal_deadline ?? null,
      technical_opening_at: body.technical_opening_at ?? null,
      economic_opening_at: body.economic_opening_at ?? null,
      ruling_date: body.ruling_date ?? null,
      contract_start_date: body.contract_start_date ?? null,
      contract_end_date: body.contract_end_date ?? null,
      total_score: null,
      score_level: null,
      auto_discarded: false,
      result: null,
      awarded_amount: null,
      winner_name: null,
      assigned_user_id: body.assigned_user_id ?? null,
      tags: body.tags ?? null,
      notes: body.notes ?? null,
      metadata: body.metadata ?? null,
      created_at: now,
      updated_at: now,
    }

    // In-memory mock: push to array (not persisted across requests in production)
    mockBids.push(newBid)

    return Response.json({ data: newBid }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/bids]', error)
    return Response.json(
      { error: 'Error al crear licitación' },
      { status: 500 }
    )
  }
}
