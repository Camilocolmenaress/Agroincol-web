import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CLAVE_MODO_PRUEBA, modoPruebaDesde, urlConMarcaDePrueba } from './modo-prueba';

function almacen(inicial: Record<string, string> = {}) {
  const datos = new Map(Object.entries(inicial));
  return {
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => void datos.set(k, v),
    removeItem: (k: string) => void datos.delete(k),
    datos,
  };
}

test('?test=1 activa el modo prueba y lo recuerda en la sesión', () => {
  const s = almacen();
  assert.equal(modoPruebaDesde('?u=3&test=1', s), true);
  assert.equal(s.datos.get(CLAVE_MODO_PRUEBA), '1');
  // La siguiente página ya no trae el parámetro: sigue en prueba.
  assert.equal(modoPruebaDesde('?pedido=EG-260927-A47J', s), true);
});

test('?test=0 lo apaga; sin parámetro ni marca no hay prueba', () => {
  const s = almacen({ [CLAVE_MODO_PRUEBA]: '1' });
  assert.equal(modoPruebaDesde('?test=0', s), false);
  assert.equal(s.datos.has(CLAVE_MODO_PRUEBA), false);
  assert.equal(modoPruebaDesde('', almacen()), false);
});

test('sin almacenamiento solo cuenta el parámetro de esta URL', () => {
  assert.equal(modoPruebaDesde('?test=1', null), true);
  assert.equal(modoPruebaDesde('', null), false);
});

test('la URL que viaja al servidor lleva test=1 solo en modo prueba', () => {
  assert.equal(urlConMarcaDePrueba('https://agroincol.com/ecogel/pedido?u=3', true), 'https://agroincol.com/ecogel/pedido?u=3&test=1');
  assert.equal(urlConMarcaDePrueba('https://agroincol.com/ecogel/pedido?u=3', false), 'https://agroincol.com/ecogel/pedido?u=3');
  // No la duplica si ya la trae.
  assert.equal(urlConMarcaDePrueba('https://agroincol.com/ecogel?test=1', true), 'https://agroincol.com/ecogel?test=1');
});
