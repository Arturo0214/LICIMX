"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatCurrency } from "@/lib/utils"
import {
  TrendingUp,
  Trophy,
  Target,
  DollarSign,
  BarChart3,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const kpis = [
  { label: "Total Participaciones", value: "147", icon: <BarChart3 className="h-5 w-5" />, change: "+12 vs. Q1 anterior" },
  { label: "Ganadas", value: "43", icon: <Trophy className="h-5 w-5" />, change: "+8 vs. Q1 anterior" },
  { label: "Tasa de Exito", value: "29.3%", icon: <Target className="h-5 w-5" />, change: "+2.1pp" },
  { label: "Monto Total Adjudicado", value: formatCurrency(284500000), icon: <DollarSign className="h-5 w-5" />, change: "+18% vs. Q1 anterior" },
]

const exitoPorDependencia = [
  { name: "IMSS", tasa: 42, participaciones: 28 },
  { name: "CFE", tasa: 35, participaciones: 22 },
  { name: "PEMEX", tasa: 30, participaciones: 18 },
  { name: "SAT", tasa: 28, participaciones: 15 },
  { name: "ISSSTE", tasa: 25, participaciones: 14 },
  { name: "SEDENA", tasa: 22, participaciones: 12 },
  { name: "CONAGUA", tasa: 20, participaciones: 10 },
  { name: "SCT", tasa: 18, participaciones: 9 },
]

const resultadosPorMes = [
  { mes: "Ene", ganadas: 4, perdidas: 6, desiertas: 2 },
  { mes: "Feb", ganadas: 5, perdidas: 4, desiertas: 1 },
  { mes: "Mar", ganadas: 6, perdidas: 5, desiertas: 3 },
  { mes: "Abr", ganadas: 3, perdidas: 7, desiertas: 2 },
  { mes: "May", ganadas: 7, perdidas: 3, desiertas: 1 },
  { mes: "Jun", ganadas: 4, perdidas: 5, desiertas: 2 },
  { mes: "Jul", ganadas: 5, perdidas: 4, desiertas: 1 },
  { mes: "Ago", ganadas: 3, perdidas: 6, desiertas: 3 },
  { mes: "Sep", ganadas: 6, perdidas: 3, desiertas: 0 },
  { mes: "Oct", ganadas: 4, perdidas: 5, desiertas: 2 },
  { mes: "Nov", ganadas: 5, perdidas: 4, desiertas: 1 },
  { mes: "Dic", ganadas: 3, perdidas: 2, desiertas: 1 },
]

const distribucionSector = [
  { name: "Salud", value: 32 },
  { name: "Energia", value: 24 },
  { name: "TI / Telecomunicaciones", value: 20 },
  { name: "Infraestructura", value: 14 },
  { name: "Servicios Generales", value: 10 },
]

const SECTOR_COLORS = ["#0d9488", "#3b82f6", "#8b5cf6", "#d97706", "#e11d48"]

const montosPorTrimestre = [
  { trimestre: "Q1 2025", monto: 45000000 },
  { trimestre: "Q2 2025", monto: 62000000 },
  { trimestre: "Q3 2025", monto: 58000000 },
  { trimestre: "Q4 2025", monto: 71000000 },
  { trimestre: "Q1 2026", monto: 84500000 },
]

interface HistorialEntry {
  id: string
  titulo: string
  entidad: string
  resultado: "ganada" | "perdida" | "desierta"
  monto: number
  margen: string
}

const historial: HistorialEntry[] = [
  { id: "1", titulo: "Suministro de Equipo Medico Hospitalario", entidad: "IMSS", resultado: "ganada", monto: 45200000, margen: "18.5%" },
  { id: "2", titulo: "Servicio de Limpieza Integral 2026", entidad: "CFE", resultado: "ganada", monto: 12800000, margen: "22.1%" },
  { id: "3", titulo: "Infraestructura de Red Corporativa", entidad: "PEMEX", resultado: "perdida", monto: 38500000, margen: "-" },
  { id: "4", titulo: "Consultoria en Ciberseguridad", entidad: "SAT", resultado: "ganada", monto: 8900000, margen: "31.2%" },
  { id: "5", titulo: "Software de Gestion Hospitalaria", entidad: "ISSSTE", resultado: "desierta", monto: 22000000, margen: "-" },
  { id: "6", titulo: "Mantenimiento de Vehiculos Pesados", entidad: "SEDENA", resultado: "perdida", monto: 15600000, margen: "-" },
  { id: "7", titulo: "Sistemas de Monitoreo Ambiental", entidad: "CONAGUA", resultado: "ganada", monto: 6700000, margen: "25.8%" },
  { id: "8", titulo: "Plataforma Digital de Tramites", entidad: "SAT", resultado: "perdida", monto: 52000000, margen: "-" },
]

const resultConfig: Record<string, { label: string; color: string }> = {
  ganada: { label: "Ganada", color: "bg-success/15 text-success border-success/30" },
  perdida: { label: "Perdida", color: "bg-red-500/15 text-red-500 border-red-500/30" },
  desierta: { label: "Desierta", color: "bg-muted text-muted-foreground border-border" },
}

const tooltipStyle = {
  contentStyle: { backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--muted-foreground)" },
  itemStyle: { color: "var(--muted-foreground)" },
  labelStyle: { color: "var(--foreground)", fontWeight: 600 },
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analitica e Inteligencia</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Metricas historicas, tasas de exito y tendencias para optimizar tu estrategia de licitaciones.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {kpi.icon}
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" />
                {kpi.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Tasa de Exito por Dependencia */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Tasa de Exito por Dependencia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={exitoPorDependencia} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} width={70} />
                <Tooltip {...tooltipStyle} formatter={(value) => [`${value}%`, "Tasa de exito"]} />
                <Bar dataKey="tasa" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resultados por Mes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Resultados por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resultadosPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="ganadas" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} name="Ganadas" />
                <Bar dataKey="perdidas" stackId="a" fill="#e11d48" radius={[0, 0, 0, 0]} name="Perdidas" />
                <Bar dataKey="desiertas" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Desiertas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Distribucion por Sector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Distribucion por Sector</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={distribucionSector}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {distribucionSector.map((_, i) => (
                      <Cell key={i} fill={SECTOR_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} formatter={(value) => [`${value}%`, "Participacion"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {distribucionSector.map((sector, i) => (
                  <div key={sector.name} className="flex items-center gap-2 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SECTOR_COLORS[i] }} />
                    <span className="flex-1 text-muted-foreground">{sector.name}</span>
                    <span className="font-semibold tabular-nums text-foreground">{sector.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Montos Adjudicados por Trimestre */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Montos Adjudicados por Trimestre</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={montosPorTrimestre}>
                <defs>
                  <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="trimestre" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                <Tooltip {...tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), "Monto adjudicado"]} />
                <Area type="monotone" dataKey="monto" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorMonto)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Historial de Licitaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Licitacion</TableHead>
                <TableHead className="text-muted-foreground">Entidad</TableHead>
                <TableHead className="text-muted-foreground">Resultado</TableHead>
                <TableHead className="text-muted-foreground text-right">Monto</TableHead>
                <TableHead className="text-muted-foreground text-right">Margen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historial.map((entry) => {
                const result = resultConfig[entry.resultado]
                return (
                  <TableRow key={entry.id} className="border-border/50">
                    <TableCell className="font-medium text-foreground text-sm">{entry.titulo}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{entry.entidad}</TableCell>
                    <TableCell>
                      <Badge className={cn("border text-[10px]", result.color)}>{result.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-foreground">{formatCurrency(entry.monto)}</TableCell>
                    <TableCell className={cn(
                      "text-right text-sm tabular-nums",
                      entry.margen !== "-" ? "text-success" : "text-muted-foreground"
                    )}>
                      {entry.margen}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
