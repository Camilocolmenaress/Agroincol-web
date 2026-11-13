import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react';
import { BUSINESS, SERVICES } from '@/lib/constants';

// Pie del sitio (manual v2): logo horizontal blanco a todo el ancho sobre Verde Letra Clara,
// el símbolo en línea y las mismas columnas, textos y enlaces del pie anterior (mismo orden).
// Manual: nada de texto pequeño en naranja sobre verde; el naranja queda en íconos y subrayados.
const enlace =
  'text-white/70 text-body-sm underline-offset-4 decoration-marca-naranja decoration-2 transition-colors hover:text-white hover:underline';
const titulo = 'font-display text-white text-sm uppercase tracking-[0.14em] mb-4';
const dato = 'text-white/70 text-body-sm';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-marca-letra">
      <div className="container-custom pt-14 md:pt-20">
        {/* Logo oficial gigante. Es el único logo del pie: mismo alt que antes. */}
        <Link href="/" className="block">
          <Image
            src="/images/logos/v2/agroincol-logo-horizontal-blanca.svg"
            alt="AGROINCOL"
            width={1100}
            height={405}
            className="h-auto w-full max-w-[1100px]"
          />
        </Link>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-white/10 pt-12 md:mt-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Columna 1 — Marca: el símbolo en línea, como la mascota del pie */}
          <div>
            <span
              className="block h-14 w-14 bg-[url('/images/logos/v2/agroincol-logo-simbolo-blanco.svg')] bg-contain bg-no-repeat"
              aria-hidden
            />
            <p className="mt-5 font-display text-lg uppercase tracking-[0.04em] text-white">{BUSINESS.slogan}</p>
            <p className={`${dato} mt-3`}>
              Empresa de fumigación y control de plagas líder en el Área Metropolitana de Bucaramanga.
              Servicio certificado conforme al Decreto 1843 de 1991.
            </p>
          </div>

          {/* Columna 2 — Servicios */}
          <div>
            <h3 className={titulo}>Servicios</h3>
            <ul className="space-y-2">
              {SERVICES.map((service) =>
                'hasPage' in service && service.hasPage && 'href' in service ? (
                  <li key={service.slug}>
                    <Link href={service.href} className={enlace}>
                      {service.title}
                    </Link>
                  </li>
                ) : (
                  <li key={service.slug}>
                    <span className={dato}>{service.title}</span>
                  </li>
                )
              )}
              <li>
                <Link href="/precios" className={enlace}>
                  Cotización
                </Link>
              </li>
              {/* Alivio — zona externa (/alivio). <a> obligatorio para cruzar de zona.
                  Enlace y estilo sin cambios hasta que se decida qué pasa con Alivio. */}
              <li>
                <a
                  href="/alivio"
                  className="inline-flex items-center gap-2 text-body-sm font-semibold text-[#1FB3A7] transition-colors hover:text-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1FB3A7]" aria-hidden />
                  Alivio · Lavado de muebles
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3 — Normativa, herramientas y zonas */}
          <div>
            <h3 className={titulo}>Normativa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/certificaciones-y-normativa" className={enlace}>
                  Certificaciones y Normativa
                </Link>
              </li>
              <li>
                <span className={dato}>Decreto 1843 de 1991</span>
              </li>
              <li>
                <span className={dato}>Resolución 2674 de 2013</span>
              </li>
              <li>
                <Link href="/politica-de-privacidad" className={enlace}>
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/herramientas/calculadora-fumigacion" className={enlace}>
                  Calculadora de Fumigación
                </Link>
              </li>
              <li>
                <Link href="/blog" className={enlace}>
                  Blog
                </Link>
              </li>
            </ul>

            <h3 className={`${titulo} mt-8`}>Zonas de Servicio</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/zonas/fumigacion-bucaramanga" className={enlace}>
                  Fumigación en Bucaramanga
                </Link>
              </li>
              <li>
                <Link href="/zonas/fumigacion-floridablanca" className={enlace}>
                  Fumigación en Floridablanca
                </Link>
              </li>
              <li>
                <Link href="/zonas/fumigacion-piedecuesta" className={enlace}>
                  Fumigación en Piedecuesta
                </Link>
              </li>
              <li>
                <Link href="/zonas/fumigacion-giron" className={enlace}>
                  Fumigación en Girón
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4 — Contacto */}
          <div>
            <h3 className={titulo}>Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-marca-naranja" aria-hidden />
                <span className={dato}>{BUSINESS.address.full}</span>
              </li>
              <li>
                <a href={`tel:${BUSINESS.phoneRaw}`} className={`flex items-center gap-3 ${enlace}`}>
                  <Phone size={18} className="shrink-0 text-marca-naranja" aria-hidden />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a href={BUSINESS.whatsappLink} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 ${enlace}`}>
                  <MessageCircle size={18} className="shrink-0 text-marca-naranja" aria-hidden />
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-marca-naranja" aria-hidden />
                <div className={dato}>
                  <p>L-V: {BUSINESS.hours.weekdays}</p>
                  <p>Sáb: {BUSINESS.hours.saturday}</p>
                  <p>Dom: {BUSINESS.hours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="mt-14 border-t border-white/10">
        <div className="container-custom py-6">
          <p className="text-center text-body-sm text-white/55">
            © {new Date().getFullYear()} AGROINCOL. Todos los derechos reservados. Fumigación y control de plagas en Bucaramanga, Santander.
          </p>
        </div>
      </div>
    </footer>
  );
}
