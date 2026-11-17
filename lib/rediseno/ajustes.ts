// Ajustes de conversión sobre el HTML del prototipo (content/rediseno/paginas.json), por ruta.
// El JSON ya no se regenera (el extractor tiene una guarda: producción es este mismo sitio), así que
// los cambios posteriores al prototipo viven aquí, separados y revisables. Cada ajuste se engancha a
// un trozo exacto del marcado; si el trozo no aparece, el build falla en vez de publicar la página
// sin el cambio.

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

// Primer pantallazo de las páginas de servicio: beneficio + CTA + prueba social + señal de precio
// (sin cifras: los precios de servicios se retiraron del sitio el 12-nov-2026). Va justo debajo del
// H1 y reemplaza la fila de botones que quedaba debajo de la figura (a ~1.000 px en escritorio).
// En celular se ocultan WhatsApp y Llamar: ya están en la barra fija de abajo.
type Gancho = { beneficio: string; wa: string; form: string };

export function gancho({ beneficio, wa, form }: Gancho): string {
  return (
    `<div class="gancho">` +
    `<p class="gancho-lead">${beneficio}</p>` +
    `<div class="gancho-cta"><a class="btn btn-naranja" href="https://wa.me/573107891948">${wa}</a>` +
    `<a class="btn btn-linea" href="#cotizar" data-ancla>${form}</a>` +
    `<a class="call" href="tel:+573107891948">Llamar 310 789 1948</a></div>` +
    `<p class="gancho-prueba"><span>4.9 · 33 reseñas en Google</span>` +
    `<a href="/precios" data-transition>Cotización gratis el mismo día · Vea cómo cotizamos →</a></p>` +
    `</div>`
  );
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

export function ajustar(ruta: string, html: string): string {
  let out = html;
  const g = GANCHOS[ruta];
  if (g) out = conGancho(ruta, out, g);
  return out;
}
