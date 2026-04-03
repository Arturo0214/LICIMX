"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  formatCurrencyCompact,
  formatRelativeDate,
  getScoreColor,
  getScoreBgColor,
  getUrgencyColor,
} from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Bid } from "@/types"
import { Calendar, User, GripVertical } from "lucide-react"

interface KanbanCardProps {
  bid: Bid
  assignedUserName?: string
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function KanbanCard({ bid, assignedUserName, onDragStart, onDragEnd }: KanbanCardProps) {
  const initials = assignedUserName
    ? assignedUserName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move"
        onDragStart?.()
      }}
      onDragEnd={onDragEnd}
    >
      <Link href={`/licitaciones/${bid.id}`}>
        <div
          className={cn(
            "group cursor-grab rounded-lg border border-border/60 bg-card p-3.5 transition-all duration-150",
            "hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/10 hover:ring-1 hover:ring-border",
            "hover:-translate-y-0.5 active:cursor-grabbing"
          )}
        >
          {/* Drag handle hint */}
          <div className="mb-1 flex items-center justify-between">
            <GripVertical className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
          </div>

          {/* Title */}
          <p className="mb-1.5 text-sm font-semibold leading-snug text-foreground line-clamp-2">
            {bid.title}
          </p>

          {/* Entity */}
          <p className="mb-3 text-xs text-muted-foreground line-clamp-1">
            {bid.contracting_entity}
          </p>

          {/* Amount | Score | Deadline row */}
          <div className="mb-3 flex items-center gap-2">
            {/* Amount */}
            <Badge
              variant="secondary"
              className="border-0 bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground"
            >
              {formatCurrencyCompact(bid.estimated_amount)}
            </Badge>

            {/* Score circle */}
            {bid.total_score != null && (
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                  getScoreBgColor(bid.total_score),
                  getScoreColor(bid.total_score)
                )}
              >
                {bid.total_score}
              </div>
            )}

            {/* Deadline countdown */}
            {bid.proposal_deadline && (
              <span
                className={cn(
                  "ml-auto flex items-center gap-1 text-[11px] font-medium",
                  getUrgencyColor(bid.proposal_deadline)
                )}
              >
                <Calendar className="h-3 w-3" />
                {formatRelativeDate(bid.proposal_deadline)}
              </span>
            )}
          </div>

          {/* Tags */}
          {bid.tags && bid.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {bid.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-md bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {bid.tags.length > 2 && (
                <span className="inline-flex rounded-md bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  +{bid.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Bottom: avatar + date */}
          <div className="flex items-center justify-between">
            {assignedUserName ? (
              <Avatar className="h-5 w-5">
                <AvatarFallback className="bg-muted text-[9px] font-medium text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted/50">
                <User className="h-3 w-3 text-muted-foreground/60" />
              </div>
            )}
            {bid.proposal_deadline && (
              <span className="text-[10px] text-muted-foreground/60">
                {new Date(bid.proposal_deadline).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
