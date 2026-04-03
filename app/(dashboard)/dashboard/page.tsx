'use client'

import { useMemo } from 'react'
import { Search, BarChart3, Trophy, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KpiCard } from '@/components/charts/kpi-card'
import { PipelineChart } from '@/components/charts/pipeline-chart'
import { TrendChart } from '@/components/charts/trend-chart'
import { WinRateChart } from '@/components/charts/win-rate-chart'
import { UpcomingDeadlines } from '@/components/charts/upcoming-deadlines'
import { PriorityBids } from '@/components/charts/priority-bids'
import { ActivityTimeline } from '@/components/charts/activity-timeline'
import { useBids } from '@/lib/store/hooks'
import { mockMilestones, mockActivityItems } from '@/lib/data/mock-data'
import { formatCurrencyCompact } from '@/lib/utils'
import type { DashboardStats, PipelineStage } from '@/types'

const ALL_STAGES: PipelineStage[] = [
  'detectada', 'analizando', 'aprobada', 'en_preparacion',
  'presentada', 'en_evaluacion', 'fallo',
  'ganada', 'perdida', 'desierta', 'descartada',
]

export default function DashboardPage() {
  const { bids, loaded } = useBids()

  const stats = useMemo<DashboardStats>(() => {
    const bidsByStage: Record<PipelineStage, number> = {} as Record<PipelineStage, number>
    for (const stage of ALL_STAGES) bidsByStage[stage] = 0
    for (const bid of bids) bidsByStage[bid.pipeline_stage] = (bidsByStage[bid.pipeline_stage] || 0) + 1

    const wonBids = bids.filter((b) => b.result === 'ganada' || b.pipeline_stage === 'ganada')
    const lostBids = bids.filter((b) => b.result === 'perdida' || b.pipeline_stage === 'perdida')
    const decidedBids = wonBids.length + lostBids.length
    const winRate = decidedBids > 0 ? wonBids.length / decidedBids : 0
    const totalWon = wonBids.reduce((sum, b) => sum + (b.awarded_amount || b.estimated_amount || 0), 0)

    const activeStages = ['detectada', 'analizando', 'aprobada', 'en_preparacion', 'presentada', 'en_evaluacion', 'fallo']
    const activePipeline = bids.filter((b) => activeStages.includes(b.pipeline_stage)).length

    const highPriority = bids
      .filter((b) => activeStages.includes(b.pipeline_stage) && b.total_score != null)
      .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
      .slice(0, 5)

    return {
      total_bids: bids.length,
      active_pipeline: activePipeline,
      win_rate: winRate,
      total_won_amount: totalWon,
      bids_by_stage: bidsByStage,
      upcoming_deadlines: mockMilestones.filter((m) => !m.is_completed).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
      high_priority_bids: highPriority,
      monthly_trend: [
        { month: '2025-10', detected: 8, won: 1, lost: 2 },
        { month: '2025-11', detected: 12, won: 2, lost: 1 },
        { month: '2025-12', detected: 6, won: 1, lost: 1 },
        { month: '2026-01', detected: 10, won: 3, lost: 2 },
        { month: '2026-02', detected: 9, won: 2, lost: 1 },
        { month: '2026-03', detected: 14, won: 1, lost: 0 },
      ],
    }
  }, [bids])

  if (!loaded) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Vista general del pipeline de licitaciones</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Oportunidades Detectadas"
          value={stats.total_bids}
          formattedValue={String(stats.total_bids)}
          trend={12}
          trendDirection="up"
          icon={Search}
          delay={0}
        />
        <KpiCard
          title="Pipeline Activo"
          value={stats.active_pipeline}
          formattedValue={String(stats.active_pipeline)}
          trend={8}
          trendDirection="up"
          icon={BarChart3}
          delay={100}
        />
        <KpiCard
          title="Tasa de Adjudicacion"
          value={stats.win_rate}
          formattedValue={`${(stats.win_rate * 100).toFixed(1)}%`}
          trend={5}
          trendDirection="up"
          icon={Trophy}
          delay={200}
        />
        <KpiCard
          title="Ingreso Adjudicado"
          value={stats.total_won_amount}
          formattedValue={formatCurrencyCompact(stats.total_won_amount)}
          trend={18}
          trendDirection="up"
          icon={DollarSign}
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Pipeline por Etapa</CardTitle>
            </CardHeader>
            <CardContent>
              <PipelineChart stats={stats} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tendencia Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={stats.monthly_trend} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tasa de Adjudicacion</CardTitle>
            </CardHeader>
            <CardContent>
              <WinRateChart
                winRate={stats.win_rate}
                won={stats.bids_by_stage.ganada ?? 0}
                lost={stats.bids_by_stage.perdida ?? 0}
                deserted={stats.bids_by_stage.desierta ?? 0}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Proximos Vencimientos</CardTitle>
            </CardHeader>
            <CardContent className="px-3">
              <UpcomingDeadlines milestones={stats.upcoming_deadlines} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Licitaciones Alta Prioridad</CardTitle>
            </CardHeader>
            <CardContent className="px-3">
              <PriorityBids bids={stats.high_priority_bids} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline items={mockActivityItems} />
        </CardContent>
      </Card>
    </div>
  )
}
