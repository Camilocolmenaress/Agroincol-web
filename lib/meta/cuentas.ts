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

export type Cuenta = 'servicios' | 'ecogel' | 'restaurantes';

/** Solo el segmento exacto: '/ecogelito' no es EcoGel. */
function bajo(pathname: string, raiz: string): boolean {
  return pathname === raiz || pathname.startsWith(`${raiz}/`);
}

/**
 * Restaurantes (/lp/restaurantes) tiene su propio dataset: es otro público
 * (dueños de restaurante, ticket de contrato) y su campaña optimiza hacia el
 * lead calificado, no hacia el de hogar de /lp/chinches.
 */
export function cuentaPorRuta(pathname: string): Cuenta {
  if (bajo(pathname, '/ecogel')) return 'ecogel';
  if (bajo(pathname, '/lp/restaurantes')) return 'restaurantes';
  return 'servicios';
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
 * esa cuenta. Ninguna cae al pixel de servicios: preferimos no medir un
 * día a contaminar el historial del otro pixel.
 *
 * Los `process.env.NEXT_PUBLIC_*` van escritos literalmente (no por índice)
 * porque Next los reemplaza en tiempo de build buscando ese texto exacto.
 */
export function pixelIdDe(cuenta: Cuenta): string {
  if (cuenta === 'ecogel') return process.env.NEXT_PUBLIC_META_PIXEL_ID_ECOGEL ?? '';
  if (cuenta === 'restaurantes') return process.env.NEXT_PUBLIC_META_PIXEL_ID_RESTAURANTES ?? '';
  return process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';
}

/**
 * Solo el tráfico de agroincol.com se mide. localhost, la red local y los
 * previews de Vercel usan las mismas credenciales (.env.local): sin este
 * filtro, una prueba local termina como compra real en Meta. Pasó el
 * 27-sep-2026: 16 Purchase falsos entraron por el Gateway de CAPI que el
 * pixel trae configurado, que no pasa por facebook.com.
 */
const DOMINIOS_PRODUCCION = ['agroincol.com', 'www.agroincol.com'];

export function esDominioDeProduccion(hostname: string): boolean {
  return DOMINIOS_PRODUCCION.includes(hostname);
}

/** Dominio real y sin `?test=1` (ver lib/meta/modo-prueba.ts). */
export function urlEsDeProduccion(url: string): boolean {
  try {
    const u = new URL(url);
    return esDominioDeProduccion(u.hostname) && u.searchParams.get('test') !== '1';
  } catch {
    return false;
  }
}
