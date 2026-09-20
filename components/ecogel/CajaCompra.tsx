'use client';

import { Bug, FileCheck, ShieldCheck, Store, Timer, Utensils, Wind, Star } from 'lucide-react';
import { AUTORIDAD, ENVIO_BASE, GARANTIA, money, tierDe, totalPedido, type EcogelConfig } from '@/lib/ecogel';
import { resumenResenas } from '@/lib/ecogel-resenas';
import { IMIDACLOPRID } from '@/lib/ecogel-evidencia';
import SelectorTier from './SelectorTier';
import { urlPedido, useTier } from './TierContext';

// Pantalla 2 de Lummia, en su orden exacto: H1 → precio anclado → estrellas →
// selector → 4 beneficios → qué es y cómo funciona → reencuadre → CTA con precio →
// logos de pago → chips → garantía.

const ICONOS = { ShieldCheck, Wind, Timer, Bug, Store, Utensils, FileCheck } as const;

// Logos reales de los métodos aceptados (mismos archivos que el checkout,
// public/ecogel/pagos/). Contraentrega no tiene logo: es efectivo, no una marca.
const LOGOS_PAGO = ['visa.svg', 'mastercard.svg', 'amex.svg', 'diners.svg', 'pse.svg', 'nequi.svg', 'bancolombia.svg', 'breb.svg'];

export default function CajaCompra({ config }: { config: EcogelConfig }) {
  const { unidades } = useTier();
  const tier = tierDe(unidades);
  const cod = totalPedido(unidades, 'contraentrega');
  const ahorroEnvio = ENVIO_BASE - tier.envio;
  const resenas = resumenResenas();

  return (
    <section className="container-custom pt-6">
      <h1 className="font-heading text-[1.9rem] font-bold leading-[1.1] tracking-[-0.01em] text-brand-green text-balance sm:text-4xl">
        {config.titulo}
      </h1>
      <p className="text-brand-black/70 mt-2 text-body">{config.subtitulo}</p>

      {/* Precio anclado en pesos, como Lummia ("$100.000 OFF"), no en porcentaje. */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-heading text-3xl font-bold text-brand-orange">{money(tier.producto)}</span>
        {tier.envio > 0 ? (
          <span className="text-body-sm text-brand-black/60">+ {money(tier.envio)} de envío</span>
        ) : (
          <span className="text-body-sm text-brand-black/60">envío gratis</span>
        )}
        {ahorroEnvio > 0 && (
          <span className="rounded-full border border-dashed border-brand-orange bg-brand-orange/10 px-2.5 py-0.5 text-body-sm font-semibold text-brand-orange-dark">
            Ahorras {money(ahorroEnvio)} de envío
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2 text-body-sm">
        <span className="flex text-brand-amber" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={16} fill={i <= Math.round(resenas.promedio) ? 'currentColor' : 'none'} />
          ))}
        </span>
        <a href="#resenas" className="text-brand-black/70 underline underline-offset-2">
          {resenas.promedio} · {resenas.total} reseñas
        </a>
        {resenas.esEjemplo && (
          <span className="rounded bg-brand-orange/15 px-1.5 py-0.5 text-[11px] font-semibold text-brand-orange-dark">
            Calificación de ejemplo
          </span>
        )}
      </div>

      <div className="mt-5">
        <SelectorTier />
      </div>

      <ul className="mt-5 space-y-2.5">
        {config.beneficios.map((b) => {
          const Icono = ICONOS[b.icono];
          return (
            <li key={b.texto} className="flex items-center gap-3 text-body text-brand-black">
              <Icono size={22} className="flex-none text-brand-green" aria-hidden />
              {b.texto}
            </li>
          );
        })}
      </ul>
      {/* Cifra sembrada (iteración 3 §4): el dato con su fuente, en una línea. */}
      <p className="mt-2.5 text-body-sm text-brand-black/60">
        −80 % de cucarachas en 4 semanas · Journal of Economic Entomology, 2000 ·{' '}
        <a href={IMIDACLOPRID.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          ver estudio
        </a>
      </p>

      {/* Qué es y cómo funciona: 3 párrafos, el tercero en cursiva como el aviso de Lummia. */}
      <div className="mt-5 space-y-3 border-t border-brand-gray-light pt-5 text-body-sm text-brand-black/80">
        <p>{config.queEs[0]}</p>
        <p>{config.queEs[1]}</p>
        <p className="italic">{config.queEs[2]}</p>
      </div>

      <p className="mt-4 rounded-lg bg-brand-amber/20 px-3 py-2 text-body-sm font-semibold italic text-brand-black">
        {config.reencuadre}
      </p>

      <a
        href={urlPedido(unidades, config.segmento)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-4 font-heading text-body font-bold text-white shadow-brand"
      >
        Comprar ahora — {money(cod.total)}
      </a>
      <p className="mt-1.5 text-center text-body-sm text-brand-black/60">
        Pagando en línea: {money(totalPedido(unidades, 'online').total)}
      </p>

      <ul className="mt-3 flex flex-wrap items-center justify-center gap-2" aria-label="Métodos de pago">
        {LOGOS_PAGO.map((archivo) => (
          <li key={archivo} className="flex h-11 items-center justify-center rounded-lg border border-brand-gray-light bg-white px-3.5">
            <img src={`/ecogel/pagos/${archivo}`} alt="" className="h-6 w-auto max-w-[68px] object-contain" />
          </li>
        ))}
        <li className="flex h-11 items-center justify-center rounded-lg border border-brand-gray-light px-3.5 text-[11px] font-bold uppercase tracking-wide text-brand-black/70">
          Contraentrega
        </li>
      </ul>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-brand-light p-3 text-center text-body-sm font-semibold text-brand-green">
        <span>Garantía {GARANTIA.dias} días</span>
        <span>Envío 2-4 días</span>
        <span>{AUTORIDAD.anios} años en plagas</span>
      </div>
    </section>
  );
}
