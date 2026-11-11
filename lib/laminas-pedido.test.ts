import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escrituraHojaLaminas, validarPedidoLaminas } from './laminas-pedido';
import { cotizar } from './laminas';

const extras = { pedidoId: 'LC-261110-ABCD', fecha: '2026-11-10 10:00:00', ip: '1.1.1.1', eventId: 'ev-12345678', fbp: 'fb.1', fbc: '', externalId: 'v1', navegador: 'UA', url: 'https://agroincol.com/tienda/pedido' };

test('reintento tras fallo de Mercado Pago: actualiza TODOS los datos del comprador, no solo montos', () => {
  const r = validarPedidoLaminas({ ...base, metodo: 'contraentrega', municipio: 'Floridablanca', direccion: 'Carrera 9 # 4-20, Cañaveral', nombre: 'Otro Nombre' });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  const e = escrituraHojaLaminas(r.pedido, cotizar(12, 'am'), extras, true);
  assert.equal(e.accion, 'actualizar');
  if (e.accion !== 'actualizar') return;
  assert.equal(e.cambios.estado, 'confirmar');
  assert.equal(e.cambios.metodoPago, 'contraentrega');
  assert.equal(e.cambios.ciudad, 'Floridablanca');
  assert.equal(e.cambios.direccion, 'Carrera 9 # 4-20, Cañaveral');
  assert.equal(e.cambios.nombre, 'Otro Nombre');
  assert.equal(e.cambios.total, 120_000);
  // La fecha, el id y la atribución del pedido original no se tocan.
  assert.equal('fecha' in e.cambios, false);
  assert.equal('pedidoId' in e.cambios, false);
  assert.equal('eventId' in e.cambios, false);
});

test('pedido nuevo: fila completa con origen laminas', () => {
  const r = validarPedidoLaminas(base);
  assert.equal(r.ok, true);
  if (!r.ok) return;
  const e = escrituraHojaLaminas(r.pedido, cotizar(12, 'am'), extras, false);
  assert.equal(e.accion, 'crear');
  if (e.accion !== 'crear') return;
  assert.equal(e.fila.estado, 'pendiente_pago');
  assert.equal(e.fila.origen, 'laminas');
  assert.equal(e.fila.pedidoId, 'LC-261110-ABCD');
  assert.equal(e.fila.eventId, 'ev-12345678');
});

const base = {
  cantidad: 12,
  metodo: 'online',
  nombre: 'Restaurante La Ceiba',
  celular: '310 789 1948',
  tipoDocumento: 'NIT',
  documento: '900.123.456-7',
  direccion: 'Calle 35 # 20-10, Centro',
  departamento: 'Santander',
  municipio: 'Bucaramanga',
};

test('pedido completo en el área: válido, zona am, celular y NIT normalizados', () => {
  const r = validarPedidoLaminas(base);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.pedido.zona, 'am');
    assert.equal(r.pedido.celular, '3107891948');
    assert.equal(r.pedido.documento, '9001234567');
  }
});

test('menos de 6 láminas no pasa', () => {
  const r = validarPedidoLaminas({ ...base, cantidad: 5 });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.errores.cantidad, /6/);
});

test('cantidad que no es entero no pasa', () => {
  assert.equal(validarPedidoLaminas({ ...base, cantidad: 12.5 }).ok, false);
  assert.equal(validarPedidoLaminas({ ...base, cantidad: '12' }).ok, false);
});

test('contraentrega solo en el área metropolitana', () => {
  assert.equal(validarPedidoLaminas({ ...base, metodo: 'contraentrega' }).ok, true);
  const fuera = validarPedidoLaminas({ ...base, metodo: 'contraentrega', municipio: 'San Gil' });
  assert.equal(fuera.ok, false);
  if (!fuera.ok) assert.match(fuera.errores.metodo, /área metropolitana/);
});

test('fuera de Santander el municipio es texto libre y la zona es fuera', () => {
  const r = validarPedidoLaminas({ ...base, departamento: 'Boyacá', municipio: 'Tunja' });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.pedido.zona, 'fuera');
});

test('municipio del área escrito a mano: zona am y se guarda con el nombre oficial', () => {
  const r = validarPedidoLaminas({ ...base, municipio: 'giron', metodo: 'contraentrega' });
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.pedido.zona, 'am');
    assert.equal(r.pedido.municipio, 'Girón');
  }
});

test('más de 500 láminas: el mensaje habla del máximo, no del mínimo', () => {
  const r = validarPedidoLaminas({ ...base, cantidad: 501 });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.errores.cantidad, /500/);
});

test('sin municipio no pasa', () => {
  const r = validarPedidoLaminas({ ...base, municipio: '' });
  assert.equal(r.ok, false);
  if (!r.ok) assert.ok(r.errores.municipio);
});

test('el correo es opcional: vacío o inválido se guarda vacío, válido se guarda en minúsculas', () => {
  const sin = validarPedidoLaminas(base);
  assert.equal(sin.ok && sin.pedido.correo, '');
  const malo = validarPedidoLaminas({ ...base, correo: 'no-es-correo' });
  assert.equal(malo.ok && malo.pedido.correo, '');
  const bueno = validarPedidoLaminas({ ...base, correo: 'Compras@LaCeiba.co ' });
  assert.equal(bueno.ok && bueno.pedido.correo, 'compras@laceiba.co');
});

test('la fila nueva trae todas las columnas de la hoja (menos las de la ruleta, que las láminas no usan)', async () => {
  const { COLUMNAS_PEDIDO } = await import('./hoja-pedidos');
  const r = validarPedidoLaminas(base);
  assert.equal(r.ok, true);
  if (!r.ok) return;
  const e = escrituraHojaLaminas(r.pedido, cotizar(12, 'am'), extras, false);
  if (e.accion !== 'crear') return assert.fail('debía crear');
  const ruleta = ['codigoPremio', 'premio', 'descuentoPremio', 'unidadesRegalo'];
  for (const c of COLUMNAS_PEDIDO) if (!ruleta.includes(c)) assert.ok(c in e.fila, `falta la columna ${c}`);
});
