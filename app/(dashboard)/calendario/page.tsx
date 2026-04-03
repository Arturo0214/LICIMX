"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"
import { Calendar, List, CalendarDays, FileSignature, Users, Gavel, Send, Eye, Clock, AlertTriangle, ChevronRight, Filter } from "lucide-react"

interface CalendarMilestone { id: string; bidTitle: string; type: "publicacion" | "junta_aclaraciones" | "entrega_propuestas" | "apertura_tecnica" | "apertura_economica" | "fallo" | "firma_contrato" | "inicio_contrato"; title: string; date: string; time: string }

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

const mockMilestones: CalendarMilestone[] = [
  { id: "1", bidTitle: "Suministro de Equipo Medico - IMSS", type: "entrega_propuestas", title: "Entrega de propuestas", date: "2026-04-02", time: "10:00" },
  { id: "2", bidTitle: "Consultoria TI - SAT", type: "junta_aclaraciones", title: "Junta de aclaraciones", date: "2026-04-02", time: "14:00" },
  { id: "3", bidTitle: "Servicio de Limpieza - CFE", type: "apertura_tecnica", title: "Apertura tecnica", date: "2026-04-03", time: "11:00" },
  { id: "4", bidTitle: "Infraestructura de Red - PEMEX", type: "junta_aclaraciones", title: "Junta de aclaraciones", date: "2026-04-04", time: "09:30" },
  { id: "5", bidTitle: "Software ERP - ISSSTE", type: "publicacion", title: "Publicacion en CompraNet", date: "2026-04-05", time: "08:00" },
  { id: "6", bidTitle: "Mantenimiento Vehicular - SEDENA", type: "entrega_propuestas", title: "Entrega de propuestas", date: "2026-04-06", time: "15:00" },
  { id: "7", bidTitle: "Suministro de Equipo Medico - IMSS", type: "apertura_economica", title: "Apertura economica", date: "2026-04-08", time: "10:00" },
  { id: "8", bidTitle: "Consultoria TI - SAT", type: "entrega_propuestas", title: "Entrega de propuestas", date: "2026-04-09", time: "12:00" },
  { id: "9", bidTitle: "Servicio de Limpieza - CFE", type: "fallo", title: "Emision de fallo", date: "2026-04-10", time: "16:00" },
  { id: "10", bidTitle: "Infraestructura de Red - PEMEX", type: "entrega_propuestas", title: "Entrega de propuestas", date: "2026-04-14", time: "11:00" },
  { id: "11", bidTitle: "Suministro de Equipo Medico - IMSS", type: "fallo", title: "Emision de fallo", date: "2026-04-18", time: "14:00" },
  { id: "12", bidTitle: "Consultoria TI - SAT", type: "apertura_tecnica", title: "Apertura tecnica", date: "2026-04-22", time: "10:00" },
  { id: "13", bidTitle: "Software ERP - ISSSTE", type: "junta_aclaraciones", title: "Junta de aclaraciones", date: "2026-04-25", time: "09:00" },
  { id: "14", bidTitle: "Mantenimiento Vehicular - SEDENA", type: "fallo", title: "Emision de fallo", date: "2026-04-30", time: "16:00" },
  { id: "15", bidTitle: "Servicio de Limpieza - CFE", type: "firma_contrato", title: "Firma de contrato", date: "2026-05-05", time: "10:00" },
]

function getUrgency(dateStr: string): "today" | "this_week" | "later" {
  const today = new Date("2026-04-02"); const date = new Date(dateStr)
  const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return "today"; if (diffDays <= 5) return "this_week"; return "later"
}

const urgencyColors = { today: "border-l-destructive", this_week: "border-l-amber-500", later: "border-l-blue-500" }

const milestoneTypes = ["Todos", "publicacion", "junta_aclaraciones", "entrega_propuestas", "apertura_tecnica", "apertura_economica", "fallo", "firma_contrato"]

export default function CalendarioPage() {
  const [view, setView] = useState<"lista" | "calendario">("lista")
  const [filterType, setFilterType] = useState("Todos")

  const filtered = filterType === "Todos" ? mockMilestones : mockMilestones.filter((m) => m.type === filterType)

  const groupedByDate = filtered.reduce<Record<string, CalendarMilestone[]>>((acc, m) => {
    if (!acc[m.date]) acc[m.date] = []; acc[m.date].push(m); return acc
  }, {})
  const sortedDates = Object.keys(groupedByDate).sort()

  const next7Days = mockMilestones.filter((m) => {
    const date = new Date(m.date); const today = new Date("2026-04-02")
    const diff = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff < 7
  })

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
          {sortedDates.map((date) => {
            const milestones = groupedByDate[date]; const urgency = getUrgency(date); const isToday = date === "2026-04-02"
            return (
              <div key={date}>
                <div className="mb-3 flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", urgency === "today" ? "bg-destructive" : urgency === "this_week" ? "bg-amber-500" : "bg-blue-500")} />
                  <h3 className="text-sm font-semibold text-foreground">{formatDate(date, "EEEE, d 'de' MMMM yyyy")}{isToday && (<span className="ml-2 text-xs font-normal text-destructive">Hoy</span>)}</h3>
                </div>
                <div className="space-y-2">
                  {milestones.map((milestone) => {
                    const config = milestoneTypeConfig[milestone.type]
                    return (
                      <div key={milestone.id} className={cn("flex items-center gap-4 rounded-lg border border-border border-l-2 bg-card px-4 py-3 transition-colors hover:border-primary/30", urgencyColors[urgency])}>
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
                    <div key={m.id} className="flex items-center gap-2 text-xs">
                      <span className={cn("shrink-0", config.color.split(" ")[1])}>{config.icon}</span>
                      <span className="truncate text-muted-foreground">{m.bidTitle.split(" - ")[1] || m.bidTitle}</span>
                      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                      <span className="shrink-0 tabular-nums text-muted-foreground">{formatDate(m.date, "d MMM")}</span>
                    </div>
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
