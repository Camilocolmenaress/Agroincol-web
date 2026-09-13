import fs from 'node:fs';
import path from 'node:path';

// Utilidades de servidor para saber qué archivos existen realmente en /public.
// Sirven para que la landing no se rompa ni muestre imágenes falsas mientras faltan
// las fotos definitivas: si el archivo no está, se dibuja un marcador evidente.

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;

/** `src` va como ruta pública, p. ej. '/images/lp/infestacion-chinches.jpg'. */
export function publicFileExists(src: string): boolean {
  try {
    return fs.existsSync(path.join(PUBLIC_DIR, src.replace(/^\//, '')));
  } catch {
    return false;
  }
}

/** Lista ordenada de imágenes dentro de una carpeta pública. */
export function listPublicImages(dir: string): string[] {
  try {
    return fs
      .readdirSync(path.join(PUBLIC_DIR, dir.replace(/^\//, '')))
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
      .map((f) => `${dir.replace(/\/$/, '')}/${f}`);
  } catch {
    return [];
  }
}
