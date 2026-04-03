import Link from "next/link"
import { Shield } from "lucide-react"

const footerLinks = [
  {
    title: "Producto",
    links: [
      { label: "Detección", href: "/#producto" },
      { label: "Scoring", href: "/#producto" },
      { label: "Pipeline", href: "/#producto" },
      { label: "Propuestas", href: "/#producto" },
      { label: "Analítica", href: "/#producto" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Guías", href: "/guias" },
      { label: "API Docs", href: "#" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: "Ventas", href: "/contacto" },
      { label: "Soporte", href: "/contacto" },
      { label: "Twitter / X", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white" id="contacto">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]">
                <Shield className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#1e3a5f]">
                LICIMX
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              La máquina de licitaciones de México. Detecta, califica, prepara y
              gana.
            </p>
            <p className="mt-6 text-sm text-slate-400">
              Hecho en México
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-sm font-semibold text-slate-900">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-[#1e3a5f]"
                    >
                      {link.label}
                    </Link>
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
            <Link href="/privacidad" className="text-sm text-slate-400 hover:text-slate-600">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-sm text-slate-400 hover:text-slate-600">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
