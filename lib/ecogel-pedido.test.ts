import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEPARTAMENTOS, nuevoPedidoId, validarPedido } from './ecogel-pedido';

const base = {
  unidades: 3,
  metodo: 'online',
  nombre: 'Diana Pérez',
  celular: '310 789 1948',
  tipoDocumento: 'CC',
  documento: '1.098.765.432',
  direccion: 'Calle 10 # 20-30, Cabecera',
  ciudad: 'Bucaramanga',
  departamento: 'Santander',
  de: 'hogar',
};

test('un pedido completo es válido y normaliza el celular', () => {
  const r = validarPedido(base);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.pedido.celular, '3107891948');
  }
});

test('el celular debe tener 10 dígitos y empezar por 3', () => {
  const r = validarPedido({ ...base, celular: '6076543210' });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.errores.celular, /celular/i);
});

test('el checkout ya no pide correo ni barrio aparte: el pedido vale sin ellos en todos los métodos', () => {
  for (const metodo of ['online', 'bancolombia', 'nequi', 'breb', 'contraentrega']) {
    const r = validarPedido({ ...base, metodo });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.pedido.correo, '');
      assert.equal(r.pedido.barrio, '');
    }
  }
});

test('un correo o barrio que llegue (página vieja en caché) se guarda; un correo inválido se descarta sin bloquear', () => {
  const r = validarPedido({ ...base, correo: 'Diana@Example.com', barrio: 'Cabecera' });
  assert.equal(r.ok && r.pedido.correo, 'diana@example.com');
  assert.equal(r.ok && r.pedido.barrio, 'Cabecera');
  const malo = validarPedido({ ...base, correo: 'no-es-correo' });
  assert.equal(malo.ok && malo.pedido.correo, '');
});

test('las autorizaciones son expresas: solo cuentan si llegan en true', () => {
  const r = validarPedido(base);
  assert.equal(r.ok && r.pedido.autorizaWhatsapp, false);
  assert.equal(r.ok && r.pedido.ofertas, false);
  const si = validarPedido({ ...base, autorizaWhatsapp: true, ofertas: true });
  assert.equal(si.ok && si.pedido.autorizaWhatsapp, true);
  assert.equal(si.ok && si.pedido.ofertas, true);
  const texto = validarPedido({ ...base, autorizaWhatsapp: 'sí' });
  assert.equal(texto.ok && texto.pedido.autorizaWhatsapp, false);
});

test('el documento es obligatorio: tipo CC, TI o NIT y solo dígitos', () => {
  const r = validarPedido(base);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.pedido.tipoDocumento, 'CC');
    assert.equal(r.pedido.documento, '1098765432');
  }
  for (const tipoDocumento of ['TI', 'NIT']) assert.equal(validarPedido({ ...base, tipoDocumento }).ok, true);
  const nit = validarPedido({ ...base, tipoDocumento: 'NIT', documento: '900.123.456-7' });
  assert.equal(nit.ok && nit.pedido.documento, '9001234567');

  const sinTipo = validarPedido({ ...base, tipoDocumento: '' });
  assert.equal(sinTipo.ok, false);
  if (!sinTipo.ok) assert.ok(sinTipo.errores.tipoDocumento);
  assert.equal(validarPedido({ ...base, tipoDocumento: 'CE' }).ok, false);

  const sinNumero = validarPedido({ ...base, documento: '' });
  assert.equal(sinNumero.ok, false);
  if (!sinNumero.ok) assert.ok(sinNumero.errores.documento);
  assert.equal(validarPedido({ ...base, documento: '1234' }).ok, false);
  assert.equal(validarPedido({ ...base, documento: '1234567890123' }).ok, false);
});

test('rechaza tier, método, segmento y departamento inválidos', () => {
  assert.equal(validarPedido({ ...base, unidades: 4 }).ok, false);
  assert.equal(validarPedido({ ...base, metodo: 'cheque' }).ok, false);
  assert.equal(validarPedido({ ...base, de: 'oficinas' }).ok, false);
  assert.equal(validarPedido({ ...base, departamento: 'Narnia' }).ok, false);
  assert.equal(validarPedido(null).ok, false);
});

test('hay 33 departamentos y Bogotá está', () => {
  assert.equal(DEPARTAMENTOS.length, 33);
  assert.ok(DEPARTAMENTOS.includes('Bogotá D.C.'));
});

test('el id de pedido es legible y determinista con azar fijo', () => {
  const id = nuevoPedidoId(new Date('2026-09-19T15:00:00Z'), () => 0);
  assert.match(id, /^EG-260919-[A-Z0-9]{4}$/);
});

test('un nombre de 200 caracteres se recorta a 120', () => {
  const r = validarPedido({ ...base, nombre: 'A'.repeat(200) });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.pedido.nombre.length, 120);
});
