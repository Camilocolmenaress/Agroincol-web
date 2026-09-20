import { NextResponse, type NextRequest } from 'next/server';
import { consultarPago, mpConfigurado } from '@/lib/mercadopago';
import { actualizarFilaPedido, leerFilaPedido } from '@/lib/hoja-pedidos';
import { enviarPurchaseEcogel } from '@/lib/meta/ecogel-purchase';
import { estadoDesdeMp } from './estado';

/**
 * Webhook de Mercado Pago.
 *
 * No se confía en el cuerpo de la notificación: solo trae un id. El servidor
 * consulta ese pago con el token y actúa con lo que responde la API. Quien no
 * tenga el token no puede fabricar un pago aprobado, así que no hace falta
 * validar firmas.
 *
 * Responde 200 siempre que el aviso tenga forma, incluso si el pago no cambia
 * nada: Mercado Pago reintenta ante cualquier otro código.
 *
 * Cuando el pago queda "pagado" es también el único momento en que un pedido
 * online manda su Purchase a Meta (ver bloque abajo) y su correo de aviso
 * (el Apps Script de la hoja lo manda al recibir este `actualizar`).
 */
export async function POST(req: NextRequest) {
  if (!mpConfigurado()) return NextResponse.json({ ok: false }, { status: 503 });

  let cuerpo: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    cuerpo = await req.json();
  } catch {
    // Algunas notificaciones viejas mandan todo por query string.
  }
  const tipo = cuerpo.type ?? req.nextUrl.searchParams.get('type') ?? req.nextUrl.searchParams.get('topic') ?? '';
  const id = String(cuerpo.data?.id ?? req.nextUrl.searchParams.get('data.id') ?? req.nextUrl.searchParams.get('id') ?? '');

  if (tipo !== 'payment' || !id) return NextResponse.json({ ok: true, ignorado: true });

  const pago = await consultarPago(id);
  if (!pago.ok) {
    // Mercado Pago manda ids de prueba desde su panel de webhooks que no
    // existen como pago real: un 404 es ruido esperado, no un fallo nuestro.
    if (pago.detalle === '404') return NextResponse.json({ ok: true, ignorado: true });
    console.error('[mp] no se pudo consultar el pago', id, pago.detalle);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  const estado = estadoDesdeMp(pago.status);
  if (!estado || !pago.externalReference.startsWith('EG-')) return NextResponse.json({ ok: true, ignorado: true });

  try {
    await actualizarFilaPedido(pago.externalReference, { estado, mpPagoId: id });
  } catch (error) {
    console.error('[hoja-pedidos] no se pudo actualizar', pago.externalReference, error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  // Único momento en que un pedido "online" manda su Purchase a Meta: aquí,
  // con el pago ya confirmado. La hoja es la única fuente de los datos del
  // pedido — esta función y la que creó el pedido corren en invocaciones
  // serverless distintas, no comparten memoria.
  if (estado === 'pagado') {
    const fila = await leerFilaPedido(pago.externalReference);
    if (!fila) {
      console.error('[meta] no se pudo leer el pedido para el Purchase', pago.externalReference);
    } else if (!fila.eventId) {
      console.error('[meta] pedido sin eventId, no se puede deduplicar el Purchase', pago.externalReference);
    } else {
      await enviarPurchaseEcogel({
        pedidoId: pago.externalReference,
        eventId: String(fila.eventId),
        total: Number(fila.total) || 0,
        unidades: Number(fila.unidades) || 0,
        contentCategory: String(fila.origen ?? ''),
        url: String(fila.url ?? ''),
        nombre: String(fila.nombre ?? ''),
        celular: String(fila.celular ?? ''),
        correo: String(fila.correo ?? ''),
        ciudad: String(fila.ciudad ?? ''),
        departamento: String(fila.departamento ?? ''),
        externalId: String(fila.externalId ?? ''),
        ip: String(fila.ip ?? ''),
        navegador: String(fila.navegador ?? ''),
        fbp: String(fila.fbp ?? ''),
        fbc: String(fila.fbc ?? ''),
      });
    }
  }

  return NextResponse.json({ ok: true, estado });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
