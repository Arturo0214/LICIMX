"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"
import { useBids } from "@/lib/store/hooks"
import { Calendar, List, CalendarDays, FileSignature, Users, Gavel, Send, Eye, Clock, AlertTriangle, ChevronRight, Filter } from "lucide-react"

type MilestoneType = "publicacion" | "junta_aclaraciones" | "entrega_propuestas" | "apertura_tecnica" | "apertura_economica" | "fallo" | "firma_contrato" | "inicio_contrato"

interface CalendarMilestone {
  id: string
  bidId: string
  bidTitle: string
  type: MilestoneType
  title: string
  date: string
  time: string
}

const milestoneTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  publicacion: { label: "Publicacion", icon: <CalendarDays className="h-4 w-4" />, color: "bg-blue-500/15 text-blue-500 border-blue-500/30" },
  junta_aclaraciones: { label: "Junta de Aclaraciones", icon: <Users className="h-4 w-4" />, color: "bg-violet-500/15 text-violet-500 border-violet-500/30" },
  entrega_propuestas: { label: "Entrega de Propuestas", icon: <Send className="h-4 w-4" />, color: "bg-success/15 text-success border-success/30" },
  apertura_tecnica: { label: "Apertura Tecnica", icon: <Eye className="h-4 w-4" />, color: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30" },
  apertura_economica: { label: "Apertura Economica", icon: <Eye className="h-4 w-4" />, color: "bg-teal-500/15 text-teal-500 border-teal-500/30" },
  fallo: { label: "Fallo", icon: <Gavel className="h-4 w-4" />, color: "bg-amber-500/15 text-amber-500 border-amber-500/30" },
  firma_contrato: { label: "Firma de Contrato", icon: <FileSignature className="h-4 w-4" />, color: "bg-rose-500/15 text-rose-500 border-rose-500/30" },
  inicio_contrato: { label: "Inicio de Contrato", icon: <Clock className="h-4 w-4" />, color: "bg-orange-500/15 text-orange-500 border-orange-500/30" },
}

const milestoneTypes = ["Todos", "publicacion", "junta_aclaraciones", "entrega_propuestas", "apertura_tecnica", "apertura_economica", "fallo", "firma_contrato"]

function getDateStr(isoDate: string | null): string | null {
  if (!isoDate) return null
  return isoDate.split("T")[0]
}

function getTimeStr(isoDate: string | null): string {
  if (!isoDate) return "00:00"
  try {
    const d = new Date(isoDate)
    return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false })
  } catch {
    return "00:00"
  }
}

function getUrgency(dateStr: string): "today" | "this_week" | "later" {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return "today"
  if (diffDays <= 5) return "this_week"
  return "later"
}

const urgencyColors = { today: "border-l-destructive", this_week: "border-l-amber-500", later: "border-l-blue-500" }

export default function CalendarioPage() {
  const { bids, loaded } = useBids()
  const [view, setView] = useState<"lista" | "calendario">("lista")
  const [filterType, setFilterType] = useState("Todos")

  // Derive milestones from actual bids
  const allMilestones = useMemo(() => {
    const ms: CalendarMilestone[] = []
    let counter = 0

    for (const bid of bids) {
      // Skip terminal stages
      if (["ganada", "perdida", "desierta", "descartada"].includes(bid.pipeline_stage)) continue

      const shortTitle = bid.title.length > 50 ? bid.title.slice(0, 50) + "..." : bid.title
      const entity = bid.contracting_entity.split(" ").slice(0, 3).join(" ")
      const label = `${shortTitle.split(" ").slice(0, 5).join(" ")} - ${entity}`

      if (bid.published_at) {
        const d = getDateStr(bid.published_at)
        if (d) ms.push({ id: `m-${++counter}`, bidId: bid.id, bidTitle: label, type: "publicacion", title: "Publicacion en CompraNet", date: d, time: getTimeStr(bid.published_at) })
      }
      if (bid.clarification_meeting_at) {
        const d = getDateStr(bid.clarification_meeting_at)
        if (d) ms.push({ id: `m-${++counter}`, bidId: bid.id, bidTitle: label, type: "junta_aclaraciones", title: "Junta de aclaraciones", date: d, time: getTimeStr(bid.clarification_meeting_at) })
      }
      if (bid.proposal_deadline) {
        const d = getDateStr(bid.proposal_deadline)
        if (d) ms.push({ id: `m-${++counter}`, bidId: bid.id, bidTitle: label, type: "entrega_propuestas", title: "Entrega de propuestas", date: d, time: getTimeStr(bid.proposal_deadline) })
      }
      if (bid.technical_opening_at) {
        const d = getDateStr(bid.technical_opening_at)
        if (d) ms.push({ id: `m-${++counter}`, bidId: bid.id, bidTitle: label, type: "apertura_tecnica", title: "Apertura tecnica", date: d, time: getTimeStr(bid.technical_opening_at) })
      }
      if (bid.economic_opening_at) {
        const d = getDateStr(bid.economic_opening_at)
        if (d) ms.push({ id: `m-${++counter}`, bidId: bid.id, bidTitle: label, type: "apertura_economica", title: "Apertura economica", date: d, time: getTimeStr(bid.economic_opening_at) })
      }
      if (bid.ruling_date) {
        const d = getDateStr(bid.ruling_date)
        if (d) ms.push({ id: `m-${++counter}`, bidId: bid.id, bidTitle: label, type: "fallo", title: "Emision de fallo", date: d, time: getTimeStr(bid.ruling_date) })
      }
      if (bid.contract_start_date) {
        const d = getDateStr(bid.contract_start_date)
        if (d) ms.push({ id: `m-${++counter}`, bidId: bid.id, bidTitle: label, type: "inicio_contrato", title: "Inicio de contrato", date: d, time: getTimeStr(bid.contract_start_date) })
      }
    }

    return ms.sort((a, b) => a.date.localeCompare(b.date))
  }, [bids])

  const filtered = filterType === "Todos" ? allMilestones : allMilestones.filter((m) => m.type === filterType)

  const groupedByDate = filtered.reduce<Record<string, CalendarMilestone[]>>((acc, m) => {
    if (!acc[m.date]) acc[m.date] = []
    acc[m.date].push(m)
    return acc
  }, {})
  const sortedDates = Object.keys(groupedByDate).sort()

  const todayStr = new Date().toISOString().split("T")[0]

  const next7Days = allMilestones.filter((m) => {
    const date = new Date(m.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff < 7
  })

  if (!loaded) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendario de Hitos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Visualiza y gestiona las fechas clave de todas las licitaciones activas.</p>
        </div>
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          <button onClick={() => setView("lista")} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors", view === "lista" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}><List className="h-3.5 w-3.5" />Lista</button>
          <button onClick={() => setView("calendario")} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors", view === "calendario" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}><Calendar className="h-3.5 w-3.5" />Calendario</button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
        {milestoneTypes.map((type) => {
          const config = type !== "Todos" ? milestoneTypeConfig[type] : null
          return (
            <button key={type} onClick={() => setFilterType(type)} className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors", filterType === type ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground")}>{config ? config.label : "Todos"}</button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="xl:col-span-3 space-y-6">
          {sortedDates.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">No hay hitos para mostrar con los filtros actuales.</p>
          )}
          {sortedDates.map((date) => {
            const milestones = groupedByDate[date]
            const urgency = getUrgency(date)
            const isToday = date === todayStr
            return (
              <div key={date}>
                <div className="mb-3 flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", urgency === "today" ? "bg-destructive" : urgency === "this_week" ? "bg-amber-500" : "bg-blue-500")} />
                  <h3 className="text-sm font-semibold text-foreground">
                    {formatDate(date, "EEEE, d 'de' MMMM yyyy")}
                    {isToday && <span className="ml-2 text-xs font-normal text-destructive">Hoy</span>}
                  </h3>
                </div>
                <div className="space-y-2">
                  {milestones.map((milestone) => {
                    const config = milestoneTypeConfig[milestone.type]
                    return (
                      <Link href={`/licitaciones/${milestone.bidId}`} key={milestone.id}>
                        <div className={cn("flex items-center gap-4 rounded-lg border border-border border-l-2 bg-card px-4 py-3 transition-colors hover:border-primary/30", urgencyColors[urgency])}>
                          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", config.color.split(" ")[0])}>
                            <span className={config.color.split(" ")[1]}>{config.icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-foreground">{milestone.title}</div>
                            <div className="text-xs text-muted-foreground">{milestone.bidTitle}</div>
                          </div>
                          <Badge className={cn("shrink-0 border text-[10px]", config.color)}>{config.label}</Badge>
                          <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">{milestone.time}</span>
                          {urgency === "today" && <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Proximos 7 dias</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Total de hitos</span><span className="font-semibold text-foreground">{next7Days.length}</span></div>
              <div className="space-y-2">
                {Object.entries(next7Days.reduce<Record<string, number>>((acc, m) => { const config = milestoneTypeConfig[m.type]; acc[config.label] = (acc[config.label] || 0) + 1; return acc }, {})).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{type}</span><span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">{count}</span></div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Urgencia</div>
                <div className="flex items-center gap-2 text-xs"><div className="h-2 w-2 rounded-full bg-destructive" /><span className="text-muted-foreground">Hoy/Vencido</span><span className="ml-auto font-medium text-foreground">{next7Days.filter((m) => getUrgency(m.date) === "today").length}</span></div>
                <div className="flex items-center gap-2 text-xs"><div className="h-2 w-2 rounded-full bg-amber-500" /><span className="text-muted-foreground">Esta semana</span><span className="ml-auto font-medium text-foreground">{next7Days.filter((m) => getUrgency(m.date) === "this_week").length}</span></div>
              </div>
              <div className="border-t border-border pt-3 space-y-1.5">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Proximos</div>
                {next7Days.slice(0, 5).map((m) => {
                  const config = milestoneTypeConfig[m.type]
                  return (
                    <Link href={`/licitaciones/${m.bidId}`} key={m.id}>
                      <div className="flex items-center gap-2 text-xs hover:text-primary transition-colors">
                        <span className={cn("shrink-0", config.color.split(" ")[1])}>{config.icon}</span>
                        <span className="truncate text-muted-foreground">{m.bidTitle.split(" - ")[1] || m.bidTitle}</span>
                        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                        <span className="shrink-0 tabular-nums text-muted-foreground">{formatDate(m.date, "d MMM")}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
