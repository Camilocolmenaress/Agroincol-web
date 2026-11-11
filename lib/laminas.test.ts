import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cotizar, datosMetaLaminas, empujon, municipioAm, normalizarCantidad, zonaDe } from './laminas';

test('los tres paquetes del brief, en el área metropolitana', () => {
  assert.deepEqual(cotizar(6, 'am'), { cantidad: 6, precioUnidad: 10_000, producto: 60_000, envio: 8_000, total: 68_000 });
  assert.deepEqual(cotizar(12, 'am'), { cantidad: 12, precioUnidad: 10_000, producto: 120_000, envio: 0, total: 120_000 });
  assert.deepEqual(cotizar(24, 'am'), { cantidad: 24, precioUnidad: 9_000, producto: 216_000, envio: 0, total: 216_000 });
});

test('cantidades sueltas: 11 paga envío, 23 a $10.000, 30 a $9.000', () => {
  assert.equal(cotizar(11, 'am').total, 118_000);
  assert.equal(cotizar(23, 'am').total, 230_000);
  assert.equal(cotizar(30, 'am').total, 270_000);
});

test('fuera del área metropolitana siempre se cobran $25.000 de envío', () => {
  assert.equal(cotizar(6, 'fuera').envio, 25_000);
  assert.equal(cotizar(12, 'fuera').envio, 25_000);
  assert.equal(cotizar(24, 'fuera').total, 241_000);
});

test('la cantidad nunca baja del mínimo de 6 ni acepta basura', () => {
  assert.equal(normalizarCantidad(2), 6);
  assert.equal(normalizarCantidad('12'), 12);
  assert.equal(normalizarCantidad(7.6), 7);
  assert.equal(normalizarCantidad('abc'), 12);
  assert.equal(normalizarCantidad(100_000), 500);
});

test('zona: solo los 4 municipios de Santander son área metropolitana', () => {
  assert.equal(zonaDe('Santander', 'Floridablanca'), 'am');
  assert.equal(zonaDe('Santander', 'Girón'), 'am');
  assert.equal(zonaDe('Santander', 'San Gil'), 'fuera');
  assert.equal(zonaDe('Antioquia', 'Bucaramanga'), 'fuera');
});

test('zona: el municipio escrito a mano cuenta aunque venga sin tilde, en minúsculas o con espacios', () => {
  for (const escrito of ['bucaramanga', 'BUCARAMANGA ', 'Giron', ' girón', 'piedecuesta', 'floridablanca']) {
    assert.equal(zonaDe('Santander', escrito), 'am', escrito);
  }
  assert.equal(municipioAm('giron'), 'Girón');
  assert.equal(municipioAm('  BUCARAMANGA'), 'Bucaramanga');
  assert.equal(municipioAm('San Gil'), null);
  assert.equal(zonaDe('santander', 'Bucaramanga'), 'fuera', 'el departamento sale de una lista cerrada');
});

test('empujón con 11: con 1 más, envío gratis', () => {
  const e = empujon(11, 'am');
  assert.equal(e?.objetivo, 12);
  assert.match(e!.texto, /Con 1 más, envío gratis: docena por \$120\.000/);
});

test('empujón con 22 y 23: 24 cuestan menos', () => {
  assert.match(empujon(22, 'am')!.texto, /\$216\.000.*menos que 22 \(\$220\.000\)/);
  assert.match(empujon(23, 'am')!.texto, /\$216\.000.*menos que 23 \(\$230\.000\)/);
  assert.equal(empujon(23, 'am')!.objetivo, 24);
});

test('empujón con 21: por $6.000 más lleva 24', () => {
  assert.match(empujon(21, 'am')!.texto, /\$6\.000 más/);
});

test('sin empujón en los paquetes cerrados ni fuera del área para el envío gratis', () => {
  assert.equal(empujon(6, 'am'), null);
  assert.equal(empujon(12, 'am'), null);
  assert.equal(empujon(24, 'am'), null);
  assert.equal(empujon(11, 'fuera'), null);
  // El de 24 sí aplica fuera: el ahorro es en el precio, no en el envío.
  assert.equal(empujon(23, 'fuera')?.objetivo, 24);
});

test('eventos del embudo: valor sin envío y cantidad de láminas', () => {
  assert.deepEqual(datosMetaLaminas(12), {
    categoria: 'laminas',
    valor: 120_000,
    contenido: { ids: ['laminas-captura'], numItems: 12 },
  });
});
