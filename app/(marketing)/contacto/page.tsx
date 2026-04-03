"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Building2, ChevronDown, ChevronUp, Send } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    label: "Ventas",
    value: "ventas@licimx.com",
    href: "mailto:ventas@licimx.com",
  },
  {
    icon: Mail,
    label: "Soporte",
    value: "soporte@licimx.com",
    href: "mailto:soporte@licimx.com",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+52 55 1234 5678",
    href: "tel:+525512345678",
  },
  {
    icon: MapPin,
    label: "Dirección",
    value: "Ciudad de México, México",
    href: null,
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lunes a Viernes, 9:00 - 18:00 CST",
    href: null,
  },
]

const faqs = [
  {
    question: "¿LICIMX ofrece una prueba gratuita?",
    answer: "Sí, ofrecemos un plan gratuito que te permite explorar las funcionalidades básicas de la plataforma, incluyendo el monitoreo de hasta 5 licitaciones activas. También puedes solicitar una demo personalizada con nuestro equipo.",
  },
  {
    question: "¿Cuánto tiempo tarda la implementación?",
    answer: "LICIMX es una plataforma SaaS lista para usar. Puedes crear tu cuenta y empezar a monitorear licitaciones en menos de 5 minutos. Para equipos empresariales, ofrecemos onboarding personalizado que toma entre 1 y 3 días hábiles.",
  },
  {
    question: "¿Pueden facturar a mi empresa?",
    answer: "Por supuesto. Emitimos facturas CFDI válidas ante el SAT. Aceptamos pagos con tarjeta de crédito, débito y transferencia bancaria. Para planes Enterprise, también ofrecemos facturación por orden de compra.",
  },
  {
    question: "¿Qué fuentes de licitaciones monitorean?",
    answer: "Monitoreamos CompraNet (licitaciones federales), los portales de compras de los 32 estados, así como licitaciones de organismos descentralizados y empresas productivas del estado. Nuestro sistema se actualiza cada 15 minutos.",
  },
]

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    tipo: "ventas",
    mensaje: "",
  })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-white pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[#1e3a5f]/10 px-4 py-1.5 text-sm font-semibold text-[#1e3a5f]">
            Contacto
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#1e3a5f] sm:text-5xl">
            Contacto
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            ¿Tienes preguntas? Estamos aquí para ayudarte
          </p>
        </div>

        {/* Two columns */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* Contact form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0d9488]/10">
                  <Send className="h-8 w-8 text-[#0d9488]" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-[#1e3a5f]">Mensaje enviado</h3>
                <p className="mt-3 text-slate-600">
                  Gracias por contactarnos. Nuestro equipo te responderá en un plazo máximo de 24 horas hábiles.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ nombre: "", email: "", empresa: "", tipo: "ventas", mensaje: "" }) }}
                  className="mt-6 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#15294a]"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-[#1e3a5f]">Envíanos un mensaje</h2>

                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="empresa" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Empresa
                  </label>
                  <input
                    id="empresa"
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Tipo de consulta
                  </label>
                  <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
                  >
                    <option value="ventas">Ventas</option>
                    <option value="soporte">Soporte técnico</option>
                    <option value="general">Consulta general</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    required
                    rows={4}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#d97706] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#b45309] hover:shadow-md active:scale-[0.98]"
                >
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#1e3a5f]">Información de contacto</h2>
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1e3a5f]/10">
                    <item.icon className="h-5 w-5 text-[#1e3a5f]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-base font-semibold text-[#1e3a5f] hover:text-[#d97706] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-base font-semibold text-[#1e3a5f]">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mini map placeholder */}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                <div className="text-center">
                  <Building2 className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-400">Ciudad de México, México</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold text-[#1e3a5f]">
            Preguntas frecuentes
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-[#1e3a5f]">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="border-t border-slate-100 px-6 py-4">
                    <p className="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
