import Link from "next/link"
import { Clock, ArrowRight, Tag } from "lucide-react"

const articles = [
  {
    title: "Cómo ganar tu primera licitación pública: Guía paso a paso",
    excerpt: "Participar en licitaciones públicas puede parecer intimidante al principio. En esta guía te llevamos de la mano por todo el proceso, desde el registro en CompraNet hasta la presentación de tu propuesta.",
    date: "15 mar 2026",
    readTime: "8 min",
    category: "Guía",
    gradient: "from-[#1e3a5f] to-[#2563eb]",
  },
  {
    title: "Los 5 errores más comunes al preparar propuestas técnicas",
    excerpt: "Después de analizar más de 500 propuestas, identificamos los errores que más frecuentemente llevan al rechazo. Aprende a evitarlos y aumenta tus probabilidades de éxito.",
    date: "8 mar 2026",
    readTime: "6 min",
    category: "Consejos",
    gradient: "from-[#d97706] to-[#f59e0b]",
  },
  {
    title: "CompraNet 2026: Todo lo que cambió y cómo adaptarte",
    excerpt: "La plataforma de compras gubernamentales tuvo actualizaciones importantes este año. Te explicamos qué cambió, qué significa para tu empresa y cómo LICIMX se adapta automáticamente.",
    date: "1 mar 2026",
    readTime: "5 min",
    category: "Noticias",
    gradient: "from-[#0d9488] to-[#14b8a6]",
  },
  {
    title: "Scoring de licitaciones: Cómo priorizar oportunidades",
    excerpt: "No todas las licitaciones valen tu tiempo. Aprende a usar el sistema de scoring de LICIMX para identificar las oportunidades con mayor probabilidad de éxito y mejor retorno.",
    date: "22 feb 2026",
    readTime: "7 min",
    category: "Producto",
    gradient: "from-[#7c3aed] to-[#8b5cf6]",
  },
  {
    title: "Automatización en contrataciones públicas: El futuro es hoy",
    excerpt: "La inteligencia artificial y la automatización están transformando cómo las empresas participan en licitaciones. Descubre las tendencias que definirán el sector en los próximos años.",
    date: "15 feb 2026",
    readTime: "10 min",
    category: "Tendencias",
    gradient: "from-[#1e3a5f] to-[#0d9488]",
  },
  {
    title: "Caso de éxito: De 0 a 5 licitaciones ganadas en 6 meses",
    excerpt: "Conoce la historia de Constructora del Valle, una PyME que pasó de nunca haber participado en licitaciones a ganar 5 contratos gubernamentales en solo medio año usando LICIMX.",
    date: "8 feb 2026",
    readTime: "4 min",
    category: "Caso de éxito",
    gradient: "from-[#d97706] to-[#0d9488]",
  },
]

export default function BlogPage() {
  return (
    <div className="bg-white pt-24 pb-20">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[#1e3a5f]/10 px-4 py-1.5 text-sm font-semibold text-[#1e3a5f]">
            Blog
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#1e3a5f] sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Insights sobre licitaciones públicas en México
          </p>
        </div>

        {/* Articles grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.title}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
            >
              {/* Image placeholder */}
              <div className={`h-48 bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwVjBoLTJ2MzRoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
                    <Tag className="h-3 w-3" />
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#1e3a5f] group-hover:text-[#d97706] transition-colors">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {article.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-[#d97706] group-hover:gap-2 transition-all">
                    Leer más
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600">
            ¿Quieres recibir nuevos artículos directamente en tu correo?
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <input
              type="email"
              placeholder="tu@email.com"
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] w-64"
            />
            <button className="rounded-lg bg-[#d97706] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#b45309] hover:shadow-md">
              Suscribirme
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
