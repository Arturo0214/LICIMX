"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  formatCurrency,
  formatRelativeDate,
  getScoreColor,
  getScoreBgColor,
  getStageColor,
  getStageLabel,
  getUrgencyColor,
  getBidTypeLabel,
} from "@/lib/utils"
import { mockBids } from "@/lib/data/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Plus,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { Bid, PipelineStage, BidType } from "@/types"

const STAGES: { value: string; label: string }[] = [
  { value: "todas", label: "Todas las etapas" },
  { value: "detectada", label: "Detectada" },
  { value: "analizando", label: "Analizando" },
  { value: "aprobada", label: "Aprobada" },
  { value: "en_preparacion", label: "En Preparacion" },
  { value: "presentada", label: "Presentada" },
  { value: "en_evaluacion", label: "En Evaluacion" },
  { value: "fallo", label: "Fallo" },
  { value: "ganada", label: "Ganada" },
  { value: "perdida", label: "Perdida" },
]

const TYPES: { value: string; label: string }[] = [
  { value: "todos", label: "Todos los tipos" },
  { value: "publica", label: "Publica" },
  { value: "invitacion", label: "Invitacion a 3" },
  { value: "adjudicacion_directa", label: "Adj. Directa" },
]

const USER_NAMES: Record<string, string> = {
  "user-mock-001": "Carlos Mendoza",
}

const PER_PAGE = 10

type SortKey = "title" | "estimated_amount" | "total_score" | "proposal_deadline"

export default function LicitacionesPage() {
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState("todas")
  const [typeFilter, setTypeFilter] = useState("todos")
  const [sortKey, setSortKey] = useState<SortKey>("proposal_deadline")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = [...mockBids]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.contracting_entity.toLowerCase().includes(q) ||
          b.procedure_number.toLowerCase().includes(q)
      )
    }

    if (stageFilter !== "todas") {
      result = result.filter((b) => b.pipeline_stage === stageFilter)
    }

    if (typeFilter !== "todos") {
      result = result.filter((b) => b.bid_type === typeFilter)
    }

    result.sort((a, b) => {
      let va: number | string | null = null
      let vb: number | string | null = null
      switch (sortKey) {
        case "title":
          va = a.title
          vb = b.title
          break
        case "estimated_amount":
          va = a.estimated_amount ?? 0
          vb = b.estimated_amount ?? 0
          break
        case "total_score":
          va = a.total_score ?? 0
          vb = b.total_score ?? 0
          break
        case "proposal_deadline":
          va = a.proposal_deadline ?? "9999"
          vb = b.proposal_deadline ?? "9999"
          break
      }
      if (va == null || vb == null) return 0
      if (va < vb) return sortDir === "asc" ? -1 : 1
      if (va > vb) return sortDir === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [search, stageFilter, typeFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  function SortButton({ column, label }: { column: SortKey; label: string }) {
    const isActive = sortKey === column
    return (
      <button
        onClick={() => toggleSort(column)}
        className={cn(
          "flex items-center gap-1 text-xs font-medium transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Licitaciones</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} licitaciones registradas
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Licitacion
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por titulo, dependencia o numero..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="h-9 pl-9 text-sm"
          />
        </div>

        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="h-9 w-44 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={stageFilter}
          onValueChange={(v) => {
            setStageFilter(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="h-9 w-48 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
              <th className="px-4 py-3 text-left">
                <SortButton column="title" label="Titulo" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Dependencia</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Tipo</th>
              <th className="px-4 py-3 text-right">
                <SortButton column="estimated_amount" label="Monto" />
              </th>
              <th className="px-4 py-3 text-center">
                <SortButton column="total_score" label="Score" />
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Etapa</th>
              <th className="px-4 py-3 text-right">
                <SortButton column="proposal_deadline" label="Fecha Limite" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Asignado</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((bid) => (
              <tr
                key={bid.id}
                className="border-b border-border/50 transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/licitaciones/${bid.id}`}
                    className="font-mono text-xs text-muted-foreground hover:text-primary"
                  >
                    {bid.procedure_number.slice(-8)}
                  </Link>
                </td>
                <td className="max-w-[300px] px-4 py-3">
                  <Link
                    href={`/licitaciones/${bid.id}`}
                    className="font-medium text-foreground hover:text-primary line-clamp-1"
                  >
                    {bid.title}
                  </Link>
                </td>
                <td className="max-w-[180px] px-4 py-3">
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {bid.contracting_entity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground">
                    {getBidTypeLabel(bid.bid_type)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(bid.estimated_amount)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {bid.total_score != null && (
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                        getScoreBgColor(bid.total_score),
                        getScoreColor(bid.total_score)
                      )}
                    >
                      {bid.total_score}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    className={cn(
                      "text-[11px] font-medium border-0",
                      getStageColor(bid.pipeline_stage)
                    )}
                  >
                    {getStageLabel(bid.pipeline_stage)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {bid.proposal_deadline ? (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        getUrgencyColor(bid.proposal_deadline)
                      )}
                    >
                      {formatRelativeDate(bid.proposal_deadline)}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">--</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground">
                    {bid.assigned_user_id
                      ? USER_NAMES[bid.assigned_user_id] || "Sin asignar"
                      : "Sin asignar"}
                  </span>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No se encontraron licitaciones con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Mostrando {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}-
          {Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
