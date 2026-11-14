'use client';

import { useEffect, useRef, useState } from 'react';
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

// Menú (decisión del 14-nov): los cuatro destinos principales en grande; el resto, pequeño abajo.
const PRINCIPALES = [...SEGMENTOS, { label: 'Servicios', href: '/servicios' }] as const;

// Punto de gel: el separador de la marca (círculo naranja pequeño).
function PuntoGel() {
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-marca-naranja" aria-hidden />;
}

// En celular va solo el ícono (círculo de 44 px) para que el logo quede centrado de verdad.
// Al pasar el mouse, la palabra "rueda" (como el MENU de la referencia); la copia es un ::after con
// attr(), así el HTML del servidor no cambia. Con el menú abierto el botón va en blanco sobre el verde.
function BotonMenu({ abierto, onClick, compacto = false, className = '' }: { abierto: boolean; onClick: () => void; compacto?: boolean; className?: string }) {
  const palabra = abierto ? 'Cerrar' : 'Menú';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={abierto}
      aria-controls="menu-sitio"
      aria-label={compacto ? (abierto ? 'Cerrar menú' : 'Abrir menú') : undefined}
      className={`boton-menu group h-11 items-center justify-center gap-2 rounded-full border-2 font-display text-[0.8rem] uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 ${
        abierto ? 'border-white/70 text-white hover:bg-white hover:text-marca-verde focus-visible:ring-white/50' : 'border-marca-verde text-marca-verde hover:bg-marca-verde hover:text-white focus-visible:ring-marca-verde/40'
      } ${compacto ? 'w-11' : 'px-4'} ${className}`}
    >
      <span className="relative block h-2.5 w-3.5" aria-hidden>
        <span className={`absolute left-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ${abierto ? 'top-1 rotate-45' : 'top-0'}`} />
        <span className={`absolute left-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ${abierto ? 'top-1 -rotate-45' : 'top-2'}`} />
      </span>
      {!compacto && (
        <span className="rodillo" data-texto={palabra}>
          <span className="rodillo-texto">{palabra}</span>
        </span>
      )}
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
  // No todas las páginas tienen formulario (#contacto): sin él, el CTA lleva al de /contacto.
  const [ctaHref, setCtaHref] = useState('#contacto');
  const cabecera = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // En el home, mientras el selector está fijado la cabecera sigue transparente (como en la referencia).
    const alDesplazar = () => {
      const pista = document.querySelector<HTMLElement>('[data-selector]');
      const umbral = pista ? pista.offsetTop + pista.offsetHeight - window.innerHeight : 0;
      setConSombra(window.scrollY > Math.max(8, umbral));
    };
    alDesplazar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  useEffect(() => {
    setAbierto(false);
    setCtaHref(document.getElementById('contacto') ? '#contacto' : '/contacto#contacto');
  }, [pathname]);

  // Menú abierto: bloquea el scroll de fondo, atrapa el foco dentro de la cabecera y cierra con
  // Escape devolviendo el foco al botón. El selector del home no mueve la fila mientras tanto.
  useEffect(() => {
    if (!abierto) return;
    document.body.style.overflow = 'hidden';
    document.body.dataset.menu = '';
    const lenis = (window as Window & { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const boton = document.activeElement as HTMLElement | null;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAbierto(false);
        boton?.focus?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const cab = cabecera.current;
      if (!cab) return;
      const focos = Array.from(cab.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter((el) => el.offsetParent !== null);
      if (!focos.length) return;
      const primero = focos[0], ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    window.addEventListener('keydown', alTeclear);
    return () => {
      document.body.style.overflow = '';
      delete document.body.dataset.menu;
      lenis?.start();
      window.removeEventListener('keydown', alTeclear);
    };
  }, [abierto]);

  const alternar = () => setAbierto((v) => !v);
  // En el home la cabecera arranca transparente sobre el menta del hero (sin franja blanca).
  const transparente = (pathname === '/' && !conSombra) || abierto;

  return (
    <header
      ref={cabecera}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${transparente ? 'bg-transparent' : 'bg-white'} ${conSombra && !abierto ? 'shadow-soft' : ''}`}
    >
      <nav aria-label="Principal" className="container-custom relative z-10 grid h-[72px] grid-cols-[1fr_auto_1fr] items-center md:h-[88px]">
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
                    abierto ? 'text-white/85 hover:text-white' : pathname === s.href ? 'text-marca-verde underline decoration-marca-naranja decoration-2 underline-offset-[6px]' : 'text-marca-letra'
                  }`}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Centro: logo oficial (SVG del manual, nunca redibujado). Horizontal ≥ 160 px. */}
        <Link href="/" className="relative block shrink-0">
          <Image
            src="/images/logos/v2/agroincol-logo-horizontal.svg"
            alt="AGROINCOL — Fumigación y Control de Plagas"
            width={200}
            height={74}
            priority
            className={`h-auto w-[160px] transition-opacity duration-300 md:w-[200px] ${abierto ? 'opacity-0' : ''}`}
          />
          {/* Sobre el panel verde va la versión blanca oficial del logo (solo se pide al abrir). */}
          {abierto && (
            // eslint-disable-next-line @next/next/no-img-element -- SVG oficial, solo al abrir el menú.
            <img
              src="/images/logos/v2/agroincol-logo-horizontal-blanca.svg"
              alt=""
              width={200}
              height={74}
              className="absolute inset-0 h-auto w-[160px] md:w-[200px]"
            />
          )}
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
            data-cursor="WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-marca-naranja text-white shadow-brand transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marca-naranja/50 focus-visible:ring-offset-2 md:h-12 md:w-12"
          >
            <MessageCircle size={20} fill="currentColor" aria-hidden />
          </a>
        </div>
      </nav>

      {/* Panel del menú (como el de agrumeafarm.it): baja en 0,9 s y cubre la pantalla; los cuatro
          destinos principales en grande y en escalera (el primero a la izquierda, el último a la
          derecha), el resto pequeño abajo. En el DOM siempre (SEO); cerrado queda oculto. */}
      <div id="menu-sitio" data-lenis-prevent data-abierto={abierto ? '' : undefined} className="menu-panel">
        <div className="container-custom flex min-h-full flex-col justify-between gap-10 pb-10 pt-[104px] md:pt-[128px]">
          <ul className="menu-escalera">
            {PRINCIPALES.map((link, i) => {
              const activo = pathname === link.href;
              return (
                <li key={link.href} className="menu-fila" style={{ ['--i' as string]: i, ['--n' as string]: PRINCIPALES.length - 1 }}>
                  <Link
                    href={link.href}
                    onClick={() => setAbierto(false)}
                    className={`menu-grande rodillo ${activo ? 'is-activo' : ''}`}
                    data-texto={link.label}
                  >
                    <span className="rodillo-texto">{link.label}</span>
                    {activo && <span className="menu-activo" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <ul className="menu-secundario">
              {NAV_LINKS.filter((l) => l.href !== '/servicios').map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setAbierto(false)}
                    className={`font-body text-[1.05rem] font-semibold transition-colors ${pathname === link.href ? 'text-marca-menta underline decoration-marca-naranja decoration-2 underline-offset-4' : 'text-white/80 hover:text-white'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
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
      </div>
    </header>
  );
}
