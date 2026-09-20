/**
 * Las dos cuentas de medición de Meta, y cómo se decide cuál toca.
 *
 * Servicios (fumigación, /lp/*) y la tienda EcoGel (/ecogel/*) tienen Pixel y
 * token de CAPI SEPARADOS a propósito. Son negocios con público, ticket y ciclo
 * de compra distintos: si compartieran pixel, Meta construiría una sola
 * audiencia de "gente que convierte" mezclando a quien compra un gel de $40.000
 * con quien contrata una fumigación de $400.000, y las audiencias similares de
 * cada campaña se contaminarían con las del otro negocio.
 *
 * La cuenta se decide por la RUTA y en ningún otro sitio. Así el navegador
 * (Pixel) y el servidor (CAPI, que recibe `sourceUrl`) llegan a la misma
 * respuesta sin pasarse ningún parámetro extra.
 *
 * Este módulo no importa nada del navegador ni del servidor: lo usan los dos.
 */

export type Cuenta = 'servicios' | 'ecogel';

export function cuentaPorRuta(pathname: string): Cuenta {
  return pathname === '/ecogel' || pathname.startsWith('/ecogel/') ? 'ecogel' : 'servicios';
}

/** Para el servidor, que recibe la URL completa de la página. Si no parsea, servicios. */
export function cuentaPorUrl(url: string | undefined): Cuenta {
  if (!url) return 'servicios';
  try {
    return cuentaPorRuta(new URL(url).pathname);
  } catch {
    return 'servicios';
  }
}

/**
 * Pixel de cada cuenta. Sin la variable, cadena vacía = medición apagada para
 * esa cuenta. EcoGel NUNCA cae al pixel de servicios: preferimos no medir un
 * día a contaminar el historial del otro pixel.
 *
 * Los `process.env.NEXT_PUBLIC_*` van escritos literalmente (no por índice)
 * porque Next los reemplaza en tiempo de build buscando ese texto exacto.
 */
export function pixelIdDe(cuenta: Cuenta): string {
  return (cuenta === 'ecogel' ? process.env.NEXT_PUBLIC_META_PIXEL_ID_ECOGEL : process.env.NEXT_PUBLIC_META_PIXEL_ID) ?? '';
}
