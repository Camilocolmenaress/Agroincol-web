// Contenido del rediseño: el HTML de cada página del prototipo aprobado (_rediseno/site), extraído
// por scripts/rediseno/extraer-prototipo.py, y su adaptación a las URL y assets de producción.
// El marcado no se reescribe a mano: es el del prototipo, para que diseño, textos y animaciones
// queden idénticos (README §6). Aquí solo se cambian rutas, imágenes y detalles técnicos.
import paginas from '@/content/rediseno/paginas.json';
import cromo from '@/content/rediseno/cromo.json';

type PaginaPrototipo = { ruta: string; title: string | null; description: string | null; main: string | null };
const PAGINAS = paginas as Record<string, PaginaPrototipo>;

// Mapa de URL del README §5: archivo del prototipo -> ruta de producción.
const RUTA_DE_ARCHIVO: Record<string, string> = Object.fromEntries(
  Object.entries(PAGINAS).map(([archivo, p]) => [archivo, p.ruta])
);

const ANCHOS = [256, 384, 640, 828, 1080, 1200, 1920];

// Imagen local del prototipo -> el optimizador de next/image (AVIF/WebP según el navegador).
// Los SVG no pasan por el optimizador.
function imagen(etiqueta: string, primera: boolean): string {
  const src = etiqueta.match(/\ssrc="assets\/([^"]+)"/)?.[1];
  if (!src) return etiqueta;
  const local = `/rediseno/${src}`;
  if (src.endsWith('.svg')) return etiqueta.replace(`src="assets/${src}"`, `src="${local}"`);
  const ancho = Number(etiqueta.match(/\swidth="(\d+)"/)?.[1] ?? 800);
  // Ancho con que el CSS del prototipo pinta cada tipo de imagen (para que el navegador no baje
  // una imagen más grande de la que muestra).
  const sizes = src.startsWith('obj-')
    ? '(max-width: 699px) 50vw, 300px'
    : src.startsWith('colado-')
      ? '(max-width: 699px) 140px, 260px'
      : src.startsWith('ilustracion-') && ancho >= 1800
        ? // Portadas en .frame: el atributo height="1013" del prototipo fija el alto y object-fit:cover
          // las pinta a ~1800 px de ancho en cualquier pantalla. Con 100vw el celular bajaba una de 640.
          '(max-width: 1800px) 1800px, 100vw'
        : src.startsWith('ilustracion-')
          ? '(max-width: 699px) 74vw, min(56vw, 760px)'
          : `(max-width: 699px) min(100vw, ${ancho}px), ${ancho}px`;
  const tope = src.startsWith('obj-') || src.startsWith('colado-') ? 640 : 1920;
  const anchos = ANCHOS.filter((w) => w <= tope);
  const url = (w: number) => `/_next/image?url=${encodeURIComponent(local)}&amp;w=${w}&amp;q=75`;
  const srcset = anchos.map((w) => `${url(w)} ${w}w`).join(', ');
  let out = etiqueta.replace(`src="assets/${src}"`, `src="${url(anchos[anchos.length - 1])}" srcset="${srcset}" sizes="${sizes}"`);
  if (!/\sdecoding=/.test(out)) out = out.replace('<img', '<img decoding="async"');
  // La primera imagen de la página que no es diferida es candidata a LCP: prioridad alta.
  if (primera && !/\sloading="lazy"/.test(out)) out = out.replace('<img', '<img fetchpriority="high"');
  return out;
}

export function transformar(html: string): string {
  let primera = true;
  return (
    html
      // Enlaces del prototipo (servicio-x.html) -> URL de producción.
      .replace(/href="([a-z0-9-]+\.html)(#[^"]*)?"/g, (m, archivo: string, hash = '') => {
        const ruta = RUTA_DE_ARCHIVO[archivo];
        return ruta ? `href="${ruta}${hash}"` : m;
      })
      .replace(/<img\b[^>]*>/g, (etiqueta) => {
        const out = imagen(etiqueta, primera);
        if (/\ssrc="assets\//.test(etiqueta) && !etiqueta.includes('.svg')) primera = false;
        return out;
      })
      // Cualquier otra referencia a assets/ (por ejemplo en atributos de datos).
      .replace(/(["'(])assets\//g, '$1/rediseno/')
  );
}

export function paginaPrototipo(archivo: string): PaginaPrototipo {
  const p = PAGINAS[archivo];
  if (!p?.main) throw new Error(`Página del prototipo sin <main>: ${archivo}`);
  return p;
}

export const CROMO = { antes: transformar(cromo.antes), despues: transformar(cromo.despues) };
