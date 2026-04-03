'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { DashboardStats } from '@/types'

interface TrendChartProps {
  data: DashboardStats['monthly_trend']
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number; color: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null

  const labels: Record<string, string> = {
    detected: 'Detectadas',
    won: 'Ganadas',
    lost: 'Perdidas',
  }

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
      <p className="mb-1 text-sm font-medium text-foreground">{label}</p>
      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center gap-2 text-sm">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground">{labels[item.dataKey]}:</span>
          <span className="font-semibold text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderLegend = (props: any) => {
  const labels: Record<string, string> = {
    detected: 'Detectadas',
    won: 'Ganadas',
    lost: 'Perdidas',
  }
  return (
    <div className="flex justify-center gap-6 pt-2">
      {props.payload?.map((entry: { value: string; color: string }) => (
        <div key={entry.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {labels[entry.value] ?? entry.value}
        </div>
      ))}
    </div>
  )
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="gradDetected" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#1e3a5f" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradWon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d9488" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradLost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e11d48" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
        <Area
          type="monotone"
          dataKey="detected"
          stroke="#1e3a5f"
          strokeWidth={2}
          fill="url(#gradDetected)"
        />
        <Area
          type="monotone"
          dataKey="won"
          stroke="#0d9488"
          strokeWidth={2}
          fill="url(#gradWon)"
        />
        <Area
          type="monotone"
          dataKey="lost"
          stroke="#e11d48"
          strokeWidth={2}
          fill="url(#gradLost)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
