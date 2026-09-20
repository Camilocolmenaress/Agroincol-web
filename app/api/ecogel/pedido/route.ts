import { NextResponse, type NextRequest } from 'next/server';
import { totalPedido } from '@/lib/ecogel';
import { nuevoPedidoId, validarPedido } from '@/lib/ecogel-pedido';
import { actualizarFilaPedido, crearFilaPedido, hojaPedidosConfigurada } from '@/lib/hoja-pedidos';
import { construirPreferencia, crearPreferencia, mpConfigurado } from '@/lib/mercadopago';
import { nuevoEventId } from '@/lib/meta/eventos';
import { construirUserData, sha256 } from '@/lib/meta/hash';
import { resolverFbc } from '@/lib/meta/fbc';
import { FBP_DURACION_S, resolverFbp } from '@/lib/meta/fbp';
import { capiConfigurada, enviarEventoAMeta } from '@/lib/meta/capi';
import { secretoValido } from '@/lib/meta/cierre';
import { firmaDePedido } from './firma';

// Mismo formato que nuevoPedidoId() en lib/ecogel-pedido.ts.
const PEDIDO_ID_RE = /^EG-\d{6}-[A-Z0-9]{4}$/;

/**
 * Crea un pedido de EcoGel.
 *
 * Orden de los pasos, y por qué:
 * 0. Sin hoja configurada no se aceptan pedidos (503). La hoja ES la base de
 *    datos: sin ella la persona vería "gracias" y el pedido no quedaría en
 *    ningún lado, y con pago en línea además se le cobraría.
 * 1. Validar y RECALCULAR el total en el servidor. El precio del navegador no existe.
 * 2. Escribir la fila en la hoja. Si falla, el pedido sigue: queda en los logs.
 * 3. Purchase a Meta por CAPI con el event_id del checkout. Se manda al crear el
 *    pedido en ambos métodos (como Shopify): es la señal con la que optimiza la
 *    campaña. La verdad de entregado/rechazado vive en la hoja.
 * 4. Contraentrega → /gracias. En línea → preferencia de Mercado Pago → init_point.
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
    return NextResponse.json({ ok: true, pedidoId: 'EG-000000-BOT', ir: '/ecogel/gracias?estado=cod', eventId: nuevoEventId() });
  }

  const validacion = validarPedido(cuerpo);
  if (!validacion.ok) return NextResponse.json({ ok: false, errores: validacion.errores }, { status: 400 });
  const pedido = validacion.pedido;

  const totales = totalPedido(pedido.unidades, pedido.metodo);
  // Si el envío anterior falló en Mercado Pago, el servidor ya guardó una fila
  // con este id: se reutiliza y se actualiza en vez de crear una duplicada.
  // Pero el formato del id no prueba nada: cualquiera puede adivinar
  // "EG-######-XXXX" y pedir que se sobreescriba el estado/método/total de un
  // pedido ajeno. Por eso solo se honra `pedidoAnterior` cuando viene con la
  // firma que el propio servidor entregó en el 502 del intento anterior (ver
  // más abajo); sin firma válida, este envío se trata como un pedido nuevo.
  const candidatoPedidoAnterior =
    typeof cuerpo.pedidoAnterior === 'string' && PEDIDO_ID_RE.test(cuerpo.pedidoAnterior) ? cuerpo.pedidoAnterior : undefined;
  const firmaAnterior = typeof cuerpo.firmaAnterior === 'string' ? cuerpo.firmaAnterior : undefined;
  const pedidoAnterior =
    candidatoPedidoAnterior !== undefined &&
    firmaAnterior !== undefined &&
    secretoValido(firmaAnterior, (await firmaDePedido(candidatoPedidoAnterior)) ?? '')
      ? candidatoPedidoAnterior
      : undefined;
  const pedidoId = pedidoAnterior ?? nuevoPedidoId();
  const base = `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '';
  const navegador = req.headers.get('user-agent') ?? '';
  const url =
    typeof cuerpo.sourceUrl === 'string' && cuerpo.sourceUrl && cuerpo.sourceUrl.length <= 500
      ? cuerpo.sourceUrl
      : `${base}/ecogel/pedido`;
  const { fbp, generado } = resolverFbp(req.cookies.get('_fbp')?.value);
  const fbc = resolverFbc(req.cookies.get('_fbc')?.value, url);
  // El fbp recién generado debe volver en TODA respuesta a partir de aquí, no
  // solo en la de éxito: si no, un visitante que reintenta tras un fallo de MP
  // recibe un fbp distinto cada vez y Meta nunca lo enlaza con el clic del anuncio.
  const conCookieFbp = (respuesta: NextResponse): NextResponse => {
    if (generado) respuesta.cookies.set('_fbp', fbp, { maxAge: FBP_DURACION_S, path: '/', sameSite: 'lax', secure: true });
    return respuesta;
  };
  const externalId = typeof cuerpo.externalId === 'string' && cuerpo.externalId.length <= 64 ? cuerpo.externalId : '';
  const eventId =
    typeof cuerpo.eventId === 'string' && cuerpo.eventId.length >= 8 && cuerpo.eventId.length <= 64
      ? cuerpo.eventId
      : nuevoEventId();

  const fechaLocal = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'medium' }).format(new Date());

  // Fila nueva, o actualización de la que quedó de un intento anterior fallido
  // en Mercado Pago: solo cambian estado, método y los montos (pudo cambiar de
  // "en línea" a "contraentrega"); el resto ya está en la hoja.
  const escrituraFila = (
    pedidoAnterior
      ? actualizarFilaPedido(pedidoId, {
          estado: pedido.metodo === 'online' ? 'pendiente_pago' : 'confirmar',
          metodoPago: pedido.metodo,
          unidades: pedido.unidades,
          producto: totales.producto,
          envio: totales.envio,
          descuento: totales.descuento,
          total: totales.total,
        })
      : crearFilaPedido({
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
        })
  ).catch((error) => {
    console.error('[hoja-pedidos] no se pudo guardar el pedido', pedidoId, error instanceof Error ? error.message : error);
  });

  // Escritura en la hoja y Purchase a Meta no dependen entre sí: van en paralelo.
  // Cada una captura sus propios errores, así que Promise.all nunca rechaza por
  // esto.
  const envioMeta = capiConfigurada('ecogel')
    ? (async () => {
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
          }, 'ecogel');
          if (!envio.ok) console.error('[meta] Purchase no enviado:', envio.motivo, envio.detalle ?? '');
        } catch (error) {
          console.error('[meta] error inesperado enviando Purchase:', error);
        }
      })()
    : Promise.resolve();

  await Promise.all([escrituraFila, envioMeta]);

  // Contraentrega y los métodos manuales (transferencia sin pasarela) van
  // directo a "gracias" con su propio estado: cada uno tiene su instrucción
  // ahí (ver TEXTOS en app/ecogel/gracias/page.tsx). Solo "online" pasa por
  // Mercado Pago.
  let ir = `/ecogel/gracias?pedido=${pedidoId}&estado=${pedido.metodo === 'contraentrega' ? 'cod' : pedido.metodo}`;
  if (pedido.metodo === 'online') {
    if (!mpConfigurado()) {
      // La firma va en el 502 para que, si la persona reintenta, el próximo
      // envío pueda probar que este pedidoId es el suyo (ver pedidoAnterior
      // arriba) sin necesitar su propio secreto en el cliente.
      const firma = await firmaDePedido(pedidoId);
      return conCookieFbp(
        NextResponse.json({ ok: false, motivo: 'mp', pedidoId, ...(firma ? { firma } : {}) }, { status: 502 }),
      );
    }
    const pref = await crearPreferencia(
      construirPreferencia({ pedidoId, unidades: pedido.unidades, total: totales.total, nombre: pedido.nombre, correo: pedido.correo, celular: pedido.celular, segmento: pedido.de, base }),
    );
    if (!pref.ok) {
      // Solo los primeros 200 caracteres: el detalle es el cuerpo completo de la
      // respuesta de Mercado Pago y puede traer de vuelta el nombre/correo/celular
      // del comprador (payer) que se le mandó en la preferencia.
      console.error('[mp] no se pudo crear la preferencia', pedidoId, pref.detalle.slice(0, 200));
      const firma = await firmaDePedido(pedidoId);
      return conCookieFbp(
        NextResponse.json({ ok: false, motivo: 'mp', pedidoId, ...(firma ? { firma } : {}) }, { status: 502 }),
      );
    }
    ir = pref.initPoint;
  }

  return conCookieFbp(NextResponse.json({ ok: true, pedidoId, ir, eventId }));
}

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
