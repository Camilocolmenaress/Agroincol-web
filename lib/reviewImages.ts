import { listPublicImages } from './publicFiles';

// Se ejecuta en el servidor, en tiempo de build. Basta con soltar las capturas de Google
// en /public/images/lp/resenas: aparecen solas, sin tocar código ni mantener listas.
export function getReviewImages(): string[] {
  return listPublicImages('/images/lp/resenas');
}
