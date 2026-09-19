import { publicFileExists } from '@/lib/publicFiles';
import type { FotosEcogel } from '@/components/ecogel/Galeria';

// Fotos definitivas: cuando existan en /public/ecogel con estos nombres, la página
// las pinta sola. Mientras no, se ven los marcadores.
const RUTAS = {
  enUso: '/ecogel/en-uso.jpg',
  producto: '/ecogel/producto.jpg',
  antes: '/ecogel/antes.jpg',
  despues: '/ecogel/despues.jpg',
  equipo: '/ecogel/equipo.jpg',
} as const;

export function fotosEcogel(): FotosEcogel {
  const salida: FotosEcogel = {};
  (Object.keys(RUTAS) as (keyof typeof RUTAS)[]).forEach((k) => {
    if (publicFileExists(RUTAS[k])) salida[k] = RUTAS[k];
  });
  return salida;
}

export function videoEcogel(): string | undefined {
  return publicFileExists('/ecogel/aplicacion.jpg') ? '/ecogel/aplicacion.jpg' : undefined;
}
