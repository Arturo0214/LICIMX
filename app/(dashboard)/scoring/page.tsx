"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  Target, RotateCcw, Save, Zap, ShieldAlert, TrendingUp, Scale,
  FileCheck, Users, Clock, DollarSign, Building2, AlertTriangle, ChevronRight,
} from "lucide-react"

interface ScoringVariable { id: string; name: string; description: string; defaultWeight: number; icon: React.ReactNode }

const defaultVariables: ScoringVariable[] = [
  { id: "margen", name: "Margen Estimado", description: "Margen de utilidad proyectado sobre el monto de la licitacion", defaultWeight: 15, icon: <DollarSign className="h-4 w-4" /> },
  { id: "experiencia", name: "Experiencia Previa", description: "Contratos similares ejecutados en los ultimos 5 anos", defaultWeight: 12, icon: <FileCheck className="h-4 w-4" /> },
  { id: "capacidad_tecnica", name: "Capacidad Tecnica", description: "Cumplimiento de especificaciones tecnicas requeridas", defaultWeight: 14, icon: <Zap className="h-4 w-4" /> },
  { id: "requisitos", name: "Requisitos Cumplidos", description: "Porcentaje de requisitos documentales que se pueden cumplir", defaultWeight: 13, icon: <ShieldAlert className="h-4 w-4" /> },
  { id: "competencia", name: "Nivel de Competencia", description: "Numero estimado de competidores y fortaleza relativa", defaultWeight: 8, icon: <Users className="h-4 w-4" /> },
  { id: "plazo_entrega", name: "Plazo de Entrega", description: "Dias disponibles para preparar y entregar la propuesta", defaultWeight: 10, icon: <Clock className="h-4 w-4" /> },
  { id: "monto", name: "Monto de la Licitacion", description: "Valor economico del contrato en relacion al tamano de la empresa", defaultWeight: 8, icon: <TrendingUp className="h-4 w-4" /> },
  { id: "riesgo_legal", name: "Riesgo Legal", description: "Evaluacion de clausulas penales, garantias y riesgos contractuales", defaultWeight: 7, icon: <Scale className="h-4 w-4" /> },
  { id: "relacion_entidad", name: "Relacion con Entidad", description: "Historial y relacion comercial con la dependencia convocante", defaultWeight: 6, icon: <Building2 className="h-4 w-4" /> },
  { id: "alineacion", name: "Alineacion Estrategica", description: "Que tanto se alinea con los objetivos estrategicos de la empresa", defaultWeight: 7, icon: <Target className="h-4 w-4" /> },
]

interface DiscardRule { id: string; label: string; description: string; enabled: boolean }

const defaultDiscardRules: DiscardRule[] = [
  { id: "req_min", label: "Requisitos minimos", description: "Si requisitos cumplidos < 50% -> Descartar", enabled: true },
  { id: "plazo_min", label: "Plazo insuficiente", description: "Si dias para entrega < 3 -> Descartar", enabled: true },
  { id: "riesgo_max", label: "Riesgo legal critico", description: "Si riesgo legal = 5 -> Descartar", enabled: true },
  { id: "monto_min", label: "Monto muy bajo", description: "Si monto < $100,000 MXN -> Descartar", enabled: false },
  { id: "competencia_max", label: "Competencia excesiva", description: "Si competidores > 15 -> Descartar", enabled: false },
]

const sampleInputs = [
  { variable: "Margen Estimado", value: 78 }, { variable: "Experiencia Previa", value: 90 },
  { variable: "Capacidad Tecnica", value: 85 }, { variable: "Requisitos Cumplidos", value: 92 },
  { variable: "Nivel de Competencia", value: 60 }, { variable: "Plazo de Entrega", value: 70 },
  { variable: "Monto de la Licitacion", value: 65 }, { variable: "Riesgo Legal", value: 45 },
  { variable: "Relacion con Entidad", value: 80 }, { variable: "Alineacion Estrategica", value: 75 },
]

function getScoreLevel(score: number): { label: string; color: string } {
  if (score >= 75) return { label: "Alta", color: "bg-success/15 text-success border-success/30" }
  if (score >= 50) return { label: "Media", color: "bg-amber-500/15 text-amber-500 border-amber-500/30" }
  if (score >= 25) return { label: "Baja", color: "bg-orange-500/15 text-orange-500 border-orange-500/30" }
  return { label: "Descarte", color: "bg-destructive/15 text-destructive border-destructive/30" }
}

export default function ScoringPage() {
  const [weights, setWeights] = useState<Record<string, number>>(
    Object.fromEntries(defaultVariables.map((v) => [v.id, v.defaultWeight]))
  )
  const [discardRules, setDiscardRules] = useState<DiscardRule[]>(defaultDiscardRules)

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)

  const handleWeightChange = (id: string, value: number) => {
    setWeights((prev) => ({ ...prev, [id]: value }))
  }

  const handleRestore = () => {
    setWeights(Object.fromEntries(defaultVariables.map((v) => [v.id, v.defaultWeight])))
    setDiscardRules(defaultDiscardRules)
  }

  const toggleRule = (id: string) => {
    setDiscardRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
  }

  const simulatedScore = Math.round(
    sampleInputs.reduce((acc, input, i) => {
      const variable = defaultVariables[i]
      const w = weights[variable.id] || 0
      return acc + (input.value * w) / 100
    }, 0)
  )
  const scoreLevel = getScoreLevel(simulatedScore)

  const radarPoints = defaultVariables.map((v, i) => {
    const angle = (Math.PI * 2 * i) / defaultVariables.length - Math.PI / 2
    const normalizedWeight = (weights[v.id] / 20)
    const r = Math.min(normalizedWeight, 1) * 90
    return { x: 100 + r * Math.cos(angle), y: 100 + r * Math.sin(angle), labelX: 100 + 110 * Math.cos(angle), labelY: 100 + 110 * Math.sin(angle), name: v.name.split(" ")[0] }
  })
  const radarPath = radarPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sistema de Scoring</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configura los pesos de cada variable para evaluar automaticamente las licitaciones y priorizar las de mayor oportunidad.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Variables de Scoring</CardTitle>
                  <CardDescription>Ajusta el peso de cada variable. El total debe sumar 100.</CardDescription>
                </div>
                <div className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold tabular-nums",
                  totalWeight === 100 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                )}>
                  Total: {totalWeight}/100
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {defaultVariables.map((variable) => (
                <div key={variable.id} className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-muted/50">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                    {variable.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{variable.name}</div>
                    <div className="text-xs text-muted-foreground">{variable.description}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="range" min={0} max={100} value={weights[variable.id]}
                      onChange={(e) => handleWeightChange(variable.id, Number(e.target.value))}
                      className="h-1.5 w-32 cursor-pointer appearance-none rounded-full bg-border accent-primary [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                    <span className="w-10 text-right text-sm font-semibold tabular-nums text-foreground">{weights[variable.id]}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button><Save className="mr-2 h-4 w-4" />Guardar Configuracion</Button>
            <Button variant="outline" onClick={handleRestore}><RotateCcw className="mr-2 h-4 w-4" />Restaurar Defaults</Button>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simular Score</CardTitle>
              <CardDescription>Vista previa con datos de ejemplo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-5 py-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Score Total</div>
                  <div className="mt-1 text-3xl font-bold tabular-nums text-foreground">{simulatedScore}</div>
                </div>
                <Badge className={cn("text-sm px-3 py-1 border", scoreLevel.color)}>{scoreLevel.label}</Badge>
              </div>

              <div className="flex justify-center">
                <svg viewBox="0 0 200 200" className="h-48 w-48">
                  {[0.25, 0.5, 0.75, 1].map((r) => (
                    <circle key={r} cx={100} cy={100} r={r * 90} fill="none" stroke="var(--border)" strokeWidth={0.5} />
                  ))}
                  {defaultVariables.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / defaultVariables.length - Math.PI / 2
                    return <line key={i} x1={100} y1={100} x2={100 + 90 * Math.cos(angle)} y2={100 + 90 * Math.sin(angle)} stroke="var(--border)" strokeWidth={0.5} />
                  })}
                  <path d={radarPath} fill="rgba(30, 58, 95, 0.15)" stroke="var(--primary)" strokeWidth={1.5} className="dark:fill-[rgba(59,130,246,0.15)]" />
                  {radarPoints.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="var(--primary)" />
                  ))}
                </svg>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Desglose</div>
                {sampleInputs.map((input, i) => {
                  const variable = defaultVariables[i]
                  const w = weights[variable.id]
                  const weighted = Math.round((input.value * w) / 100)
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{input.variable}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{input.value} x {w}%</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                        <span className="w-6 text-right font-semibold tabular-nums text-foreground">{weighted}</span>
                      </div>
                    </div>
                  )
                })}
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-sm font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{simulatedScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Reglas de Descarte Automatico
          </CardTitle>
          <CardDescription>Las licitaciones que cumplan estas condiciones seran descartadas automaticamente del pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {discardRules.map((rule) => (
              <div key={rule.id} className={cn(
                "flex items-center justify-between rounded-lg border px-4 py-3 transition-colors",
                rule.enabled ? "border-warning/20 bg-warning/5" : "border-border bg-muted/50"
              )}>
                <div>
                  <div className="text-sm font-medium text-foreground">{rule.label}</div>
                  <div className="text-xs text-muted-foreground font-mono">{rule.description}</div>
                </div>
                <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
