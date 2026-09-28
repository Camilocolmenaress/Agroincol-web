/**
 * Modo prueba: `?test=1` en cualquier URL apaga TODA la medición de la sesión
 * (Pixel, CAPI, PostHog y GTM), también en agroincol.com.
 *
 * El filtro de dominio (lib/meta/cuentas.ts) ya cubre localhost y los previews;
 * esto cubre la prueba en el dominio real, p. ej. el recorrido de humo después
 * de un despliegue. Se recuerda en sessionStorage porque el parámetro solo
 * viene en la primera página y la compra termina dos páginas después.
 *
 * El servidor no ve sessionStorage: por eso la URL que el navegador le manda
 * (`sourceUrl`) sale con test=1 (ver `urlParaMedir`) y `urlEsDeProduccion`
 * la descarta. Esa URL se guarda en la hoja, así que el webhook de Mercado
 * Pago también la descarta.
 *
 * La clave se repite, a mano, en el snippet de GTM de app/layout.tsx.
 */

export const CLAVE_MODO_PRUEBA = 'agroincol_test';

type Almacen = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function modoPruebaDesde(search: string, almacen: Almacen | null): boolean {
  const parametro = new URLSearchParams(search).get('test');
  if (!almacen) return parametro === '1';
  try {
    if (parametro === '1') almacen.setItem(CLAVE_MODO_PRUEBA, '1');
    if (parametro === '0') almacen.removeItem(CLAVE_MODO_PRUEBA);
    return almacen.getItem(CLAVE_MODO_PRUEBA) === '1';
  } catch {
    return parametro === '1';
  }
}

export function urlConMarcaDePrueba(href: string, prueba: boolean): string {
  if (!prueba) return href;
  const url = new URL(href);
  url.searchParams.set('test', '1');
  return url.toString();
}

function sesion(): Almacen | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function enModoPrueba(): boolean {
  if (typeof window === 'undefined') return false;
  return modoPruebaDesde(window.location.search, sesion());
}

/** La URL de la página tal como debe llegar al servidor para medir. */
export function urlParaMedir(): string {
  return urlConMarcaDePrueba(window.location.href, enModoPrueba());
}
