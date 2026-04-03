/**
 * API Route: /api/compranet
 *
 * GET - Search and list licitaciones from CompraNet (real API or fallback)
 *
 * Query params:
 *   search       - keyword search
 *   tipo         - tipo de procedimiento filter
 *   dependencia  - government entity filter
 *   estado       - status filter
 *   categoria    - category filter
 *   monto_min    - minimum estimated amount
 *   monto_max    - maximum estimated amount
 *   fecha_desde  - start date filter (ISO)
 *   fecha_hasta  - end date filter (ISO)
 *   limit        - page size (default 20, max 100)
 *   offset       - pagination offset
 */

import { type NextRequest } from 'next/server'
import { fetchLicitaciones, getFilterOptions } from '@/lib/compranet/client'

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams

    const params = {
      search: sp.get('search') ?? undefined,
      tipo: sp.get('tipo') ?? undefined,
      dependencia: sp.get('dependencia') ?? undefined,
      estado: sp.get('estado') ?? undefined,
      categoria: sp.get('categoria') ?? undefined,
      monto_min: sp.get('monto_min') ? Number(sp.get('monto_min')) : undefined,
      monto_max: sp.get('monto_max') ? Number(sp.get('monto_max')) : undefined,
      fecha_desde: sp.get('fecha_desde') ?? undefined,
      fecha_hasta: sp.get('fecha_hasta') ?? undefined,
      limit: Math.min(100, Math.max(1, parseInt(sp.get('limit') ?? '20', 10))),
      offset: Math.max(0, parseInt(sp.get('offset') ?? '0', 10)),
    }

    const result = await fetchLicitaciones(params)
    const filters = getFilterOptions()

    return Response.json({
      ...result,
      filters,
    })
  } catch (error) {
    console.error('[GET /api/compranet]', error)
    return Response.json(
      { error: 'Error al consultar CompraNet' },
      { status: 500 }
    )
  }
}
