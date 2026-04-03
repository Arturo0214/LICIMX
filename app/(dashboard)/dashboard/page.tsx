'use client'

import { Search, BarChart3, Trophy, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KpiCard } from '@/components/charts/kpi-card'
import { PipelineChart } from '@/components/charts/pipeline-chart'
import { TrendChart } from '@/components/charts/trend-chart'
import { WinRateChart } from '@/components/charts/win-rate-chart'
import { UpcomingDeadlines } from '@/components/charts/upcoming-deadlines'
import { PriorityBids } from '@/components/charts/priority-bids'
import { ActivityTimeline } from '@/components/charts/activity-timeline'
import {
  mockDashboardStats,
  mockMilestones,
  mockBids,
  mockActivityItems,
} from '@/lib/data/mock-data'

export default function DashboardPage() {
  const stats = mockDashboardStats

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vista general del pipeline de licitaciones
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Oportunidades Detectadas"
          value={stats.total_bids}
          formattedValue="47"
          trend={12}
          trendDirection="up"
          icon={Search}
          delay={0}
        />
        <KpiCard
          title="Pipeline Activo"
          value={stats.active_pipeline}
          formattedValue="12"
          trend={8}
          trendDirection="up"
          icon={BarChart3}
          delay={100}
        />
        <KpiCard
          title="Tasa de Adjudicacion"
          value={stats.win_rate}
          formattedValue="34.5%"
          trend={5}
          trendDirection="up"
          icon={Trophy}
          delay={200}
        />
        <KpiCard
          title="Ingreso Adjudicado"
          value={stats.total_won_amount}
          formattedValue="$28.5M"
          trend={18}
          trendDirection="up"
          icon={DollarSign}
          delay={300}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left column (60%) */}
        <div className="space-y-6 lg:col-span-3">
          {/* Pipeline by stage */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Pipeline por Etapa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PipelineChart stats={stats} />
            </CardContent>
          </Card>

          {/* Monthly trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Tendencia Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={stats.monthly_trend} />
            </CardContent>
          </Card>
        </div>

        {/* Right column (40%) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Win rate */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Tasa de Adjudicacion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WinRateChart
                winRate={stats.win_rate}
                won={stats.bids_by_stage.ganada ?? 6}
                lost={stats.bids_by_stage.perdida ?? 4}
                deserted={stats.bids_by_stage.desierta ?? 2}
              />
            </CardContent>
          </Card>

          {/* Upcoming deadlines */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Proximos Vencimientos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3">
              <UpcomingDeadlines milestones={mockMilestones} />
            </CardContent>
          </Card>

          {/* High priority bids */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Licitaciones Alta Prioridad
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3">
              <PriorityBids bids={mockBids} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full width: Activity timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline items={mockActivityItems} />
        </CardContent>
      </Card>
    </div>
  )
}
