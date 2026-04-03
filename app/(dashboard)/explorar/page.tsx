"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Globe,
  Search,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Building2,
  Calendar,
  Tag,
  Filter,
  X,
} from "lucide-react"
import type { CompraNetLicitacion } from "@/lib/compranet/client"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PER_PAGE = 15

const ESTADO_COLORS: Record<string, string> = {
  Publicada: "bg-blue-500/15 text-blue-400",
  "En periodo de aclaraciones": "bg-violet-500/15 text-violet-400",
  "Presentacion de propuestas": "bg-indigo-500/15 text-indigo-400",
  "En evaluacion": "bg-amber-500/15 text-amber-400",
  Adjudicada: "bg-success/15 text-success",
  Cancelada: "bg-red-500/15 text-red-400",
}

const TIPO_LABELS: Record<string, { short: string; color: string }> = {
  "Licitacion Publica": { short: "LP", color: "bg-blue-500/15 text-blue-400" },
  "Invitacion a cuando menos 3": { short: "I3P", color: "bg-purple-500/15 text-purple-400" },
  "Adjudicacion Directa": { short: "AD", color: "bg-orange-500/15 text-orange-400" },
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface APIResponse {
  data: CompraNetLicitacion[]
  total: number
  source: "api" | "fallback"
  cached: boolean
  filters: {
    dependencias: string[]
    categorias: string[]
    estados: string[]
    tipos: string[]
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ExplorarPage() {
  // Data state
  const [results, setResults] = useState<CompraNetLicitacion[]>([])
  const [total, setTotal] = useState(0)
  const [source, setSource] = useState<"api" | "fallback">("fallback")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter options (populated from API)
  const [filterOpts, setFilterOpts] = useState<APIResponse["filters"]>({
    dependencias: [],
    categorias: [],
    estados: [],
    tipos: [],
  })

  // Filter state
  const [search, setSearch] = useState("")
  const [tipo, setTipo] = useState("todos")
  const [dependencia, setDependencia] = useState("todas")
  const [estado, setEstado] = useState("todos")
  const [categoria, setCategoria] = useState("todas")
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Import tracking
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set())
  const [importingId, setImportingId] = useState<string | null>(null)

  // Last refresh time
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  // ----- Fetch data -----
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (tipo !== "todos") params.set("tipo", tipo)
      if (dependencia !== "todas") params.set("dependencia", dependencia)
      if (estado !== "todos") params.set("estado", estado)
      if (categoria !== "todas") params.set("categoria", categoria)
      params.set("limit", String(PER_PAGE))
      params.set("offset", String((page - 1) * PER_PAGE))

      const res = await fetch(`/api/compranet?${params.toString()}`)
      if (!res.ok) throw new Error("Error al consultar CompraNet")

      const json: APIResponse = await res.json()

      setResults(json.data)
      setTotal(json.total)
      setSource(json.source)
      setFilterOpts(json.filters)
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [search, tipo, dependencia, estado, categoria, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ----- Import handler -----
  const handleImport = async (licitacion: CompraNetLicitacion) => {
    setImportingId(licitacion.numero_procedimiento)

    try {
      const res = await fetch("/api/compranet/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero_procedimiento: licitacion.numero_procedimiento,
        }),
      })

      const json = await res.json()

      if (res.ok || json.already_imported) {
        setImportedIds((prev) => new Set(prev).add(licitacion.numero_procedimiento))
      }
    } catch {
      // Silently handle - button stays in default state
    } finally {
      setImportingId(null)
    }
  }

  // ----- Refresh -----
  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  // ----- Reset filters -----
  const handleResetFilters = () => {
    setSearch("")
    setTipo("todos")
    setDependencia("todas")
    setEstado("todos")
    setCategoria("todas")
    setPage(1)
  }

  const hasActiveFilters =
    search !== "" ||
    tipo !== "todos" ||
    dependencia !== "todas" ||
    estado !== "todos" ||
    categoria !== "todas"

  // ----- Helpers -----
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  function getRelativeTime(date: Date): string {
    const diffMs = Date.now() - date.getTime()
    const diffMin = Math.floor(diffMs / 60_000)
    if (diffMin < 1) return "hace un momento"
    if (diffMin < 60) return `hace ${diffMin} min`
    const diffHrs = Math.floor(diffMin / 60)
    if (diffHrs < 24) return `hace ${diffHrs}h`
    return `hace ${Math.floor(diffHrs / 24)}d`
  }

  function formatShortDate(dateStr: string): string {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  // ----- Render -----
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Globe className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">
                Explorar Licitaciones
              </h1>
              <Badge className="border-0 bg-amber-500/15 text-amber-400 text-[10px] font-semibold">
                CompraNet
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{total.toLocaleString("es-MX")} licitaciones encontradas</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    source === "api" ? "bg-success" : "bg-amber-500"
                  )}
                />
                {source === "api" ? "Datos en vivo" : "Datos locales"}
              </span>
              <span className="text-border">|</span>
              <span>Actualizado {getRelativeTime(lastRefresh)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border text-muted-foreground hover:text-foreground"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
            />
            Actualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 border-border",
              showFilters
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-3.5 w-3.5" />
            Filtros
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400">
                !
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por titulo, dependencia, numero de procedimiento..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="h-10 bg-card/50 border-border pl-9 text-sm placeholder:text-muted-foreground/60"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("")
                setPage(1)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Select
          value={tipo}
          onValueChange={(v) => {
            setTipo(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="h-10 w-52 border-border bg-card/50 text-sm">
            <SelectValue placeholder="Tipo de procedimiento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            {filterOpts.tipos.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border/60 bg-card/30 p-4">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Dependencia
            </label>
            <Select
              value={dependencia}
              onValueChange={(v) => {
                setDependencia(v)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-9 border-border bg-card/50 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las dependencias</SelectItem>
                {filterOpts.dependencias.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[180px]">
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Estado
            </label>
            <Select
              value={estado}
              onValueChange={(v) => {
                setEstado(v)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-9 border-border bg-card/50 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                {filterOpts.estados.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[180px]">
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Categoria
            </label>
            <Select
              value={categoria}
              onValueChange={(v) => {
                setCategoria(v)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-9 border-border bg-card/50 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorias</SelectItem>
                {filterOpts.categorias.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={handleResetFilters}
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </Button>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Results Table */}
      <div className="overflow-x-auto rounded-lg border border-border/60 bg-card/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                No. Procedimiento
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Titulo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Dependencia
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                Tipo
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                Monto Estimado
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                Publicacion
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                Estado
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr
                    key={`skeleton-${i}`}
                    className="border-b border-border/30"
                  >
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-36 bg-muted" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-64 bg-muted" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-40 bg-muted" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="mx-auto h-5 w-10 rounded-full bg-muted" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="ml-auto h-4 w-24 bg-muted" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="mx-auto h-4 w-20 bg-muted" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="mx-auto h-5 w-24 rounded-full bg-muted" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="mx-auto h-8 w-24 rounded-md bg-muted" />
                    </td>
                  </tr>
                ))
              : results.map((lic) => {
                  const isImported = importedIds.has(lic.numero_procedimiento)
                  const isImporting = importingId === lic.numero_procedimiento
                  const tipoInfo = TIPO_LABELS[lic.tipo_procedimiento] ?? {
                    short: "LP",
                    color: "bg-muted text-muted-foreground",
                  }
                  const estadoColor =
                    ESTADO_COLORS[lic.estado] ?? "bg-muted text-muted-foreground"

                  return (
                    <tr
                      key={lic.numero_procedimiento}
                      className="border-b border-border/30 transition-colors hover:bg-muted/20"
                    >
                      {/* Procedure number */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={lic.url_compranet}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-muted-foreground hover:text-amber-400 transition-colors"
                          >
                            {lic.numero_procedimiento}
                          </a>
                          <ExternalLink className="h-3 w-3 text-muted-foreground/60" />
                        </div>
                        {lic.categoria && (
                          <div className="mt-1 flex items-center gap-1">
                            <Tag className="h-2.5 w-2.5 text-muted-foreground/60" />
                            <span className="text-[10px] text-muted-foreground/60">
                              {lic.categoria}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Title */}
                      <td className="max-w-[320px] px-4 py-3">
                        <p className="font-medium text-foreground line-clamp-2 leading-snug">
                          {lic.titulo}
                        </p>
                      </td>

                      {/* Dependencia */}
                      <td className="max-w-[200px] px-4 py-3">
                        <div className="flex items-start gap-1.5">
                          <Building2 className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/60" />
                          <span className="text-xs text-muted-foreground line-clamp-2">
                            {lic.dependencia}
                          </span>
                        </div>
                        {lic.entidad_federativa && (
                          <span className="mt-0.5 block text-[10px] text-muted-foreground/60">
                            {lic.entidad_federativa}
                          </span>
                        )}
                      </td>

                      {/* Tipo */}
                      <td className="px-4 py-3 text-center">
                        <Badge
                          className={cn(
                            "text-[10px] font-semibold border-0",
                            tipoInfo.color
                          )}
                        >
                          {tipoInfo.short}
                        </Badge>
                      </td>

                      {/* Monto */}
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(lic.monto_estimado)}
                        </span>
                      </td>

                      {/* Fecha publicacion */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <Calendar className="h-3 w-3 text-muted-foreground/60" />
                          <span className="text-xs text-muted-foreground">
                            {formatShortDate(lic.fecha_publicacion)}
                          </span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3 text-center">
                        <Badge
                          className={cn(
                            "text-[11px] font-medium border-0 whitespace-nowrap",
                            estadoColor
                          )}
                        >
                          {lic.estado}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        {isImported ? (
                          <Button
                            size="sm"
                            disabled
                            className="gap-1.5 bg-success/10 text-success border-0 cursor-default text-xs"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Importada
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="gap-1.5 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 hover:text-amber-300 border-0 text-xs"
                            disabled={isImporting}
                            onClick={() => handleImport(lic)}
                          >
                            {isImporting ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                Importando
                              </>
                            ) : (
                              <>
                                <Download className="h-3.5 w-3.5" />
                                Importar
                              </>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
            {!loading && results.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-16 text-center text-sm text-muted-foreground"
                >
                  <Globe className="mx-auto mb-3 h-8 w-8 text-border" />
                  <p className="font-medium text-muted-foreground">
                    No se encontraron licitaciones
                  </p>
                  <p className="mt-1">
                    Intenta ajustar los filtros o la busqueda.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Mostrando{" "}
            {Math.min((page - 1) * PER_PAGE + 1, total).toLocaleString(
              "es-MX"
            )}
            -{Math.min(page * PER_PAGE, total).toLocaleString("es-MX")} de{" "}
            {total.toLocaleString("es-MX")}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {generatePageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1 text-xs text-muted-foreground/60"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    page === p
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "border-border text-muted-foreground"
                  )}
                  onClick={() => setPage(p as number)}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generatePageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | "...")[] = [1]

  if (current > 3) pages.push("...")

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) pages.push("...")

  pages.push(total)

  return pages
}
