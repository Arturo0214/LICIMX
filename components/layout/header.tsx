"use client"

import { Bell, Search, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/breadcrumbs"
import { UserNav } from "@/components/layout/user-nav"

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[]
}

export function Header({ breadcrumbs }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumbs items={breadcrumbs} />
        ) : (
          <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }]} />
        )}
      </div>

      {/* Center: Search */}
      <button className="flex h-9 w-72 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-muted">
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Buscar...</span>
        <kbd className="pointer-events-none hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {/* Right: Theme toggle + Notifications + User */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute left-2 top-2 h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            3
          </span>
        </button>
        <UserNav />
      </div>
    </header>
  )
}
