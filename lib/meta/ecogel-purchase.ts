/**
 * Construye y manda el Purchase de EcoGel a Meta por CAPI.
 *
 * Un solo lugar para esto porque hay DOS momentos que lo disparan:
 *  - al crear el pedido, para los métodos sin pasarela (contraentrega,
 *    bancolombia, nequi, breb) — ver app/api/ecogel/pedido/route.ts;
 *  - al confirmar el pago, solo para "online" (tarjeta/PSE vía Mercado Pago)
 *    — ver app/api/ecogel/mp/route.ts. Mandarlo al crear el pedido online
 *    sería reportar una venta que todavía puede no llegar a pagarse.
 */

import { capiConfigurada, enviarEventoAMeta } from './capi';
import { construirUserData, sha256 } from './hash';

export interface DatosPurchaseEcogel {
  pedidoId: string;
  eventId: string;
  total: number;
  unidades: number;
  /** Ya armado como "ecogel-hogar" / "ecogel-restaurantes" (columna `origen` de la hoja). */
  contentCategory: string;
  url: string;
  nombre: string;
  celular: string;
  correo: string;
  ciudad: string;
  departamento: string;
  externalId: string;
  ip: string;
  navegador: string;
  fbp: string;
  fbc: string;
}

export async function enviarPurchaseEcogel(d: DatosPurchaseEcogel, fetchFn: typeof fetch = fetch): Promise<void> {
  if (!capiConfigurada('ecogel')) return;
  try {
    const userData = await construirUserData({
      nombreCompleto: d.nombre,
      telefono: d.celular,
      correo: d.correo || undefined,
      municipio: d.ciudad,
      externalId: d.externalId || undefined,
    });
    // `construirUserData` fija st = 'santander' (herencia de las landings de
    // fumigación, donde toda la cobertura es en ese departamento). En EcoGel
    // el departamento del pedido varía, así que se sobrescribe con el real.
    userData.st = await sha256(
      d.departamento
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]/g, ''),
    );
    const envio = await enviarEventoAMeta(
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: d.eventId,
        action_source: 'website',
        event_source_url: d.url,
        custom_data: {
          value: d.total,
          currency: 'COP',
          content_ids: ['ecogel'],
          content_type: 'product',
          num_items: d.unidades,
          content_category: d.contentCategory,
          order_id: d.pedidoId,
        },
        user_data: { ...userData, client_ip_address: d.ip || undefined, client_user_agent: d.navegador || undefined, fbp: d.fbp, fbc: d.fbc },
      },
      'ecogel',
      fetchFn,
    );
    if (!envio.ok) console.error('[meta] Purchase EcoGel no enviado:', envio.motivo, envio.detalle ?? '');
  } catch (error) {
    console.error('[meta] error inesperado enviando Purchase EcoGel:', error);
  }
}
