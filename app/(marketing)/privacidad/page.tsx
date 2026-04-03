export default function PrivacidadPage() {
  return (
    <div className="bg-white pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1e3a5f] sm:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-slate-500">
            Última actualización: 1 de marzo de 2026
          </p>
        </div>

        {/* Content */}
        <div className="mt-12 space-y-10 text-slate-600 leading-relaxed">
          <p>
            En LICIMX (&quot;nosotros&quot;, &quot;nuestro&quot; o &quot;la Plataforma&quot;), nos comprometemos a proteger la
            privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos,
            usamos, almacenamos y protegemos tu información personal de acuerdo con la Ley Federal
            de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">1. Información que recopilamos</h2>
            <p className="mt-4">Recopilamos los siguientes tipos de información:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li><strong>Datos de identificación:</strong> nombre completo, correo electrónico, número telefónico y nombre de la empresa.</li>
              <li><strong>Datos de la cuenta:</strong> credenciales de acceso, preferencias de configuración y plan de suscripción.</li>
              <li><strong>Datos de uso:</strong> interacciones con la plataforma, licitaciones consultadas, propuestas generadas y actividad en el pipeline.</li>
              <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo, dispositivo y datos de ubicación aproximada.</li>
              <li><strong>Datos de facturación:</strong> información de pago procesada de forma segura a través de nuestros proveedores de pago certificados.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">2. Cómo usamos la información</h2>
            <p className="mt-4">Utilizamos tu información personal para:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Proveer, mantener y mejorar nuestros servicios de monitoreo y gestión de licitaciones.</li>
              <li>Personalizar tu experiencia, incluyendo el scoring de licitaciones y recomendaciones.</li>
              <li>Procesar pagos y administrar tu suscripción.</li>
              <li>Enviarte notificaciones sobre licitaciones relevantes y actualizaciones del servicio.</li>
              <li>Comunicaciones de marketing (con tu consentimiento previo).</li>
              <li>Cumplir con obligaciones legales y regulatorias.</li>
              <li>Mejorar nuestros algoritmos de inteligencia artificial y scoring.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">3. Compartición de datos</h2>
            <p className="mt-4">
              No vendemos tu información personal. Podemos compartir datos con:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li><strong>Proveedores de servicio:</strong> empresas que nos ayudan a operar la plataforma (hosting, procesamiento de pagos, análisis).</li>
              <li><strong>Autoridades:</strong> cuando sea requerido por ley, orden judicial o proceso legal.</li>
              <li><strong>Socios comerciales:</strong> solo con tu consentimiento explícito.</li>
            </ul>
            <p className="mt-3">
              Todos nuestros proveedores están obligados contractualmente a proteger tu información
              y solo pueden utilizarla para los fines específicos que les encomendamos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">4. Seguridad</h2>
            <p className="mt-4">
              Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger
              tu información, incluyendo:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Cifrado de datos en tránsito (TLS 1.3) y en reposo (AES-256).</li>
              <li>Autenticación de dos factores (2FA) disponible para todas las cuentas.</li>
              <li>Auditorías de seguridad periódicas y pruebas de penetración.</li>
              <li>Acceso restringido a datos personales solo al personal autorizado.</li>
              <li>Respaldos automáticos y plan de recuperación ante desastres.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">5. Cookies</h2>
            <p className="mt-4">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Para más
              información, consulta nuestra{" "}
              <a href="/cookies" className="text-[#d97706] hover:underline font-medium">
                Política de Cookies
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">6. Derechos ARCO</h2>
            <p className="mt-4">
              De acuerdo con la LFPDPPP, tienes derecho a:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li><strong>Acceso:</strong> conocer qué datos personales tenemos y cómo los usamos.</li>
              <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
              <li><strong>Cancelación:</strong> pedir la eliminación de tus datos personales.</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos para fines específicos.</li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, envía una solicitud a{" "}
              <a href="mailto:privacidad@licimx.com" className="text-[#d97706] hover:underline font-medium">
                privacidad@licimx.com
              </a>{" "}
              incluyendo tu nombre completo, descripción del derecho que deseas ejercer y una copia
              de tu identificación oficial. Responderemos en un plazo máximo de 20 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">7. Retención de datos</h2>
            <p className="mt-4">
              Conservamos tu información personal durante el tiempo que mantengas una cuenta activa
              o según sea necesario para proporcionarte nuestros servicios. Tras la cancelación de
              tu cuenta, retenemos ciertos datos durante 5 años para cumplir con obligaciones legales
              y fiscales aplicables en México.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">8. Cambios a esta política</h2>
            <p className="mt-4">
              Nos reservamos el derecho de actualizar esta Política de Privacidad. Te notificaremos
              sobre cambios significativos a través de la plataforma o por correo electrónico con al
              menos 30 días de anticipación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">9. Contacto</h2>
            <p className="mt-4">
              Si tienes preguntas sobre esta Política de Privacidad o sobre el tratamiento de tus
              datos personales, contáctanos:
            </p>
            <ul className="mt-3 space-y-2">
              <li><strong>Responsable:</strong> LICIMX Technologies, S.A. de C.V.</li>
              <li><strong>Email:</strong>{" "}
                <a href="mailto:privacidad@licimx.com" className="text-[#d97706] hover:underline font-medium">
                  privacidad@licimx.com
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
