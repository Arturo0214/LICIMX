"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, Menu, X } from "lucide-react"

const navLinks = [
  { label: "Producto", href: "/#producto" },
  { label: "Cómo Funciona", href: "/#como-funciona" },
  { label: "Precios", href: "/#precios" },
  { label: "Contacto", href: "/contacto" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]">
            <Shield className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#1e3a5f]">
            LICIMX
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-[#1e3a5f]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#1e3a5f]"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-[#d97706] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#b45309] hover:shadow-md active:scale-[0.98]"
          >
            Comenzar Gratis
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xl px-6 pb-6 pt-4 md:hidden animate-fade-in-up transition-all duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-base font-medium text-slate-700"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="text-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
            >
              Iniciar Sesión
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
