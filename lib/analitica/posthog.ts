'use client';

/**
 * Envío de eventos del embudo a PostHog.
 *
 * PostHog NO se importa estáticamente aquí a propósito. La librería pesa cerca
 * de 100 kB y este módulo lo usa el Pixel, que a su vez usan el formulario y el
 * tracker de clics — importarla de forma normal la metía entera en el bundle
 * inicial de la landing y le duplicaba el JavaScript de arranque. En una página
 * de tráfico pago desde móvil, eso cuesta más conversiones de las que la
 * medición ayuda a ganar.
 *
 * En su lugar, PostHogInit la carga en diferido y registra el cliente aquí.
 * Mientras tanto los eventos se encolan; cuando llega, se vacían en orden.
 *
 * PostHog no es para Meta ni para atribución: es para ver la landing con ojos
 * de cliente. Embudo por pasos, tiempo en página y grabaciones enmascaradas,
 * para saber en qué escalón se cae la gente antes de dejar sus datos.
 */

import { MONEDA, type NombreEvento } from '@/lib/meta/eventos';

type Capturador = { capture: (evento: string, propiedades?: Record<string, unknown>) => void };

let cliente: Capturador | null = null;
const pendientes: Array<[string, Record<string, unknown>]> = [];

/** La llama PostHogInit cuando termina de cargar la librería. */
export function registrarClienteAnalitica(c: Capturador): void {
  cliente = c;
  while (pendientes.length > 0) {
    const siguiente = pendientes.shift();
    if (!siguiente) break;
    try {
      c.capture(siguiente[0], siguiente[1]);
    } catch {
      // La medición nunca puede romper la página.
    }
  }
}

export interface DatosEmbudo {
  eventId: string;
  valor?: number;
  /** 'chinches' o 'comejen': permite segmentar el embudo por plaga. */
  categoria?: string;
}

/**
 * PageView no se registra: PostHog ya captura `$pageview` y `$pageleave` solo
 * (de ahí sale el tiempo en página) y un segundo evento de vista partiría el
 * embudo en dos.
 */
export function registrarEnEmbudo(evento: NombreEvento, datos: DatosEmbudo): void {
  if (evento === 'PageView') return;

  const propiedades: Record<string, unknown> = { event_id: datos.eventId };
  if (datos.categoria) propiedades.plaga = datos.categoria;
  if (datos.valor !== undefined) {
    propiedades.valor = datos.valor;
    propiedades.moneda = MONEDA;
  }

  if (!cliente) {
    // Tope bajo: si PostHog nunca carga (bloqueador), no crece sin control.
    if (pendientes.length < 20) pendientes.push([evento, propiedades]);
    return;
  }

  try {
    cliente.capture(evento, propiedades);
  } catch {
    // La medición nunca puede romper la página.
  }
}
