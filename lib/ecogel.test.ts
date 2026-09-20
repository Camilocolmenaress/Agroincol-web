import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DESCUENTO_ONLINE, TIERS, TIER_POR_DEFECTO, esUnidades, money, tierDe, totalPedido } from './ecogel';

test('los tres tiers tienen los precios del spec', () => {
  assert.deepEqual(
    TIERS.map((t) => [t.unidades, t.producto, t.envio]),
    [
      [1, 39_900, 20_000],
      [2, 79_800, 10_000],
      [3, 119_700, 0],
    ],
  );
});

test('el tier por defecto es 3 y es el único "más vendido"', () => {
  assert.equal(TIER_POR_DEFECTO, 3);
  assert.deepEqual(TIERS.filter((t) => t.masVendido).map((t) => t.unidades), [3]);
});

test('contraentrega paga producto + envío sin descuento', () => {
  assert.deepEqual(totalPedido(1, 'contraentrega'), { producto: 39_900, envio: 20_000, descuento: 0, total: 59_900 });
  assert.deepEqual(totalPedido(3, 'contraentrega'), { producto: 119_700, envio: 0, descuento: 0, total: 119_700 });
});

test('pago en línea descuenta $5.000 por pedido', () => {
  assert.equal(DESCUENTO_ONLINE, 5_000);
  assert.deepEqual(totalPedido(2, 'online'), { producto: 79_800, envio: 10_000, descuento: 5_000, total: 84_800 });
  assert.equal(totalPedido(3, 'online').total, 114_700);
});

test('los métodos manuales (bancolombia, nequi, breb) descuentan igual que en línea', () => {
  for (const metodo of ['bancolombia', 'nequi', 'breb'] as const) {
    assert.deepEqual(totalPedido(2, metodo), { producto: 79_800, envio: 10_000, descuento: 5_000, total: 84_800 });
  }
});

test('tierDe rechaza cantidades fuera de 1-3', () => {
  assert.throws(() => tierDe(0));
  assert.throws(() => tierDe(4));
  assert.equal(tierDe(2).unidades, 2);
});

test('esUnidades solo acepta 1, 2 o 3 numéricos', () => {
  assert.equal(esUnidades(3), true);
  assert.equal(esUnidades('3'), false);
  assert.equal(esUnidades(5), false);
});

test('money formatea en pesos colombianos', () => {
  assert.equal(money(119_700), '$119.700');
  assert.equal(money(0), '$0');
});
