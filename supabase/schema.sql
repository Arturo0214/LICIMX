-- ============================================================================
-- LICIMX - Government Procurement Management System for Mexico
-- Complete Supabase PostgreSQL Schema
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE plan_type AS ENUM ('free', 'pro', 'enterprise');

CREATE TYPE user_role AS ENUM ('director', 'analista', 'abogado', 'tecnico', 'capturista', 'admin');

CREATE TYPE bid_source_type AS ENUM ('federal', 'estatal', 'municipal');

CREATE TYPE bid_type AS ENUM ('publica', 'invitacion', 'adjudicacion_directa');

CREATE TYPE pipeline_stage AS ENUM (
  'detectada', 'analizando', 'aprobada', 'en_preparacion',
  'presentada', 'en_evaluacion', 'fallo',
  'ganada', 'perdida', 'desierta', 'descartada'
);

CREATE TYPE score_level AS ENUM ('alta', 'media', 'baja', 'descarte');

CREATE TYPE document_category AS ENUM (
  'bases', 'anexo', 'convocatoria', 'acta_aclaracion',
  'propuesta_tecnica', 'propuesta_economica', 'fallo', 'contrato', 'otro'
);

CREATE TYPE requirement_category AS ENUM (
  'documental', 'tecnico', 'legal', 'financiero', 'experiencia', 'administrativo'
);

CREATE TYPE evaluation_category AS ENUM ('tecnica', 'economica');

CREATE TYPE proposal_type AS ENUM ('tecnica', 'economica');

CREATE TYPE proposal_status AS ENUM ('draft', 'review', 'approved', 'submitted');

CREATE TYPE task_status AS ENUM ('pendiente', 'en_proceso', 'completada', 'cancelada');

CREATE TYPE priority_level AS ENUM ('alta', 'media', 'baja');

CREATE TYPE milestone_type AS ENUM (
  'publicacion', 'junta_aclaraciones', 'entrega_propuestas',
  'apertura_tecnica', 'apertura_economica', 'fallo',
  'firma_contrato', 'inicio_contrato', 'otro'
);

CREATE TYPE question_status AS ENUM ('draft', 'submitted', 'answered');

CREATE TYPE bid_result_type AS ENUM ('ganada', 'perdida', 'desierta', 'cancelada');

CREATE TYPE loss_category AS ENUM (
  'precio', 'tecnica', 'documental', 'experiencia',
  'financiera', 'incumplimiento_requisitos', 'otra'
);

CREATE TYPE contract_status AS ENUM ('activo', 'completado', 'cancelado');

CREATE TYPE contact_type AS ENUM ('funcionario', 'competidor', 'proveedor', 'aliado');

CREATE TYPE notification_type AS ENUM ('deadline', 'assignment', 'stage_change', 'result', 'system', 'reminder');

CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'whatsapp');

CREATE TYPE contracting_entity_type AS ENUM ('dependencia', 'entidad', 'organo_desconcentrado', 'empresa_productiva');

-- ============================================================================
-- 1. ORGANIZATIONS
-- ============================================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rfc VARCHAR(13),
  industry TEXT,
  logo_url TEXT,
  plan plan_type NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE organizations IS 'Multi-tenant companies using the LICIMX platform';

-- ============================================================================
-- 2. USERS
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'analista',
  avatar_url TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(organization_id, role);

COMMENT ON TABLE users IS 'System users with roles within their organization';

-- ============================================================================
-- 3. BID SOURCES
-- ============================================================================

CREATE TABLE bid_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT,
  type bid_source_type NOT NULL,
  scraper_status TEXT DEFAULT 'inactive',
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE bid_sources IS 'Sources of government bids (CompraNet, DOF, state portals)';

-- ============================================================================
-- 4. BIDS (CORE TABLE)
-- ============================================================================

CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_id UUID REFERENCES bid_sources(id) ON DELETE SET NULL,
  external_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  contracting_entity TEXT,
  contracting_entity_type contracting_entity_type,
  state VARCHAR(50),
  municipality VARCHAR(100),
  type bid_type NOT NULL DEFAULT 'publica',
  category TEXT,
  sector TEXT,
  budget_amount NUMERIC(18,2),
  currency VARCHAR(3) DEFAULT 'MXN',
  estimated_cost NUMERIC(18,2),
  estimated_margin_pct NUMERIC(5,2),
  publication_date DATE,
  clarification_meeting_date TIMESTAMPTZ,
  submission_deadline TIMESTAMPTZ,
  technical_opening_date TIMESTAMPTZ,
  economic_opening_date TIMESTAMPTZ,
  award_date DATE,
  contract_start_date DATE,
  contract_end_date DATE,
  pipeline_stage pipeline_stage NOT NULL DEFAULT 'detectada',
  score NUMERIC(5,2),
  score_level score_level,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  tags TEXT[],
  source_url TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bids_organization ON bids(organization_id);
CREATE INDEX idx_bids_pipeline_stage ON bids(organization_id, pipeline_stage);
CREATE INDEX idx_bids_assigned_to ON bids(assigned_to);
CREATE INDEX idx_bids_source ON bids(source_id);
CREATE INDEX idx_bids_submission_deadline ON bids(submission_deadline);
CREATE INDEX idx_bids_score ON bids(organization_id, score DESC NULLS LAST);
CREATE INDEX idx_bids_type ON bids(organization_id, type);
CREATE INDEX idx_bids_sector ON bids(organization_id, sector);
CREATE INDEX idx_bids_contracting_entity ON bids(contracting_entity);
CREATE INDEX idx_bids_external_id ON bids(external_id);
CREATE INDEX idx_bids_archived ON bids(organization_id, is_archived);
CREATE INDEX idx_bids_tags ON bids USING GIN(tags);

COMMENT ON TABLE bids IS 'Core table: government procurement bids/tenders tracked by the organization';

-- ============================================================================
-- 5. BID DOCUMENTS
-- ============================================================================

CREATE TABLE bid_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT,
  file_url TEXT,
  file_size BIGINT,
  mime_type VARCHAR(100),
  category document_category NOT NULL DEFAULT 'otro',
  version INT NOT NULL DEFAULT 1,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_current BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bid_documents_bid ON bid_documents(bid_id);
CREATE INDEX idx_bid_documents_org ON bid_documents(organization_id);
CREATE INDEX idx_bid_documents_category ON bid_documents(bid_id, category);

COMMENT ON TABLE bid_documents IS 'Documents attached to a specific bid';

-- ============================================================================
-- 6. BID REQUIREMENTS
-- ============================================================================

CREATE TABLE bid_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  requirement_text TEXT NOT NULL,
  category requirement_category NOT NULL,
  is_eliminatory BOOLEAN NOT NULL DEFAULT false,
  is_met BOOLEAN,
  met_notes TEXT,
  priority priority_level DEFAULT 'media',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bid_requirements_bid ON bid_requirements(bid_id);
CREATE INDEX idx_bid_requirements_org ON bid_requirements(organization_id);
CREATE INDEX idx_bid_requirements_category ON bid_requirements(bid_id, category);

COMMENT ON TABLE bid_requirements IS 'Requirements extracted from bid bases/convocatoria';

-- ============================================================================
-- 7. BID EVALUATION CRITERIA
-- ============================================================================

CREATE TABLE bid_evaluation_criteria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  criterion_name TEXT NOT NULL,
  category evaluation_category NOT NULL,
  max_points NUMERIC(6,2) NOT NULL,
  description TEXT
);

CREATE INDEX idx_bid_eval_criteria_bid ON bid_evaluation_criteria(bid_id);
CREATE INDEX idx_bid_eval_criteria_org ON bid_evaluation_criteria(organization_id);

COMMENT ON TABLE bid_evaluation_criteria IS 'Evaluation criteria and point weights per bid';

-- ============================================================================
-- 8. BID SCORES
-- ============================================================================

CREATE TABLE bid_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  variable_name TEXT NOT NULL,
  variable_value NUMERIC(10,4) NOT NULL,
  weight NUMERIC(5,4) NOT NULL,
  weighted_score NUMERIC(10,4) NOT NULL,
  notes TEXT,
  scored_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  scored_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_bid_scores_bid ON bid_scores(bid_id);
CREATE INDEX idx_bid_scores_org ON bid_scores(organization_id);

COMMENT ON TABLE bid_scores IS 'Detailed scoring breakdown for bid go/no-go analysis';

-- ============================================================================
-- 9. BID PIPELINE HISTORY
-- ============================================================================

CREATE TABLE bid_pipeline_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  from_stage pipeline_stage,
  to_stage pipeline_stage NOT NULL,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bid_pipeline_history_bid ON bid_pipeline_history(bid_id);
CREATE INDEX idx_bid_pipeline_history_org ON bid_pipeline_history(organization_id);
CREATE INDEX idx_bid_pipeline_history_date ON bid_pipeline_history(created_at);

COMMENT ON TABLE bid_pipeline_history IS 'Audit trail of pipeline stage changes per bid';

-- ============================================================================
-- 10. PROPOSALS
-- ============================================================================

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type proposal_type NOT NULL,
  version INT NOT NULL DEFAULT 1,
  status proposal_status NOT NULL DEFAULT 'draft',
  total_amount NUMERIC(18,2),
  content JSONB,
  submitted_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_proposals_bid ON proposals(bid_id);
CREATE INDEX idx_proposals_org ON proposals(organization_id);
CREATE INDEX idx_proposals_status ON proposals(organization_id, status);

COMMENT ON TABLE proposals IS 'Technical and economic proposals generated for bids';

-- ============================================================================
-- 11. PROPOSAL SECTIONS
-- ============================================================================

CREATE TABLE proposal_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  times_used INT NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_proposal_sections_org ON proposal_sections(organization_id);
CREATE INDEX idx_proposal_sections_category ON proposal_sections(organization_id, category);
CREATE INDEX idx_proposal_sections_tags ON proposal_sections USING GIN(tags);

COMMENT ON TABLE proposal_sections IS 'Reusable content sections for proposal generation';

-- ============================================================================
-- 12. TASKS
-- ============================================================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  status task_status NOT NULL DEFAULT 'pendiente',
  priority priority_level NOT NULL DEFAULT 'media',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_bid ON tasks(bid_id);
CREATE INDEX idx_tasks_org ON tasks(organization_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to, status);
CREATE INDEX idx_tasks_status ON tasks(organization_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

COMMENT ON TABLE tasks IS 'Actionable tasks associated with bids';

-- ============================================================================
-- 13. MILESTONES
-- ============================================================================

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type milestone_type NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  alert_days_before INT[] DEFAULT '{3,1}',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_milestones_bid ON milestones(bid_id);
CREATE INDEX idx_milestones_org ON milestones(organization_id);
CREATE INDEX idx_milestones_date ON milestones(date);
CREATE INDEX idx_milestones_type ON milestones(organization_id, type);

COMMENT ON TABLE milestones IS 'Key dates and deadlines with configurable alerts';

-- ============================================================================
-- 14. CLARIFICATION QUESTIONS
-- ============================================================================

CREATE TABLE clarification_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  status question_status NOT NULL DEFAULT 'draft',
  asked_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clarification_questions_bid ON clarification_questions(bid_id);
CREATE INDEX idx_clarification_questions_org ON clarification_questions(organization_id);

COMMENT ON TABLE clarification_questions IS 'Questions prepared for junta de aclaraciones';

-- ============================================================================
-- 15. BID RESULTS
-- ============================================================================

CREATE TABLE bid_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  result bid_result_type NOT NULL,
  winner_name TEXT,
  winner_amount NUMERIC(18,2),
  our_amount NUMERIC(18,2),
  loss_reason TEXT,
  loss_category loss_category,
  lessons_learned TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bid_results_bid ON bid_results(bid_id);
CREATE INDEX idx_bid_results_org ON bid_results(organization_id);
CREATE INDEX idx_bid_results_result ON bid_results(organization_id, result);

COMMENT ON TABLE bid_results IS 'Final results and outcomes of completed bids';

-- ============================================================================
-- 16. CONTRACTS
-- ============================================================================

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contract_number VARCHAR(100),
  amount NUMERIC(18,2) NOT NULL,
  start_date DATE,
  end_date DATE,
  status contract_status NOT NULL DEFAULT 'activo',
  deliverables JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contracts_bid ON contracts(bid_id);
CREATE INDEX idx_contracts_org ON contracts(organization_id);
CREATE INDEX idx_contracts_status ON contracts(organization_id, status);

COMMENT ON TABLE contracts IS 'Contracts resulting from won bids';

-- ============================================================================
-- 17. CONTACTS
-- ============================================================================

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone VARCHAR(20),
  position TEXT,
  entity TEXT,
  entity_name TEXT,
  type contact_type NOT NULL DEFAULT 'funcionario',
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contacts_org ON contacts(organization_id);
CREATE INDEX idx_contacts_type ON contacts(organization_id, type);
CREATE INDEX idx_contacts_entity ON contacts(entity_name);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);

COMMENT ON TABLE contacts IS 'CRM contacts: government officials, competitors, suppliers, partners';

-- ============================================================================
-- 18. EVIDENCE DOCUMENTS
-- ============================================================================

CREATE TABLE evidence_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  file_path TEXT,
  file_url TEXT,
  expiry_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_evidence_docs_org ON evidence_documents(organization_id);
CREATE INDEX idx_evidence_docs_category ON evidence_documents(organization_id, category);
CREATE INDEX idx_evidence_docs_expiry ON evidence_documents(expiry_date);

COMMENT ON TABLE evidence_documents IS 'Reusable evidence documents (actas constitutivas, CVs, certificates)';

-- ============================================================================
-- 19. TEMPLATES
-- ============================================================================

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  category TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_templates_org ON templates(organization_id);
CREATE INDEX idx_templates_type ON templates(organization_id, type);

COMMENT ON TABLE templates IS 'Reusable proposal and document templates';

-- ============================================================================
-- 20. ACTIVITY LOG
-- ============================================================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_log_org ON activity_log(organization_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_date ON activity_log(organization_id, created_at DESC);

COMMENT ON TABLE activity_log IS 'Comprehensive audit trail of all user actions';

-- ============================================================================
-- 21. NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type notification_type NOT NULL DEFAULT 'system',
  channel notification_channel NOT NULL DEFAULT 'in_app',
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_org ON notifications(organization_id);
CREATE INDEX idx_notifications_date ON notifications(user_id, created_at DESC);

COMMENT ON TABLE notifications IS 'User notifications for deadlines, assignments, and system events';

-- ============================================================================
-- 22. SCORING CONFIG
-- ============================================================================

CREATE TABLE scoring_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  variable_name TEXT NOT NULL,
  weight NUMERIC(5,4) NOT NULL DEFAULT 1.0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, variable_name)
);

CREATE INDEX idx_scoring_config_org ON scoring_config(organization_id);

COMMENT ON TABLE scoring_config IS 'Configurable scoring weights per organization for bid evaluation';

-- ============================================================================
-- 23. COMPETITOR INTEL
-- ============================================================================

CREATE TABLE competitor_intel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  rfc VARCHAR(13),
  sector TEXT,
  avg_bid_amount NUMERIC(18,2),
  win_rate_estimate NUMERIC(5,2),
  notes TEXT,
  bids_competed INT NOT NULL DEFAULT 0,
  bids_won INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_competitor_intel_org ON competitor_intel(organization_id);
CREATE INDEX idx_competitor_intel_name ON competitor_intel(company_name);

COMMENT ON TABLE competitor_intel IS 'Intelligence on competitors in government procurement';

-- ============================================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bids_updated_at
  BEFORE UPDATE ON bids FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_proposals_updated_at
  BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_contacts_updated_at
  BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_competitor_intel_updated_at
  BEFORE UPDATE ON competitor_intel FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_scoring_config_updated_at
  BEFORE UPDATE ON scoring_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_pipeline_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE clarification_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_intel ENABLE ROW LEVEL SECURITY;

-- Helper: get the organization_id for the current authenticated user
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- bid_sources is public read for all authenticated users
ALTER TABLE bid_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bid_sources_read" ON bid_sources
  FOR SELECT TO authenticated USING (true);

-- Organizations: users can only see their own org
CREATE POLICY "org_select" ON organizations
  FOR SELECT TO authenticated
  USING (id = get_user_org_id());

CREATE POLICY "org_update" ON organizations
  FOR UPDATE TO authenticated
  USING (id = get_user_org_id());

-- Users: can see users in their org
CREATE POLICY "users_select" ON users
  FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());

CREATE POLICY "users_update" ON users
  FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());

CREATE POLICY "users_insert" ON users
  FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());

-- Macro for org-isolated tables: SELECT, INSERT, UPDATE, DELETE
-- We create policies for each multi-tenant table

-- BIDS
CREATE POLICY "bids_select" ON bids FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bids_insert" ON bids FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "bids_update" ON bids FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bids_delete" ON bids FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- BID DOCUMENTS
CREATE POLICY "bid_docs_select" ON bid_documents FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bid_docs_insert" ON bid_documents FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "bid_docs_update" ON bid_documents FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bid_docs_delete" ON bid_documents FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- BID REQUIREMENTS
CREATE POLICY "bid_reqs_select" ON bid_requirements FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bid_reqs_insert" ON bid_requirements FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "bid_reqs_update" ON bid_requirements FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bid_reqs_delete" ON bid_requirements FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- BID EVALUATION CRITERIA
CREATE POLICY "bid_eval_select" ON bid_evaluation_criteria FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bid_eval_insert" ON bid_evaluation_criteria FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "bid_eval_update" ON bid_evaluation_criteria FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bid_eval_delete" ON bid_evaluation_criteria FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- BID SCORES
CREATE POLICY "bid_scores_select" ON bid_scores FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bid_scores_insert" ON bid_scores FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "bid_scores_update" ON bid_scores FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bid_scores_delete" ON bid_scores FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- BID PIPELINE HISTORY
CREATE POLICY "bid_hist_select" ON bid_pipeline_history FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bid_hist_insert" ON bid_pipeline_history FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());

-- PROPOSALS
CREATE POLICY "proposals_select" ON proposals FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "proposals_insert" ON proposals FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "proposals_update" ON proposals FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "proposals_delete" ON proposals FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- PROPOSAL SECTIONS
CREATE POLICY "prop_sect_select" ON proposal_sections FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "prop_sect_insert" ON proposal_sections FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "prop_sect_update" ON proposal_sections FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "prop_sect_delete" ON proposal_sections FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- TASKS
CREATE POLICY "tasks_select" ON tasks FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "tasks_insert" ON tasks FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "tasks_update" ON tasks FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "tasks_delete" ON tasks FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- MILESTONES
CREATE POLICY "milestones_select" ON milestones FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "milestones_insert" ON milestones FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "milestones_update" ON milestones FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "milestones_delete" ON milestones FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- CLARIFICATION QUESTIONS
CREATE POLICY "clarif_select" ON clarification_questions FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "clarif_insert" ON clarification_questions FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "clarif_update" ON clarification_questions FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "clarif_delete" ON clarification_questions FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- BID RESULTS
CREATE POLICY "bid_results_select" ON bid_results FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "bid_results_insert" ON bid_results FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "bid_results_update" ON bid_results FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());

-- CONTRACTS
CREATE POLICY "contracts_select" ON contracts FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "contracts_insert" ON contracts FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "contracts_update" ON contracts FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());

-- CONTACTS
CREATE POLICY "contacts_select" ON contacts FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "contacts_insert" ON contacts FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "contacts_update" ON contacts FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "contacts_delete" ON contacts FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- EVIDENCE DOCUMENTS
CREATE POLICY "evidence_select" ON evidence_documents FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "evidence_insert" ON evidence_documents FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "evidence_update" ON evidence_documents FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "evidence_delete" ON evidence_documents FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- TEMPLATES
CREATE POLICY "templates_select" ON templates FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "templates_insert" ON templates FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "templates_update" ON templates FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "templates_delete" ON templates FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- ACTIVITY LOG
CREATE POLICY "activity_select" ON activity_log FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "activity_insert" ON activity_log FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());

-- NOTIFICATIONS
CREATE POLICY "notif_select" ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "notif_update" ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "notif_insert" ON notifications FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());

-- SCORING CONFIG
CREATE POLICY "scoring_select" ON scoring_config FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "scoring_insert" ON scoring_config FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "scoring_update" ON scoring_config FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());

-- COMPETITOR INTEL
CREATE POLICY "competitor_select" ON competitor_intel FOR SELECT TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "competitor_insert" ON competitor_intel FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_org_id());
CREATE POLICY "competitor_update" ON competitor_intel FOR UPDATE TO authenticated
  USING (organization_id = get_user_org_id());
CREATE POLICY "competitor_delete" ON competitor_intel FOR DELETE TO authenticated
  USING (organization_id = get_user_org_id());

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
