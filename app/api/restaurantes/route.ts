/**
 * Recibe el formulario de /lp/restaurantes.
 *
 * Recibe a cualquier hora. En orden, y cada paso es una barrera:
 * 1. Respuestas: solo opciones de la lista; datos completos; autorización.
 * 2. Calificación: se RECALCULA aquí. El puntaje del navegador no existe.
 * 3. Fila en la hoja, calificado o no. La hoja avisa por correo si calificó.
 * 4. Lead a Meta SOLO si calificó, con el mismo event_id que el Pixel.
 *
 * El navegador recibe `calificado` y con eso decide si dispara el Pixel. Así un
 * descalificado nunca produce un Lead, ni por el servidor ni por el navegador.
 * También recibe `contacto` ("en 5 minutos" o la próxima apertura del equipo,
 * según el reloj del servidor) para decirle cuándo lo llamamos.
 *
 * Nunca se registra el contenido del lead en los logs: son datos personales.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { cuandoContactamos, estaAbierto } from '@/lib/restaurantes/horario';
import { calificar, opcionDe, respuestasValidas } from '@/lib/restaurantes/calificacion';
import { celularNormalizado, construirEvento, origenDeUrl } from '@/lib/restaurantes/eventos';
import { capiConfigurada, enviarEventoAMeta } from '@/lib/meta/capi';
import { resolverFbc } from '@/lib/meta/fbc';
import { FBP_DURACION_S, resolverFbp } from '@/lib/meta/fbp';
import { nuevoEventId } from '@/lib/meta/eventos';

const HOJA_URL = process.env.HOJA_RESTAURANTES_URL ?? '';
const HOJA_SECRETO = process.env.HOJA_RESTAURANTES_SECRETO ?? '';

/** Versión del texto de autorización que aceptó la persona. Prueba ante un reclamo. */
const POLITICA_VERSION = '2026-03-07';

const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function texto(valor: unknown, max: number): string {
  return typeof valor === 'string' ? valor.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

/**
 * Escribe la fila. Apps Script responde 302 tras un doPost exitoso: no se
 * sigue la redirección (ver /api/contact, mismo motivo).
 */
async function guardarEnHoja(fila: Record<string, unknown>): Promise<void> {
  if (!HOJA_URL || !HOJA_SECRETO) throw new Error('hoja sin configurar');
  const r = await fetch(HOJA_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secreto: HOJA_SECRETO, fila }),
    redirect: 'manual',
    signal: AbortSignal.timeout(10000),
  });
  if (r.status !== 200 && r.status !== 302) throw new Error(`la hoja respondió ${r.status}`);
}

export async function POST(req: NextRequest) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, motivo: 'json' }, { status: 400 });
  }

  // Honeypot: un bot llena el campo oculto. Se le responde éxito y no se guarda.
  if (texto(b.website, 100)) return NextResponse.json({ ok: true, calificado: false });

  const respuestas = respuestasValidas(b.respuestas);
  const nombre = texto(b.nombre, 60);
  const negocio = texto(b.negocio, 120);
  const celular = celularNormalizado(b.celular);
  const canal = b.canal === 'llamada' || b.canal === 'whatsapp' ? b.canal : null;

  if (!respuestas || nombre.length < 2 || negocio.length < 2 || !celular || !canal) {
    return NextResponse.json({ ok: false, motivo: 'datos' }, { status: 400 });
  }
  // La casilla es obligatoria (Ley 1581). Sin ella no se guarda nada.
  if (b.autoriza !== true) {
    return NextResponse.json({ ok: false, motivo: 'autorizacion' }, { status: 400 });
  }

  const resultado = calificar(respuestas);
  const leadId = typeof b.leadId === 'string' && FORMATO_UUID.test(b.leadId) ? b.leadId : nuevoEventId();

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '';
  const navegador = (req.headers.get('user-agent') ?? '').slice(0, 500);
  const url = texto(b.sourceUrl, 500) || 'https://agroincol.com/lp/restaurantes';
  const { fbp, generado } = resolverFbp(req.cookies.get('_fbp')?.value);
  const fbc = resolverFbc(req.cookies.get('_fbc')?.value, url) ?? '';
  const externalId = texto(b.externalId, 64);

  const ahora = new Date();
  const enHorario = estaAbierto(ahora);
  const contacto = cuandoContactamos(ahora);
  const fechaHora = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Bogota',
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(ahora);

  // Las respuestas van con su texto, no con el código: quien lee la hoja en el
  // celular no tiene que traducir "admin-consulta".
  const etiqueta = (id: Parameters<typeof opcionDe>[0]) => opcionDe(id, respuestas[id])?.etiqueta ?? '';

  try {
    await guardarEnHoja({
      lead_id: leadId,
      fecha_hora: fechaHora,
      calificado: resultado.calificado ? 'Sí' : 'No',
      puntaje: resultado.puntaje,
      motivo_descalificacion: resultado.motivo,
      prioridad: resultado.prioridad,
      plan_sugerido: resultado.planSugerido,
      nombre,
      negocio,
      // Con 57 delante: el enlace de WhatsApp del correo y el Purchase lo necesitan.
      whatsapp: `57${celular}`,
      canal_preferido: canal === 'llamada' ? 'Llamada' : 'WhatsApp',
      situacion: etiqueta('situacion'),
      tipo_negocio: etiqueta('tipo'),
      municipio: respuestas.municipio === 'otro' ? 'Otro' : respuestas.municipio,
      personas: etiqueta('personas'),
      rol: etiqueta('rol'),
      plan_anual: etiqueta('plan_anual'),
      presupuesto: etiqueta('presupuesto'),
      autoriza: 'sí',
      politica_version: POLITICA_VERSION,
      ...origenDeUrl(url),
      fbc,
      fbp,
      client_ip: ip,
      user_agent: navegador,
      external_id: externalId,
      url,
      // Lo que se le prometió: el correo lo repite y la mediana de minutos a
      // contacto cuenta solo los de horario (los de la noche esperan la apertura).
      en_horario: enHorario ? 'Sí' : 'No',
      contactar: contacto,
    });
  } catch (error) {
    // Aquí la hoja es la base de datos y la alarma del equipo: si no se guardó,
    // nadie va a llamar. Se le dice al visitante que reintente o escriba.
    console.error('[restaurantes] no se guardó el lead:', error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, motivo: 'hoja' }, { status: 502 });
  }

  const respuesta = NextResponse.json({ ok: true, calificado: resultado.calificado, leadId, enHorario, contacto });

  if (resultado.calificado && capiConfigurada('restaurantes')) {
    const evento = await construirEvento({
      evento: 'Lead',
      leadId,
      autoriza: true,
      nombre,
      celular,
      municipio: respuestas.municipio,
      externalId,
      fbp,
      fbc,
      ip,
      navegador,
      url,
    });
    const envio = await enviarEventoAMeta(evento, 'restaurantes');
    if (!envio.ok) console.error('[restaurantes] Lead no enviado:', envio.motivo, envio.detalle ?? '');
  }

  if (generado) {
    respuesta.cookies.set('_fbp', fbp, { maxAge: FBP_DURACION_S, path: '/', sameSite: 'lax', secure: true });
  }
  return respuesta;
}

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
