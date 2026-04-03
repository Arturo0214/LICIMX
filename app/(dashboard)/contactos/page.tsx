"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useContacts } from "@/lib/store/hooks"
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
  Trash2,
} from "lucide-react"
import type { ContactType } from "@/types"

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
  const { contacts, loaded, addContact, deleteContact } = useContacts()
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("todos")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEntity, setNewEntity] = useState("")
  const [newPosition, setNewPosition] = useState("")
  const [newType, setNewType] = useState<ContactType>("funcionario")
  const [newEmail, setNewEmail] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newTags, setNewTags] = useState("")

  const filtered = contacts.filter((c) => {
    const matchesType = activeFilter === "todos" || c.type === activeFilter
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.entity || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.position || "").toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleCreate = () => {
    if (!newName.trim()) return
    addContact({
      name: newName.trim(),
      entity: newEntity.trim() || null,
      position: newPosition.trim() || null,
      type: newType,
      email: newEmail.trim() || null,
      phone: newPhone.trim() || null,
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      notes: null,
    })
    setDialogOpen(false)
    setNewName("")
    setNewEntity("")
    setNewPosition("")
    setNewType("funcionario")
    setNewEmail("")
    setNewPhone("")
    setNewTags("")
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteContact(id)
  }

  if (!loaded) return null

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
        <Button onClick={() => setDialogOpen(true)}>
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
                  {contacts.filter((c) => c.type === tab.value).length}
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
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((contact) => {
              const config = typeConfig[contact.type]
              const isExpanded = expandedRow === contact.id
              return (
                <TableRow
                  key={contact.id}
                  className={cn("cursor-pointer border-border/50 transition-colors", isExpanded && "bg-muted/30")}
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
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.phone && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {contact.tags.map((tag) => (
                        <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDelete(contact.id, e)}
                        className="rounded p-1 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </TableCell>
                </TableRow>
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

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Contacto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input placeholder="Nombre completo" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Entidad</Label>
                <Input placeholder="Empresa u organizacion" value={newEntity} onChange={(e) => setNewEntity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input placeholder="Puesto o cargo" value={newPosition} onChange={(e) => setNewPosition(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as ContactType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="funcionario">Funcionario</SelectItem>
                  <SelectItem value="competidor">Competidor</SelectItem>
                  <SelectItem value="proveedor">Proveedor</SelectItem>
                  <SelectItem value="aliado">Aliado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@ejemplo.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Telefono</Label>
                <Input placeholder="+52 55 1234 5678" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags (separados por coma)</Label>
              <Input placeholder="gobierno, TI, salud" value={newTags} onChange={(e) => setNewTags(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={!newName.trim()}>Crear Contacto</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
