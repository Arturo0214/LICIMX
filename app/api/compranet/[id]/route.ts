/**
 * API Route: /api/compranet/[id]
 *
 * GET - Fetch a single licitacion from CompraNet by procedure number
 */

import { fetchLicitacionById } from '@/lib/compranet/client'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const decodedId = decodeURIComponent(id)
    const licitacion = await fetchLicitacionById(decodedId)

    if (!licitacion) {
      return Response.json(
        { error: 'Licitacion no encontrada' },
        { status: 404 }
      )
    }

    return Response.json({ data: licitacion })
  } catch (error) {
    console.error('[GET /api/compranet/[id]]', error)
    return Response.json(
      { error: 'Error al obtener licitacion' },
      { status: 500 }
    )
  }
}
