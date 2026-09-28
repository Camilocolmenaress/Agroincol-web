'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import type { Segmento } from '@/lib/ecogel';
import { PREMIOS, enlacePremio, fechaLarga, premioDe, type IdPremio } from '@/lib/ecogel-premios';
import { guardarPremio, marcarRuletaVista, pedirTurno, puedeMostrarRuleta, soltarTurno, type PremioGuardado } from '@/lib/ecogel-popups';
import { urlParaMedir } from '@/lib/meta/modo-prueba';
import { eventoPersonalizado } from '@/lib/meta/pixel';

/**
 * Pop-up de salida con la ruleta de premios.
 *
 * Cuándo sale: solo cuando la persona intenta irse, y nunca en los primeros
 * 3 segundos (quien rebota al instante no está decidiendo nada).
 * - Escritorio: el cursor sale por arriba de la ventana (hacia las pestañas).
 * - Botón atrás del celular: tras el primer toque se agrega una entrada al
 *   historial; el primer "atrás" la consume y muestra el pop-up, el segundo
 *   deja salir. Sin el toque, Chrome descarta esa entrada y no funcionaría.
 * - La X del navegador de Instagram/Facebook cierra la ventana sin avisar:
 *   ninguna página puede detectarla.
 *
 * Frecuencia: una vez cada 7 días por visitante y nunca a quien ya tiene un
 * premio vigente (lib/ecogel-popups.ts). El premio lo sortea el servidor; aquí
 * solo se anima la ruleta hasta el resultado.
 */

const ARMADO_MS = 3000;
const GIRO_MS = 3600;
const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Segmentos del tamaño de su probabilidad real: 40 % ocupa 144°, 10 % ocupa 36°.
const SEGMENTOS = PREMIOS.reduce<{ id: IdPremio; desde: number; hasta: number }[]>((acc, p) => {
  const desde = acc.length ? acc[acc.length - 1].hasta : 0;
  return [...acc, { id: p.id, desde, hasta: desde + p.probabilidad * 3.6 }];
}, []);
const FONDO_RULETA = `conic-gradient(${PREMIOS.map((p, i) => `${p.color} ${SEGMENTOS[i].desde}deg ${SEGMENTOS[i].hasta}deg`).join(', ')})`;

/** Giro que deja el puntero (arriba, 0°) dentro del segmento del premio, lejos de los bordes. */
function anguloFinal(id: IdPremio): number {
  const s = SEGMENTOS.find((x) => x.id === id)!;
  const margen = Math.min(6, (s.hasta - s.desde) / 4);
  const punto = s.desde + margen + Math.random() * (s.hasta - s.desde - 2 * margen);
  return 360 * 6 + (360 - punto);
}

type Resultado = PremioGuardado & { repetido: boolean; usado: boolean };

export default function RuletaSalida({ segmento, onPremio }: { segmento: Segmento; onPremio?: (p: PremioGuardado) => void }) {
  const [visible, setVisible] = useState(false);
  const [fase, setFase] = useState<'invitacion' | 'girando' | 'resultado'>('invitacion');
  const [correo, setCorreo] = useState('');
  const [autoriza, setAutoriza] = useState(false);
  const [website, setWebsite] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [rotacion, setRotacion] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [copiado, setCopiado] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!puedeMostrarRuleta()) return;
    let armado = false;
    let terminado = false;
    let centinela = Boolean(window.history.state?.ecogelRuleta);

    const limpiar = () => {
      terminado = true;
      document.removeEventListener('mouseout', alSalirCursor);
      window.removeEventListener('pointerdown', alTocar);
      window.removeEventListener('keydown', alTocar);
      window.removeEventListener('popstate', alVolver);
    };
    const mostrar = (): boolean => {
      if (terminado || !armado || !pedirTurno('ruleta')) return false;
      limpiar();
      marcarRuletaVista();
      setVisible(true);
      return true;
    };
    const alSalirCursor = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) mostrar();
    };
    const alTocar = () => {
      if (!armado || centinela) return;
      centinela = true;
      window.history.pushState({ ...(window.history.state ?? {}), ecogelRuleta: true }, '');
    };
    const alVolver = (e: PopStateEvent) => {
      if (e.state?.ecogelRuleta) return;
      // Si por alguna razón no se puede mostrar, la persona quería irse: se le deja.
      if (!mostrar()) {
        limpiar();
        window.history.back();
      }
    };

    const t = window.setTimeout(() => {
      armado = true;
    }, ARMADO_MS);
    document.addEventListener('mouseout', alSalirCursor);
    window.addEventListener('pointerdown', alTocar);
    window.addEventListener('keydown', alTocar);
    window.addEventListener('popstate', alVolver);
    return () => {
      window.clearTimeout(t);
      limpiar();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    panel.current?.focus();
    const alTeclado = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
    };
    window.addEventListener('keydown', alTeclado);
    return () => window.removeEventListener('keydown', alTeclado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function cerrar() {
    setVisible(false);
    soltarTurno();
  }

  async function girar(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!CORREO_RE.test(correo.trim())) errs.correo = 'Escribe un correo válido para enviarte el código';
    if (!autoriza) errs.autoriza = 'Para enviarte el premio necesitamos tu autorización';
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    setEnviando(true);
    try {
      const res = await fetch('/api/ecogel/ruleta', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ correo: correo.trim(), autoriza, website, sourceUrl: urlParaMedir() }),
      });
      const json = (await res.json()) as { ok: boolean; premio?: IdPremio; codigo?: string; vence?: string; estado?: string; repetido?: boolean; errores?: Record<string, string> };
      if (!res.ok || !json.ok || !json.premio || !json.codigo || !json.vence) {
        setErrores(json.errores ?? { general: 'No pudimos girar la ruleta. Inténtalo de nuevo en un momento.' });
        setEnviando(false);
        return;
      }
      const p: PremioGuardado = { premio: json.premio, codigo: json.codigo, vence: json.vence };
      const usado = json.estado === 'usado';
      if (!usado) guardarPremio(p);
      eventoPersonalizado('RuletaCorreo');
      setResultado({ ...p, repetido: json.repetido === true, usado });
      const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setRotacion(anguloFinal(p.premio));
      setFase('girando');
      window.setTimeout(() => setFase('resultado'), reducido ? 0 : GIRO_MS);
    } catch {
      setErrores({ general: 'No pudimos girar la ruleta. Revisa tu conexión e inténtalo de nuevo.' });
      setEnviando(false);
    }
  }

  async function copiar(codigo: string) {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
    } catch {
      // Sin portapapeles: el código queda a la vista para copiarlo a mano.
    }
  }

  if (!visible) return null;
  const premio = resultado ? premioDe(resultado.premio) : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-brand-green-dark/60 sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && fase !== 'girando' && cerrar()}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ruleta-titulo"
        tabIndex={-1}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-4 shadow-premium focus:outline-none sm:max-w-xl sm:rounded-3xl sm:p-7"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-brand-gray-light sm:hidden" aria-hidden />
        <button type="button" onClick={cerrar} aria-label="Cerrar" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand-black">
          <X size={18} aria-hidden />
        </button>

        <h2 id="ruleta-titulo" className="pr-10 font-heading text-[1.35rem] font-bold leading-tight text-brand-green">
          {fase === 'resultado' && premio ? `Ganaste: ${premio.titulo}` : 'Antes de irte, gira y gana un premio para tu EcoGel'}
        </h2>

        <div className="mt-4 grid items-center gap-4 sm:grid-cols-[11rem_1fr]">
          <div className="relative mx-auto h-36 w-36 sm:h-44 sm:w-44">
            <span aria-hidden className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 border-x-[9px] border-t-[14px] border-x-transparent border-t-brand-green-dark" />
            <div
              aria-hidden
              className="h-full w-full rounded-full border-4 border-white shadow-card ring-1 ring-brand-gray-light motion-reduce:!transition-none"
              style={{ background: FONDO_RULETA, transform: `rotate(${rotacion}deg)`, transition: `transform ${GIRO_MS}ms cubic-bezier(0.12, 0.8, 0.18, 1)` }}
            />
            <span aria-hidden className="absolute inset-[38%] rounded-full bg-white shadow-soft" />
          </div>
          <ul className="space-y-1.5 text-body-sm">
            {PREMIOS.map((p) => (
              <li key={p.id} className={`flex items-center gap-2 ${resultado && fase === 'resultado' && resultado.premio !== p.id ? 'opacity-40' : ''}`}>
                <span aria-hidden className="h-3 w-3 flex-none rounded-[4px] ring-1 ring-brand-black/10" style={{ background: p.color }} />
                <span className="flex-1">{p.titulo}</span>
                <span className="text-brand-black/55">{p.probabilidad} %</span>
              </li>
            ))}
          </ul>
        </div>

        {fase === 'invitacion' && (
          <form onSubmit={girar} noValidate className="mt-5 space-y-3">
            <div>
              <label htmlFor="ruleta-correo" className="block text-body-sm font-medium text-brand-black">Tu correo (opcional)</label>
              <input
                id="ruleta-correo"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                aria-describedby="ruleta-correo-ayuda"
                aria-invalid={errores.correo ? true : undefined}
                className="mt-1 w-full rounded-xl border border-brand-gray-light px-4 py-3 text-body focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25"
              />
              {errores.correo && <p className="mt-1 text-body-sm text-brand-orange-dark">{errores.correo}</p>}
              <p id="ruleta-correo-ayuda" className="mt-1 text-body-sm text-brand-black/60">Te enviamos el código y promociones de EcoGel a este correo. Un giro por correo.</p>
            </div>
            <label className="flex items-start gap-2.5 text-body-sm text-brand-black/75">
              <input type="checkbox" checked={autoriza} onChange={(e) => setAutoriza(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-gray-light text-brand-green" />
              <span>
                Autorizo el tratamiento de mis datos para recibir el premio y promociones, según la{' '}
                <a href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer" className="underline">política de privacidad</a>.
              </span>
            </label>
            {errores.autoriza && <p className="text-body-sm text-brand-orange-dark">{errores.autoriza}</p>}
            {errores.general && <p role="alert" className="rounded-lg bg-brand-orange/10 px-3 py-2 text-body-sm text-brand-orange-dark">{errores.general}</p>}
            <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
            <button type="submit" disabled={enviando} className="w-full rounded-full bg-brand-orange px-6 py-3.5 font-heading text-body font-bold text-white shadow-brand disabled:opacity-60">
              {enviando ? 'Girando…' : 'Girar la ruleta'}
            </button>
            <button type="button" onClick={cerrar} className="w-full py-1 text-center text-body-sm font-semibold text-brand-green">
              {onPremio ? 'Seguir con mi pedido' : 'Seguir viendo'}
            </button>
          </form>
        )}

        {fase === 'girando' && <p className="mt-5 text-center text-body-sm text-brand-black/60" aria-live="polite">Girando…</p>}

        {fase === 'resultado' && resultado && premio && (
          <div className="mt-5 space-y-3" aria-live="polite">
            {resultado.usado ? (
              <p className="rounded-xl bg-brand-light p-4 text-body-sm">Este correo ya había girado y su premio ya se usó en un pedido. La ruleta es una vez por correo.</p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-brand-mint px-4 py-3">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-green/70">Tu código</p>
                    <p className="select-all font-heading text-xl font-bold tracking-wider text-brand-green">{resultado.codigo}</p>
                  </div>
                  <button type="button" onClick={() => copiar(resultado.codigo)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-body-sm font-semibold text-brand-green shadow-soft">
                    {copiado ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />} {copiado ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <p className="text-body-sm text-brand-black/70">
                  {premio.condicion} Vence el {fechaLarga(resultado.vence)}.{' '}
                  {resultado.repetido ? 'Este correo ya había girado: este es su premio.' : `También te lo enviamos a ${correo.trim()}.`}
                </p>
                {onPremio ? (
                  <button
                    type="button"
                    onClick={() => {
                      onPremio(resultado);
                      cerrar();
                    }}
                    className="w-full rounded-full bg-brand-orange px-6 py-3.5 font-heading text-body font-bold text-white shadow-brand"
                  >
                    {resultado.premio === 'proxima_10000' ? 'Entendido, seguir con mi pedido' : 'Aplicar a mi pedido'}
                  </button>
                ) : (
                  <a href={`${enlacePremio(resultado.premio, resultado.codigo)}&de=${segmento}`} className="block w-full rounded-full bg-brand-orange px-6 py-3.5 text-center font-heading text-body font-bold text-white shadow-brand">
                    Usar mi premio
                  </a>
                )}
              </>
            )}
            <button type="button" onClick={cerrar} className="w-full py-1 text-center text-body-sm font-semibold text-brand-green">
              Cerrar
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-[12px] text-brand-black/55">
          Probabilidades reales. <a href="/ecogel/terminos#ruleta" target="_blank" rel="noopener noreferrer" className="underline">Términos del premio</a>
        </p>
      </div>
    </div>
  );
}
