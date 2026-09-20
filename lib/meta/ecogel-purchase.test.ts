import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enviarPurchaseEcogel } from './ecogel-purchase';

const VARS = ['NEXT_PUBLIC_META_PIXEL_ID_ECOGEL', 'META_CAPI_TOKEN_ECOGEL'] as const;

function conEcogelConfigurado(fn: (fetchFalso: typeof fetch, cuerpos: unknown[]) => Promise<void>) {
  const previo = Object.fromEntries(VARS.map((v) => [v, process.env[v]]));
  process.env.NEXT_PUBLIC_META_PIXEL_ID_ECOGEL = '222';
  process.env.META_CAPI_TOKEN_ECOGEL = 'tok-ecogel';
  const cuerpos: unknown[] = [];
  const fetchFalso = (async (_url: RequestInfo | URL, init?: RequestInit) => {
    cuerpos.push(JSON.parse(String(init?.body ?? '{}')));
    return new Response('{}', { status: 200 });
  }) as typeof fetch;
  return fn(fetchFalso, cuerpos).finally(() => {
    for (const v of VARS) {
      if (previo[v] === undefined) delete process.env[v];
      else process.env[v] = previo[v] as string;
    }
  });
}

const datosBase = {
  pedidoId: 'EG-260920-ABCD',
  eventId: 'evt-12345678',
  total: 114_700,
  unidades: 3 as const,
  contentCategory: 'ecogel-hogar',
  url: 'https://agroincol.com/ecogel/pedido',
  nombre: 'Diana Pérez',
  celular: '3107891948',
  correo: 'diana@example.com',
  ciudad: 'Bucaramanga',
  departamento: 'Santander',
  externalId: 'ext-123',
  ip: '1.2.3.4',
  navegador: 'UA de prueba',
  fbp: 'fb.1.123.456',
  fbc: '',
};

test('manda un Purchase con el event_id y los datos del pedido', () =>
  conEcogelConfigurado(async (fetchFalso, cuerpos) => {
    await enviarPurchaseEcogel(datosBase, fetchFalso);
    assert.equal(cuerpos.length, 1);
    const evento = (cuerpos[0] as { data: Array<Record<string, unknown>> }).data[0];
    assert.equal(evento.event_name, 'Purchase');
    assert.equal(evento.event_id, 'evt-12345678');
    assert.deepEqual(evento.custom_data, {
      value: 114_700,
      currency: 'COP',
      content_ids: ['ecogel'],
      content_type: 'product',
      num_items: 3,
      content_category: 'ecogel-hogar',
      order_id: 'EG-260920-ABCD',
    });
    const userData = evento.user_data as Record<string, unknown>;
    assert.ok(userData.em);
    assert.ok(userData.ph);
    assert.ok(userData.st); // departamento hasheado, no "santander" fijo
    assert.equal(userData.client_ip_address, '1.2.3.4');
    assert.equal(userData.fbp, 'fb.1.123.456');
  }));

test('sin credenciales de EcoGel, no llama a Meta ni lanza', async () => {
  delete process.env.NEXT_PUBLIC_META_PIXEL_ID_ECOGEL;
  delete process.env.META_CAPI_TOKEN_ECOGEL;
  let llamadas = 0;
  const fetchFalso = (async () => {
    llamadas++;
    return new Response('{}');
  }) as typeof fetch;
  await enviarPurchaseEcogel(datosBase, fetchFalso);
  assert.equal(llamadas, 0);
});
