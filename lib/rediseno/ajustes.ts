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
  '/empresas': {
    beneficio: 'Restaurantes, hoteles, oficinas y bodegas: expediente completo para auditorías de INVIMA y Secretaría de Salud.',
    wa: 'Pedir visita técnica',
    form: 'Solicitar visita',
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

// /empresas: hoteles y hospedajes (llega un anuncio de hoteles y la palabra no aparecía), reseñas
// reales del inicio y formulario de visita técnica en lugar del bloque final de solo botones.
// Lo de "habitación por habitación sin cerrar el hotel" lo confirmó Camilo el 17-nov-2026; lo demás
// ya está publicado (horarios, expediente, chinches).
const EMPRESAS_HOTELES = `<section class="docs-sec hoteles" id="hoteles">
  <span class="label">Para su hotel</span>
  <h2 class="display" data-reveal>Hoteles y<br>hospedajes</h2>
  <p class="hoteles-lead" data-reveal>Un huésped que ve una cucaracha o amanece con picaduras no vuelve, y lo cuenta en las reseñas.</p>
  <div class="docs"><div class="doc" data-reveal><span class="doc-n">01</span><h3>Sin cerrar el hotel</h3><p>Tratamos habitación por habitación, con el hotel funcionando.</p></div><div class="doc" data-reveal><span class="doc-n">02</span><h3>Chinches, cucarachas y roedores</h3><p>En habitaciones, cocina, lavandería y zonas comunes.</p></div><div class="doc" data-reveal><span class="doc-n">03</span><h3>En su horario</h3><p>Desde las 6 a. m., en la noche o los sábados: lo coordinamos con usted.</p></div><div class="doc" data-reveal><span class="doc-n">04</span><h3>Expediente sanitario</h3><p>Fichas técnicas, registro de cada visita y certificado para la Secretaría de Salud.</p></div></div>
  <p class="note">¿Sospecha de chinches de cama? Vea el <a href="servicio-control-chinches.html" data-transition>control de chinches para hoteles y hospedajes →</a></p>
</section>`;

const EMPRESAS_RESENAS = `<section class="voces" aria-labelledby="voces-t">
  <div class="voces-head"><h2 class="display" id="voces-t" data-reveal>Lo que<br>dicen</h2><span class="rating">4.9 · 33 reseñas en Google</span></div>
  <div class="quotes">
    <figure data-reveal><blockquote>"Anteriormente he hecho fumigaciones con otras personas pero no funcionaba. Con ellos me sirvió muchísimo."</blockquote><figcaption>Andrés Carvajal · Reseña en Google</figcaption></figure>
    <figure data-reveal><blockquote>"Realizan diagnósticos para cada situación y lo más importante: los resultados son efectivos."</blockquote><figcaption>Lorena Mueguez · Reseña en Google</figcaption></figure>
  </div>
</section>`;

// Mismo formulario y validación que los demás (form[data-lead-form], lib/rediseno/formularios.ts).
// El select se llama tipoServicio para que /api/contact lo acepte; la empresa viaja dentro de ese
// mismo campo ("Empresas · Hotel u hospedaje · Nombre"), sin cambiar la API ni la hoja (decisión C).
const EMPRESAS_FORM = `<section class="cotizar" id="cotizar">
  <div class="cot-box">
    <div class="cot-copy" data-reveal>
      <span class="label">Visita técnica</span>
      <h2 class="display">Pida una<br>visita técnica</h2>
      <p>Le respondemos por WhatsApp en menos de 5 minutos y coordinamos el diagnóstico.</p>
      <ul class="cot-list"><li>Expediente para auditorías de INVIMA y Secretaría de Salud</li><li>Servicio desde las 6 a. m., después del cierre o los sábados</li><li>Certificado válido ante INVIMA</li><li>40+ años de experiencia</li></ul>
      <div class="cot-alt"><a class="btn btn-naranja" href="https://wa.me/573107891948">Prefiero WhatsApp</a><a class="call" href="tel:+573107891948">Llamar 310 789 1948</a></div>
    </div>
    <form class="cot-form" data-lead-form novalidate>
      <p class="cot-form-t">Solicitar visita técnica</p>
      <label class="fld"><span>Nombre completo *</span><input name="nombre" type="text" autocomplete="name" placeholder="Ej: Juan Pérez" required><em class="err">Escriba su nombre.</em></label>
      <label class="fld"><span>Empresa *</span><input name="empresa" type="text" autocomplete="organization" placeholder="Nombre de su negocio" required><em class="err">Escriba el nombre de la empresa.</em></label>
      <label class="fld"><span>Teléfono / WhatsApp *</span><input name="telefono" type="tel" autocomplete="tel" inputmode="tel" placeholder="Ej: 310 789 1948" required><em class="err">Escriba un número de 10 dígitos.</em></label>
      <label class="fld"><span>Tipo de negocio *</span><span class="sel"><select name="tipoServicio" required><option value="">Seleccione una opción</option><option>Restaurante o cafetería</option><option>Hotel u hospedaje</option><option>Oficina o local comercial</option><option>Bodega o planta de producción</option><option>Otro</option></select></span><em class="err">Elija el tipo de negocio.</em></label>
      <div class="hp" aria-hidden="true"><label>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
      <label class="chk"><input name="aceptaTerminos" type="checkbox" required><span>Autorizo a AGROINCOL para el tratamiento de mis datos personales según la <a href="politica-de-privacidad.html" data-transition>Política de Tratamiento de Datos Personales</a>. *</span></label>
      <em class="err err-chk">Debe aceptar para continuar.</em>
      <button class="btn btn-verde" type="submit">Solicitar visita técnica</button>
      <p class="cot-note">Respuesta por WhatsApp en menos de 5 minutos · Sin compromiso</p>
      <div class="cot-ok" role="status" aria-live="polite" hidden><span class="gel"></span><p class="cot-ok-t">Listo.</p><p>Le escribimos por WhatsApp en menos de 5 minutos para coordinar la visita.</p></div>
    </form>
  </div>
</section>`;

function empresas(ruta: string, html: string): string {
  let out = insertarAntes(ruta, html, '<section class="pasos">', EMPRESAS_HOTELES + EMPRESAS_RESENAS + '\n');
  out = quitar(ruta, out, /<section class="cta-final">[\s\S]*?<\/section>/);
  return out + EMPRESAS_FORM;
}

// Inicio: el formulario está al final (~10.000 px). Acceso temprano en la sección que sigue al hero
// (el hero no se toca): baja al formulario con el scroll suave del motor (data-ancla).
const INICIO_FOCO = '<p data-reveal>Desde 1985 cuidamos la salud de las familias santandereanas, empezando por lo que no se ve.</p></div>';
const INICIO_TEMPRANO =
  '<div class="temprano"><a class="btn btn-linea" href="#cotizar" data-ancla>Solicitar cotización</a>' +
  '<p>Gratis y sin compromiso · Le respondemos por WhatsApp en menos de 5 minutos</p></div>';

export function ajustar(ruta: string, html: string): string {
  let out = html;
  const g = GANCHOS[ruta];
  if (g) out = conGancho(ruta, out, g);
  if (out.includes('<section class="otros">') && !out.includes('servicio-control-cucarachas.html')) out = insertarDespues(ruta, out, CARDS, TARJETA_CUCARACHAS + '\n');
  if (ruta === '/empresas') out = empresas(ruta, out);
  if (ruta === '/') out = insertarDespues(ruta, out, INICIO_FOCO, INICIO_TEMPRANO);
  if (ruta === '/servicios') out = insertarDespues(ruta, out, ULTIMA_FILA, FILA_CUCARACHAS);
  return out;
}
