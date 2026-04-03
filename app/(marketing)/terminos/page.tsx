export default function TerminosPage() {
  return (
    <div className="bg-white pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1e3a5f] sm:text-5xl">
            Términos de Servicio
          </h1>
          <p className="mt-4 text-slate-500">
            Última actualización: 1 de marzo de 2026
          </p>
        </div>

        {/* Content */}
        <div className="mt-12 space-y-10 text-slate-600 leading-relaxed">
          <p>
            Estos Términos de Servicio (&quot;Términos&quot;) rigen el uso de la plataforma LICIMX
            (&quot;el Servicio&quot;), operada por LICIMX Technologies, S.A. de C.V. (&quot;LICIMX&quot;,
            &quot;nosotros&quot;). Al acceder o utilizar el Servicio, aceptas estos Términos en su totalidad.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">1. Definiciones</h2>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li><strong>&quot;Usuario&quot;:</strong> toda persona física o moral que se registre y utilice la plataforma.</li>
              <li><strong>&quot;Cuenta&quot;:</strong> el registro individual que permite al Usuario acceder al Servicio.</li>
              <li><strong>&quot;Contenido&quot;:</strong> toda información, datos, textos y materiales disponibles en la plataforma.</li>
              <li><strong>&quot;Suscripción&quot;:</strong> el plan contratado por el Usuario para acceder a las funcionalidades del Servicio.</li>
              <li><strong>&quot;Datos del Usuario&quot;:</strong> toda información que el Usuario introduzca, cargue o genere en la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">2. Uso del servicio</h2>
            <p className="mt-4">Al utilizar LICIMX, te comprometes a:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Utilizar el Servicio únicamente para fines lícitos relacionados con la gestión de licitaciones públicas.</li>
              <li>No intentar acceder a áreas restringidas de la plataforma o eludir medidas de seguridad.</li>
              <li>No reproducir, distribuir o revender el Contenido de la plataforma sin autorización previa.</li>
              <li>No utilizar herramientas automatizadas (bots, scrapers) para extraer información del Servicio.</li>
              <li>Mantener la confidencialidad de tus credenciales de acceso.</li>
              <li>Proporcionar información veraz y actualizada en tu perfil y documentación.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">3. Cuentas de usuario</h2>
            <p className="mt-4">
              Para utilizar el Servicio, debes crear una Cuenta proporcionando información veraz y completa.
              Eres responsable de toda actividad que ocurra bajo tu Cuenta. Debes notificarnos
              inmediatamente si sospechas de uso no autorizado.
            </p>
            <p className="mt-3">
              Nos reservamos el derecho de suspender o cancelar Cuentas que violen estos Términos,
              previo aviso al Usuario salvo en casos de violaciones graves que requieran acción inmediata.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">4. Planes y facturación</h2>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>LICIMX ofrece planes gratuitos y de pago. Las funcionalidades de cada plan se describen en nuestra página de precios.</li>
              <li>Los planes de pago se facturan de forma mensual o anual, según la opción seleccionada.</li>
              <li>Los precios están expresados en pesos mexicanos (MXN) más el IVA correspondiente.</li>
              <li>El pago se procesa de forma segura a través de proveedores de pago certificados.</li>
              <li>Puedes cancelar tu suscripción en cualquier momento. La cancelación será efectiva al final del período de facturación vigente.</li>
              <li>No ofrecemos reembolsos por períodos parciales, salvo lo requerido por la ley aplicable.</li>
              <li>Nos reservamos el derecho de modificar los precios con 30 días de aviso previo.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">5. Propiedad intelectual</h2>
            <p className="mt-4">
              La plataforma LICIMX, incluyendo su código fuente, diseño, logotipos, textos, algoritmos
              y demás elementos, son propiedad exclusiva de LICIMX Technologies, S.A. de C.V. y están
              protegidos por las leyes de propiedad intelectual de México y tratados internacionales.
            </p>
            <p className="mt-3">
              Los Datos del Usuario son propiedad del Usuario. Al utilizar el Servicio, nos otorgas
              una licencia limitada, no exclusiva y revocable para procesar tus datos únicamente con
              el fin de proporcionarte el Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">6. Limitación de responsabilidad</h2>
            <p className="mt-4">
              LICIMX proporciona información sobre licitaciones públicas con fines informativos.
              No garantizamos:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>La exactitud, integridad o actualidad de la información de licitaciones obtenida de fuentes gubernamentales.</li>
              <li>Resultados específicos en procesos de licitación.</li>
              <li>La disponibilidad ininterrumpida del Servicio (aunque nos esforzamos por mantener un uptime del 99.9%).</li>
            </ul>
            <p className="mt-3">
              En ningún caso la responsabilidad total de LICIMX excederá el monto pagado por el
              Usuario en los últimos 12 meses de suscripción. Esta limitación aplica en la máxima
              medida permitida por la ley aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">7. Terminación</h2>
            <p className="mt-4">
              Puedes cancelar tu Cuenta en cualquier momento desde la configuración de tu perfil.
              Podemos suspender o terminar tu acceso si:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Violas estos Términos de Servicio.</li>
              <li>Utilizas el Servicio para actividades ilícitas.</li>
              <li>No pagas tu suscripción después de los períodos de gracia establecidos.</li>
            </ul>
            <p className="mt-3">
              Tras la terminación, tendrás 30 días para exportar tus datos. Después de este período,
              procederemos a eliminar tus datos de acuerdo con nuestra Política de Privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">8. Ley aplicable y jurisdicción</h2>
            <p className="mt-4">
              Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier
              controversia derivada de estos Términos será sometida a la jurisdicción de los
              tribunales competentes de la Ciudad de México, renunciando las partes a cualquier
              otro fuero que pudiera corresponderles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">9. Modificaciones</h2>
            <p className="mt-4">
              Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios
              serán notificados a través de la plataforma o por correo electrónico con al menos 30
              días de anticipación. El uso continuado del Servicio tras la entrada en vigor de las
              modificaciones constituye la aceptación de los nuevos Términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">10. Contacto</h2>
            <p className="mt-4">
              Para consultas sobre estos Términos de Servicio:
            </p>
            <ul className="mt-3 space-y-2">
              <li><strong>LICIMX Technologies, S.A. de C.V.</strong></li>
              <li><strong>Email:</strong>{" "}
                <a href="mailto:legal@licimx.com" className="text-[#d97706] hover:underline font-medium">
                  legal@licimx.com
                </a>
              </li>
              <li><strong>Dirección:</strong> Ciudad de México, México</li>
              <li><strong>Teléfono:</strong> +52 55 1234 5678</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
