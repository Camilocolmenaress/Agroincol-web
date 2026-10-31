import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PREGUNTAS, UMBRAL, UMBRAL_SIN_DESCARTES, calificar, respuestasValidas, type Respuestas } from './calificacion';

const base: Respuestas = {
  situacion: 'cucarachas',
  tipo: 'restaurante',
  municipio: 'Bucaramanga',
  personas: '6-15',
  rol: 'dueno',
  plan_anual: 'si',
  presupuesto: '300-600',
};

test('el puntaje máximo es 110 y el formulario tiene 7 preguntas de opción', () => {
  const maximo = PREGUNTAS.reduce((s, p) => s + Math.max(...p.opciones.map((o) => o.puntos)), 0);
  assert.equal(maximo, 110);
  assert.equal(PREGUNTAS.length, 7);
});

test('un restaurante con plaga, dueño y presupuesto medio califica con prioridad alta y plan de choque', () => {
  const r = calificar(base);
  assert.equal(r.calificado, true);
  assert.equal(r.motivo, '');
  assert.equal(r.prioridad, 'alta');
  assert.equal(r.planSugerido, 'choque');
});

test('cada descarte descalifica por debajo de la regla 60', () => {
  // Prevenir, equipo chico, otro cargo, sin plan anual: puntaje bajo para todos los casos.
  const bajo: Respuestas = { ...base, situacion: 'prevenir', rol: 'otro', plan_anual: 'no', personas: '2-5', presupuesto: '140-300' };
  const casos: [Partial<Respuestas>, string][] = [
    [{ tipo: 'otro' }, 'tipo de negocio'],
    [{ municipio: 'otro' }, 'fuera de zona'],
    [{ personas: '1' }, 'una sola persona'],
    [{ presupuesto: '<140' }, 'presupuesto'],
  ];
  for (const [cambio, motivo] of casos) {
    const r = calificar({ ...bajo, ...cambio });
    assert.ok(r.puntaje < UMBRAL_SIN_DESCARTES);
    assert.equal(r.calificado, false, motivo);
    assert.equal(r.origen, '');
    assert.equal(r.motivo, motivo);
  }
});

test('regla 60: con 60 o más, tipo, personas y presupuesto no descalifican y la hoja guarda el motivo perdonado', () => {
  const casos: [Partial<Respuestas>, string][] = [
    [{ tipo: 'otro' }, 'tipo de negocio'],
    [{ personas: '1' }, 'una sola persona'],
    [{ presupuesto: '<140' }, 'presupuesto'],
    [{ tipo: 'otro', presupuesto: '<140' }, 'tipo de negocio, presupuesto'],
  ];
  for (const [cambio, motivo] of casos) {
    const r = calificar({ ...base, ...cambio });
    assert.ok(r.puntaje >= UMBRAL_SIN_DESCARTES, motivo);
    assert.equal(r.calificado, true, motivo);
    assert.equal(r.origen, 'regla 60');
    assert.equal(r.motivo, `aprobado por puntaje: ${motivo}`);
  }
});

test('regla 60 en el borde: 60 con descarte pasa, 58 con descarte no', () => {
  // Plaga 30 + de 2 a 5 (8) + administrador que consulta 10 + asesoría 12 = 60, con tipo "otro".
  const sesenta = calificar({ ...base, tipo: 'otro', rol: 'admin-consulta', personas: '2-5', presupuesto: 'asesoria', plan_anual: 'no' });
  assert.equal(sesenta.puntaje, 60);
  assert.equal(sesenta.origen, 'regla 60');
  // Plaga 30 + de 2 a 5 (8) + administrador que decide 20 + menos de $140.000 (0) = 58.
  const cincuentaYOcho = calificar({ ...base, rol: 'admin-decide', personas: '2-5', presupuesto: '<140', plan_anual: 'no' });
  assert.equal(cincuentaYOcho.puntaje, 58);
  assert.equal(cincuentaYOcho.calificado, false);
  assert.equal(cincuentaYOcho.motivo, 'presupuesto');
});

test('fuera de zona descalifica siempre, aunque tenga el puntaje máximo', () => {
  const r = calificar({ ...base, municipio: 'otro', personas: '15+', presupuesto: '600+' });
  assert.equal(r.puntaje, 110);
  assert.equal(r.calificado, false);
  assert.equal(r.origen, '');
  assert.equal(r.motivo, 'fuera de zona');
  // Con otro descarte además, tampoco: la zona manda.
  assert.equal(calificar({ ...base, municipio: 'otro', tipo: 'otro' }).calificado, false);
});

test('sin descartes y con 55 o más califica por el formulario, como siempre', () => {
  const r = calificar(base);
  assert.equal(r.origen, 'formulario');
  assert.equal(r.motivo, '');
});

test('el borde del umbral: con plaga, administrador que consulta, equipo chico y "no sé" pasa (60)', () => {
  const r = calificar({ ...base, rol: 'admin-consulta', personas: '2-5', presupuesto: 'asesoria', plan_anual: 'no' });
  assert.equal(r.puntaje, 60);
  assert.equal(r.calificado, true);
});

test('prevenir, equipo chico y presupuesto bajo no llega al umbral (53)', () => {
  const r = calificar({ ...base, situacion: 'prevenir', personas: '2-5', presupuesto: '140-300', plan_anual: 'no' });
  assert.equal(r.puntaje, 53);
  assert.equal(r.calificado, false);
  assert.equal(r.motivo, `puntaje bajo (53 de ${UMBRAL})`);
  assert.equal(r.planSugerido, 'preventivo');
  assert.equal(r.prioridad, 'normal');
});

test('"Sí" al plan anual empuja al borde: el mismo caso con plan anual pasa (63)', () => {
  const r = calificar({ ...base, situacion: 'prevenir', personas: '2-5', presupuesto: '140-300', plan_anual: 'si' });
  assert.equal(r.calificado, true);
});

test('respuestasValidas rechaza lo que falte o no esté en la lista', () => {
  assert.deepEqual(respuestasValidas(base), base);
  assert.equal(respuestasValidas({ ...base, municipio: 'Lebrija' }), null);
  const { rol: _, ...sinRol } = base;
  assert.equal(respuestasValidas(sinRol), null);
  assert.equal(respuestasValidas(null), null);
  assert.equal(respuestasValidas('x'), null);
});
