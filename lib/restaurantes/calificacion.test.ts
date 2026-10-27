import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PREGUNTAS, UMBRAL, calificar, respuestasValidas, type Respuestas } from './calificacion';

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

test('cada descarte descalifica aunque el resto sume el máximo', () => {
  const casos: [Partial<Respuestas>, string][] = [
    [{ tipo: 'otro' }, 'tipo de negocio'],
    [{ municipio: 'otro' }, 'fuera de zona'],
    [{ personas: '1' }, 'una sola persona'],
    [{ presupuesto: '<140' }, 'presupuesto'],
  ];
  for (const [cambio, motivo] of casos) {
    const r = calificar({ ...base, ...cambio, presupuesto: cambio.presupuesto ?? '600+', personas: cambio.personas ?? '15+' });
    assert.equal(r.calificado, false, motivo);
    assert.equal(r.motivo, motivo);
  }
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
