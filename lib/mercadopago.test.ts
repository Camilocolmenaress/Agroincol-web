import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirPreferencia, consultarPago, crearPreferencia } from './mercadopago';

const datos = {
  pedidoId: 'EG-260919-K7Q2',
  unidades: 3 as const,
  total: 114_700,
  nombre: 'Diana Pérez',
  correo: 'diana@example.com',
  celular: '3107891948',
  segmento: 'hogar' as const,
  base: 'https://agroincol.com',
};

test('la preferencia lleva un solo ítem con el total y las URLs del pedido', () => {
  const p = construirPreferencia(datos) as any;
  assert.equal(p.items.length, 1);
  assert.equal(p.items[0].unit_price, 114_700);
  assert.equal(p.items[0].quantity, 1);
  assert.equal(p.items[0].currency_id, 'COP');
  assert.equal(p.external_reference, 'EG-260919-K7Q2');
  assert.equal(p.notification_url, 'https://agroincol.com/api/ecogel/mp');
  assert.equal(p.back_urls.success, 'https://agroincol.com/ecogel/gracias?pedido=EG-260919-K7Q2&estado=approved');
  assert.equal(p.back_urls.failure, 'https://agroincol.com/ecogel/gracias?pedido=EG-260919-K7Q2&estado=failure');
  assert.equal(p.auto_return, 'approved');
  assert.equal(p.statement_descriptor, 'AGROINCOL');
  assert.equal(p.payer.email, 'diana@example.com');
});

test('crearPreferencia devuelve init_point o el detalle del error', async () => {
  process.env.MP_ACCESS_TOKEN = 'APP_USR-prueba';
  const okFetch = (async () => new Response(JSON.stringify({ init_point: 'https://mp/x' }), { status: 201 })) as unknown as typeof fetch;
  assert.deepEqual(await crearPreferencia({}, okFetch), { ok: true, initPoint: 'https://mp/x' });
  const malFetch = (async () => new Response('nope', { status: 400 })) as unknown as typeof fetch;
  const r = await crearPreferencia({}, malFetch);
  assert.equal(r.ok, false);
});

test('consultarPago devuelve status y external_reference', async () => {
  process.env.MP_ACCESS_TOKEN = 'APP_USR-prueba';
  const f = (async (url: string) => {
    assert.match(String(url), /\/v1\/payments\/123$/);
    return new Response(JSON.stringify({ status: 'approved', external_reference: 'EG-1' }), { status: 200 });
  }) as unknown as typeof fetch;
  assert.deepEqual(await consultarPago('123', f), { ok: true, status: 'approved', externalReference: 'EG-1' });
});
