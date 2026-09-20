import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firmaDePedido } from './firma';

test('firmaDePedido es determinística, distinta por pedido, y null sin secreto', async () => {
  const previo = process.env.HOJA_PEDIDOS_SECRETO;
  try {
    process.env.HOJA_PEDIDOS_SECRETO = 'x';
    const a1 = await firmaDePedido('EG-260919-AAAA');
    const a2 = await firmaDePedido('EG-260919-AAAA');
    const b = await firmaDePedido('EG-260919-BBBB');
    assert.equal(a1, a2);
    assert.notEqual(a1, b);

    delete process.env.HOJA_PEDIDOS_SECRETO;
    assert.equal(await firmaDePedido('EG-260919-AAAA'), null);
  } finally {
    if (previo === undefined) delete process.env.HOJA_PEDIDOS_SECRETO;
    else process.env.HOJA_PEDIDOS_SECRETO = previo;
  }
});
