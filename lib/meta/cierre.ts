/**
 * El evento Purchase que sale cuando un lead se cierra como cliente.
 *
 * Meta solo conoce el `Lead` (alguien llenó el formulario). Sin esto optimiza
 * hacia «gente que deja datos», no hacia «gente que contrata», y con el tiempo
 * eso trae curiosos. El Purchase cierra ese hueco y se enlaza al Lead original
 * por `cierre-<eventId>`: un reintento desde la hoja produce el mismo id y Meta
 * lo deduplica.
 *
 * Aquí no hay red ni request: solo la construcción del evento, para que se
 * pueda revisar completa. Misma línea legal que el Lead: los datos de la
 * persona van hasheados y SOLO si autorizó el tratamiento (Ley 1581 de 2012).
 */

import { timingSafeEqual } from 'node:crypto';
import { MONEDA } from './eventos';
import { sha256, userDataParaMeta } from './hash';

/** Una fila de la hoja, tal como la manda el Apps Script. */
export interface FilaCierre {
  eventId: string;
  /** Lo que realmente facturó ese cliente. Lo escribe a mano quien cierra. */
  valor: number;
  autoriza: boolean;
  /** 'chinches' o 'comejen': llega como content_category, igual que el Lead. */
  categoria?: string;
  nombre?: string;
  telefono?: string;
  municipio?: string;
  fbp?: string;
  fbc?: string;
  externalId?: string;
  ip?: string;
  navegador?: string;
  url?: string;
}

/** Quita los campos vacíos: una celda vacía no es un dato, y Meta lo penaliza. */
function sinVacios(objeto: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(objeto).filter(([, valor]) => valor !== undefined && valor !== '')
  );
}

export async function construirEventoCierre(
  fila: FilaCierre,
  ahoraMs = Date.now()
): Promise<Record<string, unknown>> {
  const userData = await userDataParaMeta(
    {
      nombreCompleto: fila.nombre,
      telefono: fila.telefono,
      municipio: fila.municipio,
    },
    fila.autoriza
  );

  const categoria =
    fila.categoria === 'chinches' || fila.categoria === 'comejen' ? fila.categoria : undefined;

  return {
    event_name: 'Purchase',
    event_time: Math.floor(ahoraMs / 1000),
    event_id: `cierre-${fila.eventId}`,
    action_source: 'website',
    ...(fila.url ? { event_source_url: fila.url } : {}),
    user_data: sinVacios({
      ...userData,
      // El identificador de dispositivo no depende de la autorización: es un
      // número aleatorio, no un dato de la persona, igual que _fbp.
      external_id: fila.externalId ? await sha256(fila.externalId) : undefined,
      fbp: fila.fbp,
      fbc: fila.fbc,
      client_ip_address: fila.ip,
      client_user_agent: fila.navegador,
    }),
    custom_data: {
      value: fila.valor,
      currency: MONEDA,
      ...(categoria ? { content_category: categoria } : {}),
    },
  };
}

/**
 * Comparación en tiempo constante. Con `===` el tiempo de respuesta delata
 * cuántos caracteres del secreto acertó quien prueba.
 */
export function secretoValido(recibido: unknown, esperado: string): boolean {
  if (typeof recibido !== 'string' || esperado.length === 0) return false;
  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
