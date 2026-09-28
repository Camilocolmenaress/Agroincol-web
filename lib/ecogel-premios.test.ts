import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PREMIOS,
  aplicabilidadPremio,
  correoPremio,
  esCodigoPremio,
  esIdPremio,
  nuevoCodigoPremio,
  premioPorNumero,
  sortearPremio,
  totalConPremio,
  vencimientoPremio,
} from './ecogel-premios';

test('exactamente 4 premios y las probabilidades declaradas suman 100', () => {
  assert.equal(PREMIOS.length, 4);
  assert.deepEqual(
    Object.fromEntries(PREMIOS.map((p) => [p.id, p.probabilidad])),
    { cuatro_por_tres: 10, envio_gratis_2: 20, descuento_8000: 30, proxima_10000: 40 },
  );
  assert.equal(PREMIOS.reduce((s, p) => s + p.probabilidad, 0), 100);
});

test('cada número de 0 a 99 cae en un premio, y cada premio ocupa tantos números como su probabilidad', () => {
  const conteo: Record<string, number> = {};
  for (let n = 0; n < 100; n++) {
    const p = premioPorNumero(n);
    conteo[p.id] = (conteo[p.id] ?? 0) + 1;
  }
  for (const p of PREMIOS) assert.equal(conteo[p.id], p.probabilidad, p.id);
  assert.throws(() => premioPorNumero(100));
  assert.throws(() => premioPorNumero(-1));
});

test('sortearPremio usa el número que le da el azar', () => {
  assert.equal(sortearPremio(() => 0).id, premioPorNumero(0).id);
  assert.equal(sortearPremio(() => 99).id, premioPorNumero(99).id);
});

test('con 100.000 giros reales la distribución queda a menos de 1 punto de lo declarado', () => {
  const n = 100_000;
  const conteo: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    const p = sortearPremio();
    conteo[p.id] = (conteo[p.id] ?? 0) + 1;
  }
  for (const p of PREMIOS) {
    const real = (conteo[p.id] / n) * 100;
    assert.ok(Math.abs(real - p.probabilidad) < 1, `${p.id}: ${real.toFixed(2)} % vs ${p.probabilidad} %`);
  }
});

test('vigencia: 15 días para los premios de esta compra y 60 para la próxima', () => {
  const vig = Object.fromEntries(PREMIOS.map((p) => [p.id, p.vigenciaDias]));
  assert.deepEqual(vig, { cuatro_por_tres: 15, envio_gratis_2: 15, descuento_8000: 15, proxima_10000: 60 });
  const desde = new Date('2026-09-27T15:00:00Z');
  assert.equal(vencimientoPremio('descuento_8000', desde).toISOString(), '2026-10-12T15:00:00.000Z');
  assert.equal(vencimientoPremio('proxima_10000', desde).toISOString(), '2026-11-26T15:00:00.000Z');
});

test('los códigos son legibles, sin 0/O ni 1/I, y se reconocen', () => {
  const c = nuevoCodigoPremio(() => 0);
  assert.equal(c, 'RE-AAAAAA');
  for (let i = 0; i < 200; i++) assert.ok(esCodigoPremio(nuevoCodigoPremio()));
  assert.equal(esCodigoPremio('RE-AAAA0A'), false);
  assert.equal(esCodigoPremio('re-aaaaaa'), false);
  assert.equal(esIdPremio('descuento_8000'), true);
  assert.equal(esIdPremio('descuento_9000'), false);
});

test('cada premio aplica solo con su cantidad; el de próxima compra solo si ya compró', () => {
  assert.equal(aplicabilidadPremio('cuatro_por_tres', 3, false).aplica, true);
  assert.equal(aplicabilidadPremio('cuatro_por_tres', 2, false).aplica, false);
  assert.equal(aplicabilidadPremio('descuento_8000', 3, false).aplica, true);
  assert.equal(aplicabilidadPremio('descuento_8000', 1, false).aplica, false);
  assert.equal(aplicabilidadPremio('envio_gratis_2', 2, false).aplica, true);
  assert.equal(aplicabilidadPremio('envio_gratis_2', 3, false).aplica, false);
  assert.equal(aplicabilidadPremio('proxima_10000', 1, false).aplica, false);
  assert.equal(aplicabilidadPremio('proxima_10000', 1, true).aplica, true);
  assert.match(aplicabilidadPremio('descuento_8000', 1, false).motivo ?? '', /3 unidades/);
});

test('totalConPremio: el premio se suma al descuento por pago anticipado', () => {
  // Combo en línea: 109.700 − 5.000 (anticipado) − 8.000 (premio).
  const d = totalConPremio(3, 'online', 'descuento_8000', false);
  assert.equal(d.total, 96_700);
  assert.equal(d.descuento, 5_000);
  assert.equal(d.descuentoPremio, 8_000);
  assert.equal(d.premioAplicado, true);

  // 2 unidades contra entrega: el envío de 10.000 pasa a 0.
  const e = totalConPremio(2, 'contraentrega', 'envio_gratis_2', false);
  assert.equal(e.envio, 0);
  assert.equal(e.total, 79_800);

  // 4x3: mismo precio, una unidad de regalo.
  const r = totalConPremio(3, 'contraentrega', 'cuatro_por_tres', false);
  assert.equal(r.total, 109_700);
  assert.equal(r.unidadesRegalo, 1);

  // Próxima compra: solo si ya compró.
  assert.equal(totalConPremio(1, 'online', 'proxima_10000', true).total, 39_900 + 20_000 - 5_000 - 10_000);
  assert.equal(totalConPremio(1, 'online', 'proxima_10000', false).total, 39_900 + 20_000 - 5_000);

  // Premio que no aplica o sin premio: el precio base intacto.
  const n = totalConPremio(1, 'contraentrega', 'descuento_8000', false);
  assert.equal(n.total, 59_900);
  assert.equal(n.premioAplicado, false);
  assert.equal(totalConPremio(3, 'online', null, false).total, 104_700);
});

test('el correo lleva el código, la vigencia, la condición y el enlace con el código aplicado', () => {
  const c = correoPremio({ premio: 'envio_gratis_2', codigo: 'RE-ABCDEF', vence: '2026-10-12T15:00:00.000Z', base: 'https://agroincol.com' });
  assert.equal(c.asunto, 'Tu premio EcoGel: Envío gratis al llevar 2');
  assert.match(c.cuerpo, /RE-ABCDEF/);
  assert.match(c.cuerpo, /12 de octubre de 2026/);
  assert.match(c.cuerpo, /Aplica al llevar 2 unidades/);
  assert.match(c.cuerpo, /https:\/\/agroincol\.com\/ecogel\/pedido\?u=2&codigo=RE-ABCDEF/);
  assert.match(c.cuerpo, /BAJA/);
});
