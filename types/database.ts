/**
 * LICIMX - Database Types
 *
 * Complete TypeScript types matching the Supabase schema for the
 * government bid management platform (licitaciones publicas de Mexico).
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/** Roles available within an organization */
export type UserRole = 'director' | 'analista' | 'abogado' | 'tecnico' | 'capturista' | 'admin'

/** Type of public procurement process */
export type BidType = 'publica' | 'invitacion' | 'adjudicacion_directa'

/** Pipeline stages a bid moves through */
export type PipelineStage =
  | 'detectada'
  | 'analizando'
  | 'aprobada'
  | 'en_preparacion'
  | 'presentada'
  | 'en_evaluacion'
  | 'fallo'
  | 'ganada'
  | 'perdida'
  | 'desierta'
  | 'descartada'

/** Classification resulting from the scoring engine */
export type ScoreLevel = 'alta' | 'media' | 'baja' | 'descarte'

/** Document categories attached to a bid */
export type DocumentCategory =
  | 'bases'
  | 'anexo'
  | 'convocatoria'
  | 'acta_aclaracion'
  | 'propuesta_tecnica'
  | 'propuesta_economica'
  | 'fallo'
  | 'contrato'
  | 'otro'

/** Classification of requirements extracted from bid documents */
export type RequirementCategory =
  | 'documental'
  | 'tecnico'
  | 'legal'
  | 'financiero'
  | 'experiencia'
  | 'administrativo'

/** Status of an internal task */
export type TaskStatus = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada'

/** Priority of a task */
export type TaskPriority = 'alta' | 'media' | 'baja'

/** Type of proposal being prepared */
export type ProposalType = 'tecnica' | 'economica'

/** Lifecycle status of a proposal document */
export type ProposalStatus = 'draft' | 'review' | 'approved' | 'submitted'

/** Calendar milestone types */
export type MilestoneType =
  | 'publicacion'
  | 'junta_aclaraciones'
  | 'entrega_propuestas'
  | 'apertura_tecnica'
  | 'apertura_economica'
  | 'fallo'
  | 'firma_contrato'
  | 'inicio_contrato'
  | 'otro'

/** Kind of external contact */
export type ContactType = 'funcionario' | 'competidor' | 'proveedor' | 'aliado'

/** Final result of a bid */
export type BidResult = 'ganada' | 'perdida' | 'desierta' | 'cancelada'

/** How a notification is delivered */
export type NotificationChannel = 'in_app' | 'email' | 'whatsapp'

// ---------------------------------------------------------------------------
// Table Interfaces
// ---------------------------------------------------------------------------

/** Multi-tenant organization (empresa / despacho) */
export interface Organization {
  id: string
  name: string
  rfc: string | null
  logo_url: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  plan: string
  max_users: number
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

/** Platform user linked to a Supabase auth account */
export interface User {
  id: string
  auth_id: string
  organization_id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  phone: string | null
  is_active: boolean
  last_login_at: string | null
  preferences: Record<string, unknown>
  created_at: string
  updated_at: string
}

/** Core bid / licitacion record */
export interface Bid {
  id: string
  organization_id: string

  /* --- Identification --- */
  procedure_number: string
  title: string
  description: string | null
  bid_type: BidType

  /* --- Entity --- */
  contracting_entity: string
  buying_unit: string | null

  /* --- Financials --- */
  estimated_amount: number | null
  currency: string
  minimum_amount: number | null
  maximum_amount: number | null
  guarantee_amount: number | null

  /* --- Pipeline --- */
  pipeline_stage: PipelineStage

  /* --- Scoring --- */
  total_score: number | null
  score_level: ScoreLevel | null
  auto_discarded: boolean

  /* --- Dates --- */
  published_at: string | null
  clarification_meeting_at: string | null
  proposal_deadline: string | null
  technical_opening_at: string | null
  economic_opening_at: string | null
  ruling_date: string | null
  contract_start_date: string | null
  contract_end_date: string | null

  /* --- Classification --- */
  tags: string[] | null

  /* --- Assignment --- */
  assigned_user_id: string | null

  /* --- Result --- */
  result: BidResult | null
  awarded_amount: number | null
  winner_name: string | null

  /* --- Source --- */
  source_url: string | null
  source_portal: string | null

  /* --- Meta --- */
  notes: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

/** Document attached to a bid (stored in Supabase Storage) */
export interface BidDocument {
  id: string
  bid_id: string
  organization_id: string
  category: DocumentCategory
  name: string
  original_filename: string
  storage_path: string
  url: string | null
  mime_type: string | null
  size_bytes: number | null
  extracted_text: string | null
  ai_processed: boolean
  uploaded_by: string | null
  created_at: string
  updated_at: string
}

/** Individual requirement extracted from bid bases */
export interface BidRequirement {
  id: string
  bid_id: string
  organization_id: string
  category: RequirementCategory
  description: string
  is_mandatory: boolean
  is_met: boolean | null
  compliance_notes: string | null
  source_reference: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

/** Per-variable scoring snapshot for a bid */
export interface BidScore {
  id: string
  bid_id: string
  organization_id: string
  variable: string
  raw_value: number
  normalized_value: number
  weight: number
  weighted_score: number
  notes: string | null
  scored_by: string | null
  created_at: string
}

/** Audit log of pipeline stage changes */
export interface BidPipelineHistory {
  id: string
  bid_id: string
  organization_id: string
  from_stage: PipelineStage | null
  to_stage: PipelineStage
  changed_by: string | null
  reason: string | null
  created_at: string
}

/** Proposal document being assembled for submission */
export interface Proposal {
  id: string
  bid_id: string
  organization_id: string
  proposal_type: ProposalType
  status: ProposalStatus
  version: number
  title: string | null
  total_amount: number | null
  file_path: string | null
  created_by_id: string | null
  approved_by_id: string | null
  approved_at: string | null
  submitted_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

/** Section within a proposal (for structured assembly) */
export interface ProposalSection {
  id: string
  proposal_id: string
  organization_id: string
  title: string
  content: string | null
  order_index: number
  is_complete: boolean
  assigned_user_id: string | null
  created_at: string
  updated_at: string
}

/** Internal task linked to a bid */
export interface Task {
  id: string
  bid_id: string | null
  organization_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assigned_to: string | null
  due_date: string | null
  completed_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

/** Calendar milestone (deadline, event) linked to a bid */
export interface Milestone {
  id: string
  bid_id: string
  organization_id: string
  type: MilestoneType
  title: string
  description: string | null
  date: string
  is_completed: boolean
  reminder_minutes: number | null
  created_at: string
  updated_at: string
}

/** External contact relevant to a bid or the organization */
export interface Contact {
  id: string
  organization_id: string
  type: ContactType
  name: string
  position: string | null
  entity: string | null
  email: string | null
  phone: string | null
  notes: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

/** Physical or digital evidence document (actas, constancias, etc.) */
export interface EvidenceDocument {
  id: string
  bid_id: string
  organization_id: string
  title: string
  description: string | null
  file_path: string
  file_size: number | null
  mime_type: string | null
  uploaded_by_id: string | null
  created_at: string
  updated_at: string
}

/** In-app / email / WhatsApp notification */
export interface Notification {
  id: string
  organization_id: string
  user_id: string
  channel: NotificationChannel
  title: string
  body: string
  link: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

/** Per-organization scoring weight configuration */
export interface ScoringConfig {
  id: string
  organization_id: string
  name: string
  description: string | null
  weights: Record<string, number>
  discard_rules: Record<string, unknown> | null
  is_default: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

/** Intelligence gathered about a competitor */
export interface CompetitorIntel {
  id: string
  organization_id: string
  competitor_name: string
  bid_id: string | null
  entity_name: string | null
  notes: string | null
  won: boolean | null
  awarded_amount: number | null
  source: string | null
  created_at: string
  updated_at: string
}

/** Generic activity log for audit trail */
export interface ActivityLog {
  id: string
  organization_id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string
  metadata: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Derived / Composite Types
// ---------------------------------------------------------------------------

/** Bid with all related child entities preloaded */
export interface BidWithDetails extends Bid {
  documents: BidDocument[]
  requirements: BidRequirement[]
  scores: BidScore[]
  milestones: Milestone[]
  tasks: Task[]
  proposals: Proposal[]
  pipeline_history: BidPipelineHistory[]
  assigned_user?: User
}

/** Aggregated statistics shown on the main dashboard */
export interface DashboardStats {
  /** Total number of bids in the system */
  total_bids: number
  /** Bids currently in an active pipeline stage */
  active_pipeline: number
  /** Win rate as a decimal (0-1) */
  win_rate: number
  /** Sum of awarded amounts for won bids (MXN) */
  total_won_amount: number
  /** Count of bids in each pipeline stage */
  bids_by_stage: Record<PipelineStage, number>
  /** Next upcoming milestones across all bids */
  upcoming_deadlines: Milestone[]
  /** Bids flagged as high priority or near deadline */
  high_priority_bids: Bid[]
  /** Monthly trend data for charts */
  monthly_trend: {
    month: string
    detected: number
    won: number
    lost: number
  }[]
}

/** A single column in the Kanban pipeline view */
export interface PipelineColumn {
  stage: PipelineStage
  label: string
  color: string
  bids: Bid[]
}
