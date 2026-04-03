"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
  getScoreColor,
  getScoreBgColor,
  getStageColor,
  getStageLabel,
  getUrgencyColor,
  getBidTypeLabel,
  getPriorityColor,
  generateId,
} from "@/lib/utils"
import { useBids, useDocuments, useRequirements, useTasks } from "@/lib/store/hooks"
import { findScoresByBidId, findMilestonesByBidId } from "@/lib/data/mock-data"
import { BidInfoCards } from "@/components/licitaciones/bid-info-cards"
import { ScoreBreakdown } from "@/components/licitaciones/score-breakdown"
import { BidTimeline } from "@/components/licitaciones/bid-timeline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  MoreHorizontal,
  Edit,
  ArrowRightLeft,
  Archive,
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  User,
  Plus,
  File,
  FileSpreadsheet,
  FileType,
  Save,
} from "lucide-react"
import type { PipelineStage, TaskStatus, TaskPriority } from "@/types"

const PIPELINE_STAGES: { value: PipelineStage; label: string }[] = [
  { value: "detectada", label: "Detectada" },
  { value: "analizando", label: "Analizando" },
  { value: "aprobada", label: "Aprobada" },
  { value: "en_preparacion", label: "En Preparacion" },
  { value: "presentada", label: "Presentada" },
  { value: "en_evaluacion", label: "En Evaluacion" },
  { value: "fallo", label: "Fallo" },
  { value: "ganada", label: "Ganada" },
  { value: "perdida", label: "Perdida" },
  { value: "descartada", label: "Descartada" },
]

const MOCK_ACTIVITY = [
  { id: "al1", action: "create", description: "Creo la licitacion detectada en CompraNet", created_at: "2026-03-15T12:00:00Z", user_name: "Ana Garcia" },
  { id: "al2", action: "upload", description: "Subio las bases de licitacion (PDF, 2.5MB)", created_at: "2026-03-15T13:00:00Z", user_name: "Carlos Mendoza" },
  { id: "al3", action: "upload", description: "Subio el anexo tecnico", created_at: "2026-03-15T14:00:00Z", user_name: "Carlos Mendoza" },
  { id: "al4", action: "stage_change", description: "Cambio etapa de Detectada a Analizando", created_at: "2026-03-16T09:00:00Z", user_name: "Ana Garcia" },
  { id: "al5", action: "score", description: "Realizo scoring inicial: 82 puntos (Alta viabilidad)", created_at: "2026-03-18T09:00:00Z", user_name: "Carlos Mendoza" },
]

const MOCK_SECTIONS = [
  { id: "ps1", title: "Resumen Ejecutivo", status: "complete" as const, ai_generated: true },
  { id: "ps2", title: "Descripcion de la Solucion", status: "in_progress" as const, ai_generated: false },
  { id: "ps3", title: "Arquitectura Propuesta", status: "pending" as const, ai_generated: false },
  { id: "ps4", title: "Plan de Trabajo", status: "pending" as const, ai_generated: false },
  { id: "ps5", title: "Equipo de Trabajo", status: "complete" as const, ai_generated: true },
  { id: "ps6", title: "Experiencia y Referencias", status: "pending" as const, ai_generated: false },
]

const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  pendiente: { label: "Pendiente", icon: Circle, color: "text-muted-foreground" },
  en_proceso: { label: "En Proceso", icon: Clock, color: "text-info" },
  completada: { label: "Completada", icon: CheckCircle2, color: "text-success" },
  cancelada: { label: "Cancelada", icon: AlertTriangle, color: "text-muted-foreground" },
}

function getFileIcon(mimeType: string | null) {
  if (!mimeType) return File
  if (mimeType.includes("pdf")) return FileText
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return FileSpreadsheet
  if (mimeType.includes("word") || mimeType.includes("document")) return FileType
  return File
}

function formatFileSize(bytes: number | null): string {
  if (bytes == null) return "--"
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`
  return `${bytes} B`
}

export default function LicitacionDetailPage() {
  const params = useParams()
  const bidId = typeof params?.id === "string" ? params.id : "bid-001"

  const { bids, loaded, updateBid } = useBids()
  const { documents, addDocument } = useDocuments(bidId)
  const { requirements, toggleRequirement } = useRequirements(bidId)
  const { tasks, addTask, toggleTaskStatus } = useTasks(bidId)

  const bid = bids.find((b) => b.id === bidId) || bids[0]

  const scores = findScoresByBidId(bidId)
  const milestones = findMilestonesByBidId(bidId)

  const [activeTab, setActiveTab] = useState("resumen")
  const [notes, setNotes] = useState<string | null>(null)
  const [notesSaved, setNotesSaved] = useState(false)

  // Stage change dialog
  const [stageDialogOpen, setStageDialogOpen] = useState(false)
  const [selectedStage, setSelectedStage] = useState<PipelineStage | "">("")

  // Task dialog
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("media")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentNotes = notes !== null ? notes : (bid?.notes ?? "")

  const metCount = requirements.filter((r) => r.is_met === true).length
  const reqProgress = requirements.length > 0 ? Math.round((metCount / requirements.length) * 100) : 0

  const completeSections = MOCK_SECTIONS.filter((s) => s.status === "complete").length
  const proposalProgress = MOCK_SECTIONS.length > 0 ? Math.round((completeSections / MOCK_SECTIONS.length) * 100) : 0

  const handleSaveNotes = useCallback(() => {
    if (bid) {
      updateBid(bid.id, { notes: currentNotes })
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
    }
  }, [bid, currentNotes, updateBid])

  const handleChangeStage = useCallback(() => {
    if (bid && selectedStage) {
      updateBid(bid.id, { pipeline_stage: selectedStage as PipelineStage })
      setStageDialogOpen(false)
    }
  }, [bid, selectedStage, updateBid])

  const handleAddTask = useCallback(() => {
    if (!newTaskTitle.trim()) return
    addTask({
      bid_id: bidId,
      title: newTaskTitle.trim(),
      description: null,
      status: 'pendiente',
      priority: newTaskPriority,
      assigned_to: null,
      due_date: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
      completed_at: null,
      created_by: 'user-mock-001',
    })
    setTaskDialogOpen(false)
    setNewTaskTitle("")
    setNewTaskPriority("media")
    setNewTaskDueDate("")
  }, [addTask, bidId, newTaskTitle, newTaskPriority, newTaskDueDate])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      addDocument({
        bid_id: bidId,
        category: 'otro',
        name: file.name.replace(/\.[^.]+$/, ''),
        original_filename: file.name,
        storage_path: `orgs/org-mock-001/bids/${bidId}/${file.name}`,
        url: null,
        mime_type: file.type || 'application/octet-stream',
        size_bytes: file.size,
        extracted_text: null,
        ai_processed: false,
        uploaded_by: 'user-mock-001',
      })
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [addDocument, bidId])

  if (!loaded || !bid) return null

  return (
    <div className="flex flex-col gap-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/licitaciones">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground line-clamp-1">{bid.title}</h1>
            <p className="text-xs text-muted-foreground font-mono">{bid.procedure_number}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {bid.total_score != null && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                getScoreBgColor(bid.total_score),
                getScoreColor(bid.total_score)
              )}
            >
              {bid.total_score}
            </div>
          )}

          <Badge className={cn("border-0 px-3 py-1 text-xs font-semibold", getStageColor(bid.pipeline_stage))}>
            {getStageLabel(bid.pipeline_stage)}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2">
                <Edit className="h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={() => {
                setSelectedStage(bid.pipeline_stage)
                setStageDialogOpen(true)
              }}>
                <ArrowRightLeft className="h-4 w-4" /> Mover etapa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                <Archive className="h-4 w-4" /> Archivar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <BidInfoCards bid={bid} milestones={milestones} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="requisitos">
            Requisitos
            <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">
              {requirements.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="documentos">
            Documentos
            <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">
              {documents.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="propuesta">Propuesta</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="tareas">
            Tareas
            <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">
              {tasks.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* RESUMEN TAB */}
        <TabsContent value="resumen" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Descripcion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {bid.description || "Sin descripcion disponible."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Detalles Clave</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <DetailRow label="Tipo de procedimiento" value={getBidTypeLabel(bid.bid_type)} />
                    <DetailRow label="Entidad contratante" value={bid.contracting_entity} />
                    <DetailRow label="Monto estimado" value={formatCurrency(bid.estimated_amount)} />
                    <DetailRow label="Moneda" value={bid.currency} />
                    <DetailRow label="Fecha limite" value={formatDate(bid.proposal_deadline)} />
                    <DetailRow
                      label="Tiempo restante"
                      value={bid.proposal_deadline ? formatRelativeDate(bid.proposal_deadline) : "--"}
                      className={getUrgencyColor(bid.proposal_deadline)}
                    />
                    <DetailRow label="Portal de origen" value={bid.source_portal || "--"} />
                    <DetailRow label="Etapa actual" value={getStageLabel(bid.pipeline_stage)} />
                  </div>
                </CardContent>
              </Card>

              {/* Editable Notes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Notas</CardTitle>
                  <div className="flex items-center gap-2">
                    {notesSaved && <span className="text-xs text-success">Guardado</span>}
                    <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={handleSaveNotes}>
                      <Save className="h-3 w-3" />
                      Guardar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={currentNotes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Agrega notas sobre esta licitacion..."
                    className="min-h-[100px] text-sm"
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <ScoreBreakdown scores={scores} totalScore={bid.total_score} />
            </div>
          </div>
        </TabsContent>

        {/* REQUISITOS TAB */}
        <TabsContent value="requisitos" className="mt-6 space-y-6">
          {/* Progress summary */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Progreso de Cumplimiento</span>
              <span className="text-sm font-bold text-foreground">
                {metCount} de {requirements.length} requisitos cumplidos ({reqProgress}%)
              </span>
            </div>
            <Progress
              value={reqProgress}
              className="h-2.5 bg-muted"
              indicatorClassName={cn(reqProgress >= 80 ? "bg-success" : reqProgress >= 50 ? "bg-yellow-500" : "bg-red-500")}
            />
          </div>

          {/* Requirements list - clickable to toggle */}
          <div className="space-y-2">
            {requirements.map((req) => (
              <div
                key={req.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors cursor-pointer",
                  req.is_met === true ? "border-success/20 bg-success/5" : "border-border bg-card hover:bg-muted/50"
                )}
                onClick={() => toggleRequirement(req.id)}
              >
                <div className="mt-0.5 shrink-0">
                  {req.is_met === true ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-success" />
                  ) : (
                    <Circle className="h-4.5 w-4.5 text-muted-foreground/60" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <p className={cn("text-sm leading-snug", req.is_met === true ? "text-muted-foreground line-through" : "text-foreground")}>
                      {req.description}
                    </p>
                    {req.is_mandatory && (
                      <Badge className="shrink-0 border-0 bg-red-500/10 text-[10px] font-medium text-red-400">
                        Eliminatorio
                      </Badge>
                    )}
                  </div>
                  {req.compliance_notes && (
                    <p className="mt-1 text-xs text-muted-foreground">{req.compliance_notes}</p>
                  )}
                  {req.source_reference && (
                    <p className="mt-0.5 text-[10px] text-muted-foreground/60">Ref: {req.source_reference}</p>
                  )}
                </div>
              </div>
            ))}
            {requirements.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No hay requisitos registrados para esta licitacion.</p>
            )}
          </div>
        </TabsContent>

        {/* DOCUMENTOS TAB */}
        <TabsContent value="documentos" className="mt-6 space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <div
            className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary/30 hover:bg-muted/50 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const dt = e.dataTransfer
              if (dt.files.length > 0 && fileInputRef.current) {
                const input = fileInputRef.current
                const dataTransfer = new DataTransfer()
                for (let i = 0; i < dt.files.length; i++) {
                  dataTransfer.items.add(dt.files[i])
                }
                input.files = dataTransfer.files
                input.dispatchEvent(new Event('change', { bubbles: true }))
              }
            }}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                Arrastra archivos aqui o haz clic para subir
              </p>
              <p className="text-xs text-muted-foreground/60">
                PDF, DOCX, XLSX hasta 50MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => {
              const DocIcon = getFileIcon(doc.mime_type)
              return (
                <div
                  key={doc.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <DocIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{doc.name}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{doc.original_filename}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground/60">
                      <Badge variant="outline" className="h-4 px-1.5 text-[9px]">{doc.category}</Badge>
                      <span>{formatFileSize(doc.size_bytes)}</span>
                      <span>{formatDate(doc.created_at, "d MMM")}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* PROPUESTA TAB */}
        <TabsContent value="propuesta" className="mt-6 space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Propuesta Tecnica</p>
              <p className="text-xs text-muted-foreground">
                {completeSections} de {MOCK_SECTIONS.length} secciones completadas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32">
                <Progress value={proposalProgress} className="h-2" indicatorClassName="bg-success" />
              </div>
              <span className="text-sm font-bold text-foreground">{proposalProgress}%</span>
            </div>
          </div>

          <Button className="gap-2 bg-violet-600 text-white hover:bg-violet-700">
            <Sparkles className="h-4 w-4" />
            Generar con IA
          </Button>

          <div className="space-y-2">
            {MOCK_SECTIONS.map((section, idx) => (
              <div
                key={section.id}
                className={cn(
                  "flex items-center gap-4 rounded-lg border px-4 py-3",
                  section.status === "complete" ? "border-success/20 bg-success/5"
                    : section.status === "in_progress" ? "border-info/20 bg-info/5"
                    : "border-border bg-muted/50"
                )}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{section.title}</p>
                </div>
                {section.ai_generated && (
                  <Badge className="border-0 bg-violet-500/10 text-[10px] text-violet-500">Generado con IA</Badge>
                )}
                {section.status === "complete" ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-success" />
                ) : section.status === "in_progress" ? (
                  <Clock className="h-4.5 w-4.5 text-info" />
                ) : (
                  <Circle className="h-4.5 w-4.5 text-muted-foreground/60" />
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TIMELINE TAB */}
        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Historial de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <BidTimeline events={MOCK_ACTIVITY} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAREAS TAB */}
        <TabsContent value="tareas" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {tasks.filter((t) => t.status === "completada").length} de {tasks.length} tareas completadas
            </p>
            <Button size="sm" className="gap-2" onClick={() => setTaskDialogOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Nueva Tarea
            </Button>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => {
              const statusConfig = TASK_STATUS_CONFIG[task.status]
              const StatusIcon = statusConfig.icon
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleTaskStatus(task.id)}
                >
                  <StatusIcon className={cn("h-4.5 w-4.5 shrink-0", statusConfig.color)} />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-medium", task.status === "completada" ? "text-muted-foreground line-through" : "text-foreground")}>
                      {task.title}
                    </p>
                    {task.description && <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>}
                  </div>
                  <Badge className={cn("border-0 text-[10px] font-medium shrink-0", getPriorityColor(task.priority))}>
                    {task.priority === "alta" ? "Alta" : task.priority === "media" ? "Media" : "Baja"}
                  </Badge>
                  {task.due_date && (
                    <span className={cn("shrink-0 text-xs font-medium", task.status === "completada" ? "text-muted-foreground/60" : getUrgencyColor(task.due_date))}>
                      {formatRelativeDate(task.due_date)}
                    </span>
                  )}
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              )
            })}
            {tasks.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No hay tareas. Crea una con el boton de arriba.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Stage Change Dialog */}
      <Dialog open={stageDialogOpen} onOpenChange={setStageDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cambiar Etapa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Nueva etapa</Label>
              <Select value={selectedStage} onValueChange={(v) => setSelectedStage(v as PipelineStage)}>
                <SelectTrigger><SelectValue placeholder="Selecciona etapa" /></SelectTrigger>
                <SelectContent>
                  {PIPELINE_STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStageDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleChangeStage} disabled={!selectedStage}>Cambiar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva Tarea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Titulo *</Label>
              <Input placeholder="Descripcion de la tarea" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select value={newTaskPriority} onValueChange={(v) => setNewTaskPriority(v as TaskPriority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fecha limite</Label>
                <Input type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>Crear</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DetailRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-sm text-foreground", className)}>{value}</p>
    </div>
  )
}
