// Premios de la ruleta de EcoGel: qué se puede ganar, con qué probabilidad
// real, cuánto dura y cómo cambia el total. Sin imports de Node: lo usan el
// pop-up, el checkout y el servidor.
//
// Las probabilidades las aprobó Camilo (13-sep y 27-sep-2026). No se cambian
// sin su aprobación: los términos las publican y cada premio visible en la
// ruleta tiene que poder salir con la probabilidad declarada.
//
// El sorteo corre SOLO en el servidor (app/api/ecogel/ruleta). El navegador
// recibe el resultado y anima la ruleta hasta él.

import { totalPedido, type MetodoPago, type Unidades } from './ecogel';

export type IdPremio = 'cuatro_por_tres' | 'envio_gratis_2' | 'descuento_8000' | 'proxima_10000';

export interface Premio {
  id: IdPremio;
  /** Como aparece en la ruleta, en el correo y en el checkout. */
  titulo: string;
  /** Probabilidad en puntos porcentuales enteros. */
  probabilidad: number;
  vigenciaDias: number;
  /** La restricción, en una frase, tal como va en los términos. */
  condicion: string;
  /** Cantidad con la que aplica; `undefined` = cualquiera. */
  unidades?: Unidades;
  /** Color del segmento en la ruleta (paleta de marca). */
  color: string;
}

// Orden: de mayor a menor probabilidad, que es también el orden en la ruleta.
export const PREMIOS: readonly Premio[] = [
  {
    id: 'proxima_10000',
    titulo: '$10.000 para tu próxima compra',
    probabilidad: 40,
    vigenciaDias: 60,
    condicion: 'Aplica desde tu segundo pedido, hecho con el mismo celular.',
    color: '#174634',
  },
  {
    id: 'descuento_8000',
    titulo: '$8.000 de descuento en el combo',
    probabilidad: 30,
    vigenciaDias: 15,
    condicion: 'Aplica al llevar el combo de 3 unidades.',
    unidades: 3,
    color: '#2E7D5B',
  },
  {
    id: 'envio_gratis_2',
    titulo: 'Envío gratis al llevar 2',
    probabilidad: 20,
    vigenciaDias: 15,
    condicion: 'Aplica al llevar 2 unidades.',
    unidades: 2,
    color: '#8FB9A2',
  },
  {
    id: 'cuatro_por_tres',
    titulo: '4 por el precio de 3 en el combo',
    probabilidad: 10,
    vigenciaDias: 15,
    condicion: 'Al llevar el combo de 3 unidades te enviamos una cuarta de regalo.',
    unidades: 3,
    color: '#E1EAE2',
  },
];

export const DESCUENTO_PREMIO: Partial<Record<IdPremio, number>> = { descuento_8000: 8_000, proxima_10000: 10_000 };

export function esIdPremio(valor: unknown): valor is IdPremio {
  return PREMIOS.some((p) => p.id === valor);
}

export function premioDe(id: IdPremio): Premio {
  return PREMIOS.find((p) => p.id === id)!;
}

/** Número entero 0..99 → premio. Cada premio ocupa tantos números como su probabilidad. */
export function premioPorNumero(n: number): Premio {
  if (!Number.isInteger(n) || n < 0 || n > 99) throw new Error(`número fuera de rango: ${n}`);
  let acumulado = 0;
  for (const p of PREMIOS) {
    acumulado += p.probabilidad;
    if (n < acumulado) return p;
  }
  throw new Error('las probabilidades no suman 100');
}

/**
 * Entero uniforme 0..99 con el generador criptográfico. Se descartan los
 * valores del final del rango de 32 bits que no alcanzan un bloque completo
 * de 100: sin eso, los números bajos saldrían un poco más que los altos.
 */
function azarSeguro(): number {
  const limite = Math.floor(0x1_0000_0000 / 100) * 100;
  const buf = new Uint32Array(1);
  for (;;) {
    globalThis.crypto.getRandomValues(buf);
    if (buf[0] < limite) return buf[0] % 100;
  }
}

export function sortearPremio(azar: () => number = azarSeguro): Premio {
  return premioPorNumero(azar());
}

export function vencimientoPremio(id: IdPremio, desde = new Date()): Date {
  return new Date(desde.getTime() + premioDe(id).vigenciaDias * 86_400_000);
}

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I: se dicta por teléfono

// 256 es múltiplo de 32: un byte recortado a 5 bits da cada letra con la misma probabilidad.
function letraAlAzar(): number {
  const b = new Uint8Array(1);
  globalThis.crypto.getRandomValues(b);
  return (b[0] & 31) / 32;
}

export function nuevoCodigoPremio(azar: () => number = letraAlAzar): string {
  let c = '';
  for (let i = 0; i < 6; i++) c += ALFABETO[Math.floor(azar() * ALFABETO.length)];
  return `RE-${c}`;
}

export function esCodigoPremio(valor: unknown): valor is string {
  return typeof valor === 'string' && /^RE-[A-HJ-NP-Z2-9]{6}$/.test(valor);
}

export function aplicabilidadPremio(id: IdPremio, unidades: Unidades, yaCompro: boolean): { aplica: boolean; motivo?: string } {
  const p = premioDe(id);
  if (p.unidades && p.unidades !== unidades) {
    return { aplica: false, motivo: `Tu premio aplica al llevar ${p.unidades} unidades.` };
  }
  if (id === 'proxima_10000' && !yaCompro) {
    return { aplica: false, motivo: 'Tu bono de $10.000 aplica desde tu segundo pedido con este celular.' };
  }
  return { aplica: true };
}

/**
 * Total del pedido con el premio. Parte de `totalPedido` (precios base sin
 * tocar) y solo resta lo que el premio da. El premio se suma al descuento por
 * pago anticipado (decisión del 27-sep-2026).
 */
export function totalConPremio(unidades: Unidades, metodo: MetodoPago, premio: IdPremio | null, yaCompro: boolean) {
  const base = totalPedido(unidades, metodo);
  const aplica = premio !== null && aplicabilidadPremio(premio, unidades, yaCompro).aplica;
  const envio = aplica && premio === 'envio_gratis_2' ? 0 : base.envio;
  const descuentoPremio = aplica ? DESCUENTO_PREMIO[premio] ?? 0 : 0;
  return {
    ...base,
    envio,
    descuentoPremio,
    unidadesRegalo: aplica && premio === 'cuatro_por_tres' ? 1 : 0,
    premioAplicado: aplica,
    total: base.producto + envio - base.descuento - descuentoPremio,
  };
}

export function fechaLarga(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

/**
 * Enlace que abre el checkout con la cantidad del premio y el código ya
 * aplicado. `p` (el premio) deja mostrarlo al instante, sin esperar al Apps
 * Script; el servidor lo confirma en segundo plano y otra vez al canjear.
 */
export function enlacePremio(id: IdPremio, codigo: string, base = ''): string {
  return `${base}/ecogel/pedido?u=${premioDe(id).unidades ?? 3}&codigo=${codigo}&p=${id}`;
}

/** Correo con el código. Texto plano: lo manda el Apps Script con MailApp. */
export function correoPremio(p: { premio: IdPremio; codigo: string; vence: string; base: string }): { asunto: string; cuerpo: string } {
  const premio = premioDe(p.premio);
  return {
    asunto: `Tu premio EcoGel: ${premio.titulo}`,
    cuerpo: [
      `Ganaste ${premio.titulo}.`,
      '',
      `Tu código: ${p.codigo}`,
      `Vence el ${fechaLarga(p.vence)}.`,
      premio.condicion,
      '',
      'Úsalo aquí, ya viene aplicado:',
      enlacePremio(p.premio, p.codigo, p.base),
      '',
      'Garantía EcoGel: si en 30 días siguen, te enviamos otro kit sin costo.',
      '',
      `Términos del premio: ${p.base}/ecogel/terminos#ruleta`,
      '',
      'Recibes este correo porque giraste la ruleta en agroincol.com y autorizaste que te escribamos con promociones. Si no quieres recibir más, responde con la palabra BAJA.',
    ].join('\n'),
  };
}

/** Qué decirle a la persona cuando su código no entra. Las claves son los motivos de canjearCodigo. */
export const MENSAJE_CODIGO: Record<string, string> = {
  'no-existe': 'Ese código no existe. Revísalo o quítalo para seguir.',
  usado: 'Ese código ya se usó en otro pedido.',
  vencido: 'Ese código ya venció.',
  'primer-pedido': 'Tu bono de $10.000 aplica desde tu segundo pedido con este celular.',
  'sin-conexion': 'No pudimos validar tu código. Inténtalo de nuevo o quítalo para seguir.',
};
