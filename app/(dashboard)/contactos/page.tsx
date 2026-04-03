"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  UserPlus,
  Search,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Building2,
  Users,
  Swords,
  Handshake,
  Truck,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

interface MockContact {
  id: string
  name: string
  entity: string
  position: string
  type: "funcionario" | "competidor" | "proveedor" | "aliado"
  email: string
  phone: string
  tags: string[]
  notes: string
}

const mockContacts: MockContact[] = [
  { id: "1", name: "Lic. Carlos Eduardo Ramirez Gutierrez", entity: "IMSS - Direccion de Adquisiciones", position: "Director de Area", type: "funcionario", email: "carlos.ramirez@imss.gob.mx", phone: "+52 55 5238 1700", tags: ["salud", "adquisiciones"], notes: "Contacto principal para licitaciones de equipo medico. Reuniones los martes." },
  { id: "2", name: "Ing. Alejandra Martinez Soto", entity: "CFE - Unidad de Compras", position: "Subdirectora de Contrataciones", type: "funcionario", email: "alejandra.martinez@cfe.mx", phone: "+52 55 5229 4400", tags: ["energia", "servicios"], notes: "Responsable de contratos de servicios generales." },
  { id: "3", name: "Lic. Roberto Fernandez Diaz", entity: "Soluciones Integrales del Norte SA de CV", position: "Director General", type: "competidor", email: "rfernandez@sinorte.com.mx", phone: "+52 81 8342 5500", tags: ["TI", "gobierno"], notes: "Competidor fuerte en licitaciones de TI. Base en Monterrey." },
  { id: "4", name: "Ing. Patricia Hernandez Vega", entity: "Grupo Tecnologico Peninsular SA de CV", position: "Gerente Comercial", type: "competidor", email: "phernandez@gtpeninsular.com", phone: "+52 99 9920 1234", tags: ["software", "gobierno"], notes: "Especialistas en software gubernamental. Operan en sureste." },
  { id: "5", name: "C.P. Fernando Lopez Castillo", entity: "Distribuidora Medica del Centro SA de CV", position: "Director Comercial", type: "proveedor", email: "flopez@dismec.com.mx", phone: "+52 55 5678 9012", tags: ["equipo medico", "insumos"], notes: "Proveedor principal de equipo medico. Precios competitivos." },
  { id: "6", name: "Ing. Maria del Carmen Ortiz Ruiz", entity: "PEMEX - Gerencia de Contrataciones", position: "Gerente de Contrataciones", type: "funcionario", email: "mcarmen.ortiz@pemex.com", phone: "+52 55 1944 2500", tags: ["energia", "infraestructura"], notes: "Encargada de licitaciones de infraestructura tecnologica." },
  { id: "7", name: "Lic. Juan Pablo Moreno Silva", entity: "Consultores Asociados Bajio SC", position: "Socio Director", type: "aliado", email: "jpmoreno@cabajio.com", phone: "+52 47 7712 3456", tags: ["legal", "consultorias"], notes: "Aliado para consultorias legales. Experto en derecho administrativo." },
  { id: "8", name: "Ing. Ana Gabriela Torres Mendez", entity: "TechSolutions Mexico SA de CV", position: "CTO", type: "aliado", email: "atorres@techsolutions.mx", phone: "+52 33 3615 7890", tags: ["TI", "desarrollo"], notes: "Partner tecnologico para proyectos de desarrollo de software." },
  { id: "9", name: "C.P. Ricardo Salinas Pliego Jr.", entity: "Infraestructura y Servicios Globales SA de CV", position: "Director de Licitaciones", type: "competidor", email: "rsalinas@isglobal.com.mx", phone: "+52 55 5432 1098", tags: ["infraestructura", "servicios"], notes: "Competidor en servicios de infraestructura. Empresa grande con multiples contratos." },
  { id: "10", name: "Dra. Lucia Esperanza Garcia Navarro", entity: "SAT - Administracion General de Recursos", position: "Administradora de Recursos Materiales", type: "funcionario", email: "lucia.garcia@sat.gob.mx", phone: "+52 55 6272 2728", tags: ["fiscal", "TI"], notes: "Responsable de contrataciones de TI en el SAT." },
  { id: "11", name: "Ing. Miguel Angel Reyes Dominguez", entity: "Suministros Industriales del Pacifico SA de CV", position: "Gerente de Ventas", type: "proveedor", email: "mareyes@sipac.com.mx", phone: "+52 66 9985 4321", tags: ["industrial", "suministros"], notes: "Proveedor de suministros industriales con cobertura nacional." },
  { id: "12", name: "Lic. Sofia Valentina Cruz Espinoza", entity: "Deloitte Mexico", position: "Senior Manager - Government", type: "aliado", email: "svcruz@deloitte.com", phone: "+52 55 5080 6000", tags: ["consultoria", "gobierno"], notes: "Aliada para proyectos de consultoria gubernamental de alto perfil." },
]

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  funcionario: { label: "Funcionario", icon: <Building2 className="h-3.5 w-3.5" />, color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  competidor: { label: "Competidor", icon: <Swords className="h-3.5 w-3.5" />, color: "bg-red-500/15 text-red-400 border-red-500/30" },
  proveedor: { label: "Proveedor", icon: <Truck className="h-3.5 w-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  aliado: { label: "Aliado", icon: <Handshake className="h-3.5 w-3.5" />, color: "bg-teal-500/15 text-teal-500 border-teal-500/30" },
}

const filterTabs = [
  { value: "todos", label: "Todos", icon: <Users className="h-4 w-4" /> },
  { value: "funcionario", label: "Funcionarios", icon: <Building2 className="h-4 w-4" /> },
  { value: "competidor", label: "Competidores", icon: <Swords className="h-4 w-4" /> },
  { value: "proveedor", label: "Proveedores", icon: <Truck className="h-4 w-4" /> },
  { value: "aliado", label: "Aliados", icon: <Handshake className="h-4 w-4" /> },
]

export default function ContactosPage() {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("todos")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const filtered = mockContacts.filter((c) => {
    const matchesType = activeFilter === "todos" || c.type === activeFilter
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.entity.toLowerCase().includes(search.toLowerCase()) ||
      c.position.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contactos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Directorio de funcionarios, competidores, proveedores y aliados estrategicos.
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Contacto
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                activeFilter === tab.value
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.value !== "todos" && (
                <span className="ml-0.5 rounded-full bg-muted px-1.5 text-[10px]">
                  {mockContacts.filter((c) => c.type === tab.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, entidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Nombre</TableHead>
              <TableHead className="text-muted-foreground">Entidad</TableHead>
              <TableHead className="text-muted-foreground">Cargo</TableHead>
              <TableHead className="text-muted-foreground">Tipo</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Telefono</TableHead>
              <TableHead className="text-muted-foreground">Tags</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((contact) => {
              const config = typeConfig[contact.type]
              const isExpanded = expandedRow === contact.id
              return (
                <>
                  <TableRow
                    key={contact.id}
                    className={cn(
                      "cursor-pointer border-border/50 transition-colors",
                      isExpanded && "bg-muted/30"
                    )}
                    onClick={() => setExpandedRow(isExpanded ? null : contact.id)}
                  >
                    <TableCell className="font-medium text-foreground text-sm">{contact.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{contact.entity}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{contact.position}</TableCell>
                    <TableCell>
                      <Badge className={cn("border text-[10px] gap-1", config.color)}>
                        {config.icon}
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {contact.tags.map((tag) => (
                          <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow key={`${contact.id}-detail`} className="border-border/50 bg-muted/20 hover:bg-muted/20">
                      <TableCell colSpan={8} className="py-3">
                        <div className="text-xs text-muted-foreground pl-2">
                          <span className="font-medium text-foreground">Notas: </span>
                          {contact.notes}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )
            })}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-8 w-8 text-muted-foreground/60" />
            <p className="mt-2 text-sm text-muted-foreground">No se encontraron contactos</p>
          </div>
        )}
      </div>
    </div>
  )
}
