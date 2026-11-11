// Láminas de Captura AGROINCOL: precios, envío por zona y los textos que no se
// pueden improvisar (garantía, entrega). Sin imports de Node: lo usan cliente y
// servidor. El servidor recalcula el total desde aquí; lo que mande el
// navegador nunca se usa como precio.

export type Zona = 'am' | 'fuera';

export const NOMBRE = 'Láminas de Captura AGROINCOL';
export const CONTENT_ID = 'laminas-captura';
export const CATEGORIA = 'laminas';

export const MINIMO = 6;
/** Tope de cordura para el selector y el servidor; más que esto es un pedido por WhatsApp. */
export const MAXIMO = 500;
export const PAQUETES = [6, 12, 24] as const;
export const RECOMENDADO = 12;

export const PRECIO_UNIDAD = 10_000;
export const PRECIO_UNIDAD_24 = 9_000;
export const DESDE_PRECIO_24 = 24;
export const DESDE_ENVIO_GRATIS = 12;
export const ENVIO_AM = 8_000;
export const ENVIO_FUERA = 25_000;

export const MUNICIPIOS_AM = ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'] as const;

/** Texto exacto de Camilo. No ampliarlo. */
export const GARANTIA = 'Si su paquete llega dañado o la lámina no pega, le reponemos el paquete.';
export const RECLAMO =
  'Escríbanos por WhatsApp con su número de pedido y una foto de la caja y la lámina, y le respondemos el mismo día.';
/** Dato de Camilo (9-nov-2026). Solo para el área metropolitana: fuera no hay dato. */
export const ENTREGA_AM = 'Llega en menos de 48 horas en el área metropolitana';

/**
 * Lo que la persona ya escribió en el checkout, para no hacerla escribir dos
 * veces si el pago en línea no pasa ("Volver a intentar" en /tienda/gracias).
 * sessionStorage: solo esta pestaña. Se borra al llegar a un gracias exitoso.
 */
export const CLAVE_BORRADOR = 'laminas_borrador';

export const GUIA_PDF = '/tienda/laminas/guia-laminas-de-captura.pdf';
export const URL_PRODUCTO = '/tienda/laminas-de-captura';

const comparable = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

/** Nombre oficial del municipio del área si lo es, escrito como sea ("giron", "BUCARAMANGA "); si no, null. */
export function municipioAm(municipio: string): (typeof MUNICIPIOS_AM)[number] | null {
  const m = comparable(municipio);
  return MUNICIPIOS_AM.find((oficial) => comparable(oficial) === m) ?? null;
}

export function zonaDe(departamento: string, municipio: string): Zona {
  return departamento === 'Santander' && municipioAm(municipio) ? 'am' : 'fuera';
}

export function normalizarCantidad(valor: unknown): number {
  const n = typeof valor === 'number' ? valor : typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : NaN;
  if (!Number.isFinite(n)) return RECOMENDADO;
  return Math.min(MAXIMO, Math.max(MINIMO, Math.floor(n)));
}

export function precioUnidad(cantidad: number): number {
  return cantidad >= DESDE_PRECIO_24 ? PRECIO_UNIDAD_24 : PRECIO_UNIDAD;
}

export function envioDe(cantidad: number, zona: Zona): number {
  if (zona === 'fuera') return ENVIO_FUERA;
  return cantidad >= DESDE_ENVIO_GRATIS ? 0 : ENVIO_AM;
}

export function cotizar(cantidad: number, zona: Zona) {
  const pu = precioUnidad(cantidad);
  const producto = cantidad * pu;
  const envio = envioDe(cantidad, zona);
  return { cantidad, precioUnidad: pu, producto, envio, total: producto + envio };
}

export function money(n: number): string {
  return `$${n.toLocaleString('es-CO')}`;
}

/**
 * Empuje a un paquete mayor cuando el siguiente sale casi igual o más barato.
 * - 11 en el área: con 1 más, envío gratis (brief).
 * - 22 y 23: 24 cuestan menos (brief).
 * - 21: 24 cuestan apenas $6.000 más (agregado, aprobado sin objeción el 9-nov).
 */
export function empujon(cantidad: number, zona: Zona): { objetivo: number; texto: string } | null {
  const doce = cotizar(DESDE_ENVIO_GRATIS, zona).total;
  if (zona === 'am' && cantidad === DESDE_ENVIO_GRATIS - 1) {
    return { objetivo: DESDE_ENVIO_GRATIS, texto: `Con 1 más, envío gratis: docena por ${money(doce)}.` };
  }
  const p24 = cotizar(DESDE_PRECIO_24, zona).producto;
  if (cantidad === 22 || cantidad === 23) {
    const actual = cantidad * PRECIO_UNIDAD;
    return { objetivo: 24, texto: `24 láminas cuestan ${money(p24)}: menos que ${cantidad} (${money(actual)}).` };
  }
  if (cantidad === 21) {
    return { objetivo: 24, texto: `Por ${money(p24 - 21 * PRECIO_UNIDAD)} más lleva 24 láminas (${money(p24)}).` };
  }
  return null;
}

/** Láminas que faltan para el envío gratis en el área metropolitana (0 = ya lo tiene). */
export function faltanParaEnvioGratis(cantidad: number): number {
  return Math.max(0, DESDE_ENVIO_GRATIS - cantidad);
}

/** Eventos del embudo (ViewContent, AddToCart, InitiateCheckout): producto sin envío. El Purchase lleva el total real. */
export function datosMetaLaminas(cantidad: number) {
  return {
    categoria: CATEGORIA,
    valor: cotizar(cantidad, 'am').producto,
    contenido: { ids: [CONTENT_ID], numItems: cantidad },
  };
}

export function urlCheckout(cantidad: number): string {
  return `/tienda/pedido?n=${cantidad}`;
}
