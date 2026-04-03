"use client"

import { cn } from "@/lib/utils"
import {
  formatCurrency,
  formatDate,
  getBidTypeLabel,
  getStageColor,
} from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  DollarSign,
  CalendarDays,
  Landmark,
} from "lucide-react"
import type { Bid, Milestone } from "@/types"

interface BidInfoCardsProps {
  bid: Bid
  milestones: Milestone[]
}

export function BidInfoCards({ bid, milestones }: BidInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Card 1: Datos Generales */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Datos Generales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="Entidad" value={bid.contracting_entity} />
          <InfoRow label="Unidad" value={bid.buying_unit || "—"} />
          <InfoRow label="Tipo" value={getBidTypeLabel(bid.bid_type)} />
          <InfoRow label="Publicacion" value={formatDate(bid.published_at)} />
          <InfoRow label="No. Procedimiento" value={bid.procedure_number} mono />
          {bid.source_portal && (
            <InfoRow
              label="Portal"
              value={bid.source_portal === "compranet" ? "CompraNet" : bid.source_portal}
            />
          )}
        </CardContent>
      </Card>

      {/* Card 2: Montos */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Montos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow
            label="Presupuesto estimado"
            value={formatCurrency(bid.estimated_amount)}
            highlight
          />
          {bid.minimum_amount != null && (
            <InfoRow label="Monto minimo" value={formatCurrency(bid.minimum_amount)} />
          )}
          {bid.maximum_amount != null && (
            <InfoRow label="Monto maximo" value={formatCurrency(bid.maximum_amount)} />
          )}
          {bid.guarantee_amount != null && (
            <InfoRow label="Garantia" value={formatCurrency(bid.guarantee_amount)} />
          )}
          <InfoRow label="Moneda" value={bid.currency} />
          {bid.awarded_amount != null && (
            <InfoRow
              label="Monto adjudicado"
              value={formatCurrency(bid.awarded_amount)}
              highlight
            />
          )}
        </CardContent>
      </Card>

      {/* Card 3: Fechas Clave */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Fechas Clave
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {milestones.map((milestone, idx) => (
              <div key={milestone.id} className="flex gap-3 pb-4 last:pb-0">
                {/* Timeline dot and line */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={cn(
                      "z-10 h-2.5 w-2.5 rounded-full border-2 mt-1",
                      milestone.is_completed
                        ? "border-success bg-success"
                        : "border-border bg-card"
                    )}
                  />
                  {idx < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-border" />
                  )}
                </div>
                {/* Content */}
                <div className="min-w-0 flex-1 pb-1">
                  <p
                    className={cn(
                      "text-xs font-medium leading-tight",
                      milestone.is_completed ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {milestone.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    {formatDate(milestone.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Score overview (simple) */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Landmark className="h-4 w-4 text-muted-foreground" />
            Resumen de Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-4">
          {bid.total_score != null ? (
            <>
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold",
                  bid.total_score >= 80
                    ? "bg-success/15 text-success ring-2 ring-success/30"
                    : bid.total_score >= 60
                    ? "bg-yellow-500/15 text-yellow-400 ring-2 ring-yellow-500/30"
                    : bid.total_score >= 40
                    ? "bg-amber-500/15 text-amber-400 ring-2 ring-amber-500/30"
                    : "bg-red-500/15 text-red-400 ring-2 ring-red-500/30"
                )}
              >
                {bid.total_score}
              </div>
              <Badge
                className={cn(
                  "border-0 text-xs",
                  getStageColor(bid.pipeline_stage)
                )}
              >
                Viabilidad {bid.score_level === "alta" ? "Alta" : bid.score_level === "media" ? "Media" : "Baja"}
              </Badge>
              <p className="text-center text-[11px] text-muted-foreground">
                Basado en 5 variables de evaluacion
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Sin evaluacion</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function InfoRow({
  label,
  value,
  highlight,
  mono,
}: {
  label: string
  value: string
  highlight?: boolean
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span
        className={cn(
          "text-right text-xs leading-tight",
          highlight ? "font-semibold text-foreground" : "text-foreground",
          mono && "font-mono text-[11px]"
        )}
      >
        {value}
      </span>
    </div>
  )
}
