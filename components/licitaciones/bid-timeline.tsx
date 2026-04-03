"use client"

import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import {
  ArrowRight,
  FileUp,
  MessageSquare,
  Star,
  UserPlus,
  BarChart3,
  Edit,
  Plus,
} from "lucide-react"

interface TimelineEvent {
  id: string
  action: string
  description: string | null
  created_at: string
  user_name?: string
}

interface BidTimelineProps {
  events: TimelineEvent[]
}

const ACTION_CONFIG: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  create: { icon: Plus, color: "text-success", bg: "bg-success/15" },
  stage_change: { icon: ArrowRight, color: "text-blue-400", bg: "bg-blue-500/15" },
  upload: { icon: FileUp, color: "text-violet-400", bg: "bg-violet-500/15" },
  comment: { icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-500/15" },
  score: { icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/15" },
  assign: { icon: UserPlus, color: "text-cyan-400", bg: "bg-cyan-500/15" },
  update: { icon: Edit, color: "text-orange-400", bg: "bg-orange-500/15" },
}

const DEFAULT_CONFIG = { icon: Edit, color: "text-muted-foreground", bg: "bg-muted" }

export function BidTimeline({ events }: BidTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="relative space-y-0">
      {sortedEvents.map((event, idx) => {
        const config = ACTION_CONFIG[event.action] || DEFAULT_CONFIG
        const Icon = config.icon

        return (
          <div key={event.id} className="flex gap-4 pb-6 last:pb-0">
            {/* Timeline connector */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "z-10 flex h-8 w-8 items-center justify-center rounded-full",
                  config.bg
                )}
              >
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              {idx < sortedEvents.length - 1 && (
                <div className="w-px flex-1 bg-border/60" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm text-foreground leading-snug">
                {event.description || event.action}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{formatDate(event.created_at, "d MMM yyyy, HH:mm")}</span>
                {event.user_name && (
                  <>
                    <span className="text-border">|</span>
                    <span className="text-muted-foreground">{event.user_name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {sortedEvents.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No hay actividad registrada.
        </div>
      )}
    </div>
  )
}
