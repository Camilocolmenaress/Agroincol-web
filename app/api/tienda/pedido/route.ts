import { NextResponse, type NextRequest } from 'next/server';
import { CATEGORIA, CONTENT_ID, cotizar } from '@/lib/laminas';
import { escrituraHojaLaminas, validarPedidoLaminas } from '@/lib/laminas-pedido';
import { nuevoPedidoId } from '@/lib/ecogel-pedido';
import { actualizarFilaPedido, crearFilaPedido, hojaPedidosConfigurada } from '@/lib/hoja-pedidos';
import { construirPreferenciaLaminas, crearPreferencia, mpConfigurado } from '@/lib/mercadopago';
import { nuevoEventId } from '@/lib/meta/eventos';
import { resolverFbc } from '@/lib/meta/fbc';
import { FBP_DURACION_S, resolverFbp } from '@/lib/meta/fbp';
import { enviarPurchaseEcogel } from '@/lib/meta/ecogel-purchase';
import { secretoValido } from '@/lib/meta/cierre';
import { firmaDePedido } from '@/app/api/ecogel/pedido/firma';

const PEDIDO_ID_RE = /^LC-\d{6}-[A-Z0-9]{4}$/;

/**
 * Crea un pedido de Láminas de Captura. Mismo esquema que /api/ecogel/pedido
 * (ver los comentarios largos allá), sin ruleta:
 * 0. Sin hoja no hay pedidos (503): la hoja es la base de datos.
 * 1. Validar y RECALCULAR el total aquí, con la zona que sale del municipio.
 * 2. Fila en la hoja (misma hoja de EcoGel; origen = "laminas", id LC-…).
 *    Reintento tras el 502 de MP: misma fila, con todos los datos nuevos
 *    (escrituraHojaLaminas); el Apps Script avisa por correo en esa transición.
 * 3. Purchase por CAPI con el event_id del checkout, valor = total real con
 *    envío y num_items = láminas. Solo para métodos sin pasarela; "online" lo
 *    manda el webhook de Mercado Pago al confirmarse el pago.
 * 4. Manuales y contraentrega → /tienda/gracias. En línea → Mercado Pago.
 */
export async function POST(req: NextRequest) {
  if (!hojaPedidosConfigurada()) {
    console.error('[hoja-pedidos] HOJA_PEDIDOS_URL/SECRETO sin configurar: pedido rechazado');
    return NextResponse.json({ ok: false, motivo: 'no-disponible' }, { status: 503 });
  }

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errores: { general: 'Datos inválidos' } }, { status: 400 });
  }

  // Honeypot: un bot lo llena, una persona no lo ve.
  if (typeof cuerpo.website === 'string' && cuerpo.website) {
    return NextResponse.json({ ok: true, pedidoId: 'LC-000000-BOT', ir: '/tienda/gracias?estado=cod', eventId: nuevoEventId() });
  }

  const validacion = validarPedidoLaminas(cuerpo);
  if (!validacion.ok) return NextResponse.json({ ok: false, errores: validacion.errores }, { status: 400 });
  const pedido = validacion.pedido;
  const totales = cotizar(pedido.cantidad, pedido.zona);

  // Reintento tras un fallo de Mercado Pago: solo se reutiliza el id con la
  // firma que el servidor entregó en el 502 (ver /api/ecogel/pedido).
  const candidato = typeof cuerpo.pedidoAnterior === 'string' && PEDIDO_ID_RE.test(cuerpo.pedidoAnterior) ? cuerpo.pedidoAnterior : undefined;
  const firmaAnterior = typeof cuerpo.firmaAnterior === 'string' ? cuerpo.firmaAnterior : undefined;
  const pedidoAnterior =
    candidato !== undefined && firmaAnterior !== undefined && secretoValido(firmaAnterior, (await firmaDePedido(candidato)) ?? '')
      ? candidato
      : undefined;
  const pedidoId = pedidoAnterior ?? nuevoPedidoId(new Date(), Math.random, 'LC');

  const base = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '';
  const navegador = req.headers.get('user-agent') ?? '';
  const url =
    typeof cuerpo.sourceUrl === 'string' && cuerpo.sourceUrl && cuerpo.sourceUrl.length <= 500 ? cuerpo.sourceUrl : `${base}/tienda/pedido`;
  const { fbp, generado } = resolverFbp(req.cookies.get('_fbp')?.value);
  const fbc = resolverFbc(req.cookies.get('_fbc')?.value, url);
  const conCookieFbp = (respuesta: NextResponse): NextResponse => {
    if (generado) respuesta.cookies.set('_fbp', fbp, { maxAge: FBP_DURACION_S, path: '/', sameSite: 'lax', secure: true });
    return respuesta;
  };
  const externalId = typeof cuerpo.externalId === 'string' && cuerpo.externalId.length <= 64 ? cuerpo.externalId : '';
  const eventId =
    typeof cuerpo.eventId === 'string' && cuerpo.eventId.length >= 8 && cuerpo.eventId.length <= 64 ? cuerpo.eventId : nuevoEventId();
  const fechaLocal = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'medium' }).format(new Date());

  const escritura = escrituraHojaLaminas(
    pedido,
    totales,
    { pedidoId, fecha: fechaLocal, ip, eventId, fbp, fbc: fbc ?? '', externalId, navegador, url },
    pedidoAnterior !== undefined,
  );
  const escrituraFila = (
    escritura.accion === 'actualizar' ? actualizarFilaPedido(pedidoId, escritura.cambios) : crearFilaPedido(escritura.fila)
  ).catch((error) => {
    console.error('[hoja-pedidos] no se pudo guardar el pedido', pedidoId, error instanceof Error ? error.message : error);
  });

  const envioMeta =
    pedido.metodo === 'online'
      ? Promise.resolve()
      : enviarPurchaseEcogel({
          pedidoId,
          eventId,
          total: totales.total,
          unidades: pedido.cantidad,
          contentCategory: CATEGORIA,
          contentId: CONTENT_ID,
          url,
          nombre: pedido.nombre,
          celular: pedido.celular,
          correo: pedido.correo,
          ciudad: pedido.municipio,
          departamento: pedido.departamento,
          externalId,
          ip,
          navegador,
          fbp,
          fbc: fbc ?? '',
        });

  await Promise.all([escrituraFila, envioMeta]);

  const estadoGracias = pedido.metodo === 'contraentrega' ? 'cod' : pedido.metodo;
  let ir = `/tienda/gracias?pedido=${pedidoId}&estado=${estadoGracias}&n=${pedido.cantidad}&z=${pedido.zona}`;
  if (pedido.metodo === 'online') {
    const fallo = async () => {
      const firma = await firmaDePedido(pedidoId);
      return conCookieFbp(NextResponse.json({ ok: false, motivo: 'mp', pedidoId, ...(firma ? { firma } : {}) }, { status: 502 }));
    };
    if (!mpConfigurado()) return fallo();
    const pref = await crearPreferencia(
      construirPreferenciaLaminas({ pedidoId, cantidad: pedido.cantidad, zona: pedido.zona, total: totales.total, nombre: pedido.nombre, celular: pedido.celular, base }),
    );
    if (!pref.ok) {
      // Recortado: la respuesta de Mercado Pago puede traer los datos del comprador.
      console.error('[mp] no se pudo crear la preferencia', pedidoId, pref.detalle.slice(0, 200));
      return fallo();
    }
    ir = pref.initPoint;
  }

  return conCookieFbp(NextResponse.json({ ok: true, pedidoId, ir, eventId, total: totales.total }));
}

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
