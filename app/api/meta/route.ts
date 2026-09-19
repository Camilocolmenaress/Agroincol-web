/**
 * API de Conversiones de Meta (server-side), para eventos SIN datos personales.
 *
 * El navegador manda aquí lo mínimo (evento, event_id, valor y URL de origen) y
 * este handler completa desde el servidor lo que Meta necesita para atribuir:
 * IP, user agent y las cookies _fbp / _fbc.
 *
 * Por qué existe, además del Pixel: los bloqueadores y el ITP de Safari se
 * comen buena parte de los eventos del navegador. Lo que sale del servidor
 * llega igual. Los dos caminos mandan el MISMO event_id, así que Meta deduplica
 * y cada conversión cuenta una sola vez.
 *
 * Aquí NUNCA llega nombre ni teléfono. El Lead del formulario, que sí los
 * lleva (hasheados y solo con autorización), sale por /api/contact.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { VALOR_MAXIMO, esEventoValido } from '@/lib/meta/eventos';
import { sha256 } from '@/lib/meta/hash';
import { resolverFbc } from '@/lib/meta/fbc';
import { FBP_DURACION_S, resolverFbp } from '@/lib/meta/fbp';
import { capiConfigurada, enviarEventoAMeta } from '@/lib/meta/capi';
import { MONEDA } from '@/lib/meta/eventos';

// ---------------------------------------------------------------------------
// Límite de peticiones
//
// Memoria por instancia: en serverless no es un límite global, pero sube el
// costo de abusar del endpoint lo suficiente como para que no valga la pena.
// ---------------------------------------------------------------------------

const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 40;
const visitas = new Map<string, { conteo: number; hasta: number }>();

function excedeLimite(ip: string): boolean {
  const ahora = Date.now();
  const actual = visitas.get(ip);

  if (!actual || actual.hasta < ahora) {
    visitas.set(ip, { conteo: 1, hasta: ahora + VENTANA_MS });
    if (visitas.size > 5000) {
      // forEach y no for..of: el target de TypeScript del proyecto no permite
      // iterar un Map directamente sin downlevelIteration.
      visitas.forEach((valor, clave) => {
        if (valor.hasta < ahora) visitas.delete(clave);
      });
    }
    return false;
  }

  actual.conteo += 1;
  return actual.conteo > MAX_POR_VENTANA;
}

/** La IP real del visitante, no la del edge de Vercel. */
function ipDelCliente(req: NextRequest): string {
  const reenviada = req.headers.get('x-forwarded-for');
  if (reenviada) return reenviada.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? '';
}

/**
 * Solo se aceptan peticiones que vienen de esta misma página. No es una barrera
 * fuerte (una cabecera se falsifica), pero corta el ruido automatizado sin dar
 * falsos negativos con navegadores reales.
 */
function origenValido(req: NextRequest): boolean {
  const origen = req.headers.get('origin');
  if (!origen) return true; // algunos navegadores no mandan Origin con keepalive
  try {
    return new URL(origen).host === req.nextUrl.host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // Sin credenciales configuradas el sitio funciona igual, solo sin medición.
  if (!capiConfigurada()) {
    return NextResponse.json({ ok: false, motivo: 'sin-configurar' }, { status: 503 });
  }
  if (!origenValido(req)) {
    return NextResponse.json({ ok: false, motivo: 'origen' }, { status: 403 });
  }

  const ip = ipDelCliente(req);
  if (ip && excedeLimite(ip)) {
    return NextResponse.json({ ok: false, motivo: 'limite' }, { status: 429 });
  }

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, motivo: 'json' }, { status: 400 });
  }

  const { evento, eventId, valor, externalId, sourceUrl, categoria, contenido } = cuerpo as {
    evento?: unknown;
    eventId?: unknown;
    valor?: unknown;
    externalId?: unknown;
    sourceUrl?: unknown;
    categoria?: unknown;
    contenido?: unknown;
  };

  if (
    !esEventoValido(evento) ||
    typeof eventId !== 'string' ||
    eventId.length < 8 ||
    eventId.length > 64 ||
    typeof sourceUrl !== 'string' ||
    sourceUrl.length > 500
  ) {
    return NextResponse.json({ ok: false, motivo: 'invalido' }, { status: 400 });
  }

  const valorNumerico =
    typeof valor === 'number' && Number.isFinite(valor) && valor >= 0 && valor <= VALOR_MAXIMO
      ? Math.round(valor)
      : undefined;

  const idExterno =
    typeof externalId === 'string' && externalId.length > 0 && externalId.length <= 64
      ? externalId
      : undefined;

  // Sin _fbp (Pixel bloqueado) el evento saldría solo con IP y navegador, y Meta
  // no lo atribuye a nadie. Se genera aquí y se devuelve como cookie.
  const { fbp, generado } = resolverFbp(req.cookies.get('_fbp')?.value);
  const fbc = resolverFbc(req.cookies.get('_fbc')?.value, sourceUrl);

  const datos: Record<string, unknown> = {
    event_name: evento,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: 'website',
    event_source_url: sourceUrl,
    user_data: {
      ...(idExterno ? { external_id: await sha256(idExterno) } : {}),
      client_ip_address: ip || undefined,
      client_user_agent: req.headers.get('user-agent') ?? undefined,
      fbp,
      fbc,
    },
  };

  // Lista cerrada: nada que venga del navegador llega crudo a Meta.
  const CATEGORIAS = ['chinches', 'comejen', 'ecogel-hogar', 'ecogel-restaurantes'];
  const categoriaValida =
    typeof categoria === 'string' && CATEGORIAS.includes(categoria) ? categoria : undefined;

  // content_ids solo puede ser 'ecogel' por ahora; num_items entre 1 y 3.
  let contenidoValido: { content_ids: string[]; content_type: 'product'; num_items?: number } | undefined;
  if (contenido && typeof contenido === 'object') {
    const { ids, numItems } = contenido as { ids?: unknown; numItems?: unknown };
    if (Array.isArray(ids) && ids.length === 1 && ids[0] === 'ecogel') {
      contenidoValido = { content_ids: ['ecogel'], content_type: 'product' };
      if (numItems === 1 || numItems === 2 || numItems === 3) contenidoValido.num_items = numItems;
    }
  }

  if (valorNumerico !== undefined || categoriaValida || contenidoValido) {
    datos.custom_data = {
      ...(valorNumerico !== undefined ? { value: valorNumerico, currency: MONEDA } : {}),
      ...(categoriaValida ? { content_category: categoriaValida } : {}),
      ...(contenidoValido ?? {}),
    };
  }

  const resultado = await enviarEventoAMeta(datos);
  if (!resultado.ok) {
    // El detalle se queda en los logs del servidor, no vuelve al navegador.
    console.error('[meta] no se pudo enviar el evento:', resultado.motivo, resultado.detalle ?? '');
    return NextResponse.json({ ok: false, motivo: resultado.motivo }, { status: 502 });
  }

  const respuesta = NextResponse.json({ ok: true });
  if (generado) {
    respuesta.cookies.set('_fbp', fbp, {
      maxAge: FBP_DURACION_S,
      path: '/',
      sameSite: 'lax',
      secure: true,
      // Sin httpOnly: si el Pixel llega a cargar, tiene que poder leerla.
    });
  }
  return respuesta;
}

/** El endpoint solo acepta POST. */
export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
