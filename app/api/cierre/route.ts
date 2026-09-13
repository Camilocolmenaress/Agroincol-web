/**
 * Purchase hacia Meta cuando un lead se cierra como cliente.
 *
 * Quien llama es el Apps Script de la hoja de leads, no el navegador. Por eso
 * la barrera es un secreto compartido (el mismo que usa /api/contact para
 * escribir en la hoja, en sentido contrario) y no hay validación de Origin ni
 * límite por IP: Apps Script no manda Origin y sus llamadas salen de IPs de
 * Google.
 *
 * Purchase NO está en la lista de eventos que acepta /api/meta, a propósito:
 * nadie debe poder inflar ventas desde la consola del navegador. Solo sale por
 * aquí, con secreto.
 *
 * Nunca se registra el contenido de la fila en los logs: son datos personales.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { VALOR_MAXIMO } from '@/lib/meta/eventos';
import { capiConfigurada, enviarEventoAMeta } from '@/lib/meta/capi';
import { construirEventoCierre, secretoValido } from '@/lib/meta/cierre';

const SECRETO = process.env.HOJA_LEADS_SECRETO ?? '';

/** Recorta y valida un campo de texto opcional venido de la hoja. */
function texto(valor: unknown, max: number): string | undefined {
  if (typeof valor !== 'string') return undefined;
  const limpio = valor.trim();
  return limpio.length === 0 ? undefined : limpio.slice(0, max);
}

export async function POST(req: NextRequest) {
  if (!SECRETO || !capiConfigurada()) {
    return NextResponse.json({ ok: false, motivo: 'sin-configurar' }, { status: 503 });
  }

  let crudo: Record<string, unknown>;
  try {
    crudo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, motivo: 'json' }, { status: 400 });
  }

  // El secreto se comprueba antes de mirar nada más: sin él no hay conversación.
  if (!secretoValido(crudo.secreto, SECRETO)) {
    return NextResponse.json({ ok: false, motivo: 'secreto' }, { status: 401 });
  }

  const eventId = texto(crudo.eventId, 64);
  if (!eventId || eventId.length < 8) {
    return NextResponse.json({ ok: false, motivo: 'sin-eventid' }, { status: 400 });
  }

  // El valor lo escribe a mano quien cierra la venta. Un Purchase en 0 no le
  // enseña nada a Meta sobre cuánto vale un cliente, así que se rechaza y la
  // hoja muestra el motivo en vez de mandar un evento inútil.
  const valor = Number(crudo.valor);
  if (!Number.isFinite(valor) || valor <= 0 || valor > VALOR_MAXIMO) {
    return NextResponse.json({ ok: false, motivo: 'valor' }, { status: 400 });
  }

  const evento = await construirEventoCierre({
    eventId,
    valor: Math.round(valor),
    // La hoja guarda 'sí' / 'no'. Cualquier otra cosa cuenta como no.
    autoriza: texto(crudo.autoriza, 4) === 'sí',
    categoria: texto(crudo.categoria, 20),
    nombre: texto(crudo.nombre, 60),
    telefono: texto(crudo.telefono, 20),
    municipio: texto(crudo.municipio, 40),
    fbp: texto(crudo.fbp, 100),
    fbc: texto(crudo.fbc, 600),
    externalId: texto(crudo.externalId, 64),
    ip: texto(crudo.ip, 45),
    navegador: texto(crudo.navegador, 500),
    url: texto(crudo.url, 500),
  });

  const resultado = await enviarEventoAMeta(evento);
  if (!resultado.ok) {
    console.error('[cierre] Meta no recibió el Purchase:', resultado.motivo, resultado.detalle ?? '');
    return NextResponse.json({ ok: false, motivo: resultado.motivo }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

/** El endpoint solo acepta POST. */
export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
