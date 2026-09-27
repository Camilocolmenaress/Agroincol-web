import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diaDeDespacho, festivosColombia } from './ecogel-despacho';

// Calendario oficial 2026 y 2027 (Ley 51 de 1983, "Ley Emiliani").
test('festivos de Colombia 2026', () => {
  assert.deepEqual(Array.from(festivosColombia(2026)).sort(), [
    '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03', '2026-05-01',
    '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29', '2026-07-20', '2026-08-07',
    '2026-08-17', '2026-10-12', '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25',
  ]);
});

test('festivos de Colombia 2027', () => {
  assert.deepEqual(Array.from(festivosColombia(2027)).sort(), [
    '2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25', '2027-03-26', '2027-05-01',
    '2027-05-10', '2027-05-31', '2027-06-07', '2027-07-05', '2027-07-20', '2027-08-07',
    '2027-08-16', '2027-10-18', '2027-11-01', '2027-11-15', '2027-12-08', '2027-12-25',
  ]);
});

const caso = (iso: string) => diaDeDespacho(new Date(iso));

test('lunes a viernes antes de las 6 p.m.: sale hoy', () => {
  assert.deepEqual(caso('2026-09-28T10:00:00-05:00'), { hoy: true, fecha: '2026-09-28', texto: 'hoy' });
  assert.deepEqual(caso('2026-09-28T17:59:00-05:00'), { hoy: true, fecha: '2026-09-28', texto: 'hoy' });
});

test('madrugada de día hábil: sale ese mismo día', () => {
  assert.deepEqual(caso('2026-09-29T03:00:00-05:00'), { hoy: true, fecha: '2026-09-29', texto: 'hoy' });
});

test('lunes a viernes desde las 6 p.m.: sale el día hábil siguiente', () => {
  assert.deepEqual(caso('2026-09-28T18:00:00-05:00'), { hoy: false, fecha: '2026-09-29', texto: 'mañana' });
});

test('usa la hora de Colombia, no la del servidor (UTC)', () => {
  // 02:00 UTC del martes = 9 p.m. del lunes en Bogotá.
  assert.deepEqual(caso('2026-09-29T02:00:00Z'), { hoy: false, fecha: '2026-09-29', texto: 'mañana' });
});

test('viernes en la noche: sale el sábado', () => {
  assert.deepEqual(caso('2026-10-02T19:00:00-05:00'), { hoy: false, fecha: '2026-10-03', texto: 'mañana' });
});

test('sábado: antes del mediodía sale hoy, después el lunes', () => {
  assert.deepEqual(caso('2026-10-03T11:59:00-05:00'), { hoy: true, fecha: '2026-10-03', texto: 'hoy' });
  assert.deepEqual(caso('2026-10-03T12:00:00-05:00'), { hoy: false, fecha: '2026-10-05', texto: 'el lunes 5 de octubre' });
});

test('domingo: sale el lunes', () => {
  assert.deepEqual(caso('2026-10-04T09:00:00-05:00'), { hoy: false, fecha: '2026-10-05', texto: 'mañana' });
});

test('festivo: sale el siguiente día hábil', () => {
  assert.deepEqual(caso('2026-10-12T09:00:00-05:00'), { hoy: false, fecha: '2026-10-13', texto: 'mañana' });
});

test('sábado en la tarde antes de puente: se salta domingo y lunes festivo', () => {
  assert.deepEqual(caso('2026-10-10T14:00:00-05:00'), { hoy: false, fecha: '2026-10-13', texto: 'el martes 13 de octubre' });
});

test('sábado festivo no despacha', () => {
  // 2027-05-01 (Día del Trabajo) cae sábado.
  assert.deepEqual(caso('2027-05-01T08:00:00-05:00'), { hoy: false, fecha: '2027-05-03', texto: 'el lunes 3 de mayo' });
});

test('fin de año: cruza al año siguiente y se salta el 1 de enero', () => {
  assert.deepEqual(caso('2026-12-31T19:00:00-05:00'), { hoy: false, fecha: '2027-01-02', texto: 'el sábado 2 de enero' });
});
