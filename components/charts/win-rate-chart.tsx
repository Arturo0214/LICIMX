'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface WinRateChartProps {
  winRate: number
  won: number
  lost: number
  deserted: number
}

const COLORS = ['#0d9488', '#e11d48', '#94a3b8']

export function WinRateChart({ winRate, won, lost, deserted }: WinRateChartProps) {
  const data = [
    { name: 'Ganadas', value: won },
    { name: 'Perdidas', value: lost },
    { name: 'Desiertas', value: deserted },
  ]

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
                fillOpacity={0.85}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-foreground">
          {winRate.toFixed(1)}%
        </span>
        <span className="text-xs text-muted-foreground">Tasa de adjudicacion</span>
      </div>

      {/* Legend below */}
      <div className="flex justify-center gap-5 -mt-2">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[i] }}
            />
            {entry.name} ({entry.value})
          </div>
        ))}
      </div>
    </div>
  )
}
