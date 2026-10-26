import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avisarCuentas } from './cuentas-ecogel';

function conEnv(url: string | undefined, secreto: string | undefined) {
  if (url) process.env.CUENTAS_ECOGEL_URL = url; else delete process.env.CUENTAS_ECOGEL_URL;
  if (secreto) process.env.CUENTAS_ECOGEL_SECRETO = secreto; else delete process.env.CUENTAS_ECOGEL_SECRETO;
}

test('sin configuración no llama a nadie', async () => {
  conEnv(undefined, undefined);
  let llamadas = 0;
  await avisarCuentas('pedido', { pedidoId: 'EG-1' }, (async () => { llamadas++; return new Response('{}'); }) as unknown as typeof fetch);
  assert.equal(llamadas, 0);
});

test('manda el cuerpo a la ruta de ingesta con el secreto', async () => {
  conEnv('https://cuentas.example.com', 's3creto');
  let visto: { url: string; init: RequestInit } | null = null;
  await avisarCuentas('pago', { pedidoId: 'EG-1', estado: 'pagado' }, (async (url: string, init: RequestInit) => {
    visto = { url, init };
    return new Response('{}');
  }) as unknown as typeof fetch);
  assert.equal(visto!.url, 'https://cuentas.example.com/api/ingesta/pago');
  assert.equal((visto!.init.headers as Record<string, string>)['x-ecogel-secreto'], 's3creto');
  assert.deepEqual(JSON.parse(String(visto!.init.body)), { pedidoId: 'EG-1', estado: 'pagado' });
  conEnv(undefined, undefined);
});

test('si la app de cuentas falla, la landing sigue: nunca lanza', async () => {
  conEnv('https://cuentas.example.com', 's3creto');
  await assert.doesNotReject(avisarCuentas('pedido', { pedidoId: 'EG-1' }, (async () => { throw new Error('caída'); }) as unknown as typeof fetch));
  await assert.doesNotReject(avisarCuentas('pedido', { pedidoId: 'EG-1' }, (async () => new Response('x', { status: 500 })) as unknown as typeof fetch));
  conEnv(undefined, undefined);
});
