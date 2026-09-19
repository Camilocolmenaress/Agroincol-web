'use client';

/**
 * Disparo de eventos hacia Meta, por los dos caminos a la vez.
 *
 * Cada evento sale con un `event_id` único que va idéntico al Pixel del
 * navegador y a la API de Conversiones. Meta deduplica por
 * (event_name, event_id): si no compartieran el id, cada conversión contaría
 * dos veces y el CAC que veas sería la mitad del real.
 *
 * Hay una SEGUNDA deduplicación, distinta y propia de este proyecto: un mismo
 * visitante no puede disparar dos veces el mismo evento de conversión en una
 * sesión. Sin eso, quien llena el formulario y además escribe por WhatsApp
 * contaría como dos conversiones, el CPL se vería falsamente bueno y la tasa
 * de cierre falsamente mala. Ver `yaSeDisparo`.
 */

import { idDeVisitante } from './visitante';
import { registrarEnEmbudo } from '@/lib/analitica/posthog';
import { MONEDA, VALOR_MAXIMO, nuevoEventId, type NombreEvento } from './eventos';

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
    _fbq?: unknown;
  }
}

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';
export const pixelActivo = PIXEL_ID.length > 0;

/** Eventos de conversión: uno por sesión y por visitante. PageView y ViewContent no. */
const UNA_VEZ_POR_SESION: NombreEvento[] = ['Lead', 'Contact', 'InitiateCheckout', 'Purchase'];

/**
 * ¿Este visitante ya disparó este evento en esta sesión?
 *
 * sessionStorage y no localStorage a propósito: si la persona vuelve mañana con
 * otro problema, es una conversión nueva de verdad y debe contarse. Lo que se
 * quiere evitar es el doble conteo dentro de una misma visita.
 *
 * Si el almacenamiento está bloqueado se deja pasar el evento: perder una
 * conversión es peor que contarla dos veces.
 */
function yaSeDisparo(evento: NombreEvento): boolean {
  if (!UNA_VEZ_POR_SESION.includes(evento)) return false;
  try {
    return window.sessionStorage.getItem(`agroincol_ev_${evento}`) === '1';
  } catch {
    return false;
  }
}

function marcarDisparado(evento: NombreEvento): void {
  if (!UNA_VEZ_POR_SESION.includes(evento)) return;
  try {
    window.sessionStorage.setItem(`agroincol_ev_${evento}`, '1');
  } catch {
    // Almacenamiento bloqueado: sin marca, pero el evento ya salió.
  }
}

export interface ContenidoEvento {
  /** `content_ids` de Meta. Para EcoGel siempre ['ecogel']. */
  ids: string[];
  /** Unidades del pedido. */
  numItems?: number;
}

interface DatosEvento {
  valor?: number;
  /**
   * Qué landing generó el evento: 'chinches' o 'comejen'.
   *
   * Un solo pixel para las dos landings, porque Meta no deja que un conjunto de
   * anuncios optimice hacia dos pixeles y el presupuesto solo alcanza para un
   * conjunto. Este parámetro es lo que permite separarlas igual: con él se
   * crean conversiones personalizadas por plaga en el Administrador de eventos,
   * y PostHog puede segmentar el embudo, sin partir el historial del pixel.
   */
  categoria?: string;
  contenido?: ContenidoEvento;
  /**
   * Event id ya generado por otro lado (p. ej. el que guardó el checkout para
   * que /gracias dispare el Purchase con el mismo id que usó el servidor).
   */
  eventId?: string;
}

function saneaValor(valor: number | undefined): number | undefined {
  if (valor === undefined || !Number.isFinite(valor)) return undefined;
  return Math.min(Math.max(Math.round(valor), 0), VALOR_MAXIMO);
}

/**
 * Dispara SOLO el Pixel del navegador y devuelve el event_id, o null si el
 * evento ya se disparó en esta sesión o el Pixel no está configurado.
 *
 * Se usa cuando el camino del servidor lo hace otra ruta (el formulario manda
 * su Lead desde /api/contact, que además adjunta los datos hasheados). Si aquí
 * se llamara también a /api/meta, el Lead saldría dos veces por el servidor.
 */
export function soloPixel(evento: NombreEvento, datos: DatosEvento = {}): string | null {
  if (!pixelActivo || typeof window === 'undefined') return null;
  if (yaSeDisparo(evento)) return null;

  const eventId = datos.eventId ?? nuevoEventId();
  const valor = saneaValor(datos.valor);

  const parametros: Record<string, unknown> = {};
  if (valor !== undefined) {
    parametros.value = valor;
    parametros.currency = MONEDA;
  }
  if (datos.categoria) parametros.content_category = datos.categoria;
  if (datos.contenido) {
    parametros.content_ids = datos.contenido.ids;
    parametros.content_type = 'product';
    if (datos.contenido.numItems !== undefined) parametros.num_items = datos.contenido.numItems;
  }

  // 1) Pixel del navegador.
  try {
    window.fbq?.('track', evento, parametros, { eventID: eventId });
  } catch {
    // Bloqueador de anuncios: el camino del servidor sigue funcionando.
  }

  // 2) Embudo en PostHog, con el mismo event_id para poder cruzarlos.
  registrarEnEmbudo(evento, { eventId, valor, categoria: datos.categoria });

  marcarDisparado(evento);
  return eventId;
}

/**
 * Dispara el evento por los dos caminos: Pixel y API de Conversiones.
 *
 * No devuelve promesa a propósito: quien llama nunca debería esperar a que la
 * medición termine. Si Meta se cae, la página sigue funcionando.
 */
export function rastrear(evento: NombreEvento, datos: DatosEvento = {}): void {
  const eventId = soloPixel(evento, datos);
  if (!eventId) return;
  enviarACapi('/api/meta', {
    evento,
    eventId,
    valor: saneaValor(datos.valor),
    categoria: datos.categoria,
    contenido: datos.contenido,
  });
}

/**
 * Manda el evento a nuestro servidor.
 *
 * keepalive es obligatorio: el Contact se dispara justo antes de salir hacia
 * WhatsApp o hacia la app de teléfono, y sin keepalive el navegador cancela la
 * petición al navegar. Perderíamos justo el evento que estamos midiendo.
 */
export function enviarACapi(ruta: string, cuerpo: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    void fetch(ruta, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...cuerpo, externalId: idDeVisitante(), sourceUrl: window.location.href }),
      keepalive: true,
    }).catch(() => {
      // La medición nunca puede romper la página.
    });
  } catch {
    // idem
  }
}
