-- ============================================================================
-- LICIMX - Seed Data
-- Realistic Mexican government procurement data
-- ============================================================================

-- ============================================================================
-- ORGANIZATION
-- ============================================================================

INSERT INTO organizations (id, name, rfc, industry, plan) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'TechGov Solutions S.A. de C.V.', 'TGS200115AB3', 'Tecnologias de la Informacion', 'pro');

-- ============================================================================
-- USERS (IDs simulate auth.users references)
-- ============================================================================

INSERT INTO users (id, organization_id, email, full_name, role, phone, is_active) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'carlos.mendoza@techgov.mx', 'Carlos Mendoza Rivera', 'director', '+52 55 1234 5678', true),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'ana.gutierrez@techgov.mx', 'Ana Lucia Gutierrez Flores', 'analista', '+52 55 8765 4321', true);

-- ============================================================================
-- BID SOURCES
-- ============================================================================

INSERT INTO bid_sources (id, name, url, type, scraper_status, last_scraped_at) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'CompraNet 5.0', 'https://compranet.hacienda.gob.mx', 'federal', 'active', now() - interval '2 hours'),
  ('c0000000-0000-0000-0000-000000000002', 'Diario Oficial de la Federacion', 'https://www.dof.gob.mx', 'federal', 'active', now() - interval '6 hours'),
  ('c0000000-0000-0000-0000-000000000003', 'Portal de Adquisiciones CDMX', 'https://adquisiciones.cdmx.gob.mx', 'estatal', 'active', now() - interval '12 hours'),
  ('c0000000-0000-0000-0000-000000000004', 'CompraNet Jalisco', 'https://compranet.jalisco.gob.mx', 'estatal', 'inactive', null),
  ('c0000000-0000-0000-0000-000000000005', 'Portal de Transparencia Nuevo Leon', 'https://transparencia.nl.gob.mx', 'estatal', 'active', now() - interval '24 hours');

-- ============================================================================
-- BIDS - 14 bids across all pipeline stages
-- ============================================================================

-- Variables for readability
-- org = a0000000-0000-0000-0000-000000000001
-- user1 (director) = b0000000-0000-0000-0000-000000000001
-- user2 (analista) = b0000000-0000-0000-0000-000000000002

INSERT INTO bids (id, organization_id, source_id, external_id, title, description, contracting_entity, contracting_entity_type, state, type, category, sector, budget_amount, currency, estimated_cost, estimated_margin_pct, publication_date, clarification_meeting_date, submission_deadline, award_date, pipeline_stage, score, score_level, assigned_to, tags, source_url) VALUES

-- 1. DETECTADA
('d0000000-0000-0000-0000-000000000001',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001',
 'LA-006000993-E45-2026',
 'Servicios de desarrollo de software para el SAT',
 'Contratacion de servicios de desarrollo, mantenimiento y soporte de sistemas informaticos para la administracion tributaria digital.',
 'Servicio de Administracion Tributaria', 'dependencia', 'Ciudad de Mexico',
 'publica', 'Tecnologias de la Informacion', 'Gobierno Federal',
 45000000.00, 'MXN', 38000000.00, 18.42,
 '2026-03-25', '2026-04-10 10:00:00-06', '2026-04-25 14:00:00-06', '2026-05-15',
 'detectada', null, null,
 'b0000000-0000-0000-0000-000000000002',
 ARRAY['software','sat','desarrollo','federal'],
 'https://compranet.hacienda.gob.mx/licitacion/LA-006000993-E45-2026'),

-- 2. DETECTADA
('d0000000-0000-0000-0000-000000000002',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001',
 'LA-019GYR001-E12-2026',
 'Arrendamiento de equipo de computo para el IMSS',
 'Arrendamiento de 15,000 equipos de computo de escritorio y portatiles con garantia y soporte en sitio para unidades medicas.',
 'Instituto Mexicano del Seguro Social', 'entidad', 'Ciudad de Mexico',
 'publica', 'Equipamiento TI', 'Salud',
 120000000.00, 'MXN', 98000000.00, 22.45,
 '2026-03-28', '2026-04-12 09:00:00-06', '2026-04-28 13:00:00-06', '2026-05-20',
 'detectada', null, null,
 null,
 ARRAY['arrendamiento','computo','imss','equipo'],
 'https://compranet.hacienda.gob.mx/licitacion/LA-019GYR001-E12-2026'),

-- 3. ANALIZANDO
('d0000000-0000-0000-0000-000000000003',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001',
 'LA-018TOQ001-E78-2026',
 'Sistema de gestion documental para CFE',
 'Implementacion de sistema de gestion documental electronica y digitalizacion de archivos historicos para oficinas centrales y regionales.',
 'Comision Federal de Electricidad', 'empresa_productiva', 'Ciudad de Mexico',
 'publica', 'Software Empresarial', 'Energia',
 28500000.00, 'MXN', 22000000.00, 29.55,
 '2026-03-15', '2026-04-05 11:00:00-06', '2026-04-18 14:00:00-06', '2026-05-08',
 'analizando', 72.50, 'alta',
 'b0000000-0000-0000-0000-000000000002',
 ARRAY['documental','cfe','digitalizacion','software'],
 'https://compranet.hacienda.gob.mx/licitacion/LA-018TOQ001-E78-2026'),

-- 4. ANALIZANDO
('d0000000-0000-0000-0000-000000000004',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000002',
 'DOF-2026-03-20-PEMEX-001',
 'Plataforma de monitoreo de ductos para PEMEX',
 'Desarrollo e implementacion de plataforma IoT para monitoreo en tiempo real de la red de ductos de petroleo y gas.',
 'Petroleos Mexicanos', 'empresa_productiva', 'Tabasco',
 'invitacion', 'IoT / Monitoreo', 'Energia',
 65000000.00, 'MXN', 52000000.00, 25.00,
 '2026-03-20', '2026-04-08 10:00:00-06', '2026-04-22 12:00:00-06', '2026-05-10',
 'analizando', 58.30, 'media',
 'b0000000-0000-0000-0000-000000000001',
 ARRAY['iot','pemex','monitoreo','ductos'],
 null),

-- 5. APROBADA
('d0000000-0000-0000-0000-000000000005',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001',
 'LA-012NBP001-E33-2026',
 'Modernizacion del sistema de expediente clinico electronico ISSSTE',
 'Modernizacion y migracion a la nube del sistema de expediente clinico electronico para 1,200 unidades medicas del ISSSTE.',
 'Instituto de Seguridad y Servicios Sociales de los Trabajadores del Estado', 'entidad', 'Ciudad de Mexico',
 'publica', 'Salud Digital', 'Salud',
 78000000.00, 'MXN', 62000000.00, 25.81,
 '2026-03-10', '2026-03-28 09:00:00-06', '2026-04-15 14:00:00-06', '2026-05-05',
 'aprobada', 81.20, 'alta',
 'b0000000-0000-0000-0000-000000000002',
 ARRAY['salud','issste','expediente','nube'],
 'https://compranet.hacienda.gob.mx/licitacion/LA-012NBP001-E33-2026'),

-- 6. EN PREPARACION
('d0000000-0000-0000-0000-000000000006',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001',
 'LA-011L6J001-E90-2026',
 'Portal de tramites digitales para la SEP',
 'Desarrollo de portal unificado de tramites y servicios digitales para la Secretaria de Educacion Publica con firma electronica avanzada.',
 'Secretaria de Educacion Publica', 'dependencia', 'Ciudad de Mexico',
 'publica', 'Gobierno Digital', 'Educacion',
 18500000.00, 'MXN', 14200000.00, 30.28,
 '2026-02-28', '2026-03-18 10:00:00-06', '2026-04-08 14:00:00-06', '2026-04-28',
 'en_preparacion', 85.60, 'alta',
 'b0000000-0000-0000-0000-000000000002',
 ARRAY['portal','sep','tramites','gobierno_digital'],
 'https://compranet.hacienda.gob.mx/licitacion/LA-011L6J001-E90-2026'),

-- 7. EN PREPARACION
('d0000000-0000-0000-0000-000000000007',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000003',
 'CDMX-AD-2026-0145',
 'Sistema de videovigilancia inteligente para la SSC CDMX',
 'Suministro e instalacion de sistema de videovigilancia con analitica de video e inteligencia artificial para la Secretaria de Seguridad Ciudadana.',
 'Secretaria de Seguridad Ciudadana CDMX', 'dependencia', 'Ciudad de Mexico',
 'adjudicacion_directa', 'Seguridad', 'Seguridad Publica',
 8900000.00, 'MXN', 7100000.00, 25.35,
 '2026-03-05', null, '2026-04-05 12:00:00-06', '2026-04-20',
 'en_preparacion', 69.40, 'media',
 'b0000000-0000-0000-0000-000000000001',
 ARRAY['videovigilancia','ia','seguridad','cdmx'],
 null),

-- 8. PRESENTADA
('d0000000-0000-0000-0000-000000000008',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001',
 'LA-016GYN001-E56-2026',
 'Infraestructura de nube hibrida para CONAGUA',
 'Servicio de infraestructura de nube hibrida, migracion de cargas de trabajo y operacion de centro de datos para la Comision Nacional del Agua.',
 'Comision Nacional del Agua', 'organo_desconcentrado', 'Ciudad de Mexico',
 'publica', 'Infraestructura TI', 'Medio Ambiente',
 35000000.00, 'MXN', 27500000.00, 27.27,
 '2026-02-15', '2026-03-05 09:00:00-06', '2026-03-25 14:00:00-06', '2026-04-15',
 'presentada', 76.80, 'alta',
 'b0000000-0000-0000-0000-000000000002',
 ARRAY['nube','conagua','infraestructura','datacenter'],
 'https://compranet.hacienda.gob.mx/licitacion/LA-016GYN001-E56-2026'),

-- 9. EN EVALUACION
('d0000000-0000-0000-0000-000000000009',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001',
 'LA-006HJA001-E23-2026',
 'Servicios de ciberseguridad gestionada para la SSA',
 'Contratacion de servicios de SOC (Security Operations Center) 24x7 y respuesta a incidentes para la Secretaria de Salud.',
 'Secretaria de Salud', 'dependencia', 'Ciudad de Mexico',
 'publica', 'Ciberseguridad', 'Salud',
 22000000.00, 'MXN', 17500000.00, 25.71,
 '2026-02-01', '2026-02-20 10:00:00-06', '2026-03-15 14:00:00-06', '2026-04-05',
 'en_evaluacion', 79.30, 'alta',
 'b0000000-0000-0000-0000-000000000001',
 ARRAY['ciberseguridad','soc','ssa','seguridad'],
 'https://compranet.hacienda.gob.mx/licitacion/LA-006HJA001-E23-2026'),

-- 10. GANADA
('d0000000-0000-0000-0000-000000000010',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001',
 'LA-050GYR040-E67-2025',
 'Sistema de control de inventarios para almacenes del IMSS',
 'Desarrollo e implementacion de sistema WMS para la gestion de almacenes y cadena de suministro de medicamentos e insumos medicos.',
 'Instituto Mexicano del Seguro Social', 'entidad', 'Ciudad de Mexico',
 'publica', 'Logistica / Supply Chain', 'Salud',
 32000000.00, 'MXN', 24500000.00, 30.61,
 '2025-11-15', '2025-12-05 09:00:00-06', '2025-12-20 14:00:00-06', '2026-01-15',
 'ganada', 88.50, 'alta',
 'b0000000-0000-0000-0000-000000000002',
 ARRAY['inventarios','imss','wms','logistica'],
 'https://compranet.hacienda.gob.mx/licitacion/LA-050GYR040-E67-2025'),

-- 11. GANADA
('d0000000-0000-0000-0000-000000000011',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000003',
 'CDMX-LP-2025-0892',
 'App movil de servicios ciudadanos para Gobierno CDMX',
 'Diseno, desarrollo y operacion de aplicacion movil integrada de servicios ciudadanos con georreferenciacion y pagos en linea.',
 'Agencia Digital de Innovacion Publica CDMX', 'dependencia', 'Ciudad de Mexico',
 'publica', 'Apps Moviles', 'Gobierno Digital',
 12500000.00, 'MXN', 9800000.00, 27.55,
 '2025-10-01', '2025-10-20 10:00:00-06', '2025-11-10 14:00:00-06', '2025-12-01',
 'ganada', 91.20, 'alta',
 'b0000000-0000-0000-0000-000000000001',
 ARRAY['app','cdmx','ciudadano','movil'],
 null),

-- 12. PERDIDA
('d0000000-0000-0000-0000-000000000012',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001',
 'LA-009J9E001-E11-2025',
 'Mesa de ayuda y soporte tecnico para BANOBRAS',
 'Servicio de mesa de ayuda de primer y segundo nivel, soporte en sitio y gestion de incidentes para el Banco Nacional de Obras.',
 'Banco Nacional de Obras y Servicios Publicos', 'entidad', 'Ciudad de Mexico',
 'publica', 'Soporte TI', 'Banca de Desarrollo',
 15000000.00, 'MXN', 12800000.00, 17.19,
 '2025-09-15', '2025-10-05 09:00:00-06', '2025-10-25 14:00:00-06', '2025-11-15',
 'perdida', 62.40, 'media',
 'b0000000-0000-0000-0000-000000000002',
 ARRAY['soporte','banobras','mesa_ayuda'],
 'https://compranet.hacienda.gob.mx/licitacion/LA-009J9E001-E11-2025'),

-- 13. DESIERTA
('d0000000-0000-0000-0000-000000000013',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000005',
 'NL-LP-2025-0234',
 'Sistema de recaudacion digital para Gobierno de Nuevo Leon',
 'Modernizacion de la plataforma de recaudacion de impuestos estatales con pasarela de pagos multiple.',
 'Secretaria de Finanzas de Nuevo Leon', 'dependencia', 'Nuevo Leon',
 'publica', 'Fintech / Pagos', 'Gobierno Estatal',
 25000000.00, 'MXN', 20000000.00, 25.00,
 '2025-08-01', '2025-08-20 10:00:00-06', '2025-09-10 14:00:00-06', '2025-10-01',
 'desierta', 55.00, 'media',
 'b0000000-0000-0000-0000-000000000001',
 ARRAY['recaudacion','nuevo_leon','pagos','estatal'],
 null),

-- 14. DESCARTADA
('d0000000-0000-0000-0000-000000000014',
 'a0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000001',
 'LA-020VSS001-E88-2026',
 'Servicio de impresion masiva para el INEGI',
 'Servicio de impresion, acabado y distribucion de materiales censales y estadisticos a nivel nacional.',
 'Instituto Nacional de Estadistica y Geografia', 'organo_desconcentrado', 'Aguascalientes',
 'publica', 'Impresion', 'Estadistica',
 8000000.00, 'MXN', null, null,
 '2026-03-01', '2026-03-20 09:00:00-06', '2026-04-10 14:00:00-06', '2026-05-01',
 'descartada', 22.10, 'descarte',
 null,
 ARRAY['impresion','inegi','censo'],
 'https://compranet.hacienda.gob.mx/licitacion/LA-020VSS001-E88-2026');

-- ============================================================================
-- BID DOCUMENTS
-- ============================================================================

INSERT INTO bid_documents (id, bid_id, organization_id, name, file_size, mime_type, category, version, uploaded_by, is_current) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Bases_CFE_Gestion_Documental.pdf', 2458000, 'application/pdf', 'bases', 1, 'b0000000-0000-0000-0000-000000000002', true),
  ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Anexo_Tecnico_CFE.pdf', 1850000, 'application/pdf', 'anexo', 1, 'b0000000-0000-0000-0000-000000000002', true),
  ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Convocatoria_ISSSTE_ECE.pdf', 980000, 'application/pdf', 'convocatoria', 1, 'b0000000-0000-0000-0000-000000000002', true),
  ('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Bases_ISSSTE_ECE.pdf', 3200000, 'application/pdf', 'bases', 1, 'b0000000-0000-0000-0000-000000000002', true),
  ('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Bases_SEP_Portal_Tramites.pdf', 4100000, 'application/pdf', 'bases', 1, 'b0000000-0000-0000-0000-000000000002', true),
  ('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Propuesta_Tecnica_SEP_v1.docx', 5600000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'propuesta_tecnica', 1, 'b0000000-0000-0000-0000-000000000002', true),
  ('e0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Propuesta_Tecnica_CONAGUA.pdf', 8200000, 'application/pdf', 'propuesta_tecnica', 1, 'b0000000-0000-0000-0000-000000000002', true),
  ('e0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Propuesta_Economica_CONAGUA.pdf', 1200000, 'application/pdf', 'propuesta_economica', 1, 'b0000000-0000-0000-0000-000000000001', true),
  ('e0000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'Contrato_IMSS_Inventarios.pdf', 3500000, 'application/pdf', 'contrato', 1, 'b0000000-0000-0000-0000-000000000001', true),
  ('e0000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'Fallo_IMSS_Inventarios.pdf', 1100000, 'application/pdf', 'fallo', 1, 'b0000000-0000-0000-0000-000000000002', true),
  ('e0000000-0000-0000-0000-000000000011', 'd0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'Bases_SSA_Ciberseguridad.pdf', 2900000, 'application/pdf', 'bases', 1, 'b0000000-0000-0000-0000-000000000002', true),
  ('e0000000-0000-0000-0000-000000000012', 'd0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'Acta_Aclaracion_SSA.pdf', 750000, 'application/pdf', 'acta_aclaracion', 1, 'b0000000-0000-0000-0000-000000000002', true);

-- ============================================================================
-- BID REQUIREMENTS
-- ============================================================================

INSERT INTO bid_requirements (bid_id, organization_id, requirement_text, category, is_eliminatory, is_met, met_notes, priority) VALUES
  -- CFE bid requirements
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Acta constitutiva con objeto social relacionado a TI', 'documental', true, true, 'Acta vigente presentada', 'alta'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Constancia de situacion fiscal vigente (no mayor a 30 dias)', 'documental', true, true, null, 'alta'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Experiencia minima de 3 contratos similares en ultimos 5 anos', 'experiencia', true, true, 'Presentamos 5 contratos similares', 'alta'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Certificacion ISO 27001 vigente', 'tecnico', true, false, 'En proceso de renovacion, vence en mayo', 'alta'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Capital contable minimo de $10 MDP', 'financiero', true, true, 'Capital de $15.2 MDP verificado', 'alta'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Metodologia de implementacion documentada', 'tecnico', false, null, null, 'media'),

  -- ISSSTE bid requirements
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Registro en CompraNet actualizado', 'documental', true, true, null, 'alta'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Experiencia en sistemas de salud de al menos 2 proyectos', 'experiencia', true, true, 'IMSS Inventarios + Proyecto SSA anterior', 'alta'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Certificacion en HL7 FHIR del lider de proyecto', 'tecnico', true, null, 'Verificando certificacion del equipo', 'alta'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Poliza de seguro de responsabilidad civil por $5 MDP', 'financiero', false, true, null, 'media'),

  -- SEP bid requirements (en_preparacion)
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Carta de no inhabilitacion vigente', 'legal', true, true, null, 'alta'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Declaracion de integridad firmada por representante legal', 'legal', true, true, null, 'alta'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Equipo minimo: 1 PM, 2 Arquitectos, 5 Desarrolladores, 1 QA', 'tecnico', true, true, 'Equipo asignado y CVs preparados', 'alta'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Certificacion CMMI nivel 3 o equivalente', 'tecnico', false, true, 'Certificacion CMMI Dev v2.0 ML3 vigente', 'media'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Estados financieros auditados de los ultimos 2 ejercicios', 'financiero', true, true, null, 'alta');

-- ============================================================================
-- BID EVALUATION CRITERIA
-- ============================================================================

INSERT INTO bid_evaluation_criteria (bid_id, organization_id, criterion_name, category, max_points, description) VALUES
  -- SEP bid
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Capacidad del licitante', 'tecnica', 15.00, 'Experiencia y capacidad tecnica demostrada en proyectos similares'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Propuesta de trabajo', 'tecnica', 20.00, 'Metodologia, plan de trabajo y cronograma de implementacion'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Equipo de trabajo', 'tecnica', 15.00, 'Perfiles, certificaciones y experiencia del equipo propuesto'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Precio', 'economica', 50.00, 'Evaluacion por puntos: menor precio = mayor puntaje'),

  -- CONAGUA bid
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Experiencia empresa', 'tecnica', 10.00, 'Contratos similares en los ultimos 3 anos'),
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Solucion tecnica', 'tecnica', 25.00, 'Arquitectura, tecnologias y plan de migracion'),
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'SLA propuesto', 'tecnica', 10.00, 'Niveles de servicio y penalizaciones'),
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Certificaciones', 'tecnica', 5.00, 'Certificaciones relevantes del equipo y empresa'),
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Precio', 'economica', 50.00, 'Propuesta economica evaluada por puntos');

-- ============================================================================
-- BID SCORES
-- ============================================================================

INSERT INTO bid_scores (bid_id, organization_id, variable_name, variable_value, weight, weighted_score, notes, scored_by) VALUES
  -- CFE (score = 72.50)
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'margen_estimado', 29.55, 0.2000, 5.9100, 'Buen margen proyectado', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'experiencia_sector', 7.0000, 0.2500, 1.7500, 'Experiencia limitada en sector energia', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'cumplimiento_requisitos', 83.0000, 0.2500, 20.7500, 'Falta renovar ISO 27001', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'competencia_estimada', 6.0000, 0.1500, 0.9000, 'Al menos 5 competidores esperados', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'capacidad_equipo', 8.5000, 0.1500, 1.2750, 'Equipo calificado disponible', 'b0000000-0000-0000-0000-000000000002'),

  -- ISSSTE (score = 81.20)
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'margen_estimado', 25.81, 0.2000, 5.1620, null, 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'experiencia_sector', 9.0000, 0.2500, 2.2500, 'Excelente experiencia en salud', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'cumplimiento_requisitos', 90.0000, 0.2500, 22.5000, 'Verificar certificacion HL7', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'competencia_estimada', 7.0000, 0.1500, 1.0500, null, 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'capacidad_equipo', 9.0000, 0.1500, 1.3500, null, 'b0000000-0000-0000-0000-000000000002'),

  -- SEP (score = 85.60)
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'margen_estimado', 30.28, 0.2000, 6.0560, 'Excelente margen', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'experiencia_sector', 8.5000, 0.2500, 2.1250, 'Buenos antecedentes en gobierno digital', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'cumplimiento_requisitos', 95.0000, 0.2500, 23.7500, 'Todos los requisitos cubiertos', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'competencia_estimada', 8.0000, 0.1500, 1.2000, 'Pocos competidores especializados', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'capacidad_equipo', 9.5000, 0.1500, 1.4250, 'Equipo con certificaciones relevantes', 'b0000000-0000-0000-0000-000000000002');

-- ============================================================================
-- BID PIPELINE HISTORY
-- ============================================================================

INSERT INTO bid_pipeline_history (bid_id, organization_id, from_stage, to_stage, changed_by, reason, created_at) VALUES
  -- CFE flow
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', null, 'detectada', 'b0000000-0000-0000-0000-000000000002', 'Detectada en CompraNet', now() - interval '18 days'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'detectada', 'analizando', 'b0000000-0000-0000-0000-000000000002', 'Iniciando analisis de requisitos', now() - interval '15 days'),

  -- ISSSTE flow
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', null, 'detectada', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '23 days'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'detectada', 'analizando', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '20 days'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'analizando', 'aprobada', 'b0000000-0000-0000-0000-000000000001', 'Aprobada por direccion - alto potencial', now() - interval '14 days'),

  -- SEP flow
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', null, 'detectada', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '33 days'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'detectada', 'analizando', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '30 days'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'analizando', 'aprobada', 'b0000000-0000-0000-0000-000000000001', 'Go decision confirmada', now() - interval '25 days'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'aprobada', 'en_preparacion', 'b0000000-0000-0000-0000-000000000002', 'Iniciando preparacion de propuestas', now() - interval '20 days'),

  -- CONAGUA flow
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', null, 'detectada', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '46 days'),
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'detectada', 'analizando', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '43 days'),
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'analizando', 'aprobada', 'b0000000-0000-0000-0000-000000000001', null, now() - interval '38 days'),
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'aprobada', 'en_preparacion', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '30 days'),
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'en_preparacion', 'presentada', 'b0000000-0000-0000-0000-000000000002', 'Propuestas entregadas en tiempo', now() - interval '8 days'),

  -- IMSS Inventarios (ganada) full flow
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', null, 'detectada', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '140 days'),
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'detectada', 'analizando', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '135 days'),
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'analizando', 'aprobada', 'b0000000-0000-0000-0000-000000000001', null, now() - interval '128 days'),
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'aprobada', 'en_preparacion', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '120 days'),
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'en_preparacion', 'presentada', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '103 days'),
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'presentada', 'en_evaluacion', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '95 days'),
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'en_evaluacion', 'fallo', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '80 days'),
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'fallo', 'ganada', 'b0000000-0000-0000-0000-000000000001', 'Fallo favorable! Primer lugar en puntuacion', now() - interval '77 days'),

  -- DESCARTADA
  ('d0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000001', null, 'detectada', 'b0000000-0000-0000-0000-000000000002', null, now() - interval '32 days'),
  ('d0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000001', 'detectada', 'descartada', 'b0000000-0000-0000-0000-000000000001', 'No es nuestro giro - servicio de impresion masiva', now() - interval '30 days');

-- ============================================================================
-- PROPOSALS
-- ============================================================================

INSERT INTO proposals (id, bid_id, organization_id, type, version, status, total_amount, content, submitted_at, created_by) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'tecnica', 1, 'review', null,
   '{"executive_summary": "Propuesta para el desarrollo del Portal Unificado de Tramites de la SEP...", "methodology": "Agile/Scrum con sprints de 2 semanas", "team_size": 9, "technologies": ["React", "Node.js", "PostgreSQL", "AWS"]}',
   null, 'b0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'economica', 1, 'draft', 14200000.00,
   '{"line_items": [{"concept": "Fase 1 - Analisis", "amount": 2130000}, {"concept": "Fase 2 - Desarrollo", "amount": 7100000}, {"concept": "Fase 3 - Pruebas e implementacion", "amount": 3550000}, {"concept": "Fase 4 - Garantia 6 meses", "amount": 1420000}]}',
   null, 'b0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'tecnica', 1, 'submitted', null,
   '{"executive_summary": "Solucion integral de nube hibrida para CONAGUA basada en Azure Stack HCI y Azure Public Cloud...", "architecture": "Hibrida con failover automatico", "sla": "99.95% disponibilidad"}',
   '2026-03-25 13:45:00-06', 'b0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'economica', 1, 'submitted', 27500000.00,
   '{"line_items": [{"concept": "Infraestructura on-premises", "amount": 8250000}, {"concept": "Licenciamiento nube", "amount": 5500000}, {"concept": "Migracion", "amount": 6875000}, {"concept": "Operacion 12 meses", "amount": 6875000}]}',
   '2026-03-25 13:45:00-06', 'b0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'tecnica', 1, 'submitted', null,
   '{"executive_summary": "Sistema WMS con modulos de recepcion, almacenamiento, picking y despacho...", "methodology": "Waterfall con fases iterativas"}',
   '2025-12-20 13:00:00-06', 'b0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'economica', 1, 'submitted', 24500000.00,
   '{"line_items": [{"concept": "Desarrollo e implementacion", "amount": 14700000}, {"concept": "Capacitacion", "amount": 2450000}, {"concept": "Soporte 12 meses", "amount": 7350000}]}',
   '2025-12-20 13:00:00-06', 'b0000000-0000-0000-0000-000000000001');

-- ============================================================================
-- PROPOSAL SECTIONS (reusable)
-- ============================================================================

INSERT INTO proposal_sections (organization_id, title, content, category, tags, times_used, created_by) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Descripcion de la Empresa', 'TechGov Solutions S.A. de C.V. es una empresa mexicana especializada en soluciones tecnologicas para el sector gobierno, con mas de 8 anos de experiencia en proyectos de transformacion digital para dependencias federales y estatales. Contamos con certificaciones CMMI Dev v2.0 ML3, ISO 9001:2015 e ISO 27001:2022.', 'presentacion', ARRAY['empresa','descripcion','introduccion'], 12, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'Metodologia Agil de Desarrollo', 'Empleamos una metodologia Agile basada en Scrum, con sprints de 2 semanas, revisiones de producto con el cliente al final de cada sprint, y un enfoque de entrega continua que garantiza visibilidad y control del avance del proyecto.', 'metodologia', ARRAY['agile','scrum','metodologia'], 8, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'Plan de Aseguramiento de Calidad', 'Nuestro plan de QA incluye pruebas unitarias automatizadas (cobertura minima 80%), pruebas de integracion, pruebas de rendimiento con JMeter, pruebas de seguridad (OWASP Top 10), y pruebas de aceptacion de usuario (UAT) con participacion del equipo de la dependencia.', 'calidad', ARRAY['qa','pruebas','calidad'], 6, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'Clausula de Confidencialidad Estandar', 'TechGov Solutions se compromete a mantener estricta confidencialidad sobre toda la informacion proporcionada por la dependencia contratante, conforme a la Ley General de Proteccion de Datos Personales en Posesion de Sujetos Obligados y la Ley Federal de Transparencia y Acceso a la Informacion Publica.', 'legal', ARRAY['confidencialidad','legal','datos'], 10, 'b0000000-0000-0000-0000-000000000001');

-- ============================================================================
-- TASKS
-- ============================================================================

INSERT INTO tasks (bid_id, organization_id, title, description, assigned_to, status, priority, due_date, created_by) VALUES
  -- CFE tasks
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Revisar bases de licitacion CFE', 'Analizar el anexo tecnico y los requisitos de participacion', 'b0000000-0000-0000-0000-000000000002', 'en_proceso', 'alta', '2026-04-05', 'b0000000-0000-0000-0000-000000000001'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Verificar vigencia ISO 27001', 'Contactar al organismo certificador para confirmar vigencia o iniciar renovacion', 'b0000000-0000-0000-0000-000000000001', 'pendiente', 'alta', '2026-04-08', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Calcular propuesta economica CFE', 'Estimar costos de equipo, infraestructura y margen', 'b0000000-0000-0000-0000-000000000002', 'pendiente', 'media', '2026-04-12', 'b0000000-0000-0000-0000-000000000001'),

  -- SEP tasks
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Redactar propuesta tecnica SEP', 'Desarrollar la seccion de metodologia y plan de trabajo', 'b0000000-0000-0000-0000-000000000002', 'en_proceso', 'alta', '2026-04-03', 'b0000000-0000-0000-0000-000000000001'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Preparar CVs del equipo SEP', 'Actualizar y formatear los CVs de los 9 integrantes del equipo propuesto', 'b0000000-0000-0000-0000-000000000002', 'completada', 'alta', '2026-03-30', 'b0000000-0000-0000-0000-000000000001'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Revision legal de documentos SEP', 'Validar que todos los documentos legales esten en orden', 'b0000000-0000-0000-0000-000000000001', 'pendiente', 'media', '2026-04-05', 'b0000000-0000-0000-0000-000000000002'),

  -- SSA Ciberseguridad tasks
  ('d0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'Seguimiento al fallo SSA', 'Verificar si ya se publico el fallo en CompraNet', 'b0000000-0000-0000-0000-000000000002', 'pendiente', 'alta', '2026-04-06', 'b0000000-0000-0000-0000-000000000001'),

  -- ISSSTE task
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Preparar preguntas para junta de aclaraciones ISSSTE', 'Revisar bases y formular preguntas clave', 'b0000000-0000-0000-0000-000000000002', 'pendiente', 'alta', '2026-03-26', 'b0000000-0000-0000-0000-000000000001'),

  -- General
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Descargar bases SAT de CompraNet', 'Descargar y organizar las bases y anexos de la licitacion del SAT', 'b0000000-0000-0000-0000-000000000002', 'pendiente', 'media', '2026-04-02', 'b0000000-0000-0000-0000-000000000002');

-- ============================================================================
-- MILESTONES
-- ============================================================================

INSERT INTO milestones (bid_id, organization_id, title, type, date, alert_days_before, is_completed, notes) VALUES
  -- SAT
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Junta de Aclaraciones SAT', 'junta_aclaraciones', '2026-04-10 10:00:00-06', '{5,3,1}', false, 'Av. Hidalgo 77, Col. Guerrero, CDMX'),
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Entrega de Propuestas SAT', 'entrega_propuestas', '2026-04-25 14:00:00-06', '{7,3,1}', false, null),

  -- CFE
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Junta de Aclaraciones CFE', 'junta_aclaraciones', '2026-04-05 11:00:00-06', '{5,3,1}', false, 'Paseo de la Reforma 164, Col. Juarez'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Entrega de Propuestas CFE', 'entrega_propuestas', '2026-04-18 14:00:00-06', '{7,3,1}', false, null),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Fallo CFE', 'fallo', '2026-05-08 10:00:00-06', '{3,1}', false, null),

  -- ISSSTE
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Junta de Aclaraciones ISSSTE', 'junta_aclaraciones', '2026-03-28 09:00:00-06', '{5,3,1}', true, 'Completada - Se registraron 8 preguntas'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Entrega de Propuestas ISSSTE', 'entrega_propuestas', '2026-04-15 14:00:00-06', '{7,5,3,1}', false, 'Sede: Av. de la Republica 154, Col. Tabacalera'),

  -- SEP
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Entrega de Propuestas SEP', 'entrega_propuestas', '2026-04-08 14:00:00-06', '{7,5,3,1}', false, 'Calle de Argentina 28, Centro Historico'),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Apertura Tecnica SEP', 'apertura_tecnica', '2026-04-08 15:00:00-06', '{3,1}', false, null),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Fallo SEP', 'fallo', '2026-04-28 10:00:00-06', '{5,3,1}', false, null),

  -- CONAGUA
  ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Fallo CONAGUA', 'fallo', '2026-04-15 11:00:00-06', '{5,3,1}', false, 'Pendiente de publicacion en CompraNet'),

  -- SSA
  ('d0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'Fallo SSA Ciberseguridad', 'fallo', '2026-04-05 10:00:00-06', '{3,1}', false, null),

  -- IMSS Inventarios (ganada)
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'Firma de Contrato IMSS', 'firma_contrato', '2026-02-01 10:00:00-06', '{5,3}', true, 'Contrato firmado'),
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'Inicio de Contrato IMSS', 'inicio_contrato', '2026-02-15 09:00:00-06', '{3,1}', true, 'Proyecto en ejecucion');

-- ============================================================================
-- CLARIFICATION QUESTIONS
-- ============================================================================

INSERT INTO clarification_questions (bid_id, organization_id, question, answer, status, asked_by) VALUES
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'En relacion al numeral 3.2 del Anexo Tecnico, se solicita aclarar si la migracion a la nube incluye los datos historicos de los ultimos 10 anos o solo los datos del sistema actual.', 'La migracion debera incluir los datos historicos de los ultimos 5 anos. Los datos anteriores se mantendran en el sistema legacy con acceso de solo lectura.', 'answered', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Respecto a la certificacion HL7 FHIR mencionada en el numeral 5.1, se solicita confirmar si es aceptable que la certificacion este en proceso al momento de la presentacion de propuestas.', 'Se aceptara carta compromiso de que la certificacion se obtendra antes del inicio del contrato.', 'answered', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Se solicita confirmar el numero exacto de unidades medicas que seran incluidas en la Fase 1 del proyecto.', null, 'submitted', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Referente al requisito de ISO 27001, se aceptaria una certificacion con vigencia hasta mayo 2026 con carta compromiso de renovacion?', null, 'draft', 'b0000000-0000-0000-0000-000000000002'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Se solicita aclarar si el sistema debe integrarse con SAP del cliente o si sera un sistema independiente.', null, 'draft', 'b0000000-0000-0000-0000-000000000002');

-- ============================================================================
-- BID RESULTS
-- ============================================================================

INSERT INTO bid_results (bid_id, organization_id, result, winner_name, winner_amount, our_amount, loss_reason, loss_category, lessons_learned) VALUES
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'ganada', 'TechGov Solutions S.A. de C.V.', 24500000.00, 24500000.00, null, null, 'Excelente propuesta tecnica. La experiencia previa en sistemas de salud fue diferenciador clave.'),
  ('d0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001', 'ganada', 'TechGov Solutions S.A. de C.V.', 9800000.00, 9800000.00, null, null, 'La demostracion del prototipo funcional en la presentacion fue determinante.'),
  ('d0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000001', 'perdida', 'Sistemas Integrales MX S.A. de C.V.', 11200000.00, 12800000.00, 'El ganador ofrecio precio significativamente menor. Nuestra propuesta tecnica fue mejor valorada pero el diferencial de precio fue determinante.', 'precio', 'Revisar estructura de costos para servicios de soporte. Considerar modelo con menos personal en sitio y mas remoto para reducir costos.'),
  ('d0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000001', 'desierta', null, null, 20000000.00, 'Se declaro desierta porque ninguno de los 3 participantes cumplio con todos los requisitos eliminatorios.', 'documental', 'Verificar con mas anticipacion los requisitos especificos de licitaciones estatales. Los requisitos de Nuevo Leon difieren de los federales.');

-- ============================================================================
-- CONTRACTS
-- ============================================================================

INSERT INTO contracts (id, bid_id, organization_id, contract_number, amount, start_date, end_date, status, deliverables) VALUES
  ('10000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'IMSS-CTO-2026-0142', 24500000.00, '2026-02-15', '2027-02-14', 'activo',
   '[{"name": "Fase 1 - Analisis y Diseno", "due_date": "2026-04-15", "amount": 3675000, "status": "completado"}, {"name": "Fase 2 - Desarrollo Core", "due_date": "2026-08-15", "amount": 9800000, "status": "en_proceso"}, {"name": "Fase 3 - Integraciones", "due_date": "2026-11-15", "amount": 4900000, "status": "pendiente"}, {"name": "Fase 4 - UAT y Go-Live", "due_date": "2027-01-15", "amount": 3675000, "status": "pendiente"}, {"name": "Garantia", "due_date": "2027-02-14", "amount": 2450000, "status": "pendiente"}]'),
  ('10000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001', 'ADIP-CDMX-2025-0893', 9800000.00, '2026-01-10', '2026-07-10', 'activo',
   '[{"name": "Sprint 1-3: MVP", "due_date": "2026-02-28", "amount": 2940000, "status": "completado"}, {"name": "Sprint 4-6: Funcionalidades avanzadas", "due_date": "2026-04-15", "amount": 2940000, "status": "en_proceso"}, {"name": "Sprint 7-9: Integraciones y pagos", "due_date": "2026-05-30", "amount": 2450000, "status": "pendiente"}, {"name": "Lanzamiento y estabilizacion", "due_date": "2026-07-10", "amount": 1470000, "status": "pendiente"}]');

-- ============================================================================
-- CONTACTS
-- ============================================================================

INSERT INTO contacts (organization_id, full_name, email, phone, position, entity, entity_name, type, notes, tags) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Lic. Roberto Sanchez Vargas', 'roberto.sanchez@imss.gob.mx', '+52 55 5238 1700 ext. 4521', 'Director de Tecnologias de la Informacion', 'dependencia', 'IMSS', 'funcionario', 'Contacto principal para el proyecto de inventarios. Muy profesional y puntual.', ARRAY['imss','ti','director']),
  ('a0000000-0000-0000-0000-000000000001', 'Ing. Patricia Lopez Mendez', 'patricia.lopez@issste.gob.mx', '+52 55 5140 3200 ext. 312', 'Subdirectora de Informatica Medica', 'dependencia', 'ISSSTE', 'funcionario', 'Responsable del proyecto de expediente clinico electronico.', ARRAY['issste','salud','informatica']),
  ('a0000000-0000-0000-0000-000000000001', 'Mtro. Eduardo Ramirez Torres', 'e.ramirez@sep.gob.mx', '+52 55 3601 1000 ext. 1145', 'Director General de Tecnologia de la Informacion', 'dependencia', 'SEP', 'funcionario', 'Tomador de decisiones para proyectos de gobierno digital.', ARRAY['sep','gobierno_digital','director']),
  ('a0000000-0000-0000-0000-000000000001', 'Lic. Maria Fernanda Cruz', 'mf.cruz@conagua.gob.mx', '+52 55 5174 4000 ext. 2234', 'Coordinadora de Infraestructura Tecnologica', 'dependencia', 'CONAGUA', 'funcionario', null, ARRAY['conagua','infraestructura']),
  ('a0000000-0000-0000-0000-000000000001', 'Ing. Alejandro Vega Ruiz', null, '+52 55 9180 0000', 'Director General', 'empresa', 'Sistemas Integrales MX S.A. de C.V.', 'competidor', 'Competidor frecuente en licitaciones de soporte TI. Compiten agresivamente en precio.', ARRAY['competidor','soporte','precio_bajo']),
  ('a0000000-0000-0000-0000-000000000001', 'Ing. Laura Dominguez Ortiz', 'laura@nubetechpro.com', '+52 33 3615 2000', 'Directora Comercial', 'empresa', 'NubeTech Pro S.A. de C.V.', 'competidor', 'Fuertes en nube e infraestructura. Aliados de AWS.', ARRAY['competidor','nube','infraestructura']),
  ('a0000000-0000-0000-0000-000000000001', 'Ing. Francisco Morales', 'fmorales@secureops.mx', '+52 55 5545 8900', 'CEO', 'empresa', 'SecureOps Mexico S.A. de C.V.', 'aliado', 'Partner para servicios de ciberseguridad. Podemos subcontratarlos para SOC.', ARRAY['aliado','ciberseguridad','soc']),
  ('a0000000-0000-0000-0000-000000000001', 'C.P. Gabriela Nunez', 'gabriela@contadoresmx.com', '+52 55 5687 3400', 'Socia Directora', 'empresa', 'Contadores Asociados MX', 'proveedor', 'Firma contable para preparacion de estados financieros auditados.', ARRAY['proveedor','contabilidad','auditorias']);

-- ============================================================================
-- EVIDENCE DOCUMENTS (reusable)
-- ============================================================================

INSERT INTO evidence_documents (organization_id, name, category, expiry_date, is_active, uploaded_by) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Acta Constitutiva TechGov Solutions', 'acta_constitutiva', null, true, 'b0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 'Poder del Representante Legal', 'poder_legal', null, true, 'b0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 'Constancia de Situacion Fiscal 2026', 'constancia_fiscal', '2026-04-30', true, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'Certificacion CMMI Dev v2.0 ML3', 'certificacion', '2027-06-15', true, 'b0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 'Certificacion ISO 27001:2022', 'certificacion', '2026-05-20', true, 'b0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 'Certificacion ISO 9001:2015', 'certificacion', '2027-03-10', true, 'b0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 'Estados Financieros Auditados 2025', 'financiero', null, true, 'b0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 'Estados Financieros Auditados 2024', 'financiero', null, true, 'b0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 'CV Carlos Mendoza - Director de Proyecto', 'cv', null, true, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'CV Ana Gutierrez - Arquitecta de Soluciones', 'cv', null, true, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'Opinion de Cumplimiento SAT Positiva 2026', 'fiscal', '2026-06-30', true, 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'Carta de No Inhabilitacion SFP', 'legal', '2026-06-15', true, 'b0000000-0000-0000-0000-000000000002');

-- ============================================================================
-- TEMPLATES
-- ============================================================================

INSERT INTO templates (organization_id, name, type, content, category, created_by) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Propuesta Tecnica - Desarrollo de Software', 'propuesta_tecnica', '{"sections": ["portada", "carta_presentacion", "descripcion_empresa", "experiencia", "equipo_trabajo", "metodologia", "plan_trabajo", "cronograma", "plan_calidad", "plan_riesgos", "soporte_garantia"]}', 'software', 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'Propuesta Tecnica - Infraestructura TI', 'propuesta_tecnica', '{"sections": ["portada", "carta_presentacion", "descripcion_empresa", "experiencia", "arquitectura_propuesta", "equipamiento", "plan_migracion", "sla", "soporte"]}', 'infraestructura', 'b0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'Propuesta Economica Estandar', 'propuesta_economica', '{"sections": ["portada", "resumen_costos", "desglose_fases", "costos_unitarios", "calendario_pagos", "condiciones_pago"]}', 'general', 'b0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 'Carta Presentacion Licitacion Publica', 'carta', '{"template": "Ciudad de Mexico, a {fecha}\\n\\n{dependencia}\\nPresente.\\n\\nEn atencion a la convocatoria de la Licitacion Publica Nacional {numero_licitacion}..."}', 'general', 'b0000000-0000-0000-0000-000000000001');

-- ============================================================================
-- ACTIVITY LOG
-- ============================================================================

INSERT INTO activity_log (organization_id, user_id, action, entity_type, entity_id, details, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'created', 'bid', 'd0000000-0000-0000-0000-000000000001', '{"title": "Servicios de desarrollo de software para el SAT"}', now() - interval '8 days'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'created', 'bid', 'd0000000-0000-0000-0000-000000000002', '{"title": "Arrendamiento de equipo de computo para el IMSS"}', now() - interval '5 days'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'stage_changed', 'bid', 'd0000000-0000-0000-0000-000000000003', '{"from": "detectada", "to": "analizando"}', now() - interval '15 days'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'scored', 'bid', 'd0000000-0000-0000-0000-000000000003', '{"score": 72.50, "level": "alta"}', now() - interval '14 days'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'stage_changed', 'bid', 'd0000000-0000-0000-0000-000000000005', '{"from": "analizando", "to": "aprobada"}', now() - interval '14 days'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'uploaded_document', 'bid_document', 'e0000000-0000-0000-0000-000000000005', '{"name": "Bases_SEP_Portal_Tramites.pdf", "bid": "Portal de tramites digitales para la SEP"}', now() - interval '20 days'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'created', 'proposal', 'f0000000-0000-0000-0000-000000000001', '{"type": "tecnica", "bid": "Portal de tramites digitales para la SEP"}', now() - interval '10 days'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'submitted', 'proposal', 'f0000000-0000-0000-0000-000000000003', '{"type": "tecnica", "bid": "Infraestructura de nube hibrida para CONAGUA"}', now() - interval '8 days'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'stage_changed', 'bid', 'd0000000-0000-0000-0000-000000000010', '{"from": "fallo", "to": "ganada"}', now() - interval '77 days'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'created', 'contract', '10000000-0000-0000-0000-000000000001', '{"contract_number": "IMSS-CTO-2026-0142", "amount": 24500000}', now() - interval '60 days');

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (organization_id, user_id, title, message, type, channel, is_read, link) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Deadline en 7 dias: Entrega de Propuestas SEP', 'La fecha limite para la entrega de propuestas del Portal de tramites digitales para la SEP es el 8 de abril.', 'deadline', 'in_app', false, '/bids/d0000000-0000-0000-0000-000000000006'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Junta de Aclaraciones CFE en 3 dias', 'La junta de aclaraciones para el Sistema de gestion documental para CFE es el 5 de abril.', 'reminder', 'in_app', false, '/bids/d0000000-0000-0000-0000-000000000003'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Nuevo bid detectado: SAT', 'Se detecto una nueva licitacion del SAT para servicios de desarrollo de software por $45 MDP.', 'system', 'in_app', true, '/bids/d0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Fallo pendiente: SSA Ciberseguridad', 'El fallo de la licitacion de ciberseguridad de la SSA esta programado para el 5 de abril.', 'deadline', 'in_app', false, '/bids/d0000000-0000-0000-0000-000000000009'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Tarea asignada: Descargar bases SAT', 'Se te asigno la tarea de descargar las bases de la licitacion del SAT de CompraNet.', 'assignment', 'in_app', false, '/bids/d0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Nuevo bid detectado: IMSS Equipo de Computo', 'Se detecto una nueva licitacion del IMSS para arrendamiento de equipo de computo por $120 MDP.', 'system', 'in_app', false, '/bids/d0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Propuesta CONAGUA presentada', 'Las propuestas tecnica y economica para CONAGUA fueron entregadas exitosamente.', 'stage_change', 'in_app', true, '/bids/d0000000-0000-0000-0000-000000000008');

-- ============================================================================
-- SCORING CONFIG
-- ============================================================================

INSERT INTO scoring_config (organization_id, variable_name, weight, is_active) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'margen_estimado', 0.2000, true),
  ('a0000000-0000-0000-0000-000000000001', 'experiencia_sector', 0.2500, true),
  ('a0000000-0000-0000-0000-000000000001', 'cumplimiento_requisitos', 0.2500, true),
  ('a0000000-0000-0000-0000-000000000001', 'competencia_estimada', 0.1500, true),
  ('a0000000-0000-0000-0000-000000000001', 'capacidad_equipo', 0.1500, true);

-- ============================================================================
-- COMPETITOR INTEL
-- ============================================================================

INSERT INTO competitor_intel (organization_id, company_name, rfc, sector, avg_bid_amount, win_rate_estimate, notes, bids_competed, bids_won) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Sistemas Integrales MX S.A. de C.V.', 'SIM150320KL5', 'Soporte TI / Outsourcing', 15000000.00, 45.00, 'Competidor agresivo en precio. Equipo grande pero con alta rotacion. Ganan frecuentemente en licitaciones de soporte y mesa de ayuda.', 12, 5),
  ('a0000000-0000-0000-0000-000000000001', 'NubeTech Pro S.A. de C.V.', 'NTP180815QR9', 'Cloud / Infraestructura', 30000000.00, 35.00, 'Fuertes en proyectos de infraestructura cloud. Partner Premier de AWS. Debiles en desarrollo de software custom.', 8, 3),
  ('a0000000-0000-0000-0000-000000000001', 'Soluciones Digitales del Norte S.A. de C.V.', 'SDN170512MN3', 'Desarrollo de Software', 20000000.00, 30.00, 'Empresa regiomontana con buena presencia en el noreste. Compiten en licitaciones federales y de Nuevo Leon.', 10, 3),
  ('a0000000-0000-0000-0000-000000000001', 'GovTech Partners S.C.', 'GTP160901AB8', 'Consultoria TI', 40000000.00, 50.00, 'Empresa con excelentes contactos en gobierno federal. Muy fuertes en licitaciones de consultoria y proyectos grandes. Precio alto pero ganan por calidad tecnica.', 15, 7),
  ('a0000000-0000-0000-0000-000000000001', 'Innovacion Publica S.A.P.I. de C.V.', 'IPC190223GH6', 'Gobierno Digital', 12000000.00, 25.00, 'Startup enfocada en gobierno digital y apps ciudadanas. Equipo tecnico fuerte pero con poca experiencia en licitaciones formales.', 6, 1);

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
