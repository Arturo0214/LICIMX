const versions = [
  {
    version: "v2.4",
    date: "28 mar 2026",
    title: "Integración con CompraNet mejorada",
    changes: [
      { text: "Sincronización en tiempo real con CompraNet 2.0", tag: "new" },
      { text: "Detección automática de cambios en bases de licitación", tag: "new" },
      { text: "Mejora del 40% en velocidad de scraping", tag: "mejora" },
      { text: "Corrección de parsing para licitaciones de IMSS", tag: "fix" },
      { text: "Nuevos filtros por dependencia y estado", tag: "mejora" },
    ],
  },
  {
    version: "v2.3",
    date: "15 mar 2026",
    title: "Scoring 2.0 con variables configurables",
    changes: [
      { text: "Variables de scoring completamente personalizables", tag: "new" },
      { text: "Pesos ajustables por categoría de evaluación", tag: "new" },
      { text: "Histórico de scores para análisis de tendencias", tag: "new" },
      { text: "Recalibración automática basada en resultados", tag: "mejora" },
      { text: "Corrección en cálculo de score para licitaciones internacionales", tag: "fix" },
    ],
  },
  {
    version: "v2.2",
    date: "1 mar 2026",
    title: "Pipeline Kanban con drag & drop",
    changes: [
      { text: "Vista Kanban con drag & drop para gestión de pipeline", tag: "new" },
      { text: "Columnas personalizables por equipo", tag: "new" },
      { text: "Etiquetas de color y prioridad", tag: "new" },
      { text: "Filtros avanzados en vista de pipeline", tag: "mejora" },
      { text: "Exportación de pipeline a CSV y PDF", tag: "mejora" },
    ],
  },
  {
    version: "v2.1",
    date: "15 feb 2026",
    title: "Generación asistida de propuestas con IA",
    changes: [
      { text: "Generación de borradores de propuesta técnica con IA", tag: "new" },
      { text: "Sugerencias inteligentes basadas en licitaciones similares", tag: "new" },
      { text: "Revisión automática de requisitos faltantes", tag: "new" },
      { text: "Mejora en la velocidad de carga del editor", tag: "mejora" },
      { text: "Corrección de formato en exportación a Word", tag: "fix" },
    ],
  },
  {
    version: "v2.0",
    date: "1 feb 2026",
    title: "Lanzamiento de LICIMX 2.0",
    changes: [
      { text: "Rediseño completo de la interfaz de usuario", tag: "new" },
      { text: "Nuevo dashboard con métricas en tiempo real", tag: "new" },
      { text: "Sistema de notificaciones inteligentes", tag: "new" },
      { text: "API pública para integraciones", tag: "new" },
      { text: "Mejora del 60% en rendimiento general", tag: "mejora" },
      { text: "Soporte para equipos con roles y permisos", tag: "new" },
    ],
  },
  {
    version: "v1.0",
    date: "15 dic 2025",
    title: "Lanzamiento inicial",
    changes: [
      { text: "Detección automática de licitaciones en CompraNet", tag: "new" },
      { text: "Sistema de scoring básico", tag: "new" },
      { text: "Pipeline de seguimiento de licitaciones", tag: "new" },
      { text: "Alertas por correo electrónico", tag: "new" },
      { text: "Dashboard con estadísticas básicas", tag: "new" },
    ],
  },
]

function TagBadge({ tag }: { tag: string }) {
  const styles: Record<string, string> = {
    new: "bg-[#0d9488]/10 text-[#0d9488]",
    mejora: "bg-[#2563eb]/10 text-[#2563eb]",
    fix: "bg-[#d97706]/10 text-[#d97706]",
  }
  const labels: Record<string, string> = {
    new: "Nuevo",
    mejora: "Mejora",
    fix: "Fix",
  }
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[tag] ?? ""}`}>
      {labels[tag] ?? tag}
    </span>
  )
}

export default function ChangelogPage() {
  return (
    <div className="bg-white pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#1e3a5f]/10 px-4 py-1.5 text-sm font-semibold text-[#1e3a5f]">
            Changelog
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#1e3a5f] sm:text-5xl">
            Changelog
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Todas las mejoras y nuevas funcionalidades
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-16 space-y-0">
          {versions.map((v, i) => (
            <div key={v.version} className="relative pl-8 pb-12 last:pb-0">
              {/* Timeline line */}
              {i < versions.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-px bg-slate-200" />
              )}
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#1e3a5f] bg-white">
                <div className="h-2.5 w-2.5 rounded-full bg-[#1e3a5f]" />
              </div>

              {/* Version header */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-[#1e3a5f] px-3 py-1 text-sm font-bold text-white">
                  {v.version}
                </span>
                <span className="text-sm text-slate-400">{v.date}</span>
              </div>
              <h3 className="mt-3 text-xl font-bold text-[#1e3a5f]">{v.title}</h3>

              {/* Changes */}
              <ul className="mt-4 space-y-2.5">
                {v.changes.map((change) => (
                  <li key={change.text} className="flex items-start gap-3">
                    <TagBadge tag={change.tag} />
                    <span className="text-sm text-slate-600">{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
