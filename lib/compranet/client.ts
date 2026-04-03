/**
 * CompraNet API Client
 *
 * Attempts to fetch real procurement data from Mexico's CompraNet system
 * via the OCDS/EDCA API endpoints. Falls back to realistic static data
 * when government APIs are unreachable.
 */

import { fallbackLicitaciones } from './fallback-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CompraNetLicitacion {
  numero_procedimiento: string
  titulo: string
  dependencia: string
  tipo_procedimiento: string // Licitacion Publica, Invitacion a cuando menos 3, Adjudicacion Directa
  fecha_publicacion: string
  fecha_apertura: string
  monto_estimado: number
  estado: string
  url_compranet: string
  categoria: string
  descripcion?: string
  entidad_federativa?: string
  unidad_compradora?: string
  numero_expediente?: string
  fecha_limite_aclaraciones?: string
}

export interface CompraNetSearchParams {
  dependencia?: string
  tipo?: string
  fecha_desde?: string
  fecha_hasta?: string
  search?: string
  estado?: string
  categoria?: string
  monto_min?: number
  monto_max?: number
  limit?: number
  offset?: number
}

export interface CompraNetResponse {
  data: CompraNetLicitacion[]
  total: number
  source: 'api' | 'fallback'
  cached: boolean
}

// ---------------------------------------------------------------------------
// Simple in-memory cache (1 hour TTL)
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour
const cache = new Map<string, CacheEntry<unknown>>()

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// ---------------------------------------------------------------------------
// API Endpoints (tried in order)
// ---------------------------------------------------------------------------

const API_ENDPOINTS = [
  // EDCA / OCDS endpoint
  'https://api.datos.gob.mx/v1/compranet-procedimientos',
  // Alternative datos.gob.mx endpoint
  'https://api.datos.gob.mx/v2/compranet',
  // CompraNet OCDS pre-production API
  'https://upcp-api-pre.hacienda.gob.mx/api/v1/tendering',
]

// ---------------------------------------------------------------------------
// OCDS record mapper
// ---------------------------------------------------------------------------

function mapOCDSRecord(record: Record<string, unknown>): CompraNetLicitacion | null {
  try {
    const proc = (record.tender ?? record) as Record<string, unknown>
    const parties = record.parties as unknown[] | undefined
    const buyer = (record.buyer ?? parties?.[0] ?? {}) as Record<string, unknown>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = proc as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = record as any

    return {
      numero_procedimiento: String(p.id ?? r.ocid ?? r.NUMERO_PROCEDIMIENTO ?? ''),
      titulo: String(p.title ?? r.TITULO_EXPEDIENTE ?? r.titulo ?? ''),
      dependencia: String(buyer.name ?? r.DEPENDENCIA ?? r.dependencia ?? ''),
      tipo_procedimiento: mapTipoProcedimiento(String(p.procurementMethod ?? r.TIPO_PROCEDIMIENTO ?? '')),
      fecha_publicacion: String(p.tenderPeriod?.startDate ?? r.FECHA_INICIO_PERIODO_COMPRA ?? r.fecha_publicacion ?? ''),
      fecha_apertura: String(p.tenderPeriod?.endDate ?? r.FECHA_FIN_PERIODO_COMPRA ?? r.fecha_apertura ?? ''),
      monto_estimado: Number(p.value?.amount ?? r.IMPORTE_CONTRATO ?? r.monto ?? 0),
      estado: mapEstado(String(p.status ?? r.ESTATUS_CONTRATACION ?? '')),
      url_compranet: String(r.uri ?? r.URL_COMPRANET ?? `https://compranet.hacienda.gob.mx/`),
      categoria: String(r.TIPO_CONTRATACION ?? r.categoria ?? 'General'),
      descripcion: String(p.description ?? r.DESCRIPCION_CONTRATACION ?? ''),
      entidad_federativa: String(r.NOMBRE_DE_LA_UC?.toString().split('-')[0] ?? r.entidad_federativa ?? ''),
      unidad_compradora: String(r.NOMBRE_DE_LA_UC ?? r.unidad_compradora ?? ''),
    }
  } catch {
    return null
  }
}

function mapTipoProcedimiento(raw: string): string {
  const lower = raw.toLowerCase()
  if (lower.includes('open') || lower.includes('publica') || lower.includes('licitacion')) return 'Licitacion Publica'
  if (lower.includes('selective') || lower.includes('invitacion') || lower.includes('restringida')) return 'Invitacion a cuando menos 3'
  if (lower.includes('direct') || lower.includes('adjudicacion')) return 'Adjudicacion Directa'
  return raw || 'Licitacion Publica'
}

function mapEstado(raw: string): string {
  const lower = raw.toLowerCase()
  if (lower.includes('active') || lower.includes('publicada') || lower.includes('vigente')) return 'Publicada'
  if (lower.includes('planned') || lower.includes('planeada')) return 'Publicada'
  if (lower.includes('complete') || lower.includes('adjudicad') || lower.includes('terminad')) return 'Adjudicada'
  if (lower.includes('cancel')) return 'Cancelada'
  return raw || 'Publicada'
}

// ---------------------------------------------------------------------------
// Core fetch logic
// ---------------------------------------------------------------------------

async function tryFetchFromAPI(params: CompraNetSearchParams): Promise<CompraNetResponse | null> {
  for (const endpoint of API_ENDPOINTS) {
    try {
      const url = new URL(endpoint)

      // Build query params depending on the API
      if (params.search) url.searchParams.set('q', params.search)
      if (params.limit) url.searchParams.set('pageSize', String(params.limit))
      if (params.offset) url.searchParams.set('page', String(Math.floor(params.offset / (params.limit || 20)) + 1))
      if (params.dependencia) url.searchParams.set('DEPENDENCIA', params.dependencia)

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000) // 8s timeout

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LICIMX/1.0 (Government Procurement Tracker)',
        },
      })

      clearTimeout(timeout)

      if (!response.ok) continue

      const json = await response.json()

      // Handle different response formats
      const records: Record<string, unknown>[] =
        json.results ?? json.data ?? json.records ?? json.releases ?? (Array.isArray(json) ? json : [])

      if (records.length === 0) continue

      const mapped = records
        .map(mapOCDSRecord)
        .filter((r): r is CompraNetLicitacion => r !== null && r.titulo.length > 0)

      if (mapped.length === 0) continue

      return {
        data: mapped,
        total: json.pagination?.total ?? json.total ?? json.count ?? mapped.length,
        source: 'api',
        cached: false,
      }
    } catch {
      // Try next endpoint
      continue
    }
  }

  return null
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchLicitaciones(params: CompraNetSearchParams = {}): Promise<CompraNetResponse> {
  const cacheKey = `compranet:list:${JSON.stringify(params)}`
  const cached = getCached<CompraNetResponse>(cacheKey)
  if (cached) return { ...cached, cached: true }

  // Try real API first
  const apiResult = await tryFetchFromAPI(params)
  if (apiResult) {
    setCache(cacheKey, apiResult)
    return apiResult
  }

  // Fallback to static data with filtering
  let filtered = [...fallbackLicitaciones]

  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(
      (l) =>
        l.titulo.toLowerCase().includes(q) ||
        l.dependencia.toLowerCase().includes(q) ||
        l.numero_procedimiento.toLowerCase().includes(q) ||
        (l.descripcion?.toLowerCase().includes(q) ?? false) ||
        (l.categoria?.toLowerCase().includes(q) ?? false)
    )
  }

  if (params.dependencia) {
    const dep = params.dependencia.toLowerCase()
    filtered = filtered.filter((l) => l.dependencia.toLowerCase().includes(dep))
  }

  if (params.tipo) {
    const tipo = params.tipo.toLowerCase()
    filtered = filtered.filter((l) => l.tipo_procedimiento.toLowerCase().includes(tipo))
  }

  if (params.estado) {
    const estado = params.estado.toLowerCase()
    filtered = filtered.filter((l) => l.estado.toLowerCase().includes(estado))
  }

  if (params.categoria) {
    const cat = params.categoria.toLowerCase()
    filtered = filtered.filter((l) => l.categoria.toLowerCase().includes(cat))
  }

  if (params.monto_min != null) {
    filtered = filtered.filter((l) => l.monto_estimado >= params.monto_min!)
  }

  if (params.monto_max != null) {
    filtered = filtered.filter((l) => l.monto_estimado <= params.monto_max!)
  }

  if (params.fecha_desde) {
    const desde = new Date(params.fecha_desde).getTime()
    filtered = filtered.filter((l) => new Date(l.fecha_publicacion).getTime() >= desde)
  }

  if (params.fecha_hasta) {
    const hasta = new Date(params.fecha_hasta).getTime()
    filtered = filtered.filter((l) => new Date(l.fecha_publicacion).getTime() <= hasta)
  }

  // Sort by publication date (newest first)
  filtered.sort((a, b) => new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime())

  const total = filtered.length
  const offset = params.offset ?? 0
  const limit = params.limit ?? 20
  const paginated = filtered.slice(offset, offset + limit)

  const result: CompraNetResponse = {
    data: paginated,
    total,
    source: 'fallback',
    cached: false,
  }

  setCache(cacheKey, result)
  return result
}

export async function fetchLicitacionById(id: string): Promise<CompraNetLicitacion | null> {
  const cacheKey = `compranet:detail:${id}`
  const cached = getCached<CompraNetLicitacion>(cacheKey)
  if (cached) return cached

  // Try fetching full list and find by id
  const { data } = await fetchLicitaciones({ limit: 100 })
  const found = data.find((l) => l.numero_procedimiento === id) ?? null

  if (found) {
    setCache(cacheKey, found)
  }

  return found
}

/**
 * Get unique values for filter dropdowns
 */
export function getFilterOptions() {
  const dependencias = [...new Set(fallbackLicitaciones.map((l) => l.dependencia))].sort()
  const categorias = [...new Set(fallbackLicitaciones.map((l) => l.categoria))].sort()
  const estados = [...new Set(fallbackLicitaciones.map((l) => l.estado))].sort()
  const tipos = [...new Set(fallbackLicitaciones.map((l) => l.tipo_procedimiento))].sort()

  return { dependencias, categorias, estados, tipos }
}
