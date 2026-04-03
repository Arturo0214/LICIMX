"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  Building2,
  Users,
  Target,
  Bell,
  Plug,
  Upload,
  UserPlus,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  MessageSquare,
  Smartphone,
  Crown,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const orgData = {
  name: "Soluciones Tecnologicas Avanzadas SA de CV",
  rfc: "STA200315XY9",
  industry: "Tecnologias de la Informacion",
  plan: "Pro",
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  roleLabel: string
  initials: string
  isActive: boolean
}

const teamMembers: TeamMember[] = [
  { id: "1", name: "Ing. Roberto Mendez Lopez", email: "rmendez@statech.mx", role: "director", roleLabel: "Director", initials: "RM", isActive: true },
  { id: "2", name: "Lic. Ana Gabriela Torres", email: "atorres@statech.mx", role: "analista", roleLabel: "Analista", initials: "AT", isActive: true },
  { id: "3", name: "Lic. Carlos Eduardo Ramirez", email: "cramirez@statech.mx", role: "abogado", roleLabel: "Abogado", initials: "CR", isActive: true },
  { id: "4", name: "Ing. Sofia Valentina Cruz", email: "svcruz@statech.mx", role: "tecnico", roleLabel: "Tecnico", initials: "SC", isActive: true },
  { id: "5", name: "C.P. Miguel Angel Reyes", email: "mareyes@statech.mx", role: "capturista", roleLabel: "Capturista", initials: "MR", isActive: true },
  { id: "6", name: "Lic. Fernanda Lopez Diaz", email: "flopez@statech.mx", role: "analista", roleLabel: "Analista", initials: "FL", isActive: false },
]

const roleColors: Record<string, string> = {
  director: "bg-primary/15 text-primary border-primary/30",
  analista: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  abogado: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  tecnico: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
  capturista: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  admin: "bg-rose-500/15 text-rose-500 border-rose-500/30",
}

interface NotifPref {
  event: string
  email: boolean
  whatsapp: boolean
  in_app: boolean
}

const defaultNotifPrefs: NotifPref[] = [
  { event: "Nueva licitacion detectada", email: true, whatsapp: true, in_app: true },
  { event: "Fecha limite proxima (3 dias)", email: true, whatsapp: true, in_app: true },
  { event: "Fecha limite proxima (1 dia)", email: true, whatsapp: true, in_app: true },
  { event: "Cambio de etapa en pipeline", email: false, whatsapp: false, in_app: true },
  { event: "Documento por vencer", email: true, whatsapp: false, in_app: true },
  { event: "Tarea asignada", email: false, whatsapp: false, in_app: true },
  { event: "Propuesta aprobada", email: true, whatsapp: true, in_app: true },
  { event: "Fallo publicado", email: true, whatsapp: true, in_app: true },
  { event: "Nuevo competidor detectado", email: false, whatsapp: false, in_app: true },
  { event: "Aclaracion publicada", email: true, whatsapp: false, in_app: true },
]

interface Integration {
  id: string
  name: string
  description: string
  status: "conectado" | "desconectado" | "configurando"
  icon: string
}

const integrations: Integration[] = [
  { id: "compranet", name: "CompraNet", description: "Monitoreo automatico de licitaciones en CompraNet", status: "conectado", icon: "CN" },
  { id: "dof", name: "Diario Oficial (DOF)", description: "Alertas de convocatorias publicadas en el DOF", status: "conectado", icon: "DOF" },
  { id: "claude", name: "Claude API (Anthropic)", description: "Analisis inteligente de bases, scoring y generacion de propuestas", status: "conectado", icon: "AI" },
  { id: "n8n", name: "n8n (Automatizaciones)", description: "Workflows automatizados para notificaciones y procesos", status: "configurando", icon: "n8n" },
]

const integrationStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  conectado: { label: "Conectado", color: "text-success", icon: <CheckCircle2 className="h-4 w-4 text-success" /> },
  desconectado: { label: "Desconectado", color: "text-destructive", icon: <XCircle className="h-4 w-4 text-destructive" /> },
  configurando: { label: "Configurando", color: "text-amber-500", icon: <Clock className="h-4 w-4 text-amber-500" /> },
}

export default function SettingsPage() {
  const [notifPrefs, setNotifPrefs] = useState<NotifPref[]>(defaultNotifPrefs)

  const toggleNotif = (index: number, channel: "email" | "whatsapp" | "in_app") => {
    setNotifPrefs((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [channel]: !p[channel] } : p))
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra tu organizacion, equipo, notificaciones e integraciones.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="organizacion">
        <TabsList>
          <TabsTrigger value="organizacion">
            <Building2 className="mr-2 h-4 w-4" />
            Organizacion
          </TabsTrigger>
          <TabsTrigger value="usuarios">
            <Users className="mr-2 h-4 w-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="scoring">
            <Target className="mr-2 h-4 w-4" />
            Scoring
          </TabsTrigger>
          <TabsTrigger value="notificaciones">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="integraciones">
            <Plug className="mr-2 h-4 w-4" />
            Integraciones
          </TabsTrigger>
        </TabsList>

        {/* Tab: Organizacion */}
        <TabsContent value="organizacion" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Datos de la Organizacion</CardTitle>
                  <CardDescription>Informacion general de tu empresa</CardDescription>
                </div>
                <Badge className={cn("border text-sm px-3 py-1 gap-1.5", "bg-accent/15 text-accent border-accent/30")}>
                  <Crown className="h-3.5 w-3.5" />
                  Plan {orgData.plan}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted text-muted-foreground">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Logo de la empresa</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG o SVG. Max 2MB.</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    Subir imagen
                  </Button>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Nombre de la Organizacion</Label>
                  <Input defaultValue={orgData.name} />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">RFC</Label>
                  <Input defaultValue={orgData.rfc} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Industria / Giro</Label>
                  <Input defaultValue={orgData.industry} />
                </div>
              </div>

              <Button>
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Usuarios */}
        <TabsContent value="usuarios" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Miembros del Equipo</h2>
            <Button size="sm">
              <UserPlus className="mr-2 h-3.5 w-3.5" />
              Invitar
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Miembro</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Rol</TableHead>
                  <TableHead className="text-muted-foreground">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-xs text-muted-foreground">{member.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      <Badge className={cn("border text-[10px]", roleColors[member.role])}>
                        {member.roleLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className={cn("h-2 w-2 rounded-full", member.isActive ? "bg-success" : "bg-muted-foreground/40")} />
                        <span className="text-xs text-muted-foreground">{member.isActive ? "Activo" : "Inactivo"}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab: Scoring */}
        <TabsContent value="scoring" className="mt-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-10 w-10 text-muted-foreground/60" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">Configuracion de Scoring</h3>
              <p className="mt-1 text-xs text-muted-foreground">Administra las variables y pesos del sistema de scoring.</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <a href="/scoring">
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  Ir a Scoring
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Notificaciones */}
        <TabsContent value="notificaciones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificacion</CardTitle>
              <CardDescription>
                Selecciona como quieres recibir cada tipo de alerta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border">
                {/* Header Row */}
                <div className="grid grid-cols-4 gap-4 border-b border-border px-4 py-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Evento</div>
                  <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    WhatsApp
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
                    <Smartphone className="h-3.5 w-3.5" />
                    In-App
                  </div>
                </div>
                {/* Rows */}
                {notifPrefs.map((pref, index) => (
                  <div
                    key={pref.event}
                    className={cn(
                      "grid grid-cols-4 gap-4 px-4 py-3 transition-colors hover:bg-muted/30",
                      index < notifPrefs.length - 1 && "border-b border-border/50"
                    )}
                  >
                    <div className="text-sm text-foreground">{pref.event}</div>
                    <div className="flex justify-center">
                      <Checkbox
                        checked={pref.email}
                        onCheckedChange={() => toggleNotif(index, "email")}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        checked={pref.whatsapp}
                        onCheckedChange={() => toggleNotif(index, "whatsapp")}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox
                        checked={pref.in_app}
                        onCheckedChange={() => toggleNotif(index, "in_app")}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">
                Guardar Preferencias
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Integraciones */}
        <TabsContent value="integraciones" className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {integrations.map((integration) => {
              const statusInfo = integrationStatusConfig[integration.status]
              return (
                <Card key={integration.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-bold text-foreground">
                        {integration.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{integration.name}</h3>
                          {statusInfo.icon}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{integration.description}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <span className={cn("text-xs font-medium", statusInfo.color)}>
                            {statusInfo.label}
                          </span>
                          <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                            Configurar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
