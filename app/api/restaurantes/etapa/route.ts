/**
 * Schedule y Purchase de restaurantes, cuando cambia el `estado` en la hoja.
 * También el Lead de un descalificado que se pasa a "Recuperado": con el mismo
 * event_id (= lead_id) y la hora en que llenó el formulario (`eventTime`), que
 * debe estar dentro de los 7 días que acepta Meta.
 *
 * Quien llama es el Apps Script de la hoja, no el navegador: la barrera es el
 * secreto compartido (el mismo con que /api/restaurantes escribe en la hoja).
 * El token de Meta vive solo aquí, en Vercel; el script nunca lo ve.
 *
 * Nunca se registra el contenido de la fila en los logs.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { capiConfigurada, enviarEventoAMeta } from '@/lib/meta/capi';
import { secretoValido } from '@/lib/meta/cierre';
import { construirEvento, eventTimeRecuperado } from '@/lib/restaurantes/eventos';

const SECRETO = process.env.HOJA_RESTAURANTES_SECRETO ?? '';

/**
 * Tope del valor de un contrato. Un plan anual de un restaurante grande puede
 * pasar del tope general del sitio (pensado para hogares); esto solo frena una
 * cifra absurda escrita por error, que le enseñaría a Meta un cliente irreal.
 */
const VALOR_MAXIMO_CONTRATO = 50_000_000;

function texto(valor: unknown, max: number): string | undefined {
  if (typeof valor !== 'string' && typeof valor !== 'number') return undefined;
  const limpio = String(valor).trim();
  return limpio ? limpio.slice(0, max) : undefined;
}

export async function POST(req: NextRequest) {
  if (!SECRETO || !capiConfigurada('restaurantes')) {
    return NextResponse.json({ ok: false, motivo: 'sin-configurar' }, { status: 503 });
  }

  let c: Record<string, unknown>;
  try {
    c = await req.json();
  } catch {
    return NextResponse.json({ ok: false, motivo: 'json' }, { status: 400 });
  }
  if (!secretoValido(c.secreto, SECRETO)) {
    return NextResponse.json({ ok: false, motivo: 'secreto' }, { status: 401 });
  }

  const evento = c.evento === 'Lead' || c.evento === 'Schedule' || c.evento === 'Purchase' ? c.evento : null;
  const leadId = texto(c.leadId, 64);
  if (!evento || !leadId || leadId.length < 8) {
    return NextResponse.json({ ok: false, motivo: 'invalido' }, { status: 400 });
  }

  // El Lead recuperado sale con la hora del formulario: con la de hoy, Meta lo
  // pegaría a otro clic y otro día de gasto.
  let ahoraMs: number | undefined;
  if (evento === 'Lead') {
    const t = eventTimeRecuperado(c.eventTime);
    if (t === null) return NextResponse.json({ ok: false, motivo: 'event_time', detalle: 'futuro o con más de 7 días' }, { status: 400 });
    ahoraMs = t * 1000;
  }

  let valor: number | undefined;
  if (evento === 'Purchase') {
    // Un Purchase en 0 le enseña a Meta que un cliente no vale nada.
    valor = Math.round(Number(c.valor));
    if (!Number.isFinite(valor) || valor <= 0 || valor > VALOR_MAXIMO_CONTRATO) {
      return NextResponse.json({ ok: false, motivo: 'valor' }, { status: 400 });
    }
  }

  const datos = await construirEvento({
    evento,
    leadId,
    valor,
    autoriza: texto(c.autoriza, 4) === 'sí',
    nombre: texto(c.nombre, 60),
    celular: texto(c.whatsapp, 20),
    municipio: texto(c.municipio, 40),
    externalId: texto(c.externalId, 64),
    fbp: texto(c.fbp, 100),
    fbc: texto(c.fbc, 600),
    ip: texto(c.ip, 45),
    navegador: texto(c.navegador, 500),
    url: texto(c.url, 500),
  }, ahoraMs);

  const r = await enviarEventoAMeta(datos, 'restaurantes');
  if (!r.ok) {
    console.error(`[restaurantes] ${evento} no enviado:`, r.motivo, r.detalle ?? '');
    return NextResponse.json({ ok: false, motivo: r.motivo, detalle: r.detalle?.slice(0, 200) }, { status: 502 });
  }
  return NextResponse.json({ ok: true, ...r.respuesta, event_time: datos.event_time });
}

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
