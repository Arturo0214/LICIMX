"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { getStageDotColor } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { KanbanCard } from "@/components/pipeline/kanban-card"
import { Plus } from "lucide-react"
import type { Bid, PipelineStage } from "@/types"

interface KanbanColumnProps {
  stage: PipelineStage
  label: string
  bids: Bid[]
  getUserName: (id: string | null | undefined) => string | undefined
  onAdd: () => void
  onDragStart: (bidId: string) => void
  onDrop: () => void
  onDragEnd: () => void
  isDragOver: boolean
}

export function KanbanColumn({ stage, label, bids, getUserName, onAdd, onDragStart, onDrop, onDragEnd }: KanbanColumnProps) {
  const [dragOver, setDragOver] = useState(false)

  return (
    <div
      className={cn(
        "flex min-w-[290px] max-w-[290px] flex-col rounded-xl bg-muted/30 border border-border/40 transition-colors",
        dragOver && "border-primary/50 bg-primary/5"
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        onDrop()
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <div className={cn("h-2.5 w-2.5 rounded-full", getStageDotColor(stage))} />
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground">
          {bids.length}
        </span>
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1 px-2 pb-2" style={{ maxHeight: "calc(100vh - 240px)" }}>
        <div className="flex flex-col gap-2 p-1">
          {bids.map((bid) => (
            <KanbanCard
              key={bid.id}
              bid={bid}
              assignedUserName={getUserName(bid.assigned_user_id)}
              onDragStart={() => onDragStart(bid.id)}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Add button */}
      <div className="border-t border-border/40 px-2 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={onAdd}
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar licitacion
        </Button>
      </div>
    </div>
  )
}
