/**
 * API Route: /api/bids/[id]/documents
 *
 * GET  - List documents for a bid
 * POST - Create document metadata (file upload goes through Supabase Storage directly)
 */

import { findBidById, findDocumentsByBidId, mockDocuments } from '@/lib/data/mock-data'
import type { BidDocument, DocumentCategory } from '@/types'

type RouteParams = { params: Promise<{ id: string }> }

// ---------------------------------------------------------------------------
// GET /api/bids/[id]/documents
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

    // TODO: Replace with supabase.from('bid_documents').select('*').eq('bid_id', id).order('created_at', { ascending: false })
    const documents = findDocumentsByBidId(id)

    return Response.json({ data: documents })
  } catch (error) {
    console.error('[GET /api/bids/[id]/documents]', error)
    return Response.json(
      { error: 'Error al obtener documentos' },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// POST /api/bids/[id]/documents
// ---------------------------------------------------------------------------

const VALID_CATEGORIES: DocumentCategory[] = [
  'bases', 'anexo', 'convocatoria', 'acta_aclaracion',
  'propuesta_tecnica', 'propuesta_economica', 'fallo', 'contrato', 'otro',
]

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

    // Validate required fields
    const required = ['name', 'original_filename', 'storage_path', 'category'] as const
    const missing = required.filter((field) => !body[field])

    if (missing.length > 0) {
      return Response.json(
        { error: `Campos requeridos faltantes: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(body.category)) {
      return Response.json(
        { error: `Categoría inválida. Valores permitidos: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // TODO: Replace with supabase.from('bid_documents').insert({...}).select().single()
    const newDocument: BidDocument = {
      id: `doc-${Date.now()}`,
      bid_id: id,
      organization_id: bid.organization_id,
      category: body.category,
      name: body.name,
      original_filename: body.original_filename,
      storage_path: body.storage_path,
      url: body.url ?? null,
      mime_type: body.mime_type ?? null,
      size_bytes: body.size_bytes ?? null,
      extracted_text: null,
      ai_processed: false,
      uploaded_by: body.uploaded_by ?? null,
      created_at: now,
      updated_at: now,
    }

    mockDocuments.push(newDocument)

    return Response.json({ data: newDocument }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/bids/[id]/documents]', error)
    return Response.json(
      { error: 'Error al registrar documento' },
      { status: 500 }
    )
  }
}
