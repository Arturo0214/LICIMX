"use client"

import { cn } from "@/lib/utils"
import type { BidScore } from "@/types"

interface ScoreBreakdownProps {
  scores: BidScore[]
  totalScore: number | null
}

const VARIABLE_LABELS: Record<string, string> = {
  alineacion_estrategica: "Alineacion Estrategica",
  capacidad_tecnica: "Capacidad Tecnica",
  competitividad_precio: "Competitividad de Precio",
  experiencia_entidad: "Experiencia con Entidad",
  riesgo: "Nivel de Riesgo",
  experiencia_previa: "Experiencia Previa",
  cumplimiento_legal: "Cumplimiento Legal",
  margen_utilidad: "Margen de Utilidad",
  riesgo_operativo: "Riesgo Operativo",
  precio_competitivo: "Precio Competitivo",
}

function getBarColor(value: number): string {
  if (value >= 80) return "bg-success"
  if (value >= 60) return "bg-yellow-500"
  if (value >= 40) return "bg-amber-500"
  return "bg-red-500"
}

function getBarBg(value: number): string {
  if (value >= 80) return "bg-success/10"
  if (value >= 60) return "bg-yellow-500/10"
  if (value >= 40) return "bg-amber-500/10"
  return "bg-red-500/10"
}

export function ScoreBreakdown({ scores, totalScore }: ScoreBreakdownProps) {
  const sortedScores = [...scores].sort((a, b) => b.weight - a.weight)

  return (
    <div className="space-y-6">
      {/* Total score header */}
      <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold",
            totalScore != null && totalScore >= 80
              ? "bg-success/15 text-success ring-2 ring-success/30"
              : totalScore != null && totalScore >= 60
              ? "bg-yellow-500/15 text-yellow-400 ring-2 ring-yellow-500/30"
              : totalScore != null && totalScore >= 40
              ? "bg-amber-500/15 text-amber-400 ring-2 ring-amber-500/30"
              : "bg-red-500/15 text-red-400 ring-2 ring-red-500/30"
          )}
        >
          {totalScore ?? "—"}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Score Total Ponderado</p>
          <p className="text-xs text-muted-foreground">
            Basado en {scores.length} variables con pesos configurados
          </p>
        </div>
      </div>

      {/* Horizontal bar chart */}
      <div className="space-y-4">
        {sortedScores.map((score) => {
          const label = VARIABLE_LABELS[score.variable] || score.variable
          return (
            <div key={score.id}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">
                    Peso: {score.weight}%
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      score.normalized_value >= 80
                        ? "text-success"
                        : score.normalized_value >= 60
                        ? "text-yellow-400"
                        : score.normalized_value >= 40
                        ? "text-amber-400"
                        : "text-red-400"
                    )}
                  >
                    {score.normalized_value}
                  </span>
                </div>
              </div>
              <div className={cn("h-3 w-full overflow-hidden rounded-full", getBarBg(score.normalized_value))}>
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    getBarColor(score.normalized_value)
                  )}
                  style={{ width: `${score.normalized_value}%` }}
                />
              </div>
              {score.notes && (
                <p className="mt-1 text-[10px] text-muted-foreground/60">{score.notes}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Weighted contributions */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Contribucion Ponderada
        </p>
        <div className="space-y-2">
          {sortedScores.map((score) => {
            const label = VARIABLE_LABELS[score.variable] || score.variable
            return (
              <div key={score.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-medium text-foreground">
                  {score.weighted_score.toFixed(1)} pts
                </span>
              </div>
            )
          })}
          <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Total</span>
            <span className="font-mono text-sm font-bold text-success">
              {scores.reduce((sum, s) => sum + s.weighted_score, 0).toFixed(1)} pts
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
