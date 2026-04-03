"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { getStageLabel } from "@/lib/utils"
import { KanbanColumn } from "@/components/pipeline/kanban-column"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, SlidersHorizontal } from "lucide-react"
import type { Bid, PipelineStage, BidType } from "@/types"

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
  onAddBid: (bid: Omit<Bid, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => Bid
  onMoveBid: (id: string, stage: PipelineStage) => void
}

export function KanbanBoard({ bids, userNames, onAddBid, onMoveBid }: KanbanBoardProps) {
  const [search, setSearch] = useState("")
  const [sectorFilter, setSectorFilter] = useState("todos")
  const [scoreFilter, setScoreFilter] = useState("todos")
  const [showFilters, setShowFilters] = useState(false)

  // Add bid dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogStage, setDialogStage] = useState<PipelineStage>("detectada")
  const [newTitle, setNewTitle] = useState("")
  const [newEntity, setNewEntity] = useState("")
  const [newType, setNewType] = useState<BidType>("publica")
  const [newAmount, setNewAmount] = useState("")

  // Drag state
  const [draggedBidId, setDraggedBidId] = useState<string | null>(null)

  const filteredBids = useMemo(() => {
    return bids.filter((bid) => {
      if (search) {
        const q = search.toLowerCase()
        const matches =
          bid.title.toLowerCase().includes(q) ||
          bid.contracting_entity.toLowerCase().includes(q) ||
          bid.procedure_number.toLowerCase().includes(q)
        if (!matches) return false
      }

      if (sectorFilter !== "todos") {
        const hasSector = bid.tags?.some((t) =>
          t.toLowerCase().includes(sectorFilter.toLowerCase())
        )
        if (!hasSector) return false
      }

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

  const handleOpenAddDialog = (stage: PipelineStage) => {
    setDialogStage(stage)
    setNewTitle("")
    setNewEntity("")
    setNewType("publica")
    setNewAmount("")
    setDialogOpen(true)
  }

  const handleCreateBid = () => {
    if (!newTitle.trim() || !newEntity.trim()) return
    onAddBid({
      title: newTitle.trim(),
      contracting_entity: newEntity.trim(),
      bid_type: newType,
      pipeline_stage: dialogStage,
      procedure_number: `LA-${Date.now().toString().slice(-9)}-2026`,
      estimated_amount: newAmount ? Number(newAmount) : null,
      currency: 'MXN',
      description: null,
      buying_unit: null,
      minimum_amount: null,
      maximum_amount: null,
      guarantee_amount: null,
      total_score: null,
      score_level: null,
      auto_discarded: false,
      published_at: new Date().toISOString(),
      clarification_meeting_at: null,
      proposal_deadline: null,
      technical_opening_at: null,
      economic_opening_at: null,
      ruling_date: null,
      contract_start_date: null,
      contract_end_date: null,
      tags: [],
      assigned_user_id: null,
      result: null,
      awarded_amount: null,
      winner_name: null,
      source_url: null,
      source_portal: null,
      notes: null,
      metadata: null,
    })
    setDialogOpen(false)
  }

  const handleDragStart = (bidId: string) => {
    setDraggedBidId(bidId)
  }

  const handleDrop = (stage: PipelineStage) => {
    if (draggedBidId) {
      onMoveBid(draggedBidId, stage)
      setDraggedBidId(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedBidId(null)
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
            onAdd={() => handleOpenAddDialog(stage)}
            onDragStart={handleDragStart}
            onDrop={() => handleDrop(stage)}
            onDragEnd={handleDragEnd}
            isDragOver={false}
          />
        ))}
      </div>

      {/* Add Bid Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Licitacion - {getStageLabel(dialogStage)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Titulo *</Label>
              <Input
                placeholder="Nombre de la licitacion"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Dependencia *</Label>
              <Input
                placeholder="Entidad contratante"
                value={newEntity}
                onChange={(e) => setNewEntity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de procedimiento</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as BidType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publica">Publica</SelectItem>
                  <SelectItem value="invitacion">Invitacion a 3</SelectItem>
                  <SelectItem value="adjudicacion_directa">Adj. Directa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Monto estimado (MXN)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateBid} disabled={!newTitle.trim() || !newEntity.trim()}>
                Crear Licitacion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
