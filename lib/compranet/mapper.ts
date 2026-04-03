/**
 * CompraNet to Internal Bid Mapper
 *
 * Transforms CompraNet licitacion data into the internal Bid type
 * used by LICIMX's pipeline and scoring systems.
 */

import type { Bid, BidType } from '@/types'
import type { CompraNetLicitacion } from './client'
import { generateId } from '@/lib/utils'

/**
 * Map a CompraNet tipo_procedimiento string to our internal BidType enum
 */
function mapBidType(tipo: string): BidType {
  const lower = tipo.toLowerCase()
  if (lower.includes('publica') || lower.includes('licitacion')) return 'publica'
  if (lower.includes('invitacion') || lower.includes('cuando menos')) return 'invitacion'
  if (lower.includes('directa') || lower.includes('adjudicacion')) return 'adjudicacion_directa'
  return 'publica'
}

/**
 * Derive tags from the CompraNet licitacion fields
 */
function deriveTags(licitacion: CompraNetLicitacion): string[] {
  const tags: string[] = []

  if (licitacion.categoria) tags.push(licitacion.categoria)
  if (licitacion.entidad_federativa) tags.push(licitacion.entidad_federativa)

  // Add sector-based tags from title keywords
  const title = licitacion.titulo.toLowerCase()
  if (title.includes('software') || title.includes('computo') || title.includes('nube') || title.includes('sistema')) {
    tags.push('TI')
  }
  if (title.includes('medic') || title.includes('hospital') || title.includes('salud')) {
    tags.push('Salud')
  }
  if (title.includes('construcc') || title.includes('obra') || title.includes('carretera')) {
    tags.push('Infraestructura')
  }
  if (title.includes('energia') || title.includes('electric') || title.includes('petrole')) {
    tags.push('Energia')
  }

  return [...new Set(tags)]
}

/**
 * Map a CompraNet licitacion into a partial Bid record ready for import.
 * The caller should fill in organization_id and any other org-specific fields.
 */
export function mapCompraNetToBid(licitacion: CompraNetLicitacion): Partial<Bid> {
  const now = new Date().toISOString()

  return {
    id: `bid-cn-${generateId()}`,
    procedure_number: licitacion.numero_procedimiento,
    title: licitacion.titulo,
    description: licitacion.descripcion ?? null,
    bid_type: mapBidType(licitacion.tipo_procedimiento),
    contracting_entity: licitacion.dependencia,
    buying_unit: licitacion.unidad_compradora ?? null,
    estimated_amount: licitacion.monto_estimado,
    currency: 'MXN',
    minimum_amount: null,
    maximum_amount: null,
    guarantee_amount: null,
    pipeline_stage: 'detectada',
    total_score: null,
    score_level: null,
    auto_discarded: false,
    published_at: licitacion.fecha_publicacion,
    clarification_meeting_at: licitacion.fecha_limite_aclaraciones ?? null,
    proposal_deadline: licitacion.fecha_apertura,
    technical_opening_at: null,
    economic_opening_at: null,
    ruling_date: null,
    contract_start_date: null,
    contract_end_date: null,
    tags: deriveTags(licitacion),
    assigned_user_id: null,
    result: null,
    awarded_amount: null,
    winner_name: null,
    source_url: licitacion.url_compranet,
    source_portal: 'CompraNet',
    notes: `Importada desde CompraNet el ${new Date().toLocaleDateString('es-MX')}. Estado en CompraNet: ${licitacion.estado}.`,
    metadata: {
      compranet_estado: licitacion.estado,
      compranet_categoria: licitacion.categoria,
      compranet_entidad_federativa: licitacion.entidad_federativa,
      compranet_numero_expediente: licitacion.numero_expediente,
      imported_at: now,
    },
    created_at: now,
    updated_at: now,
  }
}
