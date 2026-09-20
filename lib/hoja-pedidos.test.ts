import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hojaPedidosConfigurada, leerFilaPedido } from './hoja-pedidos';

function conCredenciales(fn: () => void | Promise<void>) {
  const previo = { u: process.env.HOJA_PEDIDOS_URL, s: process.env.HOJA_PEDIDOS_SECRETO };
  process.env.HOJA_PEDIDOS_URL = 'https://script.google.com/macros/s/x/exec';
  process.env.HOJA_PEDIDOS_SECRETO = 'shh';
  const restaurar = () => {
    if (previo.u === undefined) delete process.env.HOJA_PEDIDOS_URL; else process.env.HOJA_PEDIDOS_URL = previo.u;
    if (previo.s === undefined) delete process.env.HOJA_PEDIDOS_SECRETO; else process.env.HOJA_PEDIDOS_SECRETO = previo.s;
  };
  const r = fn();
  return r instanceof Promise ? r.finally(restaurar) : (restaurar(), r);
}

test('la hoja de pedidos solo cuenta como configurada con URL y secreto', () => {
  const previo = { u: process.env.HOJA_PEDIDOS_URL, s: process.env.HOJA_PEDIDOS_SECRETO };
  try {
    delete process.env.HOJA_PEDIDOS_URL;
    delete process.env.HOJA_PEDIDOS_SECRETO;
    assert.equal(hojaPedidosConfigurada(), false);
    process.env.HOJA_PEDIDOS_URL = 'https://script.google.com/macros/s/x/exec';
    assert.equal(hojaPedidosConfigurada(), false);
    process.env.HOJA_PEDIDOS_SECRETO = 'abc';
    assert.equal(hojaPedidosConfigurada(), true);
  } finally {
    if (previo.u === undefined) delete process.env.HOJA_PEDIDOS_URL; else process.env.HOJA_PEDIDOS_URL = previo.u;
    if (previo.s === undefined) delete process.env.HOJA_PEDIDOS_SECRETO; else process.env.HOJA_PEDIDOS_SECRETO = previo.s;
  }
});

test('leerFilaPedido manda accion "leer" y devuelve la fila si existe', () =>
  conCredenciales(async () => {
    const peticiones: unknown[] = [];
    const fetchFalso = (async (_url: RequestInfo | URL, init?: RequestInit) => {
      peticiones.push(JSON.parse(String(init?.body ?? '{}')));
      return new Response(JSON.stringify({ ok: true, fila: { pedidoId: 'EG-260920-ABCD', total: 114_700 } }), { status: 200 });
    }) as typeof fetch;
    const fila = await leerFilaPedido('EG-260920-ABCD', fetchFalso);
    assert.deepEqual(peticiones[0], { secreto: 'shh', accion: 'leer', pedidoId: 'EG-260920-ABCD' });
    assert.deepEqual(fila, { pedidoId: 'EG-260920-ABCD', total: 114_700 });
  }));

test('leerFilaPedido devuelve null si el pedido no existe o la hoja no está configurada', () =>
  conCredenciales(async () => {
    const fetchFalso = (async () => new Response(JSON.stringify({ ok: false }), { status: 200 })) as typeof fetch;
    assert.equal(await leerFilaPedido('EG-000000-XXXX', fetchFalso), null);
  }));

test('leerFilaPedido sin credenciales no llama a la hoja', async () => {
  delete process.env.HOJA_PEDIDOS_URL;
  delete process.env.HOJA_PEDIDOS_SECRETO;
  let llamadas = 0;
  const fetchFalso = (async () => {
    llamadas++;
    return new Response('{}');
  }) as typeof fetch;
  assert.equal(await leerFilaPedido('EG-260920-ABCD', fetchFalso), null);
  assert.equal(llamadas, 0);
});
