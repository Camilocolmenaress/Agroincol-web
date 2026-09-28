'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { money, tierDe, type Segmento } from '@/lib/ecogel';
import { CANTIDADES, ESPACIOS, recomendarUnidades, type Cantidad, type Espacio } from '@/lib/ecogel-calculadora';
import { marcarCalculadoraVista, pedirTurno, puedeMostrarCalculadora, soltarTurno } from '@/lib/ecogel-popups';
import { urlPedido, useTier } from './TierContext';

/**
 * "¿Cuántas jeringas necesitas?": aparece cuando la persona lleva 10 s en la
 * página del producto viéndola (pestaña visible y ya bajó a ver el contenido).
 * Dos preguntas y una recomendación con la regla de la ficha. Sin descuento ni
 * datos personales: su trabajo es resolver la duda que frena la compra.
 * Una vez por sesión, y nunca si la ruleta ya salió en esta página.
 */

const SEGUNDOS = 10;

export default function CalculadoraJeringas({ segmento }: { segmento: Segmento }) {
  const { setUnidades } = useTier();
  const [visible, setVisible] = useState(false);
  const [espacio, setEspacio] = useState<Espacio | null>(null);
  const [cantidad, setCantidad] = useState<Cantidad | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!puedeMostrarCalculadora()) return;
    let segundos = 0;
    let vioContenido = false;
    const alBajar = () => {
      if (window.scrollY > 300) vioContenido = true;
    };
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      segundos++;
      if (segundos >= SEGUNDOS && vioContenido && pedirTurno('calculadora')) {
        window.clearInterval(id);
        window.removeEventListener('scroll', alBajar);
        marcarCalculadoraVista();
        setVisible(true);
      }
    }, 1000);
    window.addEventListener('scroll', alBajar, { passive: true });
    return () => {
      window.clearInterval(id);
      window.removeEventListener('scroll', alBajar);
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
  }, [visible]);

  function cerrar() {
    setVisible(false);
    soltarTurno();
  }

  if (!visible) return null;
  const rec = espacio && cantidad ? recomendarUnidades(espacio, cantidad) : null;
  const tier = rec ? tierDe(rec.unidades) : null;

  const opciones = <T extends string>(nombre: string, lista: { id: T; texto: string }[], valor: T | null, cambiar: (v: T) => void) => (
    <div role="radiogroup" aria-label={nombre} className="mt-2 flex flex-wrap gap-2">
      {lista.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={valor === o.id}
          onClick={() => cambiar(o.id)}
          className={`rounded-full border-2 px-3.5 py-2 text-body-sm font-semibold transition-colors ${valor === o.id ? 'border-brand-green bg-brand-green text-white' : 'border-brand-gray-light text-brand-black hover:border-brand-green/50'}`}
        >
          {o.texto}
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-brand-green-dark/50 sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && cerrar()}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calc-titulo"
        tabIndex={-1}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-4 shadow-premium focus:outline-none sm:max-w-md sm:rounded-3xl sm:p-7"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-brand-gray-light sm:hidden" aria-hidden />
        <button type="button" onClick={cerrar} aria-label="Cerrar" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand-black">
          <X size={18} aria-hidden />
        </button>
        <h2 id="calc-titulo" className="pr-10 font-heading text-[1.35rem] font-bold leading-tight text-brand-green">¿Cuántas jeringas necesitas?</h2>
        <p className="mt-1 text-body-sm text-brand-black/60">Dos preguntas y te decimos.</p>

        <p className="mt-5 text-body-sm font-semibold text-brand-black">¿Dónde las ves?</p>
        {opciones('¿Dónde las ves?', ESPACIOS, espacio, setEspacio)}
        <p className="mt-4 text-body-sm font-semibold text-brand-black">¿Cuántas ves?</p>
        {opciones('¿Cuántas ves?', CANTIDADES, cantidad, setCantidad)}

        {rec && tier && (
          <div className="mt-5 rounded-2xl bg-brand-mint p-4" aria-live="polite">
            <p className="font-heading text-lg font-bold text-brand-green">
              Te recomendamos {rec.unidades} {rec.unidades === 1 ? 'unidad' : 'unidades'}
            </p>
            <p className="mt-1 text-body-sm text-brand-black/75">{rec.porque}</p>
            <p className="mt-2 text-body-sm font-semibold text-brand-black">
              {money(tier.producto)} · envío {tier.envio === 0 ? 'gratis' : money(tier.envio)}
              {rec.unidades === 3 && ' · guía de regalo'}
            </p>
            <a
              href={urlPedido(rec.unidades, segmento)}
              onClick={() => setUnidades(rec.unidades)}
              className="mt-3 block w-full rounded-full bg-brand-orange px-6 py-3.5 text-center font-heading text-body font-bold text-white shadow-brand"
            >
              Ver mi pedido · {money(tier.producto + tier.envio)}
            </a>
          </div>
        )}
        <button type="button" onClick={cerrar} className="mt-3 w-full py-1 text-center text-body-sm font-semibold text-brand-green">
          Seguir viendo
        </button>
      </div>
    </div>
  );
}
