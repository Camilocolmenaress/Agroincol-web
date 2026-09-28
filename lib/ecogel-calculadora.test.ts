import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CANTIDADES, ESPACIOS, recomendarUnidades } from './ecogel-calculadora';

test('toda la casa o muchas cucarachas → 3; varias → 2; pocas en cocina o cocina y baño → 1', () => {
  for (const c of CANTIDADES) assert.equal(recomendarUnidades('todo', c.id).unidades, 3);
  for (const e of ESPACIOS) assert.equal(recomendarUnidades(e.id, 'muchas').unidades, 3);
  assert.equal(recomendarUnidades('cocina', 'varias').unidades, 2);
  assert.equal(recomendarUnidades('cocina_bano', 'varias').unidades, 2);
  assert.equal(recomendarUnidades('cocina', 'pocas').unidades, 1);
  assert.equal(recomendarUnidades('cocina_bano', 'pocas').unidades, 1);
});
