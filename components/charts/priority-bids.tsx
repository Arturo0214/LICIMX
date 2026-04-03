'use client'

import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { Bid } from '@/types'

interface PriorityBidsProps {
  bids: Bid[]
}

function getDaysUntilDeadline(bid: Bid): number | null {
  const deadline = bid.proposal_deadline
  if (!deadline) return null
  const now = new Date('2026-04-02T12:00:00Z')
  const target = new Date(deadline)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function formatAmount(amount: number | null): string {
  if (!amount) return '-'
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`
  }
  return `$${(amount / 1_000).toFixed(0)}K`
}

function getScoreColor(score: number | null): string {
  if (!score) return 'bg-muted-foreground/40'
  if (score >= 80) return 'bg-success'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

export function PriorityBids({ bids }: PriorityBidsProps) {
  const sorted = [...bids]
    .filter(
      (b) =>
        !['ganada', 'perdida', 'desierta', 'descartada'].includes(
          b.pipeline_stage,
        ),
    )
    .sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0))
    .slice(0, 6)

  return (
    <div className="space-y-1">
      {sorted.map((bid) => {
        const days = getDaysUntilDeadline(bid)

        return (
          <div
            key={bid.id}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5',
              'hover:bg-muted/50 transition-colors cursor-pointer group',
            )}
          >
            {/* Score badge */}
            <div
              className={cn(
                'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                getScoreColor(bid.total_score),
              )}
            >
              {bid.total_score ?? '-'}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {bid.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {bid.contracting_entity}
              </p>
            </div>

            {/* Amount */}
            <span className="flex-shrink-0 text-sm font-medium text-foreground tabular-nums">
              {formatAmount(bid.estimated_amount)}
            </span>

            {/* Days */}
            {days !== null && (
              <span
                className={cn(
                  'flex-shrink-0 text-xs font-medium tabular-nums',
                  days <= 7
                    ? 'text-amber-400'
                    : days <= 3
                      ? 'text-red-400'
                      : 'text-muted-foreground',
                )}
              >
                {days}d
              </span>
            )}

            {/* Arrow */}
            <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
          </div>
        )
      })}
    </div>
  )
}
