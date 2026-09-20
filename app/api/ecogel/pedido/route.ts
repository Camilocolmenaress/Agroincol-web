import { NextResponse, type NextRequest } from 'next/server';
import { totalPedido } from '@/lib/ecogel';
import { nuevoPedidoId, validarPedido } from '@/lib/ecogel-pedido';
import { crearFilaPedido } from '@/lib/hoja-pedidos';
import { construirPreferencia, crearPreferencia, mpConfigurado } from '@/lib/mercadopago';
import { nuevoEventId } from '@/lib/meta/eventos';
import { construirUserData, sha256 } from '@/lib/meta/hash';
import { resolverFbc } from '@/lib/meta/fbc';
import { FBP_DURACION_S, resolverFbp } from '@/lib/meta/fbp';
import { capiConfigurada, enviarEventoAMeta } from '@/lib/meta/capi';

/**
 * Crea un pedido de EcoGel.
 *
 * Orden de los pasos, y por qué:
 * 1. Validar y RECALCULAR el total en el servidor. El precio del navegador no existe.
 * 2. Escribir la fila en la hoja. Si falla, el pedido sigue: queda en los logs.
 * 3. Purchase a Meta por CAPI con el event_id del checkout. Se manda al crear el
 *    pedido en ambos métodos (como Shopify): es la señal con la que optimiza la
 *    campaña. La verdad de entregado/rechazado vive en la hoja.
 * 4. Contraentrega → /gracias. En línea → preferencia de Mercado Pago → init_point.
 */
export async function POST(req: NextRequest) {
  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errores: { general: 'Datos inválidos' } }, { status: 400 });
  }

  // Honeypot: un bot lo llena, una persona no lo ve.
  if (typeof cuerpo.website === 'string' && cuerpo.website) {
    return NextResponse.json({ ok: true, pedidoId: 'EG-000000-BOT', ir: '/ecogel/gracias?estado=cod', eventId: nuevoEventId() });
  }

  const validacion = validarPedido(cuerpo);
  if (!validacion.ok) return NextResponse.json({ ok: false, errores: validacion.errores }, { status: 400 });
  const pedido = validacion.pedido;

  const totales = totalPedido(pedido.unidades, pedido.metodo);
  const pedidoId = nuevoPedidoId();
  const base = `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '';
  const navegador = req.headers.get('user-agent') ?? '';
  const url = typeof cuerpo.sourceUrl === 'string' && cuerpo.sourceUrl ? cuerpo.sourceUrl : `${base}/ecogel/pedido`;
  const { fbp, generado } = resolverFbp(req.cookies.get('_fbp')?.value);
  const fbc = resolverFbc(req.cookies.get('_fbc')?.value, url);
  // El fbp recién generado debe volver en TODA respuesta a partir de aquí, no
  // solo en la de éxito: si no, un visitante que reintenta tras un fallo de MP
  // recibe un fbp distinto cada vez y Meta nunca lo enlaza con el clic del anuncio.
  const conCookieFbp = (respuesta: NextResponse): NextResponse => {
    if (generado) respuesta.cookies.set('_fbp', fbp, { maxAge: FBP_DURACION_S, path: '/', sameSite: 'lax', secure: true });
    return respuesta;
  };
  const externalId = typeof cuerpo.externalId === 'string' ? cuerpo.externalId : '';
  const eventId = typeof cuerpo.eventId === 'string' && cuerpo.eventId.length >= 8 ? cuerpo.eventId : nuevoEventId();

  const fechaLocal = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'medium' }).format(new Date());

  await crearFilaPedido({
    estado: pedido.metodo === 'online' ? 'pendiente_pago' : 'confirmar',
    guia: '',
    fecha: fechaLocal,
    pedidoId,
    unidades: pedido.unidades,
    producto: totales.producto,
    envio: totales.envio,
    descuento: totales.descuento,
    total: totales.total,
    metodoPago: pedido.metodo,
    nombre: pedido.nombre,
    celular: pedido.celular,
    correo: pedido.correo,
    direccion: pedido.direccion,
    barrio: pedido.barrio,
    ciudad: pedido.ciudad,
    departamento: pedido.departamento,
    ofertas: pedido.ofertas ? 'sí' : 'no',
    origen: `ecogel-${pedido.de}`,
    ip,
    eventId,
    fbp,
    fbc: fbc ?? '',
    externalId,
    navegador,
    url,
    mpPagoId: '',
  }).catch((error) => {
    console.error('[hoja-pedidos] no se pudo guardar el pedido', pedidoId, error instanceof Error ? error.message : error);
  });

  if (capiConfigurada()) {
    try {
      const userData = await construirUserData({
        nombreCompleto: pedido.nombre,
        telefono: pedido.celular,
        correo: pedido.correo || undefined,
        municipio: pedido.ciudad,
        externalId: externalId || undefined,
      });
      // `construirUserData` fija st = 'santander' (herencia de las landings de
      // fumigación, donde toda la cobertura es en ese departamento). En EcoGel
      // el departamento del pedido varía, así que se sobrescribe aquí con el
      // departamento real que escribió la persona.
      userData.st = await sha256(
        pedido.departamento
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]/g, ''),
      );
      const envio = await enviarEventoAMeta({
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: url,
        custom_data: {
          value: totales.total,
          currency: 'COP',
          content_ids: ['ecogel'],
          content_type: 'product',
          num_items: pedido.unidades,
          content_category: `ecogel-${pedido.de}`,
          order_id: pedidoId,
        },
        user_data: { ...userData, client_ip_address: ip || undefined, client_user_agent: navegador || undefined, fbp, fbc },
      });
      if (!envio.ok) console.error('[meta] Purchase no enviado:', envio.motivo, envio.detalle ?? '');
    } catch (error) {
      console.error('[meta] error inesperado enviando Purchase:', error);
    }
  }

  let ir = `/ecogel/gracias?pedido=${pedidoId}&estado=cod`;
  if (pedido.metodo === 'online') {
    if (!mpConfigurado()) return conCookieFbp(NextResponse.json({ ok: false, motivo: 'mp' }, { status: 502 }));
    const pref = await crearPreferencia(
      construirPreferencia({ pedidoId, unidades: pedido.unidades, total: totales.total, nombre: pedido.nombre, correo: pedido.correo, celular: pedido.celular, segmento: pedido.de, base }),
    );
    if (!pref.ok) {
      // Solo los primeros 200 caracteres: el detalle es el cuerpo completo de la
      // respuesta de Mercado Pago y puede traer de vuelta el nombre/correo/celular
      // del comprador (payer) que se le mandó en la preferencia.
      console.error('[mp] no se pudo crear la preferencia', pedidoId, pref.detalle.slice(0, 200));
      return conCookieFbp(NextResponse.json({ ok: false, motivo: 'mp', pedidoId }, { status: 502 }));
    }
    ir = pref.initPoint;
  }

  return conCookieFbp(NextResponse.json({ ok: true, pedidoId, ir, eventId }));
}

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
