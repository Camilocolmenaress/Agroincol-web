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
 *
 * Los cuatro de compra son del e-commerce de EcoGel (/ecogel), uno por paso
 * real del recorrido para que cada columna de Meta mida algo distinto:
 *
 * - `ViewContent`: la oferta (precio y cantidad) aparece en pantalla. No al
 *   cargar la página: eso ya lo mide la visita.
 * - `AddToCart`: carga /ecogel/pedido con la cantidad elegida. No hay carrito;
 *   llegar al checkout ES elegir y avanzar.
 * - `InitiateCheckout`: escribe en el primer campo del formulario. Separa a
 *   quien se asusta al ver el formulario de quien lo abandona a medias.
 * - `Purchase`: al crear el pedido. Sale por el servidor desde
 *   /api/ecogel/pedido (lleva datos hasheados) y por el Pixel desde
 *   /ecogel/gracias, con el mismo event_id.
 */
export const EVENTOS = ['PageView', 'Lead', 'Contact', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase'] as const;

export type NombreEvento = (typeof EVENTOS)[number];

/**
 * Eventos que un visitante dispara una sola vez por sesión. PageView no.
 * ViewContent sí: volver del checkout a la landing no es ver la oferta otra vez.
 */
export const UNA_VEZ_POR_SESION: readonly NombreEvento[] = ['Lead', 'Contact', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase'];

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
