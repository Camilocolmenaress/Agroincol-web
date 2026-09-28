import { NextResponse, type NextRequest } from 'next/server';
import { correoPremio, esCodigoPremio, nuevoCodigoPremio, sortearPremio, vencimientoPremio } from '@/lib/ecogel-premios';
import { consultarCodigo, hojaPedidosConfigurada, registrarGiro } from '@/lib/hoja-pedidos';

/**
 * Ruleta de EcoGel.
 *
 * POST: gira. El premio se sortea AQUÍ, con las probabilidades declaradas en
 * lib/ecogel-premios.ts; el navegador solo anima la ruleta hasta el resultado.
 * Un correo gira una sola vez: si ya giró, el Apps Script devuelve su premio de
 * entonces y aquí se responde ese, sin sortear otro.
 *
 * GET ?codigo=: estado de un código, para que el checkout lo muestre antes de
 * confirmar. Nunca devuelve el correo al que pertenece.
 *
 * Nada de esto dispara eventos de Meta: el pop-up mide RuletaCorreo como
 * evento personalizado desde el navegador, sin marcarlo como conversión.
 */

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mismoOrigen(req: NextRequest): boolean {
  const origen = req.headers.get('origin');
  if (!origen) return true;
  try {
    return new URL(origen).host === req.nextUrl.host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!mismoOrigen(req)) return NextResponse.json({ ok: false, motivo: 'origen' }, { status: 403 });
  if (!hojaPedidosConfigurada()) return NextResponse.json({ ok: false, motivo: 'no-disponible' }, { status: 503 });

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errores: { general: 'Datos inválidos' } }, { status: 400 });
  }
  // Honeypot: un bot lo llena, una persona no lo ve. No se sortea nada.
  if (typeof cuerpo.website === 'string' && cuerpo.website) return NextResponse.json({ ok: false, motivo: 'no-disponible' }, { status: 503 });

  const correo = typeof cuerpo.correo === 'string' ? cuerpo.correo.trim().toLowerCase().slice(0, 120) : '';
  const errores: Record<string, string> = {};
  if (!CORREO_RE.test(correo)) errores.correo = 'Escribe un correo válido para enviarte el código';
  if (cuerpo.autoriza !== true) errores.autoriza = 'Para enviarte el premio necesitamos tu autorización';
  if (Object.keys(errores).length > 0) return NextResponse.json({ ok: false, errores }, { status: 400 });

  const base = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const url = typeof cuerpo.sourceUrl === 'string' && cuerpo.sourceUrl.length <= 500 ? cuerpo.sourceUrl : '';
  const premio = sortearPremio();
  const codigo = nuevoCodigoPremio();
  const vence = vencimientoPremio(premio.id).toISOString();
  const fecha = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'medium' }).format(new Date());

  const resultado = await registrarGiro(
    { fecha, correo, premio: premio.id, codigo, vence, estado: 'disponible', pedidoId: '', fechaUso: '', autorizaDatos: 'sí', url },
    correoPremio({ premio: premio.id, codigo, vence, base }),
  );
  if (!resultado) {
    console.error('[ruleta] la hoja no respondió al registrar el giro');
    return NextResponse.json({ ok: false, motivo: 'hoja' }, { status: 502 });
  }
  const r = resultado.registro;
  return NextResponse.json({ ok: true, premio: r.premio, codigo: r.codigo, vence: r.vence, estado: r.estado, repetido: !resultado.nuevo });
}

export async function GET(req: NextRequest) {
  const codigo = req.nextUrl.searchParams.get('codigo') ?? '';
  if (!esCodigoPremio(codigo)) return NextResponse.json({ ok: false }, { status: 400 });
  const r = await consultarCodigo(codigo);
  if (!r) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, premio: r.premio, codigo: r.codigo, vence: r.vence, estado: r.estado });
}
