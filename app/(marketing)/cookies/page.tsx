export default function CookiesPage() {
  return (
    <div className="bg-white pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1e3a5f] sm:text-5xl">
            Política de Cookies
          </h1>
          <p className="mt-4 text-slate-500">
            Última actualización: 1 de marzo de 2026
          </p>
        </div>

        {/* Content */}
        <div className="mt-12 space-y-10 text-slate-600 leading-relaxed">
          <p>
            Esta Política de Cookies explica qué son las cookies, qué tipos de cookies utilizamos
            en LICIMX y cómo puedes gestionarlas. Te recomendamos leer esta política junto con nuestra{" "}
            <a href="/privacidad" className="text-[#d97706] hover:underline font-medium">
              Política de Privacidad
            </a>.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">¿Qué son las cookies?</h2>
            <p className="mt-4">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando
              visitas un sitio web. Son ampliamente utilizadas para que los sitios web funcionen
              correctamente, mejorar la experiencia del usuario y proporcionar información a los
              propietarios del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Tipos de cookies que utilizamos</h2>

            {/* Esenciales */}
            <div className="mt-6 rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]/10 text-sm font-bold text-[#1e3a5f]">1</span>
                <h3 className="text-lg font-bold text-[#1e3a5f]">Cookies esenciales</h3>
                <span className="rounded-full bg-[#0d9488]/10 px-2.5 py-0.5 text-xs font-medium text-[#0d9488]">Siempre activas</span>
              </div>
              <p className="mt-3 text-sm">
                Son necesarias para el funcionamiento básico de la plataforma. Sin ellas, no podrías
                iniciar sesión, navegar entre páginas ni utilizar funciones esenciales del servicio.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-2 text-left font-semibold text-slate-900">Cookie</th>
                      <th className="pb-2 text-left font-semibold text-slate-900">Propósito</th>
                      <th className="pb-2 text-left font-semibold text-slate-900">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr>
                      <td className="py-2 font-mono text-xs">session_id</td>
                      <td className="py-2">Mantener tu sesión activa</td>
                      <td className="py-2">Sesión</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-xs">csrf_token</td>
                      <td className="py-2">Protección contra ataques CSRF</td>
                      <td className="py-2">Sesión</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-xs">cookie_consent</td>
                      <td className="py-2">Recordar tus preferencias de cookies</td>
                      <td className="py-2">1 año</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analytics */}
            <div className="mt-4 rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]/10 text-sm font-bold text-[#1e3a5f]">2</span>
                <h3 className="text-lg font-bold text-[#1e3a5f]">Cookies de analítica</h3>
                <span className="rounded-full bg-[#d97706]/10 px-2.5 py-0.5 text-xs font-medium text-[#d97706]">Opcionales</span>
              </div>
              <p className="mt-3 text-sm">
                Nos ayudan a entender cómo los visitantes interactúan con nuestra plataforma,
                permitiéndonos mejorar la experiencia de usuario y el rendimiento del sitio.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-2 text-left font-semibold text-slate-900">Cookie</th>
                      <th className="pb-2 text-left font-semibold text-slate-900">Propósito</th>
                      <th className="pb-2 text-left font-semibold text-slate-900">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr>
                      <td className="py-2 font-mono text-xs">_ga</td>
                      <td className="py-2">Google Analytics - identificar usuarios únicos</td>
                      <td className="py-2">2 años</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-xs">_ga_*</td>
                      <td className="py-2">Google Analytics - mantener estado de sesión</td>
                      <td className="py-2">2 años</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Funcionales */}
            <div className="mt-4 rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]/10 text-sm font-bold text-[#1e3a5f]">3</span>
                <h3 className="text-lg font-bold text-[#1e3a5f]">Cookies funcionales</h3>
                <span className="rounded-full bg-[#d97706]/10 px-2.5 py-0.5 text-xs font-medium text-[#d97706]">Opcionales</span>
              </div>
              <p className="mt-3 text-sm">
                Permiten funcionalidades mejoradas y personalización, como recordar tus preferencias
                de idioma, tema visual o configuración de filtros.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-2 text-left font-semibold text-slate-900">Cookie</th>
                      <th className="pb-2 text-left font-semibold text-slate-900">Propósito</th>
                      <th className="pb-2 text-left font-semibold text-slate-900">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr>
                      <td className="py-2 font-mono text-xs">theme_pref</td>
                      <td className="py-2">Recordar preferencia de tema (claro/oscuro)</td>
                      <td className="py-2">1 año</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-xs">filter_state</td>
                      <td className="py-2">Guardar configuración de filtros del dashboard</td>
                      <td className="py-2">30 días</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Cómo gestionar las cookies</h2>
            <p className="mt-4">
              Puedes controlar y gestionar las cookies de varias formas:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li><strong>Configuración del navegador:</strong> la mayoría de los navegadores te permiten ver, eliminar y bloquear cookies desde su configuración. Ten en cuenta que bloquear cookies esenciales puede afectar el funcionamiento de la plataforma.</li>
              <li><strong>Panel de preferencias:</strong> puedes actualizar tus preferencias de cookies en cualquier momento desde la configuración de tu cuenta en LICIMX.</li>
              <li><strong>Opt-out de analítica:</strong> puedes instalar el complemento de inhabilitación de Google Analytics para evitar el seguimiento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Cookies de terceros</h2>
            <p className="mt-4">
              Algunos de nuestros proveedores de servicio pueden establecer cookies en tu dispositivo
              cuando visitas nuestra plataforma. Estos terceros incluyen:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li><strong>Google Analytics:</strong> para análisis de tráfico y comportamiento de usuarios.</li>
              <li><strong>Stripe:</strong> para el procesamiento seguro de pagos.</li>
              <li><strong>Intercom:</strong> para soporte al cliente en tiempo real.</li>
            </ul>
            <p className="mt-3">
              No tenemos control sobre las cookies de terceros. Te recomendamos revisar las políticas
              de privacidad de cada proveedor para más información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Cambios a esta política</h2>
            <p className="mt-4">
              Podemos actualizar esta Política de Cookies periódicamente. Te notificaremos sobre
              cambios significativos a través de un aviso en nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Contacto</h2>
            <p className="mt-4">
              Si tienes preguntas sobre nuestra Política de Cookies, contáctanos en{" "}
              <a href="mailto:privacidad@licimx.com" className="text-[#d97706] hover:underline font-medium">
                privacidad@licimx.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
