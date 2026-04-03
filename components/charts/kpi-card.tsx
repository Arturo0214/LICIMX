'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: number
  formattedValue: string
  trend: number
  trendDirection: 'up' | 'down'
  icon: LucideIcon
  delay?: number
}

function useCountUp(end: number, duration = 1200, delay = 0) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now()

      function step(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(eased * end)
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step)
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [end, duration, delay])

  return current
}

export function KpiCard({
  title,
  value,
  formattedValue,
  trend,
  trendDirection,
  icon: Icon,
  delay = 0,
}: KpiCardProps) {
  const animated = useCountUp(value, 1200, delay)
  const isUp = trendDirection === 'up'

  // Build displayed value by replacing the number portion with animated version
  const displayValue = formattedValue.includes('%')
    ? `${animated.toFixed(1)}%`
    : formattedValue.includes('$')
      ? `$${(animated / 1_000_000).toFixed(1)}M`
      : Math.round(animated).toString()

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border',
        'bg-card backdrop-blur-sm',
        'p-6 transition-all duration-300',
        'hover:border-primary/30 hover:shadow-sm',
        'group',
      )}
    >
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      {/* Icon */}
      <div className="absolute top-4 right-4 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors">
        <Icon className="h-6 w-6" />
      </div>

      {/* Value */}
      <div className="relative">
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {displayValue}
        </p>

        {/* Title */}
        <p className="mt-1 text-sm text-muted-foreground">{title}</p>

        {/* Trend */}
        <div className="mt-3 flex items-center gap-1.5">
          {isUp ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              isUp ? 'text-success' : 'text-destructive',
            )}
          >
            {isUp ? '+' : '-'}{Math.abs(trend)}%
          </span>
          <span className="text-xs text-muted-foreground">vs mes anterior</span>
        </div>
      </div>
    </div>
  )
}
