import { FileText, File, CheckSquare, Calculator, BookOpen, Play, ArrowRight, Download } from "lucide-react"

const resources = [
  {
    title: "Guía Completa de Licitaciones Públicas en México 2026",
    description: "Todo lo que necesitas saber para participar en licitaciones públicas: requisitos, plazos, documentación y mejores prácticas. Actualizada con las últimas reformas.",
    icon: FileText,
    cta: "Descargar PDF",
    gradient: "from-[#1e3a5f] to-[#2563eb]",
    type: "PDF",
  },
  {
    title: "Plantilla de Propuesta Técnica",
    description: "Plantilla profesional lista para usar con la estructura, secciones y formato que esperan los evaluadores en licitaciones federales y estatales.",
    icon: File,
    cta: "Descargar Plantilla",
    gradient: "from-[#d97706] to-[#f59e0b]",
    type: "DOCX",
  },
  {
    title: "Checklist de Documentos para Licitaciones Federales",
    description: "Lista completa y verificable de todos los documentos requeridos para participar en licitaciones de dependencias federales. Nunca más olvides un documento.",
    icon: CheckSquare,
    cta: "Descargar Checklist",
    gradient: "from-[#0d9488] to-[#14b8a6]",
    type: "PDF",
  },
  {
    title: "Calculadora de Margen para Propuestas Económicas",
    description: "Herramienta interactiva para calcular márgenes, costos indirectos y precio final de tu propuesta económica. Incluye fórmulas y ejemplos prácticos.",
    icon: Calculator,
    cta: "Abrir Calculadora",
    gradient: "from-[#7c3aed] to-[#8b5cf6]",
    type: "Herramienta",
  },
  {
    title: "Glosario de Términos de Contrataciones Públicas",
    description: "Más de 200 términos explicados de forma clara: desde adjudicación directa hasta UPCP. Ideal para quienes inician en el mundo de las licitaciones.",
    icon: BookOpen,
    cta: "Ver Glosario",
    gradient: "from-[#1e3a5f] to-[#0d9488]",
    type: "Web",
  },
  {
    title: "Video: Cómo usar LICIMX en 10 minutos",
    description: "Tutorial paso a paso para configurar tu cuenta, crear alertas, usar el scoring y gestionar tu pipeline de licitaciones en LICIMX.",
    icon: Play,
    cta: "Ver Video",
    gradient: "from-[#d97706] to-[#0d9488]",
    type: "Video",
  },
]

export default function GuiasPage() {
  return (
    <div className="bg-white pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[#1e3a5f]/10 px-4 py-1.5 text-sm font-semibold text-[#1e3a5f]">
            Recursos
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#1e3a5f] sm:text-5xl">
            Guías y Recursos
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Todo lo que necesitas para dominar las licitaciones públicas
          </p>
        </div>

        {/* Resources grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
            >
              {/* Icon */}
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${resource.gradient}`}>
                <resource.icon className="h-7 w-7 text-white" />
              </div>

              {/* Type badge */}
              <span className="mt-4 inline-flex self-start rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {resource.type}
              </span>

              {/* Content */}
              <h3 className="mt-3 text-lg font-bold text-[#1e3a5f]">
                {resource.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {resource.description}
              </p>

              {/* CTA */}
              <button className="mt-6 flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#15294a] hover:shadow-md group-hover:gap-3">
                {resource.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#15294a] p-10 text-center text-white">
          <h2 className="text-2xl font-bold">¿Necesitas ayuda personalizada?</h2>
          <p className="mt-3 text-slate-300">
            Nuestro equipo de expertos puede guiarte en tu primera licitación
          </p>
          <a
            href="/contacto"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#d97706] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#b45309] hover:shadow-md"
          >
            Hablar con un experto
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
