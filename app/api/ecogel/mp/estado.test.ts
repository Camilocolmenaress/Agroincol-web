import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoDesdeMp } from './estado';

test('approved marca pagado; rejected y cancelled marcan pago_fallido; el resto no toca', () => {
  assert.equal(estadoDesdeMp('approved'), 'pagado');
  assert.equal(estadoDesdeMp('rejected'), 'pago_fallido');
  assert.equal(estadoDesdeMp('cancelled'), 'pago_fallido');
  assert.equal(estadoDesdeMp('pending'), null);
  assert.equal(estadoDesdeMp('in_process'), null);
  assert.equal(estadoDesdeMp(''), null);
});
