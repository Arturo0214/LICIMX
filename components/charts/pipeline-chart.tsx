'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { pipelineColumns } from '@/lib/data/mock-data'
import type { DashboardStats } from '@/types'

interface PipelineChartProps {
  stats: DashboardStats
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: { label: string; count: number; color: string } }>
}) => {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-foreground">{data.label}</p>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{data.count}</span>{' '}
        licitaciones
      </p>
    </div>
  )
}

export function PipelineChart({ stats }: PipelineChartProps) {
  const data = pipelineColumns.map((col) => ({
    stage: col.stage,
    label: col.label,
    count: stats.bids_by_stage[col.stage] ?? 0,
    color: col.color,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
        barCategoryGap="20%"
      >
        <XAxis
          type="number"
          hide
          domain={[0, 'auto']}
        />
        <YAxis
          type="category"
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 13 }}
          width={120}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(0,0,0,0.03)' }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {data.map((entry) => (
            <Cell key={entry.stage} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
