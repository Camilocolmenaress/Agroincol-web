'use client';

// Memoria del navegador para la ruleta y la calculadora. Solo comodidades de
// este visitante: si el almacenamiento está bloqueado, los pop-ups
// simplemente no se muestran y el premio no se recuerda (el código igual va
// por correo). Sin fingerprinting: nada identifica a la persona.

import { esCodigoPremio, esIdPremio, type IdPremio } from './ecogel-premios';

const PREMIO = 'ecogel_premio';
const RULETA_VISTA = 'ecogel_ruleta_vista';
const CALCULADORA_VISTA = 'ecogel_calculadora_vista';
const SIETE_DIAS = 7 * 86_400_000;

export interface PremioGuardado {
  codigo: string;
  premio: IdPremio;
  vence: string;
}

function local(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function leerPremioGuardado(): PremioGuardado | null {
  try {
    const p = JSON.parse(local()?.getItem(PREMIO) ?? 'null') as PremioGuardado | null;
    if (!p || !esCodigoPremio(p.codigo) || !esIdPremio(p.premio)) return null;
    if (new Date(p.vence).getTime() < Date.now()) return null;
    return p;
  } catch {
    return null;
  }
}

export function guardarPremio(p: PremioGuardado): void {
  try {
    local()?.setItem(PREMIO, JSON.stringify(p));
  } catch {
    // Sin almacenamiento: el código igual llegó por correo.
  }
}

export function olvidarPremio(): void {
  try {
    local()?.removeItem(PREMIO);
  } catch {
    // idem
  }
}

/** Una vez cada 7 días por visitante, y nunca a quien ya tiene un premio vigente. */
export function puedeMostrarRuleta(): boolean {
  const l = local();
  if (!l) return false;
  try {
    if (leerPremioGuardado()) return false;
    const vista = Number(l.getItem(RULETA_VISTA) ?? 0);
    return Date.now() - vista > SIETE_DIAS;
  } catch {
    return false;
  }
}

export function marcarRuletaVista(): void {
  try {
    local()?.setItem(RULETA_VISTA, String(Date.now()));
  } catch {
    // idem
  }
}

/** La calculadora: una vez por sesión. */
export function puedeMostrarCalculadora(): boolean {
  try {
    return window.sessionStorage.getItem(CALCULADORA_VISTA) !== '1';
  } catch {
    return false;
  }
}

export function marcarCalculadoraVista(): void {
  try {
    window.sessionStorage.setItem(CALCULADORA_VISTA, '1');
  } catch {
    // idem
  }
}

// Un pop-up a la vez: si uno está abierto (o ya salió en esta página), el otro espera o no sale.
let abierto: 'ruleta' | 'calculadora' | null = null;
let ruletaMostradaEnPagina = false;

export function pedirTurno(quien: 'ruleta' | 'calculadora'): boolean {
  if (abierto) return false;
  if (quien === 'calculadora' && ruletaMostradaEnPagina) return false;
  abierto = quien;
  if (quien === 'ruleta') ruletaMostradaEnPagina = true;
  return true;
}

export function soltarTurno(): void {
  abierto = null;
}
