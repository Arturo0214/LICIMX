'use client'

import { cn } from '@/lib/utils'
import { Calendar, Users, FileText, Gavel, MapPin } from 'lucide-react'
import type { Milestone } from '@/types'

interface UpcomingDeadlinesProps {
  milestones: Milestone[]
}

const typeLabels: Record<string, string> = {
  publicacion: 'Publicacion',
  junta_aclaraciones: 'Junta',
  entrega_propuestas: 'Entrega',
  apertura_tecnica: 'Apertura Tec.',
  apertura_economica: 'Apertura Eco.',
  fallo: 'Fallo',
  firma_contrato: 'Firma',
  inicio_contrato: 'Inicio',
  visita_sitio: 'Visita',
  otro: 'Otro',
}

const typeIcons: Record<string, typeof Calendar> = {
  junta_aclaraciones: Users,
  entrega_propuestas: FileText,
  fallo: Gavel,
  visita_sitio: MapPin,
}

function getDaysRemaining(dateStr: string): number {
  const now = new Date('2026-04-02T12:00:00Z')
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  })
}

export function UpcomingDeadlines({ milestones }: UpcomingDeadlinesProps) {
  const sorted = [...milestones]
    .filter((m) => !m.is_completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8)

  return (
    <div className="space-y-1">
      {sorted.map((milestone) => {
        const days = getDaysRemaining(milestone.date)
        const Icon = typeIcons[milestone.type] ?? Calendar

        return (
          <div
            key={milestone.id}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5',
              'hover:bg-muted/50 transition-colors cursor-pointer group',
            )}
          >
            {/* Date badge */}
            <div
              className={cn(
                'flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg text-xs font-medium',
                days <= 3
                  ? 'bg-red-500/15 text-red-400'
                  : days <= 7
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-blue-500/15 text-blue-400',
              )}
            >
              <span className="text-[10px] leading-none uppercase">
                {formatDate(milestone.date).split(' ')[1]}
              </span>
              <span className="text-base font-bold leading-tight">
                {formatDate(milestone.date).split(' ')[0]}
              </span>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {milestone.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {milestone.description}
              </p>
            </div>

            {/* Type badge */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Icon className="h-3 w-3 text-muted-foreground" />
              <span
                className={cn(
                  'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium',
                  'bg-muted text-muted-foreground border border-border',
                )}
              >
                {typeLabels[milestone.type] ?? milestone.type}
              </span>
            </div>

            {/* Days remaining */}
            <span
              className={cn(
                'flex-shrink-0 text-xs font-medium tabular-nums',
                days <= 3
                  ? 'text-red-400'
                  : days <= 7
                    ? 'text-amber-400'
                    : 'text-muted-foreground',
              )}
            >
              {days}d
            </span>
          </div>
        )
      })}
    </div>
  )
}
