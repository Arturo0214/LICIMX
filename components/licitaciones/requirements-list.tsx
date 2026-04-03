"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, AlertTriangle, ShieldAlert } from "lucide-react"
import type { BidRequirement, RequirementCategory } from "@/types"

interface RequirementsListProps {
  requirements: BidRequirement[]
}

const CATEGORY_LABELS: Record<RequirementCategory, string> = {
  documental: "Documental",
  tecnico: "Tecnico",
  legal: "Legal",
  financiero: "Financiero",
  experiencia: "Experiencia",
  administrativo: "Administrativo",
}

const CATEGORY_ICONS: Record<RequirementCategory, string> = {
  documental: "text-blue-400",
  tecnico: "text-violet-400",
  legal: "text-amber-400",
  financiero: "text-success",
  experiencia: "text-cyan-400",
  administrativo: "text-orange-400",
}

export function RequirementsList({ requirements }: RequirementsListProps) {
  const grouped = useMemo(() => {
    const groups: Record<string, BidRequirement[]> = {}
    for (const req of requirements) {
      if (!groups[req.category]) groups[req.category] = []
      groups[req.category].push(req)
    }
    return groups
  }, [requirements])

  const metCount = requirements.filter((r) => r.is_met === true).length
  const totalCount = requirements.length
  const progress = totalCount > 0 ? Math.round((metCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Progreso de Cumplimiento
          </span>
          <span className="text-sm font-bold text-foreground">
            {metCount} de {totalCount} requisitos cumplidos ({progress}%)
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2.5 bg-muted"
          indicatorClassName={cn(
            progress >= 80
              ? "bg-success"
              : progress >= 50
              ? "bg-yellow-500"
              : "bg-red-500"
          )}
        />
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            {metCount} cumplidos
          </span>
          <span className="flex items-center gap-1">
            <Circle className="h-3.5 w-3.5 text-muted-foreground/60" />
            {requirements.filter((r) => r.is_met === false).length} pendientes
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            {requirements.filter((r) => r.is_met == null).length} sin evaluar
          </span>
          <span className="flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
            {requirements.filter((r) => r.is_mandatory && r.is_met === false).length} eliminatorios pendientes
          </span>
        </div>
      </div>

      {/* Grouped requirements */}
      {Object.entries(grouped).map(([category, reqs]) => {
        const catMetCount = reqs.filter((r) => r.is_met === true).length
        return (
          <div key={category}>
            <div className="mb-3 flex items-center gap-2">
              <h3
                className={cn(
                  "text-sm font-semibold",
                  CATEGORY_ICONS[category as RequirementCategory] || "text-muted-foreground"
                )}
              >
                {CATEGORY_LABELS[category as RequirementCategory] || category}
              </h3>
              <span className="text-xs text-muted-foreground">
                {catMetCount}/{reqs.length}
              </span>
            </div>
            <div className="space-y-2">
              {reqs.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors",
                    req.is_met === true
                      ? "border-success/20 bg-success/5"
                      : req.is_met === false
                      ? "border-border bg-card"
                      : "border-border/40 bg-card/20"
                  )}
                >
                  {/* Checkbox icon */}
                  <div className="mt-0.5 shrink-0">
                    {req.is_met === true ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-success" />
                    ) : req.is_met === false ? (
                      <Circle className="h-4.5 w-4.5 text-muted-foreground/60" />
                    ) : (
                      <Circle className="h-4.5 w-4.5 text-border" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p
                        className={cn(
                          "text-sm leading-snug",
                          req.is_met === true
                            ? "text-muted-foreground"
                            : "text-foreground"
                        )}
                      >
                        {req.description}
                      </p>
                      {req.is_mandatory && (
                        <Badge className="shrink-0 border-0 bg-red-500/10 text-[10px] font-medium text-red-400">
                          Eliminatorio
                        </Badge>
                      )}
                    </div>
                    {req.compliance_notes && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {req.compliance_notes}
                      </p>
                    )}
                    {req.source_reference && (
                      <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                        Ref: {req.source_reference}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
