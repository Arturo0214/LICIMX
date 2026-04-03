"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn, formatDate } from "@/lib/utils"
import { FileText, Upload, AlertCircle, CheckCircle2, Clock, Search, FolderOpen, Shield, Building2, GraduationCap, Receipt, Filter } from "lucide-react"

interface BidDocStatus { id: string; bidTitle: string; procedureNumber: string; entity: string; totalDocs: number; completedDocs: number; missingDocs: string[] }

const mockBidDocs: BidDocStatus[] = [
  { id: "1", bidTitle: "Suministro de Equipo Medico - IMSS", procedureNumber: "LA-006000993-E1-2026", entity: "IMSS", totalDocs: 12, completedDocs: 10, missingDocs: ["Carta de no inhabilitacion", "Garantia de sostenimiento"] },
  { id: "2", bidTitle: "Servicio de Limpieza - CFE", procedureNumber: "LA-018TOQ002-E5-2026", entity: "CFE", totalDocs: 8, completedDocs: 8, missingDocs: [] },
  { id: "3", bidTitle: "Infraestructura de Red - PEMEX", procedureNumber: "LA-018T4N001-E3-2026", entity: "PEMEX", totalDocs: 15, completedDocs: 7, missingDocs: ["Propuesta tecnica", "CVs del equipo", "Estados financieros auditados", "Acta constitutiva", "Carta poder"] },
  { id: "4", bidTitle: "Consultoria TI - SAT", procedureNumber: "LA-006E00001-E2-2026", entity: "SAT", totalDocs: 10, completedDocs: 9, missingDocs: ["Propuesta economica"] },
  { id: "5", bidTitle: "Software ERP - ISSSTE", procedureNumber: "LA-051GYN001-E1-2026", entity: "ISSSTE", totalDocs: 11, completedDocs: 4, missingDocs: ["Propuesta tecnica", "Constancia IMSS", "Constancia SAT", "Declaracion anual", "Referencias comerciales", "Plan de trabajo", "Curriculum empresa"] },
  { id: "6", bidTitle: "Mantenimiento Vehicular - SEDENA", procedureNumber: "LA-007000001-E8-2026", entity: "SEDENA", totalDocs: 9, completedDocs: 6, missingDocs: ["Certificaciones ISO", "Poliza de seguro", "Garantia de cumplimiento"] },
]

interface ReusableDoc { id: string; name: string; category: string; categoryIcon: React.ReactNode; expiryDate: string; status: "vigente" | "por_vencer" | "vencido"; fileType: string; uploadedAt: string }

const mockReusableDocs: ReusableDoc[] = [
  { id: "1", name: "Acta Constitutiva", category: "Legal", categoryIcon: <Shield className="h-3.5 w-3.5" />, expiryDate: "2028-12-31", status: "vigente", fileType: "PDF", uploadedAt: "2025-03-15" },
  { id: "2", name: "Estados Financieros 2025 (Auditados)", category: "Financiero", categoryIcon: <Receipt className="h-3.5 w-3.5" />, expiryDate: "2026-12-31", status: "vigente", fileType: "PDF", uploadedAt: "2026-02-20" },
  { id: "3", name: "Constancia de Situacion Fiscal", category: "Fiscal", categoryIcon: <Building2 className="h-3.5 w-3.5" />, expiryDate: "2026-06-30", status: "por_vencer", fileType: "PDF", uploadedAt: "2026-01-10" },
  { id: "4", name: "Opinion de Cumplimiento SAT", category: "Fiscal", categoryIcon: <Building2 className="h-3.5 w-3.5" />, expiryDate: "2026-04-15", status: "por_vencer", fileType: "PDF", uploadedAt: "2026-03-15" },
  { id: "5", name: "Opinion de Cumplimiento IMSS", category: "Fiscal", categoryIcon: <Building2 className="h-3.5 w-3.5" />, expiryDate: "2026-04-10", status: "por_vencer", fileType: "PDF", uploadedAt: "2026-03-10" },
  { id: "6", name: "Certificacion ISO 9001:2015", category: "Certificacion", categoryIcon: <Shield className="h-3.5 w-3.5" />, expiryDate: "2025-11-30", status: "vencido", fileType: "PDF", uploadedAt: "2023-12-01" },
  { id: "7", name: "CV - Ing. Roberto Mendez (Director Tecnico)", category: "RRHH", categoryIcon: <GraduationCap className="h-3.5 w-3.5" />, expiryDate: "2027-01-01", status: "vigente", fileType: "PDF", uploadedAt: "2026-01-05" },
  { id: "8", name: "CV - Lic. Maria Fernanda Lopez (Directora Legal)", category: "RRHH", categoryIcon: <GraduationCap className="h-3.5 w-3.5" />, expiryDate: "2027-01-01", status: "vigente", fileType: "PDF", uploadedAt: "2026-01-05" },
  { id: "9", name: "Poder Notarial del Representante Legal", category: "Legal", categoryIcon: <Shield className="h-3.5 w-3.5" />, expiryDate: "2028-06-30", status: "vigente", fileType: "PDF", uploadedAt: "2024-07-01" },
  { id: "10", name: "Poliza de Seguro de Responsabilidad Civil", category: "Seguro", categoryIcon: <Shield className="h-3.5 w-3.5" />, expiryDate: "2026-03-01", status: "vencido", fileType: "PDF", uploadedAt: "2025-03-01" },
  { id: "11", name: "Declaracion Anual 2025", category: "Fiscal", categoryIcon: <Receipt className="h-3.5 w-3.5" />, expiryDate: "2027-04-30", status: "vigente", fileType: "PDF", uploadedAt: "2026-03-28" },
  { id: "12", name: "Constancia de No Inhabilitacion", category: "Legal", categoryIcon: <Shield className="h-3.5 w-3.5" />, expiryDate: "2026-05-01", status: "por_vencer", fileType: "PDF", uploadedAt: "2026-02-01" },
]

const categories = ["Todos", "Legal", "Fiscal", "Financiero", "RRHH", "Certificacion", "Seguro"]

const statusConfig = {
  vigente: { label: "Vigente", color: "bg-success/15 text-success border-success/30" },
  por_vencer: { label: "Por vencer", color: "bg-amber-500/15 text-amber-500 border-amber-500/30" },
  vencido: { label: "Vencido", color: "bg-destructive/15 text-destructive border-destructive/30" },
}

export default function DocumentosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [search, setSearch] = useState("")

  const filteredDocs = mockReusableDocs.filter((doc) => {
    const matchesCategory = selectedCategory === "Todos" || doc.category === selectedCategory
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Centro de Documentos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestiona los documentos de cada licitacion y mantiene tu acervo de documentos reutilizables.</p>
        </div>
        <Button><Upload className="mr-2 h-4 w-4" />Subir Documento</Button>
      </div>

      <Tabs defaultValue="por-licitacion">
        <TabsList>
          <TabsTrigger value="por-licitacion"><FolderOpen className="mr-2 h-4 w-4" />Por Licitacion</TabsTrigger>
          <TabsTrigger value="reutilizables"><FileText className="mr-2 h-4 w-4" />Documentos Reutilizables</TabsTrigger>
        </TabsList>

        <TabsContent value="por-licitacion" className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mockBidDocs.map((bid) => {
              const progress = Math.round((bid.completedDocs / bid.totalDocs) * 100)
              const isComplete = bid.completedDocs === bid.totalDocs
              return (
                <Card key={bid.id} className={cn("transition-colors hover:border-primary/30", !isComplete && bid.missingDocs.length > 3 && "border-destructive/20")}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm font-medium leading-tight">{bid.bidTitle}</CardTitle>
                        <p className="mt-1 text-xs font-mono text-muted-foreground">{bid.procedureNumber}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">{bid.entity}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Documentos</span>
                      <span className={cn("font-semibold tabular-nums", isComplete ? "text-success" : "text-foreground")}>{bid.completedDocs}/{bid.totalDocs}</span>
                    </div>
                    <Progress value={progress} className="h-1.5" indicatorClassName={cn(isComplete ? "bg-success" : progress > 60 ? "bg-amber-500" : "bg-destructive")} />
                    {!isComplete && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-amber-500">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{bid.missingDocs.length} documento{bid.missingDocs.length > 1 ? "s" : ""} faltante{bid.missingDocs.length > 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {bid.missingDocs.slice(0, 3).map((doc) => (
                            <span key={doc} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{doc}</span>
                          ))}
                          {bid.missingDocs.length > 3 && (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">+{bid.missingDocs.length - 3} mas</span>
                          )}
                        </div>
                      </div>
                    )}
                    {isComplete && (
                      <div className="flex items-center gap-1.5 text-xs text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" /><span>Documentacion completa</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="reutilizables" className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar documento..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  selectedCategory === cat ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredDocs.map((doc) => {
              const status = statusConfig[doc.status]
              return (
                <div key={doc.id} className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{doc.name}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">{doc.categoryIcon}{doc.category}</span>
                      <span className="text-muted-foreground/40">|</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" />Vence: {formatDate(doc.expiryDate)}</span>
                    </div>
                  </div>
                  <Badge className={cn("shrink-0 border text-[10px]", status.color)}>{status.label}</Badge>
                </div>
              )
            })}
          </div>

          {filteredDocs.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
              <FileText className="h-8 w-8 text-muted-foreground/60" />
              <p className="mt-2 text-sm text-muted-foreground">No se encontraron documentos</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
