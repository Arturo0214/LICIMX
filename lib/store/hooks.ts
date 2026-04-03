'use client'

/**
 * LICIMX - Custom Hooks for Local State
 *
 * Each hook manages one entity type, initialising from mock data
 * and syncing every mutation to localStorage.
 */

import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEYS, getStored, setStored } from './index'
import { generateId } from '@/lib/utils'
import {
  mockBids,
  mockDocuments,
  mockRequirements,
  mockTasks,
} from '@/lib/data/mock-data'
import type {
  Bid,
  BidDocument,
  BidRequirement,
  Task,
  Contact,
  PipelineStage,
  TaskStatus,
} from '@/types'

// ---------------------------------------------------------------------------
// useBids
// ---------------------------------------------------------------------------

export function useBids() {
  const [bids, setBids] = useState<Bid[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = getStored<Bid[]>(STORAGE_KEYS.BIDS, [])
    if (stored.length > 0) {
      setBids(stored)
    } else {
      setBids(mockBids)
      setStored(STORAGE_KEYS.BIDS, mockBids)
    }
    setLoaded(true)
  }, [])

  const persist = useCallback((next: Bid[]) => {
    setBids(next)
    setStored(STORAGE_KEYS.BIDS, next)
  }, [])

  const addBid = useCallback((bid: Omit<Bid, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString()
    const newBid: Bid = {
      ...bid,
      id: `bid-${generateId().slice(0, 8)}`,
      organization_id: 'org-mock-001',
      created_at: now,
      updated_at: now,
    } as Bid
    const next = [...bids, newBid]
    persist(next)
    return newBid
  }, [bids, persist])

  const updateBid = useCallback((id: string, updates: Partial<Bid>) => {
    const next = bids.map((b) =>
      b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b
    )
    persist(next)
  }, [bids, persist])

  const deleteBid = useCallback((id: string) => {
    persist(bids.filter((b) => b.id !== id))
  }, [bids, persist])

  const moveBidStage = useCallback((id: string, stage: PipelineStage) => {
    updateBid(id, { pipeline_stage: stage })
  }, [updateBid])

  return { bids, loaded, addBid, updateBid, deleteBid, moveBidStage }
}

// ---------------------------------------------------------------------------
// useContacts
// ---------------------------------------------------------------------------

const DEFAULT_CONTACTS: Contact[] = [
  { id: '1', organization_id: 'org-mock-001', name: 'Lic. Carlos Eduardo Ramirez Gutierrez', entity: 'IMSS - Direccion de Adquisiciones', position: 'Director de Area', type: 'funcionario', email: 'carlos.ramirez@imss.gob.mx', phone: '+52 55 5238 1700', tags: ['salud', 'adquisiciones'], notes: 'Contacto principal para licitaciones de equipo medico. Reuniones los martes.', created_at: '2026-01-15T10:00:00Z', updated_at: '2026-01-15T10:00:00Z' },
  { id: '2', organization_id: 'org-mock-001', name: 'Ing. Alejandra Martinez Soto', entity: 'CFE - Unidad de Compras', position: 'Subdirectora de Contrataciones', type: 'funcionario', email: 'alejandra.martinez@cfe.mx', phone: '+52 55 5229 4400', tags: ['energia', 'servicios'], notes: 'Responsable de contratos de servicios generales.', created_at: '2026-01-20T10:00:00Z', updated_at: '2026-01-20T10:00:00Z' },
  { id: '3', organization_id: 'org-mock-001', name: 'Lic. Roberto Fernandez Diaz', entity: 'Soluciones Integrales del Norte SA de CV', position: 'Director General', type: 'competidor', email: 'rfernandez@sinorte.com.mx', phone: '+52 81 8342 5500', tags: ['TI', 'gobierno'], notes: 'Competidor fuerte en licitaciones de TI. Base en Monterrey.', created_at: '2026-02-01T10:00:00Z', updated_at: '2026-02-01T10:00:00Z' },
  { id: '4', organization_id: 'org-mock-001', name: 'Ing. Patricia Hernandez Vega', entity: 'Grupo Tecnologico Peninsular SA de CV', position: 'Gerente Comercial', type: 'competidor', email: 'phernandez@gtpeninsular.com', phone: '+52 99 9920 1234', tags: ['software', 'gobierno'], notes: 'Especialistas en software gubernamental. Operan en sureste.', created_at: '2026-02-10T10:00:00Z', updated_at: '2026-02-10T10:00:00Z' },
  { id: '5', organization_id: 'org-mock-001', name: 'C.P. Fernando Lopez Castillo', entity: 'Distribuidora Medica del Centro SA de CV', position: 'Director Comercial', type: 'proveedor', email: 'flopez@dismec.com.mx', phone: '+52 55 5678 9012', tags: ['equipo medico', 'insumos'], notes: 'Proveedor principal de equipo medico. Precios competitivos.', created_at: '2026-02-15T10:00:00Z', updated_at: '2026-02-15T10:00:00Z' },
  { id: '6', organization_id: 'org-mock-001', name: 'Ing. Maria del Carmen Ortiz Ruiz', entity: 'PEMEX - Gerencia de Contrataciones', position: 'Gerente de Contrataciones', type: 'funcionario', email: 'mcarmen.ortiz@pemex.com', phone: '+52 55 1944 2500', tags: ['energia', 'infraestructura'], notes: 'Encargada de licitaciones de infraestructura tecnologica.', created_at: '2026-02-20T10:00:00Z', updated_at: '2026-02-20T10:00:00Z' },
  { id: '7', organization_id: 'org-mock-001', name: 'Lic. Juan Pablo Moreno Silva', entity: 'Consultores Asociados Bajio SC', position: 'Socio Director', type: 'aliado', email: 'jpmoreno@cabajio.com', phone: '+52 47 7712 3456', tags: ['legal', 'consultorias'], notes: 'Aliado para consultorias legales. Experto en derecho administrativo.', created_at: '2026-03-01T10:00:00Z', updated_at: '2026-03-01T10:00:00Z' },
  { id: '8', organization_id: 'org-mock-001', name: 'Ing. Ana Gabriela Torres Mendez', entity: 'TechSolutions Mexico SA de CV', position: 'CTO', type: 'aliado', email: 'atorres@techsolutions.mx', phone: '+52 33 3615 7890', tags: ['TI', 'desarrollo'], notes: 'Partner tecnologico para proyectos de desarrollo de software.', created_at: '2026-03-05T10:00:00Z', updated_at: '2026-03-05T10:00:00Z' },
  { id: '9', organization_id: 'org-mock-001', name: 'C.P. Ricardo Salinas Pliego Jr.', entity: 'Infraestructura y Servicios Globales SA de CV', position: 'Director de Licitaciones', type: 'competidor', email: 'rsalinas@isglobal.com.mx', phone: '+52 55 5432 1098', tags: ['infraestructura', 'servicios'], notes: 'Competidor en servicios de infraestructura. Empresa grande con multiples contratos.', created_at: '2026-03-10T10:00:00Z', updated_at: '2026-03-10T10:00:00Z' },
  { id: '10', organization_id: 'org-mock-001', name: 'Dra. Lucia Esperanza Garcia Navarro', entity: 'SAT - Administracion General de Recursos', position: 'Administradora de Recursos Materiales', type: 'funcionario', email: 'lucia.garcia@sat.gob.mx', phone: '+52 55 6272 2728', tags: ['fiscal', 'TI'], notes: 'Responsable de contrataciones de TI en el SAT.', created_at: '2026-03-15T10:00:00Z', updated_at: '2026-03-15T10:00:00Z' },
  { id: '11', organization_id: 'org-mock-001', name: 'Ing. Miguel Angel Reyes Dominguez', entity: 'Suministros Industriales del Pacifico SA de CV', position: 'Gerente de Ventas', type: 'proveedor', email: 'mareyes@sipac.com.mx', phone: '+52 66 9985 4321', tags: ['industrial', 'suministros'], notes: 'Proveedor de suministros industriales con cobertura nacional.', created_at: '2026-03-20T10:00:00Z', updated_at: '2026-03-20T10:00:00Z' },
  { id: '12', organization_id: 'org-mock-001', name: 'Lic. Sofia Valentina Cruz Espinoza', entity: 'Deloitte Mexico', position: 'Senior Manager - Government', type: 'aliado', email: 'svcruz@deloitte.com', phone: '+52 55 5080 6000', tags: ['consultoria', 'gobierno'], notes: 'Aliada para proyectos de consultoria gubernamental de alto perfil.', created_at: '2026-03-25T10:00:00Z', updated_at: '2026-03-25T10:00:00Z' },
]

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = getStored<Contact[]>(STORAGE_KEYS.CONTACTS, [])
    if (stored.length > 0) {
      setContacts(stored)
    } else {
      setContacts(DEFAULT_CONTACTS)
      setStored(STORAGE_KEYS.CONTACTS, DEFAULT_CONTACTS)
    }
    setLoaded(true)
  }, [])

  const persist = useCallback((next: Contact[]) => {
    setContacts(next)
    setStored(STORAGE_KEYS.CONTACTS, next)
  }, [])

  const addContact = useCallback((contact: Omit<Contact, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString()
    const newContact: Contact = {
      ...contact,
      id: `c-${generateId().slice(0, 8)}`,
      organization_id: 'org-mock-001',
      created_at: now,
      updated_at: now,
    }
    persist([...contacts, newContact])
    return newContact
  }, [contacts, persist])

  const deleteContact = useCallback((id: string) => {
    persist(contacts.filter((c) => c.id !== id))
  }, [contacts, persist])

  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    const next = contacts.map((c) =>
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    )
    persist(next)
  }, [contacts, persist])

  return { contacts, loaded, addContact, deleteContact, updateContact }
}

// ---------------------------------------------------------------------------
// useImportedIds
// ---------------------------------------------------------------------------

export function useImportedIds() {
  const [importedIds, setImportedIds] = useState<string[]>([])

  useEffect(() => {
    setImportedIds(getStored<string[]>(STORAGE_KEYS.IMPORTED_IDS, []))
  }, [])

  const markImported = useCallback((id: string) => {
    setImportedIds((prev) => {
      const next = [...prev, id]
      setStored(STORAGE_KEYS.IMPORTED_IDS, next)
      return next
    })
  }, [])

  const isImported = useCallback((id: string) => {
    return importedIds.includes(id)
  }, [importedIds])

  return { importedIds, markImported, isImported }
}

// ---------------------------------------------------------------------------
// useDocuments
// ---------------------------------------------------------------------------

export function useDocuments(bidId?: string) {
  const [documents, setDocuments] = useState<BidDocument[]>([])

  useEffect(() => {
    const stored = getStored<BidDocument[]>(STORAGE_KEYS.DOCUMENTS, [])
    if (stored.length > 0) {
      setDocuments(stored)
    } else {
      setDocuments(mockDocuments)
      setStored(STORAGE_KEYS.DOCUMENTS, mockDocuments)
    }
  }, [])

  const persist = useCallback((next: BidDocument[]) => {
    setDocuments(next)
    setStored(STORAGE_KEYS.DOCUMENTS, next)
  }, [])

  const addDocument = useCallback((doc: Omit<BidDocument, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString()
    const newDoc: BidDocument = {
      ...doc,
      id: `doc-${generateId().slice(0, 8)}`,
      organization_id: 'org-mock-001',
      created_at: now,
      updated_at: now,
    }
    persist([...documents, newDoc])
    return newDoc
  }, [documents, persist])

  const filtered = bidId ? documents.filter((d) => d.bid_id === bidId) : documents

  return { documents: filtered, allDocuments: documents, addDocument }
}

// ---------------------------------------------------------------------------
// useRequirements
// ---------------------------------------------------------------------------

export function useRequirements(bidId?: string) {
  const [requirements, setRequirements] = useState<BidRequirement[]>([])

  useEffect(() => {
    const stored = getStored<BidRequirement[]>(STORAGE_KEYS.REQUIREMENTS, [])
    if (stored.length > 0) {
      setRequirements(stored)
    } else {
      setRequirements(mockRequirements)
      setStored(STORAGE_KEYS.REQUIREMENTS, mockRequirements)
    }
  }, [])

  const persist = useCallback((next: BidRequirement[]) => {
    setRequirements(next)
    setStored(STORAGE_KEYS.REQUIREMENTS, next)
  }, [])

  const toggleRequirement = useCallback((id: string) => {
    const next = requirements.map((r) => {
      if (r.id !== id) return r
      const newMet = r.is_met === true ? false : true
      return { ...r, is_met: newMet, updated_at: new Date().toISOString() }
    })
    persist(next)
  }, [requirements, persist])

  const filtered = bidId ? requirements.filter((r) => r.bid_id === bidId) : requirements

  return { requirements: filtered, allRequirements: requirements, toggleRequirement }
}

// ---------------------------------------------------------------------------
// useTasks
// ---------------------------------------------------------------------------

export function useTasks(bidId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const stored = getStored<Task[]>(STORAGE_KEYS.TASKS, [])
    if (stored.length > 0) {
      setTasks(stored)
    } else {
      setTasks(mockTasks)
      setStored(STORAGE_KEYS.TASKS, mockTasks)
    }
  }, [])

  const persist = useCallback((next: Task[]) => {
    setTasks(next)
    setStored(STORAGE_KEYS.TASKS, next)
  }, [])

  const addTask = useCallback((task: Omit<Task, 'id' | 'organization_id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString()
    const newTask: Task = {
      ...task,
      id: `task-${generateId().slice(0, 8)}`,
      organization_id: 'org-mock-001',
      created_at: now,
      updated_at: now,
    }
    persist([...tasks, newTask])
    return newTask
  }, [tasks, persist])

  const toggleTaskStatus = useCallback((id: string) => {
    const next = tasks.map((t) => {
      if (t.id !== id) return t
      const statusFlow: Record<TaskStatus, TaskStatus> = {
        pendiente: 'en_proceso',
        en_proceso: 'completada',
        completada: 'pendiente',
        cancelada: 'pendiente',
      }
      const newStatus = statusFlow[t.status]
      return {
        ...t,
        status: newStatus,
        completed_at: newStatus === 'completada' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }
    })
    persist(next)
  }, [tasks, persist])

  const filtered = bidId ? tasks.filter((t) => t.bid_id === bidId) : tasks

  return { tasks: filtered, allTasks: tasks, addTask, toggleTaskStatus }
}

// ---------------------------------------------------------------------------
// useSettings
// ---------------------------------------------------------------------------

export interface OrgSettings {
  name: string
  rfc: string
  industry: string
  plan: string
}

export interface NotifPref {
  event: string
  email: boolean
  whatsapp: boolean
  in_app: boolean
}

const DEFAULT_ORG_SETTINGS: OrgSettings = {
  name: 'Soluciones Tecnologicas Avanzadas SA de CV',
  rfc: 'STA200315XY9',
  industry: 'Tecnologias de la Informacion',
  plan: 'Pro',
}

const DEFAULT_NOTIF_PREFS: NotifPref[] = [
  { event: 'Nueva licitacion detectada', email: true, whatsapp: true, in_app: true },
  { event: 'Fecha limite proxima (3 dias)', email: true, whatsapp: true, in_app: true },
  { event: 'Fecha limite proxima (1 dia)', email: true, whatsapp: true, in_app: true },
  { event: 'Cambio de etapa en pipeline', email: false, whatsapp: false, in_app: true },
  { event: 'Documento por vencer', email: true, whatsapp: false, in_app: true },
  { event: 'Tarea asignada', email: false, whatsapp: false, in_app: true },
  { event: 'Propuesta aprobada', email: true, whatsapp: true, in_app: true },
  { event: 'Fallo publicado', email: true, whatsapp: true, in_app: true },
  { event: 'Nuevo competidor detectado', email: false, whatsapp: false, in_app: true },
  { event: 'Aclaracion publicada', email: true, whatsapp: false, in_app: true },
]

export function useSettings() {
  const [org, setOrg] = useState<OrgSettings>(DEFAULT_ORG_SETTINGS)
  const [notifPrefs, setNotifPrefs] = useState<NotifPref[]>(DEFAULT_NOTIF_PREFS)

  useEffect(() => {
    setOrg(getStored(STORAGE_KEYS.SETTINGS_ORG, DEFAULT_ORG_SETTINGS))
    setNotifPrefs(getStored(STORAGE_KEYS.SETTINGS_NOTIF, DEFAULT_NOTIF_PREFS))
  }, [])

  const saveOrg = useCallback((updates: Partial<OrgSettings>) => {
    const next = { ...org, ...updates }
    setOrg(next)
    setStored(STORAGE_KEYS.SETTINGS_ORG, next)
  }, [org])

  const toggleNotif = useCallback((index: number, channel: 'email' | 'whatsapp' | 'in_app') => {
    setNotifPrefs((prev) => {
      const next = prev.map((p, i) => (i === index ? { ...p, [channel]: !p[channel] } : p))
      setStored(STORAGE_KEYS.SETTINGS_NOTIF, next)
      return next
    })
  }, [])

  const saveNotifPrefs = useCallback(() => {
    setStored(STORAGE_KEYS.SETTINGS_NOTIF, notifPrefs)
  }, [notifPrefs])

  return { org, notifPrefs, saveOrg, toggleNotif, saveNotifPrefs }
}

// ---------------------------------------------------------------------------
// useProposals
// ---------------------------------------------------------------------------

export type ProposalStatusType = 'borrador' | 'revision' | 'aprobada' | 'enviada'

export interface LocalProposal {
  id: string
  bidId: string
  bidTitle: string
  type: 'tecnica' | 'economica'
  version: number
  status: ProposalStatusType
  progress: number
  lastModified: string
  assignedTo: { name: string; initials: string }
}

const DEFAULT_PROPOSALS: LocalProposal[] = [
  { id: '1', bidId: 'bid-002', bidTitle: 'Mantenimiento preventivo y correctivo de equipos medicos - IMSS', type: 'tecnica', version: 3, status: 'revision', progress: 85, lastModified: '2026-04-01', assignedTo: { name: 'Roberto Mendez', initials: 'RM' } },
  { id: '2', bidId: 'bid-002', bidTitle: 'Mantenimiento preventivo y correctivo de equipos medicos - IMSS', type: 'economica', version: 2, status: 'borrador', progress: 60, lastModified: '2026-03-31', assignedTo: { name: 'Ana Torres', initials: 'AT' } },
  { id: '3', bidId: 'bid-003', bidTitle: 'Desarrollo de sistema de gestion documental - CFE', type: 'tecnica', version: 1, status: 'aprobada', progress: 100, lastModified: '2026-03-28', assignedTo: { name: 'Carlos Ramirez', initials: 'CR' } },
  { id: '4', bidId: 'bid-003', bidTitle: 'Desarrollo de sistema de gestion documental - CFE', type: 'economica', version: 1, status: 'aprobada', progress: 100, lastModified: '2026-03-29', assignedTo: { name: 'Sofia Cruz', initials: 'SC' } },
  { id: '5', bidId: 'bid-008', bidTitle: 'Red de telecomunicaciones - PEMEX', type: 'tecnica', version: 2, status: 'borrador', progress: 35, lastModified: '2026-04-02', assignedTo: { name: 'Miguel Reyes', initials: 'MR' } },
  { id: '6', bidId: 'bid-001', bidTitle: 'Servicio de infraestructura de computo en la nube para el SAT', type: 'tecnica', version: 1, status: 'enviada', progress: 100, lastModified: '2026-03-25', assignedTo: { name: 'Roberto Mendez', initials: 'RM' } },
  { id: '7', bidId: 'bid-001', bidTitle: 'Servicio de infraestructura de computo en la nube para el SAT', type: 'economica', version: 1, status: 'enviada', progress: 100, lastModified: '2026-03-26', assignedTo: { name: 'Ana Torres', initials: 'AT' } },
]

export function useProposals() {
  const [proposals, setProposals] = useState<LocalProposal[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = getStored<LocalProposal[]>(STORAGE_KEYS.PROPOSALS, [])
    if (stored.length > 0) {
      setProposals(stored)
    } else {
      setProposals(DEFAULT_PROPOSALS)
      setStored(STORAGE_KEYS.PROPOSALS, DEFAULT_PROPOSALS)
    }
    setLoaded(true)
  }, [])

  const persist = useCallback((next: LocalProposal[]) => {
    setProposals(next)
    setStored(STORAGE_KEYS.PROPOSALS, next)
  }, [])

  const addProposal = useCallback((proposal: Omit<LocalProposal, 'id'>) => {
    const newP: LocalProposal = { ...proposal, id: `p-${generateId().slice(0, 8)}` }
    persist([...proposals, newP])
    return newP
  }, [proposals, persist])

  const advanceStatus = useCallback((id: string) => {
    const flow: Record<ProposalStatusType, ProposalStatusType> = {
      borrador: 'revision',
      revision: 'aprobada',
      aprobada: 'enviada',
      enviada: 'enviada',
    }
    const next = proposals.map((p) => {
      if (p.id !== id) return p
      const newStatus = flow[p.status]
      const newProgress = newStatus === 'enviada' || newStatus === 'aprobada' ? 100 : p.progress
      return { ...p, status: newStatus, progress: newProgress, lastModified: new Date().toISOString().split('T')[0] }
    })
    persist(next)
  }, [proposals, persist])

  const updateProgress = useCallback((id: string, progress: number) => {
    const next = proposals.map((p) =>
      p.id === id ? { ...p, progress, lastModified: new Date().toISOString().split('T')[0] } : p
    )
    persist(next)
  }, [proposals, persist])

  return { proposals, loaded, addProposal, advanceStatus, updateProgress }
}
