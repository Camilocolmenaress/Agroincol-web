/**
 * Eventos de Meta del embudo de restaurantes, armados en el servidor.
 *
 *   Lead      — al enviar el formulario, SOLO si calificó. Mismo event_id que el
 *               Pixel del navegador (= lead_id), así Meta lo cuenta una vez.
 *   Schedule  — cuando en la hoja la fila pasa a "Inspección agendada".
 *   Purchase  — cuando pasa a "Contratado", con el valor del contrato.
 *
 * Schedule y Purchase salen desde la hoja (Apps Script → /api/restaurantes/etapa)
 * con los identificadores que se guardaron al recibir el lead: fbp, fbc, IP y
 * navegador. Sin ellos Meta no los enlaza al clic del anuncio.
 *
 * `action_source: 'website'` también en Schedule y Purchase, aunque el contrato
 * se firme en persona: la campaña optimiza conversiones del sitio y Meta solo
 * usa para eso los eventos marcados `website`. Es lo mismo que hace /api/cierre.
 *
 * Aquí no hay red: solo la construcción del evento, para poder revisarla y
 * probarla completa. Los datos de la persona van hasheados y SOLO si autorizó
 * (Ley 1581 de 2012).
 */

import { MONEDA } from '@/lib/meta/eventos';
import { sha256, userDataParaMeta } from '@/lib/meta/hash';

export type EventoRestaurante = 'Lead' | 'Schedule' | 'Purchase';

export interface DatosEvento {
  evento: EventoRestaurante;
  leadId: string;
  autoriza: boolean;
  /** Solo Purchase: total del contrato en COP. */
  valor?: number;
  nombre?: string;
  celular?: string;
  municipio?: string;
  /** Id anónimo del dispositivo; si no hay, se usa el lead_id. */
  externalId?: string;
  fbp?: string;
  fbc?: string;
  ip?: string;
  navegador?: string;
  url?: string;
}

/** El Lead usa el lead_id tal cual (es el que comparte con el Pixel). */
export function eventIdDe(evento: EventoRestaurante, leadId: string): string {
  return evento === 'Lead' ? leadId : `${evento.toLowerCase()}-${leadId}`;
}

/** Celular colombiano: 10 dígitos que empiezan por 3. Acepta +57 y espacios. */
export function celularNormalizado(valor: unknown): string | null {
  if (typeof valor !== 'string') return null;
  let digitos = valor.replace(/\D/g, '');
  if (digitos.length === 12 && digitos.startsWith('57')) digitos = digitos.slice(2);
  return /^3\d{9}$/.test(digitos) ? digitos : null;
}

/** UTM y fbclid de la URL con la que llegó la persona. */
export function origenDeUrl(url: string): Record<'utm_source' | 'utm_campaign' | 'utm_content' | 'fbclid', string> {
  let p: URLSearchParams;
  try {
    p = new URL(url).searchParams;
  } catch {
    p = new URLSearchParams();
  }
  const leer = (k: string) => (p.get(k) ?? '').slice(0, 200);
  return {
    utm_source: leer('utm_source'),
    utm_campaign: leer('utm_campaign'),
    utm_content: leer('utm_content'),
    fbclid: leer('fbclid'),
  };
}

function sinVacios(objeto: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(objeto).filter(([, v]) => v !== undefined && v !== ''));
}

export async function construirEvento(d: DatosEvento, ahoraMs = Date.now()): Promise<Record<string, unknown>> {
  const personales = await userDataParaMeta(
    { nombreCompleto: d.nombre, telefono: d.celular, municipio: d.municipio },
    d.autoriza
  );

  return {
    event_name: d.evento,
    event_time: Math.floor(ahoraMs / 1000),
    event_id: eventIdDe(d.evento, d.leadId),
    action_source: 'website',
    ...(d.url ? { event_source_url: d.url } : {}),
    user_data: sinVacios({
      ...personales,
      // Número aleatorio, no un dato de la persona: va con o sin autorización.
      external_id: await sha256(d.externalId || d.leadId),
      fbp: d.fbp,
      fbc: d.fbc,
      client_ip_address: d.ip,
      client_user_agent: d.navegador,
    }),
    custom_data: {
      content_category: 'restaurantes',
      ...(d.evento === 'Purchase' && d.valor ? { value: d.valor, currency: MONEDA } : {}),
    },
  };
}
