/**
 * LICIMX - Scoring Configuration & Labels
 *
 * Default configuration, Spanish labels, and display metadata for the
 * scoring engine.  Used by UI components to render the scoring form,
 * breakdown tables, and recommendation badges.
 */

import type { ScoreLevel } from '@/types/database'
import type { ScoringWeights } from './engine'
import { DEFAULT_WEIGHTS } from './engine'

// ---------------------------------------------------------------------------
// Variable Metadata (Spanish labels for the UI)
// ---------------------------------------------------------------------------

export interface ScoringVariableMeta {
  /** Variable key matching ScoringInput */
  key: keyof ScoringWeights
  /** Display label in Spanish */
  label: string
  /** Short description shown as helper text */
  description: string
  /** Minimum allowed value */
  min: number
  /** Maximum allowed value */
  max: number
  /** Step increment for sliders/inputs */
  step: number
  /** Unit displayed next to the value (e.g. "%", "dias") */
  unit: string
  /** Whether a higher raw value is worse (inverse scoring) */
  inverse: boolean
}

/** Ordered list of scoring variables with their UI metadata */
export const SCORING_VARIABLES: ScoringVariableMeta[] = [
  {
    key: 'fit_score',
    label: 'Ajuste al giro',
    description: 'Que tanto se alinea la licitacion con el giro y capacidades de la empresa',
    min: 1,
    max: 5,
    step: 1,
    unit: '',
    inverse: false,
  },
  {
    key: 'requirements_met',
    label: 'Requisitos cumplibles',
    description: 'Porcentaje de requisitos obligatorios que la empresa puede cumplir',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    inverse: false,
  },
  {
    key: 'doc_complexity',
    label: 'Complejidad documental',
    description: 'Nivel de complejidad en la preparacion de documentos (mayor = mas dificil)',
    min: 1,
    max: 5,
    step: 1,
    unit: '',
    inverse: true,
  },
  {
    key: 'estimated_margin',
    label: 'Margen estimado',
    description: 'Margen de utilidad estimado sobre el monto del contrato',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    inverse: false,
  },
  {
    key: 'competition_level',
    label: 'Nivel de competencia',
    description: 'Cantidad y fortaleza esperada de competidores (mayor = mas competido)',
    min: 1,
    max: 5,
    step: 1,
    unit: '',
    inverse: true,
  },
  {
    key: 'prior_experience',
    label: 'Experiencia previa',
    description: 'Experiencia en contratos similares (0=ninguna, 1=parcial, 2=completa)',
    min: 0,
    max: 2,
    step: 1,
    unit: '',
    inverse: false,
  },
  {
    key: 'entity_history',
    label: 'Historial con la dependencia',
    description: 'Score historico basado en relacion previa con la entidad contratante',
    min: 0,
    max: 100,
    step: 5,
    unit: '',
    inverse: false,
  },
  {
    key: 'time_available',
    label: 'Tiempo disponible',
    description: 'Dias restantes hasta la fecha limite de presentacion',
    min: 0,
    max: 90,
    step: 1,
    unit: 'dias',
    inverse: false,
  },
  {
    key: 'legal_risk',
    label: 'Riesgo legal',
    description: 'Nivel de riesgo legal o de inconformidad (mayor = mas riesgoso)',
    min: 1,
    max: 5,
    step: 1,
    unit: '',
    inverse: true,
  },
  {
    key: 'effort_ratio',
    label: 'Relacion monto/esfuerzo',
    description: 'Proporcion entre el valor del contrato y el esfuerzo requerido para participar',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    inverse: false,
  },
]

// ---------------------------------------------------------------------------
// Score Level Labels & Colors
// ---------------------------------------------------------------------------

export interface ScoreLevelMeta {
  level: ScoreLevel
  label: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
}

export const SCORE_LEVELS: Record<ScoreLevel, ScoreLevelMeta> = {
  alta: {
    level: 'alta',
    label: 'Alta',
    description: 'Oportunidad solida, se recomienda participar',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: 'check-circle',
  },
  media: {
    level: 'media',
    label: 'Media',
    description: 'Requiere analisis adicional antes de decidir',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: 'alert-circle',
  },
  baja: {
    level: 'baja',
    label: 'Baja',
    description: 'Probabilidad baja de exito, evaluar con cuidado',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: 'alert-triangle',
  },
  descarte: {
    level: 'descarte',
    label: 'Descarte',
    description: 'No cumple criterios minimos, se recomienda no participar',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: 'x-circle',
  },
}

// ---------------------------------------------------------------------------
// Recommendation Labels
// ---------------------------------------------------------------------------

export const RECOMMENDATION_LABELS: Record<string, { label: string; color: string }> = {
  participar: { label: 'Participar', color: 'text-green-700 bg-green-50' },
  revisar: { label: 'Revisar', color: 'text-yellow-700 bg-yellow-50' },
  descartar: { label: 'Descartar', color: 'text-red-700 bg-red-50' },
}

// ---------------------------------------------------------------------------
// Default Config Helper
// ---------------------------------------------------------------------------

/** Returns the full default scoring configuration ready to persist */
export function getDefaultScoringConfig() {
  return {
    name: 'Configuracion predeterminada',
    weights: DEFAULT_WEIGHTS as unknown as Record<string, number>,
    is_default: true,
  }
}

/** Validates that a set of weights sums to 100 */
export function validateWeights(weights: ScoringWeights): {
  valid: boolean
  total: number
  message: string
} {
  const values = Object.values(weights)
  const total = values.reduce((sum, v) => sum + v, 0)
  const valid = total === 100

  return {
    valid,
    total,
    message: valid
      ? 'Los pesos suman 100 correctamente'
      : `Los pesos suman ${total}. Deben sumar exactamente 100.`,
  }
}
