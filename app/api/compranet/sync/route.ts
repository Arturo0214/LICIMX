/**
 * API Route: /api/compranet/sync
 *
 * POST - Import a CompraNet licitacion into the internal bids pipeline.
 *
 * Body:
 *   { numero_procedimiento: string }
 *
 * This endpoint fetches the CompraNet licitacion, maps it to the internal
 * Bid type, and adds it to the bids list.
 */

import { fetchLicitacionById } from '@/lib/compranet/client'
import { mapCompraNetToBid } from '@/lib/compranet/mapper'
import { mockBids } from '@/lib/data/mock-data'
import type { Bid } from '@/types'

// Track imported procedure numbers to prevent duplicates
const importedProcedures = new Set<string>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { numero_procedimiento } = body

    if (!numero_procedimiento) {
      return Response.json(
        { error: 'Se requiere el numero_procedimiento' },
        { status: 400 }
      )
    }

    // Check for duplicates
    if (importedProcedures.has(numero_procedimiento)) {
      return Response.json(
        { error: 'Esta licitacion ya fue importada', already_imported: true },
        { status: 409 }
      )
    }

    // Also check against existing bids
    const existingBid = mockBids.find(
      (b) => b.procedure_number === numero_procedimiento
    )
    if (existingBid) {
      importedProcedures.add(numero_procedimiento)
      return Response.json(
        { error: 'Esta licitacion ya existe en el pipeline', already_imported: true, bid_id: existingBid.id },
        { status: 409 }
      )
    }

    // Fetch the licitacion from CompraNet (or fallback)
    const licitacion = await fetchLicitacionById(numero_procedimiento)
    if (!licitacion) {
      return Response.json(
        { error: 'No se encontro la licitacion en CompraNet' },
        { status: 404 }
      )
    }

    // Map to internal Bid format
    const bidData = mapCompraNetToBid(licitacion)
    const newBid: Bid = {
      ...bidData,
      organization_id: 'org-mock-001',
    } as Bid

    // Add to in-memory store
    mockBids.push(newBid)
    importedProcedures.add(numero_procedimiento)

    return Response.json(
      {
        data: newBid,
        message: 'Licitacion importada exitosamente al pipeline',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/compranet/sync]', error)
    return Response.json(
      { error: 'Error al importar la licitacion' },
      { status: 500 }
    )
  }
}
