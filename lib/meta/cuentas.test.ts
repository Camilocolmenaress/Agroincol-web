import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cuentaPorRuta, cuentaPorUrl, pixelIdDe } from './cuentas';

test('las rutas de EcoGel van a la cuenta ecogel; el resto a servicios', () => {
  assert.equal(cuentaPorRuta('/ecogel'), 'ecogel');
  assert.equal(cuentaPorRuta('/ecogel/hogar'), 'ecogel');
  assert.equal(cuentaPorRuta('/ecogel/pedido'), 'ecogel');
  assert.equal(cuentaPorRuta('/lp/chinches'), 'servicios');
  assert.equal(cuentaPorRuta('/'), 'servicios');
  // Un prefijo parecido no basta: solo el segmento exacto.
  assert.equal(cuentaPorRuta('/ecogelito'), 'servicios');
});

test('cuentaPorUrl lee el pathname y cae a servicios si la URL no parsea', () => {
  assert.equal(cuentaPorUrl('https://agroincol.com/ecogel/restaurantes?u=3'), 'ecogel');
  assert.equal(cuentaPorUrl('https://agroincol.com/lp/comejen'), 'servicios');
  assert.equal(cuentaPorUrl('no es una url'), 'servicios');
  assert.equal(cuentaPorUrl(undefined), 'servicios');
});

test('cada cuenta lee su propio pixel; sin variable, vacío (medición apagada)', () => {
  const previo = { s: process.env.NEXT_PUBLIC_META_PIXEL_ID, e: process.env.NEXT_PUBLIC_META_PIXEL_ID_ECOGEL };
  process.env.NEXT_PUBLIC_META_PIXEL_ID = '111';
  delete process.env.NEXT_PUBLIC_META_PIXEL_ID_ECOGEL;
  try {
    assert.equal(pixelIdDe('servicios'), '111');
    assert.equal(pixelIdDe('ecogel'), '');
    process.env.NEXT_PUBLIC_META_PIXEL_ID_ECOGEL = '222';
    assert.equal(pixelIdDe('ecogel'), '222');
    // La cuenta de EcoGel NUNCA hereda el pixel de servicios.
    assert.notEqual(pixelIdDe('ecogel'), pixelIdDe('servicios'));
  } finally {
    if (previo.s === undefined) delete process.env.NEXT_PUBLIC_META_PIXEL_ID; else process.env.NEXT_PUBLIC_META_PIXEL_ID = previo.s;
    if (previo.e === undefined) delete process.env.NEXT_PUBLIC_META_PIXEL_ID_ECOGEL; else process.env.NEXT_PUBLIC_META_PIXEL_ID_ECOGEL = previo.e;
  }
});
