'use client';

import { usePathname } from 'next/navigation';
import { preload } from 'react-dom';

// Fuente del H1 del sitio v2. Si se cambia el archivo, cambiar el nombre: se sirve con caché inmutable.
export const FUENTE_TITULAR = '/fonts/league-spartan-latin-800-normal.woff2';

// Las landings de pauta (/lp/*, /ecogel/* y /tienda/*) no llevan navegación: cada enlace de salida
// es un lead pagado que se va, y cada una trae su propio cromo (cabecera, WhatsApp,
// barra sticky). Además conservan la marca v1: quedan fuera del rediseño.
export function esLanding(pathname: string | null) {
  return !!pathname && (pathname.startsWith('/lp') || pathname.startsWith('/ecogel') || pathname.startsWith('/tienda'));
}

// Oculta el cromo global solo en las landings y deja el resto del sitio igual.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (esLanding(pathname)) return null;
  return <>{children}</>;
}

// Marca visual por ruta: v1 para las landings, v2 (manual oct-2026) para el resto.
// usePathname también corre en el servidor, así que el atributo sale en el HTML inicial
// (sin parpadeo). El contenedor es display: contents: no agrega caja ni cambia el layout.
export function MarcaRuta({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const v2 = !esLanding(pathname);
  // Precarga solo donde se usa: las landings no pagan esa descarga.
  if (v2) preload(FUENTE_TITULAR, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  return (
    <div data-marca={v2 ? 'v2' : 'v1'} id="marca-raiz">
      {children}
    </div>
  );
}
