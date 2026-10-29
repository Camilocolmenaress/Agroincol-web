import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cuandoContactamos, estaAbierto, festivosDe, proximaApertura, textoProximaApertura } from './horario';

/** Hora local de Bogotá (UTC-5) como instante real. */
const bogota = (iso: string) => new Date(`${iso}-05:00`);

test('festivos 2026: los 18 del calendario oficial, con los trasladados a lunes', () => {
  assert.deepEqual(
    Array.from(festivosDe(2026)).sort(),
    [
      '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03', '2026-05-01',
      '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29', '2026-07-20', '2026-08-07',
      '2026-08-17', '2026-10-12', '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25',
    ]
  );
});

test('festivos 2027: se calculan solos, sin lista que mantener', () => {
  assert.deepEqual(
    Array.from(festivosDe(2027)).sort(),
    [
      '2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25', '2027-03-26', '2027-05-01',
      '2027-05-10', '2027-05-31', '2027-06-07', '2027-07-05', '2027-07-20', '2027-08-07',
      '2027-08-16', '2027-10-18', '2027-11-01', '2027-11-15', '2027-12-08', '2027-12-25',
    ]
  );
});

test('abierto lunes a viernes 8:00-11:55 y 14:00-17:55', () => {
  assert.equal(estaAbierto(bogota('2026-10-26T08:00')), true);
  assert.equal(estaAbierto(bogota('2026-10-26T11:54')), true);
  assert.equal(estaAbierto(bogota('2026-10-26T14:00')), true);
  assert.equal(estaAbierto(bogota('2026-10-30T17:54')), true);
});

test('cerrado a las 7:59, 11:55, 12:30, 17:55, 18:05 y en la noche', () => {
  assert.equal(estaAbierto(bogota('2026-10-26T07:59')), false);
  assert.equal(estaAbierto(bogota('2026-10-26T11:55')), false);
  assert.equal(estaAbierto(bogota('2026-10-26T12:30')), false);
  assert.equal(estaAbierto(bogota('2026-10-26T17:55')), false);
  assert.equal(estaAbierto(bogota('2026-10-26T18:05')), false);
  assert.equal(estaAbierto(bogota('2026-10-26T22:00')), false);
});

test('cerrado sábado, domingo y festivos', () => {
  assert.equal(estaAbierto(bogota('2026-10-31T10:00')), false);
  assert.equal(estaAbierto(bogota('2026-11-01T10:00')), false);
  assert.equal(estaAbierto(bogota('2026-11-02T10:00')), false); // Todos los Santos, corrido
  assert.equal(estaAbierto(bogota('2026-11-16T10:00')), false); // Cartagena, corrido
});

test('no depende de la zona horaria de la máquina: 13:00 UTC son las 8:00 en Bogotá', () => {
  assert.equal(estaAbierto(new Date('2026-10-26T13:00:00Z')), true);
  assert.equal(estaAbierto(new Date('2026-10-26T12:59:00Z')), false);
});

test('próxima apertura', () => {
  assert.deepEqual(proximaApertura(bogota('2026-10-26T12:30')), bogota('2026-10-26T14:00'));
  assert.deepEqual(proximaApertura(bogota('2026-10-26T06:00')), bogota('2026-10-26T08:00'));
  // Viernes en la noche, con el lunes festivo: abre el martes.
  assert.deepEqual(proximaApertura(bogota('2026-10-30T18:05')), bogota('2026-11-03T08:00'));
});

test('texto de la próxima apertura', () => {
  assert.equal(textoProximaApertura(bogota('2026-10-26T12:30')), 'hoy a partir de las 2:00 p. m.');
  assert.equal(textoProximaApertura(bogota('2026-10-26T18:05')), 'mañana a partir de las 8:00 a. m.');
  assert.equal(textoProximaApertura(bogota('2026-10-30T18:05')), 'el martes 3 de noviembre a partir de las 8:00 a. m.');
  // Pasada la medianoche del domingo, el lunes ya es "hoy".
  assert.equal(textoProximaApertura(bogota('2026-10-26T00:30')), 'hoy a partir de las 8:00 a. m.');
});

test('cuándo contactamos: 5 minutos en horario, la próxima apertura fuera de él', () => {
  assert.equal(cuandoContactamos(bogota('2026-10-26T10:00')), 'en 5 minutos');
  // 11:57: aún es horario, pero no alcanza para los 5 minutos.
  assert.equal(cuandoContactamos(bogota('2026-10-26T11:57')), 'hoy a partir de las 2:00 p. m.');
  assert.equal(cuandoContactamos(bogota('2026-10-31T22:00')), 'el martes 3 de noviembre a partir de las 8:00 a. m.');
});
