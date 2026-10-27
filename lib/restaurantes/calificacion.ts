/**
 * Las preguntas del formulario de restaurantes y cómo se califica un lead.
 *
 * Es la ÚNICA fuente: el formulario pinta estas preguntas y el servidor vuelve
 * a calcular la calificación con esta misma función. El puntaje que mande el
 * navegador no se usa nunca: cualquiera puede editarlo desde la consola.
 *
 * Dos filtros, a propósito distintos:
 *
 * 1. DESCARTES. Lo que no se compensa con nada: un negocio que no es de comida,
 *    fuera del área metropolitana, de una sola persona o con presupuesto por
 *    debajo de una visita. Si fuera solo puntaje, un restaurante de otro
 *    municipio con presupuesto alto pasaría.
 * 2. PUNTAJE. Lo demás suma y pasa quien llega al UMBRAL. Es la perilla: con
 *    ~19 leads calificados por semana Meta ya aprende lento, y cada punto que
 *    sube el umbral le quita señal. Subirlo solo con datos de la hoja.
 *
 * Un descalificado NUNCA dispara el Lead: Meta no debe aprender de quien no sirve.
 */

export interface Opcion {
  valor: string;
  etiqueta: string;
  puntos: number;
  /** Si existe, esta respuesta descalifica y este es el motivo para la hoja. */
  descarta?: string;
}

export interface Pregunta {
  id: IdPregunta;
  titulo: string;
  ayuda?: string;
  opciones: readonly Opcion[];
}

export type IdPregunta =
  | 'situacion'
  | 'tipo'
  | 'municipio'
  | 'personas'
  | 'rol'
  | 'plan_anual'
  | 'presupuesto';

export type Respuestas = Record<IdPregunta, string>;

/** Puntos mínimos para calificar, sobre un máximo de 110. */
export const UMBRAL = 55;

/** Respuestas de "Qué está pasando" que indican plaga activa. */
const CON_PLAGA = ['cliente-vio', 'cucarachas', 'volvieron', 'secretaria'];

export const PREGUNTAS: readonly Pregunta[] = [
  {
    id: 'situacion',
    titulo: '¿Qué está pasando en su restaurante?',
    opciones: [
      { valor: 'cliente-vio', etiqueta: 'Un cliente vio una cucaracha o se quejó', puntos: 30 },
      { valor: 'cucarachas', etiqueta: 'Hay cucarachas en la cocina o la bodega', puntos: 30 },
      { valor: 'volvieron', etiqueta: 'Ya fumigamos y volvieron', puntos: 25 },
      { valor: 'secretaria', etiqueta: 'Viene una visita de la Secretaría de Salud', puntos: 25 },
      { valor: 'prevenir', etiqueta: 'Quiero prevenir, no tengo plaga', puntos: 10 },
    ],
  },
  {
    id: 'tipo',
    titulo: '¿Qué tipo de negocio tiene?',
    opciones: [
      { valor: 'restaurante', etiqueta: 'Restaurante', puntos: 0 },
      { valor: 'comida', etiqueta: 'Cafetería, panadería o bar', puntos: 0 },
      { valor: 'otro', etiqueta: 'Otro tipo de negocio', puntos: 0, descarta: 'tipo de negocio' },
    ],
  },
  {
    id: 'municipio',
    titulo: '¿Dónde queda?',
    opciones: [
      { valor: 'Bucaramanga', etiqueta: 'Bucaramanga', puntos: 0 },
      { valor: 'Floridablanca', etiqueta: 'Floridablanca', puntos: 0 },
      { valor: 'Girón', etiqueta: 'Girón', puntos: 0 },
      { valor: 'Piedecuesta', etiqueta: 'Piedecuesta', puntos: 0 },
      { valor: 'otro', etiqueta: 'Otro municipio', puntos: 0, descarta: 'fuera de zona' },
    ],
  },
  {
    id: 'personas',
    titulo: '¿Cuántas personas trabajan en su negocio?',
    opciones: [
      { valor: '1', etiqueta: 'Solo yo', puntos: 0, descarta: 'una sola persona' },
      { valor: '2-5', etiqueta: 'De 2 a 5', puntos: 8 },
      { valor: '6-15', etiqueta: 'De 6 a 15', puntos: 15 },
      { valor: '15+', etiqueta: 'Más de 15', puntos: 20 },
    ],
  },
  {
    id: 'rol',
    titulo: '¿Cuál es su rol?',
    opciones: [
      { valor: 'dueno', etiqueta: 'Dueño o socio', puntos: 25 },
      { valor: 'admin-decide', etiqueta: 'Administrador, y decido yo', puntos: 20 },
      { valor: 'admin-consulta', etiqueta: 'Administrador, pero decide el dueño', puntos: 10 },
      { valor: 'otro', etiqueta: 'Otro cargo', puntos: 0 },
    ],
  },
  {
    id: 'plan_anual',
    titulo: '¿Le interesaría un plan anual para mantener su restaurante protegido todo el año?',
    opciones: [
      { valor: 'si', etiqueta: 'Sí, me interesa', puntos: 10 },
      { valor: 'no', etiqueta: 'Por ahora no', puntos: 0 },
    ],
  },
  {
    id: 'presupuesto',
    titulo: '¿Cuánto tiene pensado invertir por cada servicio de fumigación?',
    ayuda: 'El valor exacto lo definimos en la inspección gratis.',
    opciones: [
      { valor: '<140', etiqueta: 'Menos de $140.000', puntos: 0, descarta: 'presupuesto' },
      { valor: '140-300', etiqueta: 'Entre $140.000 y $300.000', puntos: 10 },
      { valor: '300-600', etiqueta: 'Entre $300.000 y $600.000', puntos: 20 },
      { valor: '600+', etiqueta: 'Más de $600.000', puntos: 25 },
      { valor: 'asesoria', etiqueta: 'No sé, prefiero que me asesoren', puntos: 12 },
    ],
  },
];

export interface Calificacion {
  calificado: boolean;
  puntaje: number;
  /** Por qué no calificó. Vacío si calificó. */
  motivo: string;
  prioridad: 'alta' | 'normal';
  planSugerido: 'choque' | 'preventivo';
}

/**
 * Valida y normaliza lo que llega del navegador. Devuelve null si falta una
 * respuesta o alguna no es una opción de la lista: así nada inventado llega a
 * la hoja ni al cálculo.
 */
export function respuestasValidas(crudo: unknown): Respuestas | null {
  if (!crudo || typeof crudo !== 'object') return null;
  const salida: Partial<Respuestas> = {};
  for (const p of PREGUNTAS) {
    const valor = (crudo as Record<string, unknown>)[p.id];
    if (typeof valor !== 'string' || !p.opciones.some((o) => o.valor === valor)) return null;
    salida[p.id] = valor;
  }
  return salida as Respuestas;
}

export function opcionDe(id: IdPregunta, valor: string): Opcion | undefined {
  return PREGUNTAS.find((p) => p.id === id)?.opciones.find((o) => o.valor === valor);
}

export function calificar(respuestas: Respuestas): Calificacion {
  let puntaje = 0;
  const descartes: string[] = [];
  for (const p of PREGUNTAS) {
    const opcion = opcionDe(p.id, respuestas[p.id]);
    if (!opcion) throw new Error(`respuesta inválida en ${p.id}`);
    puntaje += opcion.puntos;
    if (opcion.descarta) descartes.push(opcion.descarta);
  }

  const conPlaga = CON_PLAGA.includes(respuestas.situacion);
  const motivo = descartes.length
    ? descartes.join(', ')
    : puntaje < UMBRAL
      ? `puntaje bajo (${puntaje} de ${UMBRAL})`
      : '';

  return {
    calificado: motivo === '',
    puntaje,
    motivo,
    prioridad: conPlaga ? 'alta' : 'normal',
    planSugerido: conPlaga ? 'choque' : 'preventivo',
  };
}
