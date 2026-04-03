"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn, formatDate } from "@/lib/utils"
import { useProposals, useBids } from "@/lib/store/hooks"
import type { ProposalStatusType } from "@/lib/store/hooks"
import {
  FileText,
  Search,
  Eye,
  Pencil,
  Copy,
  Library,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react"

const statusConfig: Record<ProposalStatusType, { label: string; color: string; next: string }> = {
  borrador: { label: "En borrador", color: "bg-muted text-muted-foreground border-border", next: "Enviar a revision" },
  revision: { label: "En revision", color: "bg-amber-500/15 text-amber-500 border-amber-500/30", next: "Aprobar" },
  aprobada: { label: "Aprobada", color: "bg-success/15 text-success border-success/30", next: "Marcar como enviada" },
  enviada: { label: "Enviada", color: "bg-blue-500/15 text-blue-500 border-blue-500/30", next: "" },
}

const typeConfigMap = {
  tecnica: { label: "Tecnica", color: "bg-violet-500/15 text-violet-500 border-violet-500/30" },
  economica: { label: "Economica", color: "bg-teal-500/15 text-teal-500 border-teal-500/30" },
}

const filterOptions: { value: ProposalStatusType | "todos"; label: string }[] = [
  { value: "todos", label: "Todas" },
  { value: "borrador", label: "En borrador" },
  { value: "revision", label: "En revision" },
  { value: "aprobada", label: "Aprobadas" },
  { value: "enviada", label: "Enviadas" },
]

const mockReusableSections = [
  { id: "1", title: "Descripcion de la Empresa y Experiencia", category: "Introduccion", usageCount: 24, lastUsed: "2026-03-28" },
  { id: "2", title: "Metodologia de Implementacion Agile", category: "Metodologia", usageCount: 18, lastUsed: "2026-04-01" },
  { id: "3", title: "Plan de Gestion de Riesgos", category: "Gestion", usageCount: 15, lastUsed: "2026-03-25" },
  { id: "4", title: "Equipo Clave y Perfiles Profesionales", category: "RRHH", usageCount: 22, lastUsed: "2026-04-02" },
  { id: "5", title: "Politica de Calidad ISO 9001", category: "Calidad", usageCount: 20, lastUsed: "2026-03-20" },
  { id: "6", title: "Cronograma de Entregables Estandar", category: "Planeacion", usageCount: 16, lastUsed: "2026-03-30" },
  { id: "7", title: "Clausulas de Confidencialidad", category: "Legal", usageCount: 12, lastUsed: "2026-03-18" },
  { id: "8", title: "Garantias y Soporte Post-Venta", category: "Servicio", usageCount: 14, lastUsed: "2026-03-22" },
]

export default function PropuestasPage() {
  const { proposals, loaded, addProposal, advanceStatus } = useProposals()
  const { bids } = useBids()

  const [activeFilter, setActiveFilter] = useState<ProposalStatusType | "todos">("todos")
  const [sectionSearch, setSectionSearch] = useState("")

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newBidId, setNewBidId] = useState("")
  const [newType, setNewType] = useState<"tecnica" | "economica">("tecnica")
  const [newAssignee, setNewAssignee] = useState("")

  const filtered = activeFilter === "todos" ? proposals : proposals.filter((p) => p.status === activeFilter)

  const filteredSections = mockReusableSections.filter((s) =>
    s.title.toLowerCase().includes(sectionSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(sectionSearch.toLowerCase())
  )

  const activeBids = bids.filter((b) =>
    !["ganada", "perdida", "desierta", "descartada"].includes(b.pipeline_stage)
  )

  const handleCreate = () => {
    const bid = bids.find((b) => b.id === newBidId)
    if (!bid) return
    const initials = newAssignee
      ? newAssignee.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "NN"

    addProposal({
      bidId: bid.id,
      bidTitle: bid.title,
      type: newType,
      version: 1,
      status: "borrador",
      progress: 0,
      lastModified: new Date().toISOString().split("T")[0],
      assignedTo: { name: newAssignee || "Sin asignar", initials },
    })
    setDialogOpen(false)
    setNewBidId("")
    setNewType("tecnica")
    setNewAssignee("")
  }

  if (!loaded) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Propuestas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona las propuestas tecnicas y economicas de cada licitacion.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Propuesta
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 w-fit">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              activeFilter === opt.value ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
            {opt.value !== "todos" && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[10px]">
                {proposals.filter((p) => p.status === opt.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((proposal) => {
          const status = statusConfig[proposal.status]
          const type = typeConfigMap[proposal.type]
          return (
            <Card key={proposal.id} className="transition-colors hover:border-primary/30">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-foreground leading-tight">{proposal.bidTitle}</h3>
                    <Badge className={cn("shrink-0 border text-[10px]", status.color)}>{status.label}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("border text-[10px]", type.color)}>{type.label}</Badge>
                    <span className="text-xs text-muted-foreground">v{proposal.version}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-semibold tabular-nums text-foreground">{proposal.progress}%</span>
                  </div>
                  <Progress
                    value={proposal.progress}
                    className="h-1.5"
                    indicatorClassName={cn(
                      proposal.progress === 100 ? "bg-success" : proposal.progress > 50 ? "bg-blue-500" : "bg-amber-500"
                    )}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">{proposal.assignedTo.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(proposal.lastModified)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {proposal.status !== "enviada" && (
                      <button
                        onClick={() => advanceStatus(proposal.id)}
                        className="rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        title={status.next}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Ver">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Editar">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Duplicar">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No hay propuestas con este filtro.
          </div>
        )}
      </div>

      {/* Reusable Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Secciones Reutilizables</h2>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar seccion..."
              value={sectionSearch}
              onChange={(e) => setSectionSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {filteredSections.map((section) => (
            <div key={section.id} className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground leading-tight">{section.title}</div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-[10px] px-1.5">{section.category}</Badge>
                  <span className="text-muted-foreground">Usado {section.usageCount}x</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Propuesta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Licitacion *</Label>
              <Select value={newBidId} onValueChange={setNewBidId}>
                <SelectTrigger><SelectValue placeholder="Selecciona una licitacion" /></SelectTrigger>
                <SelectContent>
                  {activeBids.map((bid) => (
                    <SelectItem key={bid.id} value={bid.id}>
                      {bid.title.slice(0, 60)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de propuesta</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as "tecnica" | "economica")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnica">Tecnica</SelectItem>
                  <SelectItem value="economica">Economica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Asignado a</Label>
              <Input placeholder="Nombre del responsable" value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={!newBidId}>Crear</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
