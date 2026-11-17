// Láminas de Captura AGROINCOL: precios, envío por zona y los textos que no se
// pueden improvisar (garantía, entrega). Sin imports de Node: lo usan cliente y
// servidor. El servidor recalcula el total desde aquí; lo que mande el
// navegador nunca se usa como precio.

export type Zona = 'am' | 'fuera';

export const NOMBRE = 'Láminas de Captura AGROINCOL';
export const CONTENT_ID = 'laminas-captura';
export const CATEGORIA = 'laminas';

export const MINIMO = 3;
/** Tope de cordura para el selector y el servidor; más que esto es un pedido por WhatsApp. */
export const MAXIMO = 500;
export const PAQUETES = [3, 12, 24] as const;
export const RECOMENDADO = 12;
/** Para quién es cada paquete. Las mismas palabras en el selector y en "Cuántas necesita". */
export const ETIQUETA_PAQUETE: Record<(typeof PAQUETES)[number], string> = {
  3: 'Perfecto para el hogar',
  12: 'Perfecto para un restaurante',
  24: 'Perfecto para bodegas o fincas',
};

/**
 * Escala de Camilo (17-nov-2026): el precio por lámina baja por tramos. El
 * paquete de 3 es el ancla: el único ahorro que se muestra es contra su
 * precio. Sin precios tachados ni "antes": nadie vio otro precio.
 */
export const ESCALA = [
  { desde: 3, precio: 10_000 },
  { desde: 12, precio: 6_000 },
  { desde: 24, precio: 5_400 },
] as const;
export const PRECIO_ANCLA = ESCALA[0].precio;
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
  return [...ESCALA].reverse().find((t) => cantidad >= t.desde)?.precio ?? PRECIO_ANCLA;
}

/** Ahorro por lámina frente al paquete de 3 (0 en el tramo del ancla). */
export function ahorroPorLamina(cantidad: number): number {
  return PRECIO_ANCLA - precioUnidad(cantidad);
}

/**
 * Calculadora "¿Cuántas necesito?": 1-3 → 3, 4-12 → docena, 13-24 → 24.
 * Más de 24 → las que necesita (el de 24 más las extra, todas a $5.400).
 */
export function paqueteSugerido(necesarias: number): number {
  return PAQUETES.find((p) => necesarias <= p) ?? Math.min(MAXIMO, Math.ceil(necesarias));
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

/** Hasta cuánto más se sugiere pasar al paquete siguiente (21 → 24 costaba $6.000 más y se aprobó el 9-nov). */
const UMBRAL_EMPUJON = 6_000;

/**
 * Empuje al paquete siguiente (12 o 24) cuando sale más barato o casi igual.
 * Con la escala del 17-nov, de 7 a 11 láminas en el área cuestan más que la
 * docena con envío gratis, y 22-23 más que 24: sin este aviso el selector de
 * cantidad le cobraría más a quien lleva menos. Se comparan totales con envío.
 */
export function empujon(cantidad: number, zona: Zona): { objetivo: number; texto: string } | null {
  const objetivo = PAQUETES.find((p) => p > cantidad && p > MINIMO);
  if (!objetivo) return null;
  const actual = cotizar(cantidad, zona).total;
  const destino = cotizar(objetivo, zona);
  const gratis = zona === 'am' && destino.envio === 0 && envioDe(cantidad, zona) > 0 ? ' con envío gratis' : '';
  if (destino.total <= actual) {
    return { objetivo, texto: `${objetivo} láminas cuestan ${money(destino.total)}${gratis}: menos que ${cantidad} (${money(actual)}).` };
  }
  const diferencia = destino.total - actual;
  if (diferencia <= UMBRAL_EMPUJON) {
    return { objetivo, texto: `Por ${money(diferencia)} más lleva ${objetivo} láminas${gratis} (${money(destino.total)}).` };
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
