"use client"

import { useMemo } from "react"
import { KanbanBoard } from "@/components/pipeline/kanban-board"
import { mockBids } from "@/lib/data/mock-data"
import { getStageLabel, getStageDotColor, cn } from "@/lib/utils"
import { Kanban } from "lucide-react"
import type { PipelineStage } from "@/types"

const ACTIVE_STAGES: PipelineStage[] = [
  "detectada",
  "analizando",
  "aprobada",
  "en_preparacion",
  "presentada",
  "en_evaluacion",
]

// Simple mock user name lookup
const USER_NAMES: Record<string, string> = {
  "user-mock-001": "Carlos Mendoza",
}

export default function PipelinePage() {
  const stageCounts = useMemo(() => {
    const counts: Partial<Record<PipelineStage, number>> = {}
    for (const bid of mockBids) {
      counts[bid.pipeline_stage] = (counts[bid.pipeline_stage] || 0) + 1
    }
    return counts
  }, [])

  const activeBids = mockBids.filter((b) =>
    !["ganada", "perdida", "desierta", "descartada"].includes(b.pipeline_stage)
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Kanban className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Pipeline de Licitaciones</h1>
            <p className="text-sm text-muted-foreground">
              Visualiza y gestiona el flujo de licitaciones
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
        <span className="text-sm font-medium text-foreground">
          <span className="text-accent font-bold">{activeBids.length}</span> activas
        </span>
        <div className="h-4 w-px bg-border" />
        {ACTIVE_STAGES.map((stage) => {
          const count = stageCounts[stage] || 0
          if (count === 0) return null
          return (
            <div key={stage} className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", getStageDotColor(stage))} />
              <span className="text-xs text-muted-foreground">
                {getStageLabel(stage)}{" "}
                <span className="font-semibold text-foreground">{count}</span>
              </span>
            </div>
          )
        })}
      </div>

      {/* Kanban board */}
      <KanbanBoard bids={mockBids} userNames={USER_NAMES} />
    </div>
  )
}
