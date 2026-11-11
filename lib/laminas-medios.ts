import { publicFileExists } from './publicFiles';
import type { VideoSlot } from '@/components/tienda/Video';

/**
 * Los videos A y B quedan listos: cuando existan los archivos en
 * public/tienda/laminas/ con estos nombres, la página los muestra sola.
 * Mientras no, no se pinta nada (un espacio vacío se ve peor que no tenerlo).
 */
export function videoSlot(nombre: 'video-a' | 'video-b'): VideoSlot | undefined {
  const src = `/tienda/laminas/${nombre}.mp4`;
  const poster = `/tienda/laminas/${nombre}-poster.webp`;
  return publicFileExists(src) && publicFileExists(poster) ? { src, poster } : undefined;
}
