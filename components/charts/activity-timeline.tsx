'use client'

import { cn } from '@/lib/utils'
import {
  ArrowRightLeft,
  MessageSquare,
  FileUp,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react'
import type { ActivityItem } from '@/types'

interface ActivityTimelineProps {
  items: ActivityItem[]
}

const typeConfig: Record<
  ActivityItem['type'],
  { icon: typeof ArrowRightLeft; color: string; bg: string }
> = {
  stage_change: {
    icon: ArrowRightLeft,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/15',
  },
  comment: {
    icon: MessageSquare,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
  },
  document: {
    icon: FileUp,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
  },
  bid_created: {
    icon: PlusCircle,
    color: 'text-success',
    bg: 'bg-success/15',
  },
  task_completed: {
    icon: CheckCircle2,
    color: 'text-teal-400',
    bg: 'bg-teal-500/15',
  },
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date('2026-04-02T12:00:00Z')
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `hace ${diffMins}m`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays === 1) return 'ayer'
  if (diffDays < 7) return `hace ${diffDays}d`
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  const sorted = [...items].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />

      <div className="space-y-0.5">
        {sorted.map((item) => {
          const config = typeConfig[item.type]
          const Icon = config.icon

          return (
            <div
              key={item.id}
              className="relative flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-border/30 transition-colors"
            >
              {/* Icon */}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                  config.bg,
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', config.color)} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {item.user}
                  </span>{' '}
                  {item.action}{' '}
                  {item.bid_title && (
                    <span className="font-medium text-foreground">
                      {item.bid_title}
                    </span>
                  )}
                </p>
              </div>

              {/* Timestamp */}
              <span className="flex-shrink-0 pt-0.5 text-xs text-muted-foreground/60">
                {formatRelativeTime(item.timestamp)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
