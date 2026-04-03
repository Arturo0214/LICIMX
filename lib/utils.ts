import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { PipelineStage, ScoreLevel, TaskPriority } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined, currency: string = "MXN"): string {
  if (amount == null) return "—"
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format amount as compact string: $15M, $2.3B, etc. */
export function formatCurrencyCompact(amount: number | null | undefined): string {
  if (amount == null) return "—"
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

export function formatDate(date: string | Date | null | undefined, pattern: string = "d MMM yyyy"): string {
  if (!date) return "—"
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, pattern, { locale: es })
}

/** Format relative date (e.g. "en 5 dias", "hace 2 dias") */
export function formatRelativeDate(dateString: string | null | undefined): string {
  if (!dateString) return "—"
  const now = new Date()
  const target = new Date(dateString)
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "hoy"
  if (diffDays === 1) return "manana"
  if (diffDays === -1) return "ayer"
  if (diffDays > 0) return `en ${diffDays} dias`
  return `hace ${Math.abs(diffDays)} dias`
}

/** Get urgency color based on days remaining */
export function getUrgencyColor(dateString: string | null | undefined): string {
  if (!dateString) return "text-muted-foreground"
  const now = new Date()
  const target = new Date(dateString)
  const diffDays = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return "text-red-400"
  if (diffDays <= 3) return "text-red-400"
  if (diffDays <= 7) return "text-amber-400"
  if (diffDays <= 14) return "text-yellow-400"
  return "text-muted-foreground"
}

/** Get color for score value */
export function getScoreColor(score: number | null | undefined): string {
  if (score == null) return "text-muted-foreground"
  if (score >= 80) return "text-success"
  if (score >= 60) return "text-yellow-400"
  if (score >= 40) return "text-amber-400"
  return "text-red-400"
}

/** Get background color for score */
export function getScoreBgColor(score: number | null | undefined): string {
  if (score == null) return "bg-muted"
  if (score >= 80) return "bg-success/15"
  if (score >= 60) return "bg-yellow-500/15"
  if (score >= 40) return "bg-amber-500/15"
  return "bg-red-500/15"
}

const stageConfig: Record<PipelineStage, { label: string; color: string; dotColor: string }> = {
  detectada: { label: "Detectada", color: "bg-slate-500/15 text-slate-400", dotColor: "bg-slate-400" },
  analizando: { label: "Analizando", color: "bg-blue-500/15 text-blue-400", dotColor: "bg-blue-400" },
  aprobada: { label: "Aprobada", color: "bg-violet-500/15 text-violet-400", dotColor: "bg-violet-400" },
  en_preparacion: { label: "En Preparacion", color: "bg-indigo-500/15 text-indigo-400", dotColor: "bg-indigo-400" },
  presentada: { label: "Presentada", color: "bg-cyan-500/15 text-cyan-400", dotColor: "bg-cyan-400" },
  en_evaluacion: { label: "En Evaluacion", color: "bg-amber-500/15 text-amber-400", dotColor: "bg-amber-400" },
  fallo: { label: "Fallo", color: "bg-orange-500/15 text-orange-400", dotColor: "bg-orange-400" },
  ganada: { label: "Ganada", color: "bg-success/15 text-success", dotColor: "bg-success" },
  perdida: { label: "Perdida", color: "bg-red-500/15 text-red-400", dotColor: "bg-red-400" },
  desierta: { label: "Desierta", color: "bg-muted text-muted-foreground", dotColor: "bg-muted-foreground" },
  descartada: { label: "Descartada", color: "bg-muted text-muted-foreground", dotColor: "bg-muted-foreground" },
}

/** Get human-readable label for pipeline stage */
export function getStageLabel(stage: PipelineStage): string {
  return stageConfig[stage]?.label ?? stage
}

/** Get CSS classes for pipeline stage badge */
export function getStageColor(stage: PipelineStage): string {
  return stageConfig[stage]?.color ?? "bg-muted text-muted-foreground"
}

/** Get CSS class for pipeline stage dot */
export function getStageDotColor(stage: PipelineStage): string {
  return stageConfig[stage]?.dotColor ?? "bg-muted-foreground"
}

/** Get label for bid type */
export function getBidTypeLabel(type: string): string {
  const map: Record<string, string> = {
    publica: "Publica",
    invitacion: "Invitacion a 3",
    adjudicacion_directa: "Adj. Directa",
  }
  return map[type] ?? type
}

/** Get label for score level */
export function getScoreLevelLabel(level: ScoreLevel | null | undefined): string {
  if (!level) return "—"
  const map: Record<ScoreLevel, string> = {
    alta: "Alta",
    media: "Media",
    baja: "Baja",
    descarte: "Descarte",
  }
  return map[level] ?? level
}

// ---------------------------------------------------------------------------
// Additional utility functions
// ---------------------------------------------------------------------------

/**
 * Full date format in Spanish: "2 de abril de 2026"
 */
export function formatDateFull(date: string | Date | null | undefined): string {
  if (!date) return "—"
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: es })
}

/**
 * Number of calendar days until the given date.
 * Positive = future, negative = past, 0 = today.
 */
export function daysUntil(date: string | Date): number {
  const target = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Map a 0-100 numeric score to a qualitative level.
 */
export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 75) return "alta"
  if (score >= 50) return "media"
  if (score >= 25) return "baja"
  return "descarte"
}

/** Tailwind classes for a task priority badge */
export function getPriorityColor(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    alta: "text-red-500 bg-red-500/15",
    media: "text-yellow-500 bg-yellow-500/15",
    baja: "text-teal-500 bg-teal-500/15",
  }
  return map[priority] ?? "text-muted-foreground bg-muted"
}

/** Truncate a string to `length` characters, appending "..." if trimmed. */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trimEnd() + "..."
}

/**
 * Generate a random UUID v4 string.
 * Uses `crypto.randomUUID` when available, falls back to a polyfill.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
