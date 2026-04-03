/**
 * LICIMX - Scoring Engine
 *
 * Calculates a composite Go/No-Go score for a bid based on multiple
 * weighted variables.  The engine normalises raw inputs to a 0-100 scale,
 * applies configurable weights, checks auto-discard rules, and returns
 * a detailed breakdown suitable for display in the UI.
 */

import type { ScoreLevel } from '@/types/database'

// ---------------------------------------------------------------------------
// Input / Output Types
// ---------------------------------------------------------------------------

/** Raw values collected from the analyst for a bid evaluation */
export interface ScoringInput {
  /** 1-5: How well the bid matches the company's core business */
  fit_score: number
  /** 0-100%: Percentage of mandatory requirements the company can meet */
  requirements_met: number
  /** 1-5: Documentary complexity (higher = harder, scored inversely) */
  doc_complexity: number
  /** 0-100%: Estimated profit margin */
  estimated_margin: number
  /** 1-5: Expected competition level (higher = more competitors, scored inversely) */
  competition_level: number
  /** 0-2: Prior experience with this type of contract (0=none, 1=partial, 2=full) */
  prior_experience: number
  /** 0-100: Historical score with the contracting entity */
  entity_history: number
  /** Days remaining until submission deadline */
  time_available: number
  /** 1-5: Legal risk level (higher = riskier, scored inversely) */
  legal_risk: number
  /** 0-100: Value relative to effort required */
  effort_ratio: number
}

/** Weights for each scoring variable (must sum to 100) */
export interface ScoringWeights {
  fit_score: number
  requirements_met: number
  doc_complexity: number
  estimated_margin: number
  competition_level: number
  prior_experience: number
  entity_history: number
  time_available: number
  legal_risk: number
  effort_ratio: number
}

/** Single variable breakdown in the scoring result */
export interface ScoringBreakdownItem {
  /** Variable identifier */
  variable: string
  /** Original value provided by the analyst */
  raw_value: number
  /** Value normalised to 0-100 */
  normalized: number
  /** Weight assigned to this variable */
  weight: number
  /** normalized * weight / 100 */
  weighted_score: number
}

/** Complete result returned by the scoring engine */
export interface ScoringResult {
  /** Composite score on a 0-100 scale */
  total_score: number
  /** Qualitative classification */
  level: ScoreLevel
  /** Per-variable breakdown */
  breakdown: ScoringBreakdownItem[]
  /** Whether the bid was automatically discarded */
  auto_discard: boolean
  /** Reasons the bid was auto-discarded (empty if not discarded) */
  discard_reasons: string[]
  /** High-level recommendation */
  recommendation: 'participar' | 'revisar' | 'descartar'
}

// ---------------------------------------------------------------------------
// Default Weights (total = 100)
// ---------------------------------------------------------------------------

export const DEFAULT_WEIGHTS: ScoringWeights = {
  fit_score: 20,
  requirements_met: 15,
  doc_complexity: 5,
  estimated_margin: 15,
  competition_level: 10,
  prior_experience: 10,
  entity_history: 5,
  time_available: 8,
  legal_risk: 7,
  effort_ratio: 5,
}

/** Returns a copy of the default weights */
export function getDefaultWeights(): ScoringWeights {
  return { ...DEFAULT_WEIGHTS }
}

// ---------------------------------------------------------------------------
// Normalisation Helpers
// ---------------------------------------------------------------------------

/**
 * Normalise a 1-5 scale value to 0-100.
 * @param value  Raw value (1-5)
 * @param inverse  If true, a higher raw value produces a lower normalised score
 */
function normalizeScale5(value: number, inverse = false): number {
  const clamped = Math.max(1, Math.min(5, value))
  const norm = ((clamped - 1) / 4) * 100
  return inverse ? 100 - norm : norm
}

/**
 * Normalise a 0-100 value (identity, but clamped).
 */
function normalizePercent(value: number): number {
  return Math.max(0, Math.min(100, value))
}

/**
 * Normalise prior experience (0-2) to 0-100.
 */
function normalizeExperience(value: number): number {
  const clamped = Math.max(0, Math.min(2, value))
  return (clamped / 2) * 100
}

/**
 * Normalise days available to a 0-100 score.
 * - 0 days  => 0
 * - 3 days  => 15
 * - 7 days  => 50
 * - 15 days => 80
 * - 30+ days => 100
 */
function normalizeTimeAvailable(days: number): number {
  if (days <= 0) return 0
  if (days >= 30) return 100
  // Logarithmic-ish curve for natural diminishing returns
  return Math.min(100, Math.round((Math.log(days + 1) / Math.log(31)) * 100))
}

// ---------------------------------------------------------------------------
// Core Calculation
// ---------------------------------------------------------------------------

/**
 * Calculate the composite Go/No-Go score for a bid.
 *
 * @param input   Raw scoring values from the analyst
 * @param weights Optional custom weights (defaults are used for missing keys)
 * @returns       Detailed scoring result with breakdown
 *
 * @example
 * ```ts
 * const result = calculateScore({
 *   fit_score: 4,
 *   requirements_met: 85,
 *   doc_complexity: 2,
 *   estimated_margin: 30,
 *   competition_level: 3,
 *   prior_experience: 2,
 *   entity_history: 70,
 *   time_available: 20,
 *   legal_risk: 1,
 *   effort_ratio: 65,
 * })
 * console.log(result.total_score) // e.g. 72.5
 * console.log(result.recommendation) // 'participar'
 * ```
 */
export function calculateScore(
  input: ScoringInput,
  weights?: Partial<ScoringWeights>,
): ScoringResult {
  const w: ScoringWeights = { ...DEFAULT_WEIGHTS, ...weights }

  // --- Normalise each variable ---
  const normalised: Record<keyof ScoringInput, number> = {
    fit_score: normalizeScale5(input.fit_score),
    requirements_met: normalizePercent(input.requirements_met),
    doc_complexity: normalizeScale5(input.doc_complexity, true),
    estimated_margin: normalizePercent(input.estimated_margin),
    competition_level: normalizeScale5(input.competition_level, true),
    prior_experience: normalizeExperience(input.prior_experience),
    entity_history: normalizePercent(input.entity_history),
    time_available: normalizeTimeAvailable(input.time_available),
    legal_risk: normalizeScale5(input.legal_risk, true),
    effort_ratio: normalizePercent(input.effort_ratio),
  }

  // --- Build breakdown & compute weighted total ---
  const variables = Object.keys(w) as (keyof ScoringWeights)[]
  const breakdown: ScoringBreakdownItem[] = []
  let totalScore = 0

  for (const key of variables) {
    const norm = normalised[key]
    const weight = w[key]
    const weighted = (norm * weight) / 100

    breakdown.push({
      variable: key,
      raw_value: input[key],
      normalized: Math.round(norm * 100) / 100,
      weight,
      weighted_score: Math.round(weighted * 100) / 100,
    })

    totalScore += weighted
  }

  totalScore = Math.round(totalScore * 100) / 100

  // --- Auto-discard rules ---
  const discardReasons: string[] = []

  if (input.requirements_met < 50) {
    discardReasons.push('Requisitos cumplibles por debajo del 50%')
  }
  if (input.time_available < 3) {
    discardReasons.push('Menos de 3 dias disponibles para preparacion')
  }
  if (input.legal_risk === 5) {
    discardReasons.push('Riesgo legal maximo (nivel 5)')
  }

  const autoDiscard = discardReasons.length > 0

  // --- Determine level ---
  let level: ScoreLevel
  if (autoDiscard) {
    level = 'descarte'
  } else if (totalScore >= 75) {
    level = 'alta'
  } else if (totalScore >= 50) {
    level = 'media'
  } else if (totalScore >= 25) {
    level = 'baja'
  } else {
    level = 'descarte'
  }

  // --- Recommendation ---
  let recommendation: ScoringResult['recommendation']
  if (autoDiscard || level === 'descarte') {
    recommendation = 'descartar'
  } else if (level === 'alta') {
    recommendation = 'participar'
  } else {
    recommendation = 'revisar'
  }

  return {
    total_score: totalScore,
    level,
    breakdown,
    auto_discard: autoDiscard,
    discard_reasons: discardReasons,
    recommendation,
  }
}
