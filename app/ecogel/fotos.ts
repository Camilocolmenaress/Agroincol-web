import { publicFileExists } from '@/lib/publicFiles';
import type { Segmento } from '@/lib/ecogel';
import type { FotosEcogel } from '@/components/ecogel/Galeria';

// Fotos definitivas: cuando existan en /public/ecogel con estos nombres, la página
// las pinta sola. Mientras no, se ven los marcadores. `antes`/`despues` son la misma
// foto real (editada) para los dos segmentos: no tiene contexto de hogar/restaurante.
const COMPARTIDAS = {
  producto: '/ecogel/producto.webp',
  antes: '/ecogel/antes.webp',
  despues: '/ecogel/despues.webp',
  nevera: '/ecogel/nevera.webp',
  lavaplatos: '/ecogel/lavaplatos.webp',
  gabinete: '/ecogel/gabinete.webp',
  zocalo: '/ecogel/zocalo.webp',
  kit: '/ecogel/kit.webp',
  macro: '/ecogel/macro.webp',
  ugc: '/ecogel/ugc.webp',
} as const;

const POR_SEGMENTO: Record<Segmento, Record<'enUso' | 'equipo', string>> = {
  hogar: {
    enUso: '/ecogel/en-uso.webp',
    equipo: '/ecogel/equipo.webp',
  },
  restaurantes: {
    enUso: '/ecogel/en-uso-restaurantes.webp',
    equipo: '/ecogel/equipo-restaurantes.webp',
  },
};

export function fotosEcogel(segmento: Segmento): FotosEcogel {
  const rutas = { ...COMPARTIDAS, ...POR_SEGMENTO[segmento] };
  const salida: FotosEcogel = {};
  (Object.keys(rutas) as (keyof typeof rutas)[]).forEach((k) => {
    if (publicFileExists(rutas[k])) salida[k] = rutas[k];
  });
  return salida;
}

export interface VideoAprender {
  src: string;
  poster: string;
}

/** Los 3 videos de "Aprende a usarlo": mismo para hogar y restaurantes. */
export function videosAprenderAUsarlo(): (VideoAprender | undefined)[] {
  return [1, 2, 3].map((i) => {
    const src = `/ecogel/aprende-${i}.mp4`;
    const poster = `/ecogel/aprende-${i}-poster.webp`;
    return publicFileExists(src) && publicFileExists(poster) ? { src, poster } : undefined;
  });
}
