"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { getStageLabel } from "@/lib/utils"
import { KanbanColumn } from "@/components/pipeline/kanban-column"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import type { Bid, PipelineStage } from "@/types"

const KANBAN_STAGES: PipelineStage[] = [
  "detectada",
  "analizando",
  "aprobada",
  "en_preparacion",
  "presentada",
  "en_evaluacion",
  "fallo",
  "ganada",
  "perdida",
]

const SECTORS = [
  { value: "todos", label: "Todos los sectores" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "salud", label: "Salud" },
  { value: "energia", label: "Energia" },
  { value: "educacion", label: "Educacion" },
  { value: "gobierno", label: "Gobierno" },
]

interface KanbanBoardProps {
  bids: Bid[]
  userNames: Record<string, string>
}

export function KanbanBoard({ bids, userNames }: KanbanBoardProps) {
  const [search, setSearch] = useState("")
  const [sectorFilter, setSectorFilter] = useState("todos")
  const [scoreFilter, setScoreFilter] = useState("todos")
  const [showFilters, setShowFilters] = useState(false)

  const filteredBids = useMemo(() => {
    return bids.filter((bid) => {
      // Text search
      if (search) {
        const q = search.toLowerCase()
        const matches =
          bid.title.toLowerCase().includes(q) ||
          bid.contracting_entity.toLowerCase().includes(q) ||
          bid.procedure_number.toLowerCase().includes(q)
        if (!matches) return false
      }

      // Sector filter
      if (sectorFilter !== "todos") {
        const hasSector = bid.tags?.some((t) =>
          t.toLowerCase().includes(sectorFilter.toLowerCase())
        )
        if (!hasSector) return false
      }

      // Score filter
      if (scoreFilter === "alta" && (bid.total_score == null || bid.total_score < 75)) return false
      if (scoreFilter === "media" && (bid.total_score == null || bid.total_score < 50 || bid.total_score >= 75)) return false
      if (scoreFilter === "baja" && (bid.total_score == null || bid.total_score >= 50)) return false

      return true
    })
  }, [bids, search, sectorFilter, scoreFilter])

  const bidsByStage = useMemo(() => {
    const grouped: Record<PipelineStage, Bid[]> = {} as Record<PipelineStage, Bid[]>
    for (const stage of KANBAN_STAGES) {
      grouped[stage] = []
    }
    for (const bid of filteredBids) {
      if (grouped[bid.pipeline_stage]) {
        grouped[bid.pipeline_stage].push(bid)
      }
    }
    return grouped
  }, [filteredBids])

  const getUserName = (id: string | null | undefined): string | undefined => {
    if (!id) return undefined
    return userNames[id]
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar licitaciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 bg-card/50 border-border pl-9 text-sm placeholder:text-muted-foreground"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-2 border-border bg-card/50 text-muted-foreground hover:text-foreground",
            showFilters && "border-primary/30 bg-primary/5 text-primary"
          )}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtros
        </Button>

        {showFilters && (
          <>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="h-9 w-44 border-border bg-card/50 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="h-9 w-40 border-border bg-card/50 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todo score</SelectItem>
                <SelectItem value="alta">Alta (&ge;75)</SelectItem>
                <SelectItem value="media">Media (50-74)</SelectItem>
                <SelectItem value="baja">Baja (&lt;50)</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      {/* Board */}
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 220px)" }}>
        {KANBAN_STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            label={getStageLabel(stage)}
            bids={bidsByStage[stage] || []}
            getUserName={getUserName}
          />
        ))}
      </div>
    </div>
  )
}
