"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Shield,
  BarChart3,
  FileText,
  Zap,
  Lock,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: BarChart3,
    title: "Scoring inteligente",
    description: "Evalua automaticamente cada licitacion con IA",
  },
  {
    icon: FileText,
    title: "Gestion documental",
    description: "Organiza y genera propuestas en minutos",
  },
  {
    icon: Zap,
    title: "Alertas en tiempo real",
    description: "Nunca pierdas una fecha limite importante",
  },
  {
    icon: Lock,
    title: "Seguridad empresarial",
    description: "Datos cifrados y acceso controlado por roles",
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel - Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0f1d32] p-12 lg:flex">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(217,119,6,0.12)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(30,58,95,0.2)_0%,_transparent_50%)]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              LICIMX
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
              La maquina de
              <br />
              licitaciones de
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Mexico
              </span>
            </h1>
            <p className="max-w-md text-lg text-slate-400">
              Gestiona, analiza y gana mas licitaciones publicas con
              inteligencia artificial.
            </p>
          </div>

          <div className="grid gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                  <feature.icon className="h-4.5 w-4.5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {feature.title}
                  </p>
                  <p className="text-sm text-slate-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-slate-600">
            &copy; 2026 LICIMX. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex w-full flex-col items-center justify-center bg-background px-6 lg:w-1/2">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            LICIMX
          </span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Iniciar sesion
            </h2>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Correo electronico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                className="flex h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Contrasena
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Olvidaste tu contrasena?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <button
              type="submit"
              className={cn(
                "flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
              )}
            >
              Iniciar sesion
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            No tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
