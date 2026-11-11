import Image from 'next/image';

// Piezas del manual de marca v2 (Desktop/manual de marca agroincol), copiadas a
// public/tienda/marca/. Reglas que se respetan aquí:
// - Logo: horizontal sobre fondos claros o menta; horizontal blanca sobre verde.
//   Nunca sobre un patrón ni sobre naranja, nunca deformado ni con efectos.
// - Patrones: uno por pieza (la página de producto usa Gel; checkout y gracias,
//   Arcos). Claro sobre fondo claro, oscuro sobre verde. Sin cambiar colores.

export function Logo({ blanco = false, className = 'h-10 w-auto', prioridad = false }: { blanco?: boolean; className?: string; prioridad?: boolean }) {
  return (
    <Image
      src={blanco ? '/tienda/marca/logo-horizontal-blanca.svg' : '/tienda/marca/logo-horizontal.svg'}
      alt="AGROINCOL"
      width={974}
      height={359}
      priority={prioridad}
      unoptimized
      className={className}
    />
  );
}

export type Patron = 'gel-claro' | 'gel-oscuro' | 'arcos-claro' | 'arcos-oscuro';

/** Fondo con el patrón en mosaico. 700 px de archivo a 280 px en pantalla: nítido en celulares de alta densidad. */
export function fondoPatron(patron: Patron, tamano = 280): React.CSSProperties {
  return { backgroundImage: `url(/tienda/marca/patron-${patron}.webp)`, backgroundSize: `${tamano}px`, backgroundRepeat: 'repeat' };
}
