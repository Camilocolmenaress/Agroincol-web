// Ajustes de conversión sobre el HTML del prototipo (content/rediseno/paginas.json), por ruta.
// El JSON ya no se regenera (el extractor tiene una guarda: producción es este mismo sitio), así que
// los cambios posteriores al prototipo viven aquí, separados y revisables. Cada ajuste se engancha a
// un trozo exacto del marcado; si el trozo no aparece, el build falla en vez de publicar la página
// sin el cambio.
import { type Gancho, gancho, tarjeta } from './piezas';

function exigir(ruta: string, html: string, ancla: string): number {
  const i = html.indexOf(ancla);
  if (i < 0) throw new Error(`[ajustes] ${ruta}: no encontré «${ancla.slice(0, 60)}»`);
  return i;
}

export function insertarDespues(ruta: string, html: string, ancla: string, fragmento: string): string {
  const i = exigir(ruta, html, ancla) + ancla.length;
  return html.slice(0, i) + fragmento + html.slice(i);
}

export function insertarAntes(ruta: string, html: string, ancla: string, fragmento: string): string {
  const i = exigir(ruta, html, ancla);
  return html.slice(0, i) + fragmento + html.slice(i);
}

export function quitar(ruta: string, html: string, re: RegExp): string {
  if (!re.test(html)) throw new Error(`[ajustes] ${ruta}: no encontré ${re}`);
  return html.replace(re, '');
}

const SRV_CTA = /\n?\s*<div class="srv-cta">.*?<\/div>/;

function conGancho(ruta: string, html: string, g: Gancho): string {
  return insertarDespues(ruta, quitar(ruta, html, SRV_CTA), '</h1>', gancho(g));
}

const GANCHOS: Record<string, Gancho> = {
  '/servicios/fumigacion-residencial': {
    beneficio: 'Fumigación segura para niños y mascotas, con productos registrados ante el ICA.',
    wa: 'Cotizar por WhatsApp',
    form: 'Solicitar cotización',
  },
  '/servicios/control-chinches': {
    beneficio: 'Inspección minuciosa y segunda visita incluida para romper el ciclo de huevos.',
    wa: 'Cotizar por WhatsApp',
    form: 'Solicitar cotización',
  },
  '/servicios/control-comejen-termitas': {
    beneficio: 'Eliminamos la colonia completa, no solo los insectos visibles.',
    wa: 'Cotizar por WhatsApp',
    form: 'Solicitar cotización',
  },
};

// /servicios/control-cucarachas (página nueva, lib/rediseno/paginas-nuevas.ts): primera tarjeta de
// "Otros servicios" en todas las páginas que la tienen y fila 10 del listado de /servicios.
const CARDS = 'aria-label="Servicios, arrastre para ver más">';
const TARJETA_CUCARACHAS = tarjeta('servicio-control-cucarachas.html', 'obj-aplicador', 'Control de cucarachas');
// Fin de la última fila (chinches) del listado de /servicios.
const ULTIMA_FILA = '<span class="pic"><img src="assets/obj-colchon.webp" alt="" width="200" height="200"></span></span></a>';
const FILA_CUCARACHAS =
  '<a class="seg-row md" href="servicio-control-cucarachas.html" data-transition data-cursor="VER SERVICIO"><span class="num">10</span>' +
  '<span class="display word">Cucarachas<svg viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M 5 10 Q 500 70 995 10"/></svg></span>' +
  '<span class="aside"><p class="cap">Gel que elimina la colonia completa, seguro para niños y mascotas. Para casas, apartamentos y negocios.</p>' +
  '<span class="pic"><img src="assets/obj-aplicador.webp" alt="" width="200" height="200"></span></span></a>';

export function ajustar(ruta: string, html: string): string {
  let out = html;
  const g = GANCHOS[ruta];
  if (g) out = conGancho(ruta, out, g);
  if (out.includes('<section class="otros">') && !out.includes('servicio-control-cucarachas.html')) out = insertarDespues(ruta, out, CARDS, TARJETA_CUCARACHAS + '\n');
  if (ruta === '/servicios') out = insertarDespues(ruta, out, ULTIMA_FILA, FILA_CUCARACHAS);
  return out;
}
