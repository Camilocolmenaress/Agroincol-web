/**
 * Horario en que el formulario de restaurantes recibe solicitudes.
 *
 * La promesa de la página es "lo contactamos en 5 minutos". Solo se puede
 * cumplir si hay alguien atendiendo, así que el formulario existe únicamente
 * en el horario del equipo: lunes a viernes, 8:00-12:00 y 14:00-18:00 en
 * Bogotá, sin festivos. Fuera de ahí la página muestra cuándo vuelve a abrir.
 *
 * Lo decide el SERVIDOR (la página se arma en cada visita y la API vuelve a
 * comprobarlo al recibir). El reloj del celular de la persona no cuenta.
 *
 * Este módulo no depende del navegador ni del servidor y no lee la zona horaria
 * de la máquina: Vercel corre en UTC y una prueba local en otra zona tiene que
 * dar el mismo resultado.
 */

/** Bogotá es UTC-5 todo el año: Colombia no tiene horario de verano. */
const DESFASE_BOGOTA_MS = 5 * 60 * 60 * 1000;

/** Bloques de atención, en minutos desde la medianoche de Bogotá. */
export const BLOQUES = [
  { desde: 8 * 60, hasta: 12 * 60 },
  { desde: 14 * 60, hasta: 18 * 60 },
] as const;

/**
 * La página deja de recibir 5 minutos antes de cada cierre (11:55 y 17:55):
 * un lead que entra a las 11:59 no se puede llamar "en 5 minutos".
 *
 * La API usa margen 0: quien abrió el formulario a las 11:54 y lo envía a las
 * 11:57 no pierde lo que ya llenó.
 */
export const MARGEN_CIERRE_MIN = 5;

/**
 * Días que el equipo no atiende aunque no sean festivo (p. ej. '2026-12-24').
 * Los festivos de ley NO van aquí: se calculan solos.
 */
export const DIAS_SIN_ATENCION: readonly string[] = [];

interface FechaLocal {
  anio: number;
  mes: number; // 1-12
  dia: number;
  diaSemana: number; // 0 = domingo
  minutos: number;
}

function enBogota(fecha: Date): FechaLocal {
  const d = new Date(fecha.getTime() - DESFASE_BOGOTA_MS);
  return {
    anio: d.getUTCFullYear(),
    mes: d.getUTCMonth() + 1,
    dia: d.getUTCDate(),
    diaSemana: d.getUTCDay(),
    minutos: d.getUTCHours() * 60 + d.getUTCMinutes(),
  };
}

/** El instante real de una hora local de Bogotá. */
function instante(anio: number, mes: number, dia: number, minutos = 0): Date {
  return new Date(Date.UTC(anio, mes - 1, dia, 0, minutos) + DESFASE_BOGOTA_MS);
}

function clave(anio: number, mes: number, dia: number): string {
  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

/** Domingo de Pascua (algoritmo gregoriano anónimo, Meeus/Jones/Butcher). */
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
  return new Date(Date.UTC(anio, mes - 1, dia));
}

function sumarDias(fecha: Date, dias: number): Date {
  return new Date(fecha.getTime() + dias * 86_400_000);
}

/** Ley Emiliani (Ley 51 de 1983): el festivo se corre al lunes siguiente. */
function alLunes(fecha: Date): Date {
  const dia = fecha.getUTCDay();
  return dia === 1 ? fecha : sumarDias(fecha, (8 - dia) % 7);
}

const cacheFestivos = new Map<number, Set<string>>();

/**
 * Los 18 festivos de Colombia de un año, como 'AAAA-MM-DD'.
 *
 * Se calculan en vez de copiarse de una lista: así no hay que actualizar nada
 * cada enero, y un año sin lista no deja el formulario abierto un festivo.
 */
export function festivosDe(anio: number): Set<string> {
  const guardado = cacheFestivos.get(anio);
  if (guardado) return guardado;

  const fijo = (mes: number, dia: number) => new Date(Date.UTC(anio, mes - 1, dia));
  const p = pascua(anio);

  const fechas = [
    // Fijos: no se mueven.
    fijo(1, 1), // Año Nuevo
    fijo(5, 1), // Día del Trabajo
    fijo(7, 20), // Independencia
    fijo(8, 7), // Batalla de Boyacá
    fijo(12, 8), // Inmaculada Concepción
    fijo(12, 25), // Navidad
    sumarDias(p, -3), // Jueves Santo
    sumarDias(p, -2), // Viernes Santo
    // Se corren al lunes.
    alLunes(fijo(1, 6)), // Reyes Magos
    alLunes(fijo(3, 19)), // San José
    alLunes(fijo(6, 29)), // San Pedro y San Pablo
    alLunes(fijo(8, 15)), // Asunción
    alLunes(fijo(10, 12)), // Día de la Raza
    alLunes(fijo(11, 1)), // Todos los Santos
    alLunes(fijo(11, 11)), // Independencia de Cartagena
    // Movibles por Pascua, corridos al lunes.
    alLunes(sumarDias(p, 39)), // Ascensión
    alLunes(sumarDias(p, 60)), // Corpus Christi
    alLunes(sumarDias(p, 68)), // Sagrado Corazón
  ];

  const conjunto = new Set(
    fechas.map((f) => clave(f.getUTCFullYear(), f.getUTCMonth() + 1, f.getUTCDate()))
  );
  cacheFestivos.set(anio, conjunto);
  return conjunto;
}

function esDiaDeAtencion(anio: number, mes: number, dia: number, diaSemana: number): boolean {
  if (diaSemana === 0 || diaSemana === 6) return false;
  const k = clave(anio, mes, dia);
  return !festivosDe(anio).has(k) && !DIAS_SIN_ATENCION.includes(k);
}

/**
 * Solo para probar en local fuera de horario. En producción no existe: Vercel
 * compila con NODE_ENV=production y la condición queda siempre en falso.
 */
const SIN_HORARIO_LOCAL = process.env.NODE_ENV !== 'production' && process.env.RESTAURANTES_SIN_HORARIO === '1';

/** ¿Se reciben solicitudes en este instante? */
export function estaAbierto(fecha: Date = new Date(), margenMin: number = MARGEN_CIERRE_MIN): boolean {
  if (SIN_HORARIO_LOCAL) return true;
  const l = enBogota(fecha);
  if (!esDiaDeAtencion(l.anio, l.mes, l.dia, l.diaSemana)) return false;
  return BLOQUES.some((b) => l.minutos >= b.desde && l.minutos < b.hasta - margenMin);
}

/** Próximo instante en que el formulario abre. Si está abierto, el actual. */
export function proximaApertura(fecha: Date = new Date()): Date {
  if (estaAbierto(fecha)) return fecha;
  const hoy = enBogota(fecha);
  // 15 días cubren de sobra el peor caso (Semana Santa cae en jueves y viernes).
  for (let i = 0; i < 15; i++) {
    const d = enBogota(sumarDias(instante(hoy.anio, hoy.mes, hoy.dia, 12 * 60), i));
    if (!esDiaDeAtencion(d.anio, d.mes, d.dia, d.diaSemana)) continue;
    for (const b of BLOQUES) {
      if (i > 0 || hoy.minutos < b.desde) return instante(d.anio, d.mes, d.dia, b.desde);
    }
  }
  throw new Error('sin apertura en 15 días: revisa DIAS_SIN_ATENCION');
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function hora(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = String(minutos % 60).padStart(2, '0');
  if (h === 12 && m === '00') return '12:00 m.';
  return `${h > 12 ? h - 12 : h}:${m} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

/** "hoy a las 2:00 p. m.", "mañana a las 8:00 a. m.", "el lunes 2 de noviembre a las 8:00 a. m." */
export function textoProximaApertura(fecha: Date = new Date()): string {
  const abre = enBogota(proximaApertura(fecha));
  const hoy = enBogota(fecha);
  const manana = enBogota(sumarDias(instante(hoy.anio, hoy.mes, hoy.dia, 12 * 60), 1));
  const a = `a las ${hora(abre.minutos)}`;
  if (abre.dia === hoy.dia && abre.mes === hoy.mes) return `hoy ${a}`;
  if (abre.dia === manana.dia && abre.mes === manana.mes) return `mañana ${a}`;
  return `el ${DIAS[abre.diaSemana]} ${abre.dia} de ${MESES[abre.mes - 1]} ${a}`;
}
