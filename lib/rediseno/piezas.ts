// Piezas de HTML que se repiten en los ajustes (ajustes.ts) y en las páginas nuevas (paginas-nuevas.ts).

// Primer pantallazo de las páginas de servicio: beneficio + CTA + prueba social + señal de precio
// (sin cifras: los precios de servicios se retiraron del sitio el 12-nov-2026). Va justo debajo del
// H1 y reemplaza la fila de botones que quedaba debajo de la figura (a ~1.000 px en escritorio).
// En celular se ocultan WhatsApp y Llamar: ya están en la barra fija de abajo.
// senal: la frase del enlace a /precios (por defecto, la de servicio general).
export type Gancho = { beneficio: string; wa: string; form: string; senal?: string };

export function gancho({ beneficio, wa, form, senal = 'Cotización gratis el mismo día' }: Gancho): string {
  return (
    `<div class="gancho">` +
    `<p class="gancho-lead">${beneficio}</p>` +
    `<div class="gancho-cta"><a class="btn btn-naranja" href="https://wa.me/573107891948">${wa}</a>` +
    `<a class="btn btn-linea" href="#cotizar" data-ancla>${form}</a>` +
    `<a class="call" href="tel:+573107891948">Llamar 310 789 1948</a></div>` +
    `<p class="gancho-prueba"><span>4.9 · 33 reseñas en Google</span>` +
    `<a href="/precios" data-transition>${senal} · Vea cómo cotizamos →</a></p>` +
    `</div>`
  );
}

// Tarjeta de "Otros servicios" (misma marca que el prototipo).
export const tarjeta = (archivo: string, obj: string, nombre: string) =>
  `<a class="card" href="${archivo}" data-transition data-cursor="VER SERVICIO"><div class="art"><img src="assets/${obj}.webp" alt="" width="200" height="200" loading="lazy"></div><span class="name">${nombre}</span></a>`;
