'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { BUSINESS, NAV_LINKS } from '@/lib/constants';
import Button from '@/components/ui/Button';

// Accesos por segmento (aprobados en la fase 0): las mismas rutas que las tarjetas del home.
const SEGMENTOS = [
  { label: 'Hogar', href: '/servicios/fumigacion-residencial' },
  { label: 'Restaurantes', href: '/servicios/fumigacion-restaurantes' },
  { label: 'Empresas', href: '/servicios/fumigacion-industrial' },
] as const;

// Punto de gel: el separador de la marca (círculo naranja pequeño).
function PuntoGel() {
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-marca-naranja" aria-hidden />;
}

// En celular va solo el ícono (círculo de 44 px) para que el logo quede centrado de verdad.
function BotonMenu({ abierto, onClick, compacto = false, className = '' }: { abierto: boolean; onClick: () => void; compacto?: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={abierto}
      aria-controls="menu-sitio"
      aria-label={compacto ? (abierto ? 'Cerrar menú' : 'Abrir menú') : undefined}
      className={`h-11 items-center justify-center gap-2 rounded-full border-2 border-marca-verde font-display text-[0.8rem] uppercase tracking-[0.12em] text-marca-verde transition-colors hover:bg-marca-verde hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marca-verde/40 ${compacto ? 'w-11' : 'px-4'} ${className}`}
    >
      <span className="relative block h-2.5 w-3.5" aria-hidden>
        <span className={`absolute left-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ${abierto ? 'top-1 rotate-45' : 'top-0'}`} />
        <span className={`absolute left-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ${abierto ? 'top-1 -rotate-45' : 'top-2'}`} />
      </span>
      {!compacto && (abierto ? 'Cerrar' : 'Menú')}
    </button>
  );
}

// Cabecera del sitio (manual v2). Segmentos a la izquierda, logo oficial centrado, menú y WhatsApp
// a la derecha. El menú completo va en el HTML del servidor aunque esté cerrado: son los mismos
// enlaces de la cabecera anterior, en el mismo orden, para no mover el enlazado interno.
// Sin backdrop-filter: en iOS atrapa el position:fixed del panel.
export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const [conSombra, setConSombra] = useState(false);
  // No todas las páginas tienen formulario (#contacto): sin él, el CTA lleva al del home.
  const [ctaHref, setCtaHref] = useState('#contacto');
  const pathname = usePathname();

  useEffect(() => {
    const alDesplazar = () => setConSombra(window.scrollY > 8);
    alDesplazar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  useEffect(() => {
    setAbierto(false);
    setCtaHref(document.getElementById('contacto') ? '#contacto' : '/#contacto');
  }, [pathname]);

  // Menú abierto: bloquea el scroll de fondo y cierra con Escape.
  useEffect(() => {
    if (!abierto) return;
    document.body.style.overflow = 'hidden';
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', alTeclear);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', alTeclear);
    };
  }, [abierto]);

  const alternar = () => setAbierto((v) => !v);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ${conSombra || abierto ? 'shadow-soft' : ''}`}
    >
      <nav aria-label="Principal" className="container-custom grid h-[72px] grid-cols-[1fr_auto_1fr] items-center md:h-[88px]">
        {/* Izquierda: menú en celular; segmentos en escritorio */}
        <div className="flex items-center">
          <BotonMenu abierto={abierto} onClick={alternar} compacto className="inline-flex lg:hidden" />
          <ul className="hidden items-center gap-3 lg:flex">
            {SEGMENTOS.map((s, i) => (
              <li key={s.href} className="flex items-center gap-3">
                {i > 0 && <PuntoGel />}
                <Link
                  href={s.href}
                  className={`font-body text-[0.9rem] font-bold transition-colors hover:text-marca-verde ${
                    pathname === s.href ? 'text-marca-verde underline decoration-marca-naranja decoration-2 underline-offset-[6px]' : 'text-marca-letra'
                  }`}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Centro: logo oficial (SVG del manual, nunca redibujado). Horizontal ≥ 160 px. */}
        <Link href="/" className="block shrink-0">
          <Image
            src="/images/logos/v2/agroincol-logo-horizontal.svg"
            alt="AGROINCOL — Fumigación y Control de Plagas"
            width={200}
            height={74}
            priority
            className="h-auto w-[160px] md:w-[200px]"
          />
        </Link>

        {/* Derecha: menú (escritorio) y WhatsApp siempre visible */}
        <div className="flex items-center justify-end gap-2">
          <BotonMenu abierto={abierto} onClick={alternar} className="hidden lg:inline-flex" />
          <a
            href={BUSINESS.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cotizar por WhatsApp"
            data-cta="header-whatsapp"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-marca-naranja text-white shadow-brand transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marca-naranja/50 focus-visible:ring-offset-2 md:h-12 md:w-12"
          >
            <MessageCircle size={20} fill="currentColor" aria-hidden />
          </a>
        </div>
      </nav>

      {/* Panel del menú: en el DOM siempre (SEO), visible solo al abrir. */}
      <div
        id="menu-sitio"
        className={`fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-marca-verde md:top-[88px] ${abierto ? 'block motion-safe:animate-fade-in-up' : 'hidden'}`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/patrones/patron-gel-oscuro.webp')] bg-[length:420px] opacity-25"
          aria-hidden
        />
        <div className="container-custom relative flex flex-col gap-10 py-10 md:gap-14 md:py-14">
          <ul className="flex flex-col gap-1 md:gap-2">
            {NAV_LINKS.map((link) => {
              const activo = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setAbierto(false)}
                    className={`group inline-flex items-center gap-4 font-display text-[clamp(2rem,6.5vw,4.25rem)] uppercase leading-[1.02] tracking-[-0.02em] transition-colors ${
                      activo ? 'text-marca-naranja' : 'text-white hover:text-marca-naranja'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Alivio — zona externa (/alivio). <a> obligatorio: <Link> rompe el cruce de zonas.
                Enlace y estilo sin cambios hasta que se decida qué pasa con Alivio. */}
            <a
              href="/alivio"
              className="inline-flex items-center gap-1.5 text-sm font-body font-semibold text-[#1FB3A7] transition-colors duration-200 hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#1FB3A7]" aria-hidden />
              Alivio
            </a>
            <Button variant="primary" href={ctaHref}>
              Cotizar Ahora
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
