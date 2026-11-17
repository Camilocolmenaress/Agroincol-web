import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ahorroPorLamina,
  cotizar,
  datosMetaLaminas,
  empujon,
  municipioAm,
  normalizarCantidad,
  paqueteSugerido,
  zonaDe,
} from './laminas';

test('los tres paquetes de la escala del 17-nov, en el área metropolitana', () => {
  assert.deepEqual(cotizar(3, 'am'), { cantidad: 3, precioUnidad: 10_000, producto: 30_000, envio: 8_000, total: 38_000 });
  assert.deepEqual(cotizar(12, 'am'), { cantidad: 12, precioUnidad: 6_000, producto: 72_000, envio: 0, total: 72_000 });
  assert.deepEqual(cotizar(24, 'am'), { cantidad: 24, precioUnidad: 5_400, producto: 129_600, envio: 0, total: 129_600 });
});

test('otra cantidad: 3-11 a $10.000 con envío $8.000, 12-23 a $6.000 gratis, desde 24 a $5.400 gratis', () => {
  assert.equal(cotizar(11, 'am').total, 118_000);
  assert.equal(cotizar(13, 'am').total, 78_000);
  assert.equal(cotizar(23, 'am').total, 138_000);
  assert.equal(cotizar(30, 'am').total, 162_000);
});

test('fuera del área metropolitana siempre se cobran $25.000 de envío', () => {
  assert.equal(cotizar(3, 'fuera').envio, 25_000);
  assert.equal(cotizar(12, 'fuera').total, 97_000);
  assert.equal(cotizar(24, 'fuera').total, 154_600);
});

test('el ahorro por lámina se mide contra el paquete de 3', () => {
  assert.equal(ahorroPorLamina(3), 0);
  assert.equal(ahorroPorLamina(12), 4_000);
  assert.equal(ahorroPorLamina(24), 4_600);
});

test('la cantidad nunca baja del mínimo de 3 ni acepta basura', () => {
  assert.equal(normalizarCantidad(2), 3);
  assert.equal(normalizarCantidad('12'), 12);
  assert.equal(normalizarCantidad(7.6), 7);
  assert.equal(normalizarCantidad('abc'), 12);
  assert.equal(normalizarCantidad(100_000), 500);
});

test('calculadora: 1-3 → 3, 4-12 → docena, 13-24 → 24, más de 24 → las que necesita (24 + extras a $5.400)', () => {
  assert.equal(paqueteSugerido(1), 3);
  assert.equal(paqueteSugerido(3), 3);
  assert.equal(paqueteSugerido(4), 12);
  assert.equal(paqueteSugerido(12), 12);
  assert.equal(paqueteSugerido(13), 24);
  assert.equal(paqueteSugerido(24), 24);
  assert.equal(paqueteSugerido(30), 30);
  assert.equal(cotizar(30, 'am').precioUnidad, 5_400);
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

test('empujón: de 7 a 11 en el área la docena cuesta menos (con envío)', () => {
  for (const n of [7, 8, 9, 10, 11]) {
    const e = empujon(n, 'am');
    assert.equal(e?.objetivo, 12, String(n));
    assert.match(e!.texto, /12 láminas cuestan \$72\.000/);
  }
  assert.match(empujon(11, 'am')!.texto, /menos que 11 \(\$118\.000\)/);
});

test('empujón: con 6 en el área, por $4.000 más lleva la docena', () => {
  assert.match(empujon(6, 'am')!.texto, /Por \$4\.000 más lleva 12 láminas/);
  assert.equal(empujon(5, 'am'), null);
});

test('empujón: 22 y 23 → 24 cuestan menos; 21 → por $3.600 más', () => {
  assert.match(empujon(22, 'am')!.texto, /\$129\.600.*menos que 22 \(\$132\.000\)/);
  assert.match(empujon(23, 'am')!.texto, /menos que 23 \(\$138\.000\)/);
  assert.match(empujon(21, 'am')!.texto, /Por \$3\.600 más lleva 24 láminas/);
  assert.equal(empujon(20, 'am'), null);
});

test('empujón fuera del área: el envío es igual, solo cuenta el producto', () => {
  assert.match(empujon(7, 'fuera')!.texto, /Por \$2\.000 más/);
  assert.equal(empujon(8, 'fuera')?.objetivo, 12);
  assert.equal(empujon(6, 'fuera'), null);
  assert.equal(empujon(23, 'fuera')?.objetivo, 24);
});

test('sin empujón en los paquetes cerrados', () => {
  assert.equal(empujon(3, 'am'), null);
  assert.equal(empujon(12, 'am'), null);
  assert.equal(empujon(24, 'am'), null);
  assert.equal(empujon(30, 'am'), null);
});

test('eventos del embudo: valor sin envío y cantidad de láminas', () => {
  assert.deepEqual(datosMetaLaminas(12), {
    categoria: 'laminas',
    valor: 72_000,
    contenido: { ids: ['laminas-captura'], numItems: 12 },
  });
  assert.equal(datosMetaLaminas(3).valor, 30_000);
  assert.equal(datosMetaLaminas(24).valor, 129_600);
});
