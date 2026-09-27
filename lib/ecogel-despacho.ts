// Cuándo sale un pedido de EcoGel. Única fuente de la promesa de envío: la
// leen la página de producto, el checkout y /gracias. Sin imports de Node.
//
// Regla del equipo de despachos (27-sep-2026):
// - Lunes a viernes: lo que entra antes de las 6 p.m. sale ese día.
// - Sábado: lo que entra antes del mediodía sale ese día.
// - Lo demás (noches, sábado en la tarde, domingo, festivos) sale el
//   siguiente día de despacho: lunes a sábado que no sea festivo.

export const REGLA_DESPACHO =
  'Pedidos de lunes a viernes antes de las 6 p.m. y sábados antes del mediodía salen el mismo día.';
export const TIEMPO_ENTREGA = 'Llega en 1-2 días hábiles a ciudades principales y en 2-4 al resto del país.';
/** Versión corta para espacios reducidos (chips). */
export const ENTREGA_CORTA = 'Entrega 1-4 días';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIA_MS = 86_400_000;
/** Colombia no tiene horario de verano: UTC-5 todo el año. */
const OFFSET_BOGOTA_MS = -5 * 3_600_000;

// Todas las fechas internas son medianoche UTC del día calendario de Bogotá,
// así getUTC* devuelve el día de Colombia sin depender de la zona del servidor.
const ymd = (d: Date) => d.toISOString().slice(0, 10);
const utc = (anio: number, mes: number, dia: number) => new Date(Date.UTC(anio, mes, dia));
const masDias = (d: Date, n: number) => new Date(d.getTime() + n * DIA_MS);
const lunesSiguiente = (d: Date) => masDias(d, (8 - d.getUTCDay()) % 7);

/** Domingo de Pascua (algoritmo anónimo gregoriano, Meeus). */
function pascua(anio: number): Date {
  const a = anio % 19;
  const b = Math.floor(anio / 100);
  const c = anio % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return utc(anio, mes - 1, dia);
}

/** Festivos de Colombia en formato YYYY-MM-DD (Ley 51 de 1983). */
export function festivosColombia(anio: number): Set<string> {
  const p = pascua(anio);
  const fijos = [utc(anio, 0, 1), utc(anio, 4, 1), utc(anio, 6, 20), utc(anio, 7, 7), utc(anio, 11, 8), utc(anio, 11, 25)];
  // Se trasladan al lunes siguiente si no caen en lunes.
  const trasladables = [
    utc(anio, 0, 6), utc(anio, 2, 19), utc(anio, 5, 29), utc(anio, 7, 15), utc(anio, 9, 12), utc(anio, 10, 1), utc(anio, 10, 11),
  ].map(lunesSiguiente);
  const deSemanaSanta = [
    masDias(p, -3), // Jueves Santo
    masDias(p, -2), // Viernes Santo
    masDias(p, 43), // Ascensión (trasladada a lunes)
    masDias(p, 64), // Corpus Christi (trasladado a lunes)
    masDias(p, 71), // Sagrado Corazón (trasladado a lunes)
  ];
  return new Set([...fijos, ...trasladables, ...deSemanaSanta].map(ymd));
}

function esDiaDeDespacho(d: Date): boolean {
  return d.getUTCDay() !== 0 && !festivosColombia(d.getUTCFullYear()).has(ymd(d));
}

export interface Despacho {
  hoy: boolean;
  /** Día de Colombia en que sale, YYYY-MM-DD. */
  fecha: string;
  /** "hoy", "mañana" o "el lunes 5 de octubre". */
  texto: string;
}

export function diaDeDespacho(ahora: Date): Despacho {
  const local = new Date(ahora.getTime() + OFFSET_BOGOTA_MS);
  const hora = local.getUTCHours();
  const hoy = utc(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const corte = hoy.getUTCDay() === 6 ? 12 : 18;

  if (esDiaDeDespacho(hoy) && hora < corte) return { hoy: true, fecha: ymd(hoy), texto: 'hoy' };

  let dia = masDias(hoy, 1);
  while (!esDiaDeDespacho(dia)) dia = masDias(dia, 1);
  const texto =
    dia.getTime() - hoy.getTime() === DIA_MS
      ? 'mañana'
      : `el ${DIAS[dia.getUTCDay()]} ${dia.getUTCDate()} de ${MESES[dia.getUTCMonth()]}`;
  return { hoy: false, fecha: ymd(dia), texto };
}
