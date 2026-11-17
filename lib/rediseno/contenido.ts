// Contenido del rediseño: el HTML de cada página del prototipo aprobado (_rediseno/site), extraído
// por scripts/rediseno/extraer-prototipo.py, y su adaptación a las URL y assets de producción.
// El marcado no se reescribe a mano: es el del prototipo, para que diseño, textos y animaciones
// queden idénticos (README §6). Aquí solo se cambian rutas, imágenes y detalles técnicos.
import paginas from '@/content/rediseno/paginas.json';
import cromo from '@/content/rediseno/cromo.json';
import { MENSAJE_GENERAL, conMensaje } from './whatsapp';
import { PAGINAS_NUEVAS } from './paginas-nuevas';

type PaginaPrototipo = { ruta: string; title: string | null; description: string | null; main: string | null };
// Las del prototipo y las creadas después (lib/rediseno/paginas-nuevas.ts).
const PAGINAS = { ...(paginas as Record<string, PaginaPrototipo>), ...PAGINAS_NUEVAS } as Record<string, PaginaPrototipo>;

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
  // Figuras 3D (obj-*.webp): directas, sin el optimizador (decisión de Camilo, 15-nov). La recompresión
  // a AVIF ensuciaba el canal alfa (menos píxeles del todo transparentes y más casi transparentes) y el
  // drop-shadow del prototipo lo convertía en un cuadro de fondo en el iPhone.
  // Para no mandar el original de 900 px a todos los celulares, hay copias estáticas de 300, 450 y 600 px
  // con el alfa sin pérdida (scripts/rediseno/figuras.sh): también van directas, sin optimizador.
  if (src.startsWith('obj-')) {
    const b = local.replace(/\.webp$/, '');
    const srcset = `${b}-300.webp 300w, ${b}-450.webp 450w, ${b}-600.webp 600w, ${local} 900w`;
    let out = etiqueta.replace(`src="assets/${src}"`, `src="${b}-600.webp" srcset="${srcset}" sizes="(max-width: 699px) 50vw, 300px"`);
    if (!/\sdecoding=/.test(out)) out = out.replace('<img', '<img decoding="async"');
    if (primera && !/\sloading="lazy"/.test(out)) out = out.replace('<img', '<img fetchpriority="high"');
    return out;
  }
  const ancho = Number(etiqueta.match(/\swidth="(\d+)"/)?.[1] ?? 800);
  // Ancho con que el CSS del prototipo pinta cada tipo de imagen (para que el navegador no baje
  // una imagen más grande de la que muestra).
  const sizes = src.startsWith('colado-')
      ? '(max-width: 699px) 140px, 260px'
      : src.startsWith('ilustracion-') && ancho >= 1800
        ? // Portadas en .frame: el atributo height="1013" del prototipo fija el alto y object-fit:cover
          // las pinta a ~1800 px de ancho en cualquier pantalla. Con 100vw el celular bajaba una de 640.
          '(max-width: 1800px) 1800px, 100vw'
        : src.startsWith('ilustracion-')
          ? '(max-width: 699px) 74vw, min(56vw, 760px)'
          : `(max-width: 699px) min(100vw, ${ancho}px), ${ancho}px`;
  const tope = src.startsWith('colado-') ? 640 : 1920;
  const anchos = ANCHOS.filter((w) => w <= tope);
  const url = (w: number) => `/_next/image?url=${encodeURIComponent(local)}&amp;w=${w}&amp;q=75`;
  const srcset = anchos.map((w) => `${url(w)} ${w}w`).join(', ');
  let out = etiqueta.replace(`src="assets/${src}"`, `src="${url(anchos[anchos.length - 1])}" srcset="${srcset}" sizes="${sizes}"`);
  if (!/\sdecoding=/.test(out)) out = out.replace('<img', '<img decoding="async"');
  // La primera imagen de la página que no es diferida es candidata a LCP: prioridad alta.
  if (primera && !/\sloading="lazy"/.test(out)) out = out.replace('<img', '<img fetchpriority="high"');
  return out;
}

// Rendimiento sin cambiar el diseño (Lighthouse móvil del inicio, 15-nov):
// - Imágenes de la tercera sección en adelante: diferidas (loading="lazy"). Las dos primeras
//   secciones quedan como están, porque ahí puede estar el LCP (por ejemplo, la portada de las zonas).
// - Carrusel del hero: solo los dos primeros objetos cargan de entrada; el resto lleva
//   data-diferida y el motor los pide apenas termina la carga (lib/rediseno/motor.ts), antes de que
//   alguien alcance a deslizar la tira.
// Zonas de los carruseles (.track "Así trabajamos" y .cards "Otros servicios"): [inicio, fin) del div.
function carruseles(html: string): Array<[number, number]> {
  const zonas: Array<[number, number]> = [];
  const re = /<div class="(?:track|cards)(?:\s[^"]*)?"[^>]*>/g;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    let nivel = 1;
    const etiquetas = /<\/?div\b[^>]*>/g;
    etiquetas.lastIndex = m.index + m[0].length;
    for (let t = etiquetas.exec(html); t; t = etiquetas.exec(html)) {
      nivel += t[0].startsWith('</') ? -1 : 1;
      if (nivel === 0) {
        zonas.push([m.index, t.index]);
        break;
      }
    }
  }
  return zonas;
}

// Dentro de los carruseles, sin loading="lazy" (decisión de Camilo, 15-nov): Safari no cargaba las
// imágenes diferidas que quedan fuera de la vista dentro del riel horizontal.
function sinDiferirEnCarruseles(html: string): string {
  const zonas = carruseles(html);
  if (!zonas.length) return html;
  return html.replace(/<img\b[^>]*>/g, (tag, pos: number) =>
    zonas.some(([a, b]) => pos > a && pos < b) ? tag.replace(/\sloading="lazy"/, '') : tag
  );
}

function diferir(html: string): string {
  const zonasCarrusel = carruseles(html);
  const secciones: number[] = [];
  for (let i = html.indexOf('<section'); i >= 0; i = html.indexOf('<section', i + 1)) secciones.push(i);
  const orbita = html.indexOf('<div class="orbit">');
  const finOrbita = orbita >= 0 ? html.indexOf('</div>\n', orbita) : -1;
  let enOrbita = 0;
  return html.replace(/<img\b[^>]*>/g, (tag, pos: number) => {
    if (/\sloading=/.test(tag) || /\.svg"/.test(tag)) return tag;
    if (orbita >= 0 && pos > orbita && pos < finOrbita) {
      enOrbita++;
      return enOrbita > 2 ? tag.replace('<img', '<img loading="lazy" data-diferida') : tag;
    }
    if (zonasCarrusel.some(([a, b]) => pos > a && pos < b)) return tag; // carruseles: sin diferir
    const seccion = secciones.filter((s) => s < pos).length;
    return seccion >= 3 ? tag.replace('<img', '<img loading="lazy"') : tag;
  });
}

export function transformar(html: string): string {
  let primera = true;
  return (
    diferir(sinDiferirEnCarruseles(html))
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

// Cabecera, menú, pie y barra móvil: WhatsApp con el mensaje general; el motor les pone el de cada página.
export const CROMO = {
  antes: conMensaje(transformar(cromo.antes), MENSAJE_GENERAL),
  despues: conMensaje(transformar(cromo.despues), MENSAJE_GENERAL),
};
