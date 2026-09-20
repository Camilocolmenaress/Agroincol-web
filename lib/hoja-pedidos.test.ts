import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hojaPedidosConfigurada } from './hoja-pedidos';

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
