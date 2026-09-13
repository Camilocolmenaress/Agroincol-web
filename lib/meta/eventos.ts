/**
 * Contrato compartido entre el Pixel del navegador y la API de Conversiones.
 *
 * No importa nada del navegador ni del servidor a propósito: el mismo
 * `event_id` y la misma lista de eventos valen para los dos lados, que es
 * justo lo que Meta necesita para deduplicar.
 */

/**
 * Los tres eventos que el sitio envía. Nada más.
 *
 * La separación entre `Lead` y `Contact` es deliberada y es el corazón de la
 * medición de esta campaña:
 *
 * - `Lead` lo dispara SOLO el formulario. Es la conversión que optimiza la
 *   campaña, porque llega calificada: sabemos municipio, franja horaria y que
 *   la persona autorizó el contacto.
 * - `Contact` lo disparan los clics a WhatsApp y a teléfono. Se mide para que
 *   esos leads no queden invisibles —si no, las compuertas del tramo 1 matan
 *   una campaña rentable— pero NO se optimiza hacia él: es más barato y de
 *   peor calidad, y el algoritmo se iría hacia ahí.
 *
 * Si los dos fueran `Lead`, Meta optimizaría hacia el más barato y barato aquí
 * significa peor.
 */
export const EVENTOS = ['PageView', 'Lead', 'Contact'] as const;

export type NombreEvento = (typeof EVENTOS)[number];

export function esEventoValido(valor: unknown): valor is NombreEvento {
  return typeof valor === 'string' && (EVENTOS as readonly string[]).includes(valor);
}

export const MONEDA = 'COP';

/**
 * Tope del valor aceptado. El tratamiento más caro son $420.000; esto deja
 * margen de sobra y evita que alguien infle las métricas de la cuenta
 * publicitaria llamando al endpoint a mano con una cifra absurda.
 */
export const VALOR_MAXIMO = 5_000_000;

/** Id único por evento. Lo comparten Pixel y CAPI: es lo que permite deduplicar. */
export function nuevoEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
