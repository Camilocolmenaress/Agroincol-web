// Mercado Pago Checkout Pro, sin SDK: dos llamadas REST. El token se lee en
// cada llamada (como en lib/meta/capi.ts) para que las pruebas puedan variarlo.

import type { Segmento, Unidades } from './ecogel';

const API = 'https://api.mercadopago.com';

function token() {
  return process.env.MP_ACCESS_TOKEN ?? '';
}

export function mpConfigurado(): boolean {
  return token().length > 0;
}

export function construirPreferencia(p: {
  pedidoId: string;
  unidades: Unidades;
  total: number;
  nombre: string;
  correo: string;
  celular: string;
  segmento: Segmento;
  base: string;
}): Record<string, unknown> {
  const gracias = (estado: string) => `${p.base}/ecogel/gracias?pedido=${p.pedidoId}&estado=${estado}`;
  return {
    // Un solo ítem con el total: el desglose (envío, descuento) vive en la hoja.
    items: [
      {
        id: 'ecogel',
        title: `EcoGel x${p.unidades} — AGROINCOL`,
        quantity: 1,
        unit_price: p.total,
        currency_id: 'COP',
      },
    ],
    payer: { name: p.nombre, email: p.correo, phone: { area_code: '57', number: p.celular } },
    external_reference: p.pedidoId,
    notification_url: `${p.base}/api/ecogel/mp`,
    back_urls: { success: gracias('approved'), pending: gracias('pending'), failure: gracias('failure') },
    auto_return: 'approved',
    statement_descriptor: 'AGROINCOL',
    metadata: { segmento: p.segmento, unidades: p.unidades },
  };
}

export async function crearPreferencia(
  pref: Record<string, unknown>,
  fetchFn: typeof fetch = fetch,
): Promise<{ ok: true; initPoint: string } | { ok: false; detalle: string }> {
  try {
    const r = await fetchFn(`${API}/checkout/preferences`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token()}` },
      body: JSON.stringify(pref),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return { ok: false, detalle: `${r.status} ${await r.text()}` };
    const json = (await r.json()) as { init_point?: string };
    if (!json.init_point) return { ok: false, detalle: 'sin init_point' };
    return { ok: true, initPoint: json.init_point };
  } catch (e) {
    return { ok: false, detalle: e instanceof Error ? e.message : String(e) };
  }
}

export async function consultarPago(
  id: string,
  fetchFn: typeof fetch = fetch,
): Promise<{ ok: true; status: string; externalReference: string } | { ok: false; detalle: string }> {
  try {
    const r = await fetchFn(`${API}/v1/payments/${encodeURIComponent(id)}`, {
      headers: { authorization: `Bearer ${token()}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return { ok: false, detalle: `${r.status}` };
    const json = (await r.json()) as { status?: string; external_reference?: string };
    return { ok: true, status: json.status ?? '', externalReference: json.external_reference ?? '' };
  } catch (e) {
    return { ok: false, detalle: e instanceof Error ? e.message : String(e) };
  }
}
