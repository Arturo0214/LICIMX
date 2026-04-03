"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Shield,
  Search,
  BarChart3,
  FileText,
  FolderCheck,
  TrendingUp,
  Kanban,
  AlertTriangle,
  Users,
  Clock,
  ArrowRight,
  Check,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Zap,
  Target,
  Eye,
  Trophy,
  Radio,
  Sparkles,
  Plus,
  Minus,
  Mail,
  MessageSquare,
  Folder,
  Table,
  ArrowDown,
  Star,
  Globe,
  Cpu,
} from "lucide-react"

/* ─────────────── Helpers ─────────────── */

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const delayClass = delay > 0 ? `animation-delay-${Math.round(delay * 1000)}` : ""
  return (
    <div
      className={`animate-fade-in-up ${delayClass} ${className}`}
      style={
        delay > 0
          ? { opacity: 0, animationDelay: `${delay}s`, animationFillMode: "forwards" }
          : {}
      }
    >
      {children}
    </div>
  )
}

/* ─────────────── Navbar ─────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const navLinks = [
    { label: "Producto", href: "#producto" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Precios", href: "#precios" },
    { label: "Contacto", href: "#contacto" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]">
            <Shield className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#1e3a5f]">LICIMX</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-[#1e3a5f]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#1e3a5f]"
          >
            Iniciar Sesion
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-[#d97706] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#b45309] hover:shadow-md active:scale-[0.98]"
          >
            Comenzar Gratis
          </Link>
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xl px-6 pb-6 pt-4 md:hidden animate-fade-in-up transition-all duration-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-base font-medium text-slate-700"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="text-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              Iniciar Sesion
            </Link>
            <Link
              href="/login"
              className="text-center rounded-lg bg-[#d97706] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ─────────────── Dashboard Mockup ─────────────── */

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-[#1e3a5f]/20 via-[#d97706]/10 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="ml-3 flex-1 rounded-md bg-slate-100 px-3 py-1 text-center text-xs text-slate-400">
            app.licimx.com/dashboard
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4 grid grid-cols-4 gap-3">
            {[
              { label: "Activas", value: "23", color: "text-[#1e3a5f]", bg: "bg-blue-50" },
              { label: "Score >80", value: "8", color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "En preparacion", value: "5", color: "text-[#d97706]", bg: "bg-amber-50" },
              { label: "Adjudicadas", value: "12", color: "text-violet-600", bg: "bg-violet-50" },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-lg ${stat.bg} p-3`}>
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="mt-0.5 text-[10px] font-medium text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                title: "Deteccion",
                color: "border-blue-400",
                items: [
                  { name: "IMSS - Equipo medico", score: 87 },
                  { name: "CFE - Transformadores", score: 72 },
                ],
              },
              {
                title: "Preparacion",
                color: "border-amber-400",
                items: [{ name: "ISSSTE - Software", score: 91 }],
              },
              {
                title: "Enviada",
                color: "border-emerald-400",
                items: [
                  { name: "PEMEX - Valvulas", score: 78 },
                  { name: "SAT - Servidores", score: 84 },
                ],
              },
            ].map((col) => (
              <div key={col.title} className={`rounded-lg border-t-2 ${col.color} bg-slate-50 p-2`}>
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {col.title}
                </div>
                <div className="space-y-1.5">
                  {col.items.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-md bg-white p-2 shadow-sm border border-slate-100"
                    >
                      <div className="text-[10px] font-medium text-slate-700 leading-tight">
                        {item.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="h-1 flex-1 rounded-full bg-slate-100">
                          <div
                            className="h-1 rounded-full bg-emerald-400"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-600">
                          {item.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────── Hero ─────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#1e3a5f]/[0.04] via-[#d97706]/[0.03] to-transparent blur-3xl" />
        <div className="absolute top-1/3 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-[#1e3a5f]/[0.03] to-transparent blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#1e3a5f 1px, transparent 1px), linear-gradient(90deg, #1e3a5f 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 lg:pb-32 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="animate-fade-in-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1e3a5f]/10 bg-[#1e3a5f]/[0.04] px-4 py-1.5 text-sm font-medium text-[#1e3a5f]">
                <Zap className="h-3.5 w-3.5" />
                La maquina de licitaciones de Mexico
              </div>
            </div>

            <h1 className="animate-fade-in-up animation-delay-100 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#0f1b2d] sm:text-5xl lg:text-[3.5rem]">
              Gana mas licitaciones.
              <br />
              <span className="text-[#1e3a5f]">Sin hojas de calculo.</span>
              <br />
              <span className="bg-gradient-to-r from-[#d97706] to-[#b45309] bg-clip-text text-transparent">
                Sin consultores.
              </span>
            </h1>

            <p className="animate-fade-in-up animation-delay-200 mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              LICIMX detecta oportunidades en CompraNet, califica automaticamente cada licitacion, y
              te ayuda a preparar propuestas ganadoras. Todo en un solo sistema.
            </p>

            <div className="animate-fade-in-up animation-delay-300 mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#d97706] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-[#b45309] hover:shadow-xl hover:shadow-amber-500/25 active:scale-[0.98]"
              >
                Comenzar Gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                Ver Demo
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="animate-fade-in animation-delay-500 mt-10 flex items-center gap-6 border-t border-slate-100 pt-8">
              <div className="flex -space-x-2">
                {["bg-[#1e3a5f]", "bg-[#d97706]", "bg-emerald-500", "bg-violet-500"].map(
                  (bg, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-[10px] font-bold text-white`}
                    >
                      {["A", "M", "R", "C"][i]}
                    </div>
                  )
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">+$285M MXN adjudicados</div>
                <div className="text-xs text-slate-500">Empresas ya confian en LICIMX</div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up animation-delay-300">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────── Social Proof Marquee ─────────────── */

function SocialProofBar() {
  const entities = ["SAT", "IMSS", "CFE", "PEMEX", "ISSSTE", "CONAGUA", "SEDENA", "SCT"]
  const iconMap: Record<string, React.ElementType> = {
    SAT: Shield,
    IMSS: Users,
    CFE: Zap,
    PEMEX: Globe,
    ISSSTE: Users,
    CONAGUA: Globe,
    SEDENA: Shield,
    SCT: Globe,
  }

  return (
    <section className="border-y border-slate-100 bg-slate-50/50 py-6 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
          Usado por equipos que licitan en
        </p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50/80 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50/80 to-transparent z-10" />
        <div className="animate-marquee flex items-center gap-16 whitespace-nowrap">
          {[...entities, ...entities].map((entity, i) => {
            const Icon = iconMap[entity] || Shield
            return (
              <div
                key={`${entity}-${i}`}
                className="flex items-center gap-2.5 opacity-40 hover:opacity-70 transition-opacity"
              >
                <Icon className="h-5 w-5 text-slate-500" />
                <span className="text-base font-bold tracking-wide text-slate-500">{entity}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────── El Problema ─────────────── */

function ProblemSection() {
  return (
    <section className="relative bg-white py-24 lg:py-32 overflow-hidden" id="producto">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left: Headline */}
          <FadeIn>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              El problema
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0f1b2d] sm:text-5xl lg:text-[3.2rem]">
              El{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                73%
              </span>{" "}
              de las empresas pierden licitaciones por desorganizacion
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
              Herramientas fragmentadas, procesos manuales y cero visibilidad. Asi se pierden
              contratos millonarios todos los dias.
            </p>
          </FadeIn>

          {/* Right: Chaos visual */}
          <FadeIn delay={0.2}>
            <div className="relative h-80 lg:h-96">
              {/* Scattered chaos icons */}
              <div className="animate-float absolute top-4 left-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-100 shadow-lg shadow-green-100/50 rotate-[-8deg]">
                <Table className="h-8 w-8 text-green-600" />
                <span className="absolute -bottom-2 text-[9px] font-bold text-green-600 bg-green-50 px-1.5 rounded">
                  Excel
                </span>
              </div>
              <div className="animate-float-delay absolute top-12 right-12 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-100 shadow-lg shadow-green-100/50 rotate-[12deg]">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <span className="absolute -bottom-2 text-[9px] font-bold text-green-600 bg-green-50 px-1.5 rounded">
                  WhatsApp
                </span>
              </div>
              <div className="animate-float-delay-2 absolute bottom-16 left-16 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 shadow-lg shadow-blue-100/50 rotate-[6deg]">
                <Mail className="h-8 w-8 text-blue-500" />
                <span className="absolute -bottom-2 text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 rounded">
                  Email
                </span>
              </div>
              <div
                className="animate-float absolute bottom-8 right-20 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 shadow-lg shadow-amber-100/50 rotate-[-5deg]"
                style={{ animationDelay: "1.5s" }}
              >
                <Folder className="h-8 w-8 text-amber-600" />
                <span className="absolute -bottom-2 text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 rounded">
                  Carpetas
                </span>
              </div>
              <div className="animate-float-delay absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 border-2 border-red-200 border-dashed">
                <AlertTriangle className="h-10 w-10 text-red-400" />
              </div>
              {/* Broken connection lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320">
                <line x1="80" y1="60" x2="200" y2="160" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 4" />
                <line x1="320" y1="80" x2="200" y2="160" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 4" />
                <line x1="120" y1="260" x2="200" y2="160" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 4" />
                <line x1="300" y1="250" x2="200" y2="160" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 4" />
              </svg>
            </div>
          </FadeIn>
        </div>

        {/* Pain points */}
        <div className="mt-16 space-y-4 max-w-2xl mx-auto">
          {[
            "Enterarte tarde de oportunidades",
            "Preparar propuestas contra reloj",
            "Perder por documentos faltantes",
          ].map((pain, i) => (
            <FadeIn key={pain} delay={0.1 * (i + 1)}>
              <div className="flex items-center gap-4 rounded-xl bg-red-50/60 border border-red-100 px-6 py-4 transition-all hover:bg-red-50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <X className="h-4 w-4 text-red-500" />
                </div>
                <span className="text-base font-medium text-slate-700 line-through decoration-red-300 decoration-2">
                  {pain}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Arrow divider */}
        <FadeIn delay={0.4} className="mt-12 flex flex-col items-center">
          <div className="h-16 w-px bg-gradient-to-b from-red-200 to-[#0d9488]" />
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d9488] shadow-lg shadow-teal-200/50">
            <ArrowDown className="h-5 w-5 text-white" />
          </div>
          <p className="mt-3 text-sm font-semibold text-[#0d9488]">La solucion</p>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─────────────── Product Showcase Mockups ─────────────── */

function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="ml-3 flex-1 rounded-md bg-slate-100 px-3 py-1 text-center text-xs text-slate-400">
          {url}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function MockDetectar() {
  const rows = [
    { id: "LA-001234", entity: "IMSS", desc: "Equipo medico hospitalario", amount: "$12.5M", score: 92 },
    { id: "LA-001235", entity: "CFE", desc: "Transformadores de potencia", amount: "$8.3M", score: 87 },
    { id: "LA-001236", entity: "PEMEX", desc: "Valvulas industriales", amount: "$15.1M", score: 78 },
    { id: "LA-001237", entity: "SAT", desc: "Servidores y almacenamiento", amount: "$6.2M", score: 65 },
  ]
  return (
    <BrowserFrame url="app.licimx.com/explorar">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-medium text-slate-500">Monitoreando CompraNet en vivo</span>
        </div>
        <div className="animate-pulse-glow rounded-lg bg-[#d97706] px-3 py-1.5 text-[10px] font-bold text-white cursor-pointer">
          + Importar Nuevas
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-100">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="px-2 py-1.5 text-left font-semibold">ID</th>
              <th className="px-2 py-1.5 text-left font-semibold">Entidad</th>
              <th className="px-2 py-1.5 text-left font-semibold hidden sm:table-cell">Descripcion</th>
              <th className="px-2 py-1.5 text-right font-semibold">Monto</th>
              <th className="px-2 py-1.5 text-right font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-50 hover:bg-blue-50/30">
                <td className="px-2 py-2 font-mono text-blue-600">{row.id}</td>
                <td className="px-2 py-2 font-semibold text-slate-700">{row.entity}</td>
                <td className="px-2 py-2 text-slate-500 hidden sm:table-cell">{row.desc}</td>
                <td className="px-2 py-2 text-right font-semibold text-slate-700">{row.amount}</td>
                <td className="px-2 py-2 text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      row.score >= 80
                        ? "bg-emerald-50 text-emerald-700"
                        : row.score >= 70
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BrowserFrame>
  )
}

function MockCalificar() {
  return (
    <BrowserFrame url="app.licimx.com/licitacion/LA-001234">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Scoring de Viabilidad
          </div>
          <div className="text-xs text-slate-600 mb-3">IMSS - Equipo medico hospitalario</div>
          {/* Radar-like chart */}
          <div className="relative mx-auto w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,10 90,38 78,82 22,82 10,38" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              <polygon points="50,22 78,42 69,76 31,76 22,42" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              <polygon points="50,34 66,46 60,70 40,70 34,46" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              <polygon points="50,14 86,40 72,78 28,80 16,38" fill="rgba(13,148,136,0.15)" stroke="#0d9488" strokeWidth="1.5" />
              {[
                [50, 14],
                [86, 40],
                [72, 78],
                [28, 80],
                [16, 38],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="2.5" fill="#0d9488" />
              ))}
            </svg>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] font-semibold text-slate-500">
              Margen
            </span>
            <span className="absolute top-1/3 right-0 text-[8px] font-semibold text-slate-500">Exp.</span>
            <span className="absolute bottom-2 right-2 text-[8px] font-semibold text-slate-500">Docs</span>
            <span className="absolute bottom-2 left-2 text-[8px] font-semibold text-slate-500">Comp.</span>
            <span className="absolute top-1/3 left-0 text-[8px] font-semibold text-slate-500">Plazo</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg viewBox="0 0 100 100" className="w-24 h-24">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#0d9488"
                strokeWidth="6"
                strokeDasharray="283"
                strokeDashoffset="23"
                strokeLinecap="round"
                className="transition-all duration-1000"
                style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-[#0d9488]">92</span>
              <span className="text-[8px] font-semibold text-slate-400">/ 100</span>
            </div>
          </div>
          <span className="mt-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
            ALTA VIABILIDAD
          </span>
          <div className="mt-3 space-y-1 w-full">
            {[
              { label: "Margen", val: 95 },
              { label: "Experiencia", val: 88 },
              { label: "Documentos", val: 92 },
              { label: "Competencia", val: 90 },
              { label: "Plazo", val: 85 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-[9px]">
                <span className="w-16 text-slate-500">{item.label}</span>
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0d9488] rounded-full" style={{ width: `${item.val}%` }} />
                </div>
                <span className="font-bold text-slate-600 w-5 text-right">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  )
}

function MockPreparar() {
  const columns = [
    { title: "Deteccion", color: "bg-blue-400", cards: [{ name: "CFE - Cables", tag: "Nuevo" }] },
    { title: "Analisis", color: "bg-violet-400", cards: [{ name: "IMSS - Equipo", tag: "Score: 92" }] },
    {
      title: "Preparacion",
      color: "bg-amber-400",
      cards: [
        { name: "PEMEX - Valvulas", tag: "70%" },
        { name: "SAT - Servidores", tag: "45%" },
      ],
    },
    { title: "Enviada", color: "bg-emerald-400", cards: [{ name: "ISSSTE - Software", tag: "Enviada" }] },
  ]
  return (
    <BrowserFrame url="app.licimx.com/pipeline">
      <div className="grid grid-cols-4 gap-2">
        {columns.map((col) => (
          <div key={col.title} className="rounded-lg bg-slate-50 p-2">
            <div className="flex items-center gap-1.5 mb-2">
              <div className={`h-2 w-2 rounded-full ${col.color}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {col.title}
              </span>
              <span className="ml-auto text-[9px] font-semibold text-slate-400 bg-slate-100 rounded-full px-1.5">
                {col.cards.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {col.cards.map((card) => (
                <div
                  key={card.name}
                  className="rounded-md bg-white p-2 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-grab"
                >
                  <div className="text-[10px] font-medium text-slate-700">{card.name}</div>
                  <div className="mt-1">
                    <span
                      className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${
                        col.color === "bg-emerald-400"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {card.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Animated flow indicator */}
      <div className="mt-3 h-1 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400 animate-flow-line" />
      </div>
    </BrowserFrame>
  )
}

function MockGanar() {
  return (
    <BrowserFrame url="app.licimx.com/dashboard">
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Tasa de Adjudicacion", value: "34.5%", change: "+5.2%", color: "text-emerald-600" },
          { label: "Contratos Ganados", value: "$285M", change: "+$42M", color: "text-[#1e3a5f]" },
          { label: "En Pipeline", value: "23", change: "+8", color: "text-[#d97706]" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg bg-slate-50 p-2.5">
            <div className="text-[9px] text-slate-500 font-medium">{kpi.label}</div>
            <div className={`text-lg font-extrabold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[9px] font-semibold text-emerald-500">{kpi.change}</div>
          </div>
        ))}
      </div>
      {/* Mini chart */}
      <div className="rounded-lg border border-slate-100 p-3 bg-white">
        <div className="text-[10px] font-semibold text-slate-500 mb-2">Win Rate - Ultimos 6 meses</div>
        <div className="flex items-end gap-1.5 h-20">
          {[28, 31, 29, 35, 33, 38].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-gradient-to-t from-[#1e3a5f] to-[#1e3a5f]/70"
                style={{ height: `${val * 2}px` }}
              />
              <span className="text-[8px] text-slate-400">
                {["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  )
}

/* ─────────────── Product Showcase ─────────────── */

function ProductShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = [
    {
      id: "detectar",
      icon: Search,
      label: "Detectar",
      title: "Monitoreo automatico de oportunidades",
      description:
        "Nuestros scrapers vigilan CompraNet, DOF y portales estatales cada 4 horas. Las oportunidades llegan a ti filtradas y listas para evaluar.",
      mock: <MockDetectar />,
    },
    {
      id: "calificar",
      icon: Target,
      label: "Calificar",
      title: "Scoring inteligente de viabilidad",
      description:
        "10 variables configurables evaluan cada licitacion automaticamente. Concentra tu esfuerzo en las que puedes ganar.",
      mock: <MockCalificar />,
    },
    {
      id: "preparar",
      icon: Kanban,
      label: "Preparar",
      title: "Pipeline visual de licitaciones",
      description:
        "De la deteccion a la adjudicacion en un tablero Kanban. Cada propuesta avanza por etapas claras. Nada se pierde.",
      mock: <MockPreparar />,
    },
    {
      id: "ganar",
      icon: Trophy,
      label: "Ganar",
      title: "Analitica de resultados y mejora continua",
      description:
        "Dashboard con KPIs en tiempo real. Tasa de adjudicacion, valor del pipeline, tendencias. Datos que mejoran tu estrategia.",
      mock: <MockGanar />,
    },
  ]

  return (
    <section className="bg-[#f8fafc] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1e3a5f]/[0.06] px-4 py-1.5 text-sm font-medium text-[#1e3a5f]">
            <Cpu className="h-3.5 w-3.5" />
            La solucion
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0f1b2d] sm:text-4xl lg:text-5xl">
            Un sistema operativo para licitaciones
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Cuatro modulos integrados que cubren el ciclo completo. De la deteccion a la adjudicacion.
          </p>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={0.2} className="mt-12">
          <div className="mx-auto flex max-w-2xl items-center justify-center rounded-2xl bg-white border border-slate-200 p-1.5 shadow-sm">
            {tabs.map((tab, i) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(i)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    activeTab === i
                      ? "bg-[#1e3a5f] text-white shadow-md"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </FadeIn>

        {/* Content */}
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#d97706]/10 px-3 py-1 text-xs font-bold text-[#d97706] uppercase tracking-wider">
              Paso {activeTab + 1} de 4
            </div>
            <h3 className="text-2xl font-bold text-[#0f1b2d] lg:text-3xl">{tabs[activeTab].title}</h3>
            <p className="mt-4 text-base leading-relaxed text-slate-600 max-w-md">
              {tabs[activeTab].description}
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#d97706] hover:text-[#b45309] transition-colors"
            >
              Ver en accion <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-[#1e3a5f]/10 via-[#d97706]/5 to-transparent blur-2xl" />
              <div className="relative">{tabs[activeTab].mock}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────── Feature Cards ─────────────── */

function FeaturesGrid() {
  const features = [
    {
      icon: Radio,
      title: "Monitoreo 24/7",
      description:
        "Scrapers que vigilan CompraNet, DOF y portales estatales cada 4 horas. Nunca pierdas una publicacion.",
      gradient: "from-blue-500 to-indigo-600",
      animation: (
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-signal-pulse" />
          <div
            className="absolute inset-2 rounded-full bg-blue-400/30 animate-signal-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div className="absolute inset-4 rounded-full bg-blue-500" />
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: "Scoring Inteligente",
      description:
        "10 variables configurables. El sistema decide por ti cuales atacar. Concentra recursos donde hay ROI.",
      gradient: "from-emerald-500 to-teal-600",
      animation: (
        <div className="flex items-end gap-1 h-10">
          {[40, 65, 85, 55, 95].map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-t bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-1000"
              style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      ),
    },
    {
      icon: Kanban,
      title: "Pipeline Visual",
      description:
        "De deteccion a adjudicacion en un tablero Kanban. Cada oportunidad tiene su lugar. Nada se pierde.",
      gradient: "from-violet-500 to-purple-600",
      animation: (
        <div className="flex gap-1 h-10 items-center">
          {[1, 2, 3].map((col) => (
            <div
              key={col}
              className="flex-1 h-full rounded bg-violet-100 flex flex-col items-center justify-center gap-0.5 p-0.5"
            >
              <div className="w-full h-1.5 rounded-full bg-violet-300" />
              {col <= 2 && <div className="w-full h-1.5 rounded-full bg-violet-200" />}
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Sparkles,
      title: "Propuestas con IA",
      description:
        "Genera borradores de propuestas tecnicas reutilizando lo que ya ganaste. Mejora con cada iteracion.",
      gradient: "from-amber-500 to-orange-600",
      animation: (
        <div className="relative h-10 w-10">
          <FileText className="h-8 w-8 text-amber-400" />
          <div className="absolute -top-1 -right-1 animate-sparkle">
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="absolute -bottom-0.5 -left-0.5 animate-sparkle-delay">
            <Sparkles className="h-3 w-3 text-orange-400" />
          </div>
        </div>
      ),
    },
    {
      icon: FolderCheck,
      title: "Gestion Documental",
      description:
        "Checklist, versionado, vault de evidencias. Todo listo para entregar. Nunca mas documentos faltantes.",
      gradient: "from-cyan-500 to-blue-600",
      animation: (
        <div className="flex flex-col gap-1 h-10 justify-center">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded bg-cyan-400 flex items-center justify-center">
                <Check className="h-2 w-2 text-white" />
              </div>
              <div
                className="h-1 flex-1 rounded-full bg-cyan-200"
                style={{ width: `${70 + item * 10}%` }}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: TrendingUp,
      title: "Analitica Predictiva",
      description:
        "Aprende de cada licitacion. Mejora tu tasa de exito con datos reales. El sistema se vuelve mas inteligente.",
      gradient: "from-rose-500 to-pink-600",
      animation: (
        <div className="h-10 w-full">
          <svg viewBox="0 0 80 32" className="w-full h-full">
            <polyline
              points="0,28 15,24 30,20 45,14 55,16 65,8 80,4"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="200"
              className="animate-trend-draw"
            />
            <circle cx="80" cy="4" r="3" fill="#f43f5e" className="animate-pulse" />
          </svg>
        </div>
      ),
    },
  ]

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1e3a5f]/[0.06] px-4 py-1.5 text-sm font-medium text-[#1e3a5f]">
            <Zap className="h-3.5 w-3.5" />
            Plataforma completa
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0f1b2d] sm:text-4xl">
            Cada herramienta que necesitas
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Seis modulos integrados que cubren todo el ciclo de licitaciones publicas.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={0.1 * (index + 1)}>
              <div className="group relative rounded-2xl border border-slate-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    {feature.animation}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────── How it Works ─────────────── */

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Detectamos",
      description:
        "Scrapers monitorizan CompraNet, DOF y portales estatales cada 4 horas. Las oportunidades llegan a ti.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      number: "02",
      icon: BarChart3,
      title: "Calificamos",
      description:
        "10 variables evaluan viabilidad automaticamente: margen, competencia, requisitos, historial y mas.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      number: "03",
      icon: FileText,
      title: "Preparamos",
      description:
        "Genera propuestas con plantillas inteligentes y tu historial de propuestas ganadoras.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      number: "04",
      icon: Trophy,
      title: "Ganamos",
      description: "Seguimiento completo hasta el fallo. Post-mortem automatico para mejorar siempre.",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ]

  return (
    <section className="relative bg-[#f8fafc] py-24 lg:py-32 overflow-hidden" id="como-funciona">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-600">
            <Clock className="h-3.5 w-3.5" />
            Proceso automatizado
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0f1b2d] sm:text-4xl">
            Como funciona
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            De la deteccion a la adjudicacion en cuatro pasos. Sin fricciones.
          </p>
        </FadeIn>

        <div className="relative mt-20">
          {/* Flowing line -- desktop only */}
          <div className="absolute left-0 right-0 top-20 hidden h-1 lg:block">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-300 via-emerald-300 via-amber-300 to-violet-300 animate-flow-line" />
          </div>
          {/* Flowing line -- mobile: vertical */}
          <div className="absolute left-8 top-0 bottom-0 w-1 lg:hidden">
            <div className="h-full w-full rounded-full bg-gradient-to-b from-blue-300 via-emerald-300 via-amber-300 to-violet-300" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <FadeIn key={step.number} delay={0.15 * (index + 1)}>
                <div className="relative pl-16 lg:pl-0 lg:text-center">
                  {/* Large number behind */}
                  <div className="hidden lg:block absolute -top-8 left-1/2 -translate-x-1/2 text-7xl font-extrabold text-slate-100 select-none">
                    {step.number}
                  </div>
                  {/* Circle */}
                  <div className="absolute -left-16 top-0 lg:relative lg:left-auto lg:top-auto">
                    <div
                      className={`flex h-12 w-12 lg:mx-auto lg:h-16 lg:w-16 items-center justify-center rounded-2xl ${step.bg} ring-4 ring-[#f8fafc] shadow-lg`}
                    >
                      <step.icon className={`h-6 w-6 lg:h-7 lg:w-7 ${step.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 lg:mt-6">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────── Metrics Stats ─────────────── */

function StatsSection() {
  const stats = [
    { value: "$285M+", label: "MXN en contratos gestionados" },
    { value: "34.5%", label: "Tasa de adjudicacion promedio" },
    { value: "4x", label: "Mas rapido que proceso manual" },
    { value: "147", label: "Licitaciones analizadas este trimestre" },
  ]

  return (
    <section className="relative overflow-hidden bg-[#1e3a5f] py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#d97706]/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Resultados que hablan por si solos
          </h2>
        </FadeIn>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={0.1 * (index + 1)}>
              <div className="text-center group">
                <div
                  className="text-4xl font-extrabold text-white lg:text-5xl transition-all group-hover:text-[#d97706]"
                  style={{ textShadow: "0 0 40px rgba(217, 119, 6, 0.15)" }}
                >
                  {stat.value}
                </div>
                <div className="mt-3 text-sm font-medium text-blue-200/70">{stat.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────── Testimonials ─────────────── */

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Antes perdiamos licitaciones por no enterarnos a tiempo. Con LICIMX detectamos oportunidades el mismo dia que se publican. Nuestro win rate subio 40% en 6 meses.",
      name: "Roberto Mendoza Garcia",
      title: "Director Comercial",
      company: "Grupo Industrial Norteno",
      initials: "RM",
      bg: "bg-[#1e3a5f]",
    },
    {
      quote:
        "El scoring nos ahorra horas de analisis. Ahora solo nos enfocamos en licitaciones donde tenemos ventaja competitiva real. Es como tener un analista senior 24/7.",
      name: "Patricia Vazquez Luna",
      title: "Analista de Licitaciones",
      company: "TechSoluciones SA de CV",
      initials: "PV",
      bg: "bg-[#d97706]",
    },
    {
      quote:
        "Implementamos LICIMX hace 8 meses. Pasamos de ganar 2 de cada 10 licitaciones a 4 de cada 10. El ROI se pago en el primer contrato adjudicado.",
      name: "Alejandro Rios Ferrer",
      title: "Director General",
      company: "Construcciones del Bajio",
      initials: "AR",
      bg: "bg-emerald-500",
    },
  ]

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-[#d97706]">
            <Star className="h-3.5 w-3.5" />
            Testimonios
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0f1b2d] sm:text-4xl">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Empresas mexicanas que ya sistematizaron su proceso de licitaciones.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={0.15 * (i + 1)}>
              <div className="relative rounded-2xl bg-white border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#d97706]">
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-[#d97706] text-[#d97706]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${t.bg} text-sm font-bold text-white`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">
                      {t.title} — {t.company}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────── Pricing ─────────────── */

function PricingSection() {
  const [annual, setAnnual] = useState(true)
  const plans = [
    {
      name: "Starter",
      price: "Gratis",
      priceAnnual: "Gratis",
      period: "",
      description: "Para explorar y evaluar la plataforma.",
      features: [
        { text: "5 licitaciones/mes", included: true },
        { text: "Scoring basico", included: true },
        { text: "1 usuario", included: true },
        { text: "Alertas por email", included: true },
        { text: "Pipeline Kanban", included: false },
        { text: "Generacion de propuestas", included: false },
      ],
      cta: "Comenzar Gratis",
      ctaClass: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$2,499",
      priceAnnual: "$1,999",
      period: "MXN/mes",
      description: "Para equipos que quieren ganar mas licitaciones.",
      features: [
        { text: "Licitaciones ilimitadas", included: true },
        { text: "Scoring avanzado con IA", included: true },
        { text: "5 usuarios incluidos", included: true },
        { text: "Pipeline visual Kanban", included: true },
        { text: "Generacion de propuestas", included: true },
        { text: "Soporte prioritario", included: true },
      ],
      cta: "Comenzar Prueba Gratis",
      ctaClass: "bg-[#d97706] text-white shadow-lg shadow-amber-500/20 hover:bg-[#b45309] hover:shadow-xl",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Personalizado",
      priceAnnual: "Personalizado",
      period: "",
      description: "Para organizaciones con operaciones complejas.",
      features: [
        { text: "Todo en Professional", included: true },
        { text: "API de integracion", included: true },
        { text: "Multi-organizacion", included: true },
        { text: "Onboarding dedicado", included: true },
        { text: "SLA garantizado", included: true },
        { text: "Facturacion a medida", included: true },
      ],
      cta: "Contactar Ventas",
      ctaClass: "bg-[#1e3a5f] text-white hover:bg-[#162d4d] shadow-lg shadow-[#1e3a5f]/20",
      highlighted: false,
    },
  ]

  return (
    <section className="bg-[#f8fafc] py-24 lg:py-32" id="precios">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-[#d97706]">
            <BarChart3 className="h-3.5 w-3.5" />
            Planes transparentes
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0f1b2d] sm:text-4xl">
            Invierte en ganar mas contratos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Empieza gratis. Escala cuando lo necesites. Sin compromisos.
          </p>
        </FadeIn>

        {/* Toggle */}
        <FadeIn delay={0.1} className="mt-10 flex items-center justify-center gap-3">
          <span className={`text-sm font-medium ${!annual ? "text-slate-900" : "text-slate-400"}`}>
            Mensual
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative h-7 w-14 rounded-full transition-colors ${
              annual ? "bg-[#d97706]" : "bg-slate-300"
            }`}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                annual ? "translate-x-7" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? "text-slate-900" : "text-slate-400"}`}>
            Anual
            <span className="ml-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
              -20%
            </span>
          </span>
        </FadeIn>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeIn key={plan.name} delay={0.1 * (index + 1)}>
              <div
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "border-[#d97706]/40 bg-white shadow-2xl shadow-amber-200/30 ring-1 ring-[#d97706]/20 lg:scale-105 animate-pulse-glow"
                    : "border-slate-200 bg-white hover:shadow-lg"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#d97706] to-[#b45309] px-4 py-1 text-xs font-bold text-white shadow-md">
                    Mas popular
                  </div>
                )}

                <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#0f1b2d]">
                    {annual ? plan.priceAnnual : plan.price}
                  </span>
                  {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
                </div>
                <p className="mt-3 text-sm text-slate-500">{plan.description}</p>

                <div className="my-8 h-px bg-slate-100" />

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          feature.included ? "text-[#0d9488]" : "text-slate-200"
                        }`}
                      />
                      <span className={feature.included ? "text-slate-600" : "text-slate-300"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`mt-8 block w-full rounded-xl px-6 py-3.5 text-center text-sm font-semibold transition-all active:scale-[0.98] ${plan.ctaClass}`}
                >
                  {plan.cta}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────── FAQ ─────────────── */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const faqs = [
    {
      q: "Funciona con licitaciones estatales y municipales?",
      a: "Si. Ademas de CompraNet (licitaciones federales), nuestros scrapers monitorean portales estatales y el DOF. Estamos expandiendo cobertura constantemente a nuevos portales municipales.",
    },
    {
      q: "Necesito experiencia previa en licitaciones?",
      a: "No. LICIMX esta disenado tanto para equipos experimentados como para empresas que quieren empezar a licitar. El sistema te guia paso a paso con checklists, plantillas y scoring automatico.",
    },
    {
      q: "Como se conecta con CompraNet?",
      a: "Usamos scrapers propios que monitorizan CompraNet cada 4 horas. No necesitas credenciales ni configuracion. Las licitaciones relevantes aparecen automaticamente en tu dashboard.",
    },
    {
      q: "Cuanto tiempo toma implementar LICIMX?",
      a: "El setup inicial toma 5 minutos. Creas tu cuenta, configuras tus filtros de busqueda (sector, monto, entidades) y el sistema empieza a trabajar. En 24 horas ya tienes oportunidades.",
    },
    {
      q: "Que pasa con mis datos y documentos?",
      a: "Tus documentos se almacenan con encriptacion end-to-end en servidores en Mexico. Cumplimos con la Ley Federal de Proteccion de Datos Personales. Solo tu equipo tiene acceso.",
    },
    {
      q: "Puedo cancelar en cualquier momento?",
      a: "Si. No hay contratos de permanencia. Puedes cancelar tu suscripcion en cualquier momento desde tu cuenta. Tu informacion permanece accesible por 30 dias despues de cancelar.",
    },
  ]

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600">
            <MessageSquare className="h-3.5 w-3.5" />
            Preguntas frecuentes
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0f1b2d] sm:text-4xl">
            Resolvemos tus dudas
          </h2>
        </FadeIn>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={0.05 * (i + 1)}>
              <div
                className={`rounded-xl border transition-all duration-300 ${
                  openIndex === i
                    ? "border-[#1e3a5f]/20 bg-[#1e3a5f]/[0.02] shadow-sm"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-slate-800 pr-4">{faq.q}</span>
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      openIndex === i
                        ? "bg-[#1e3a5f] text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {openIndex === i ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? "max-h-60 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="px-6 text-sm leading-relaxed text-slate-500">{faq.a}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────── Final CTA ─────────────── */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#1e3a5f] py-28 lg:py-36" id="contacto">
      {/* Animated mesh background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#d97706]/10 blur-[100px] animate-mesh" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-400/10 blur-[100px] animate-mesh-delay" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            Deja de perder licitaciones
            <br />
            <span className="bg-gradient-to-r from-[#d97706] to-amber-400 bg-clip-text text-transparent">
              que deberias ganar
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-blue-200/80 leading-relaxed">
            Unete a las empresas que ya sistematizaron su proceso de contratacion publica. Detecta,
            califica, prepara y gana.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#d97706] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-[#b45309] hover:shadow-xl active:scale-[0.98]"
            >
              Comenzar Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
            >
              Agendar Demo
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-6 text-sm text-blue-200/50">Sin tarjeta de credito. Setup en 5 minutos.</p>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─────────────── Footer ─────────────── */

function Footer() {
  const footerLinks = [
    {
      title: "Producto",
      links: [
        { label: "Deteccion", href: "#producto" },
        { label: "Scoring", href: "#producto" },
        { label: "Pipeline", href: "#producto" },
        { label: "Propuestas", href: "#producto" },
        { label: "Analitica", href: "#producto" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { label: "Blog", href: "#" },
        { label: "Guias", href: "#" },
        { label: "API Docs", href: "#" },
        { label: "Changelog", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacidad", href: "#" },
        { label: "Terminos", href: "#" },
        { label: "Cookies", href: "#" },
        { label: "Seguridad", href: "#" },
      ],
    },
    {
      title: "Contacto",
      links: [
        { label: "Ventas", href: "#contacto" },
        { label: "Soporte", href: "#" },
        { label: "Twitter / X", href: "#" },
        { label: "LinkedIn", href: "#" },
      ],
    },
  ]

  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand -- 2 cols */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]">
                <Shield className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#1e3a5f]">LICIMX</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 max-w-xs">
              La maquina de licitaciones de Mexico. Detecta, califica, prepara y gana contratos
              gubernamentales con tecnologia.
            </p>
            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              {["X", "Li", "Fb", "Ig"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-xs font-bold text-slate-400 transition-colors hover:bg-[#1e3a5f] hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-400">Hecho en Mexico 🇲🇽</p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-sm font-semibold text-slate-900">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-[#1e3a5f]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} LICIMX. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600">
              Privacidad
            </a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600">
              Terminos
            </a>
            <a href="#" className="text-sm text-slate-400 hover:text-slate-600">
              Seguridad
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────── Page ─────────────── */

export default function MarketingPage() {
  return (
    <div className="bg-white text-slate-900">
      <Hero />
      <SocialProofBar />
      <ProblemSection />
      <ProductShowcase />
      <FeaturesGrid />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
    </div>
  )
}
