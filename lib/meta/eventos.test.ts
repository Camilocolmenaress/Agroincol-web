import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UNA_VEZ_POR_SESION, esEventoValido } from './eventos';

test('AddToCart es un evento válido para el Pixel y la API de Conversiones', () => {
  assert.equal(esEventoValido('AddToCart'), true);
  assert.equal(esEventoValido('AddPaymentInfo'), false);
});

test('el embudo de EcoGel cuenta cada paso una vez por sesión', () => {
  for (const evento of ['ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase'] as const) {
    assert.ok(UNA_VEZ_POR_SESION.includes(evento), evento);
  }
  assert.ok(!UNA_VEZ_POR_SESION.includes('PageView'));
});
