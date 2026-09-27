import type { Despacho } from '@/lib/ecogel-despacho';
import { TIEMPO_ENTREGA } from '@/lib/ecogel-despacho';
import CelularCliente from './CelularCliente';
import { IconoLlamada } from './Iconos';

export type Tono = 'ok' | 'espera' | 'error';

// Sello del estado: el círculo y el símbolo se dibujan al cargar y una onda
// sale una vez. Solo el sello se anima: el h1 queda quieto para no retrasar el
// LCP de la página.
function Sello({ tono }: { tono: Tono }) {
  const color = tono === 'error' ? 'text-brand-orange' : 'text-brand-green';
  return (
    <div className={`gr-pop relative mx-auto h-16 w-16 ${color}`}>
      <span className="gr-anillo absolute inset-0 rounded-full bg-current" aria-hidden />
      <svg viewBox="0 0 80 80" className="relative h-full w-full" aria-hidden>
        <circle cx="40" cy="40" r="38" fill="currentColor" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="white" strokeOpacity={0.25} strokeWidth={2} pathLength={1} className="gr-trazo" />
        {tono === 'ok' && (
          <path d="m26 41 9.5 9.5L55 31" fill="none" stroke="white" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="gr-trazo gr-trazo-2" />
        )}
        {tono === 'espera' && (
          <path d="M40 24v17l10 6" fill="none" stroke="white" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="gr-trazo gr-trazo-2" />
        )}
        {tono === 'error' && (
          <path d="M29 29l22 22M51 29 29 51" fill="none" stroke="white" strokeWidth={5.5} strokeLinecap="round" pathLength={1} className="gr-trazo gr-trazo-2" />
        )}
      </svg>
    </div>
  );
}

export default function Bienvenida({
  tono,
  titulo,
  bajada,
  pedido,
  despacho,
  avisoContacto,
}: {
  tono: Tono;
  titulo: string;
  bajada: string;
  pedido: string;
  /** Solo cuando el pedido ya puede salir (contraentrega o pagado). */
  despacho?: Despacho;
  /** Contraentrega: la confirmación por WhatsApp o llamada decide si sale. */
  avisoContacto: boolean;
}) {
  return (
    <section className="bg-gradient-to-b from-brand-mint to-white pb-8 pt-5">
      <div className="container-custom max-w-xl text-center">
        <Sello tono={tono} />
        {pedido && (
          <p className="mt-4 font-heading text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Pedido {pedido}</p>
        )}
        <h1 className="mt-2 font-heading text-[2rem] font-bold leading-[1.1] text-brand-green text-balance md:text-h2">{titulo}</h1>
        <p className="mx-auto mt-2 max-w-md text-body text-brand-black/70 text-pretty">{bajada}</p>

        {avisoContacto && (
          <div role="note" className="animate-rise anim-d1 mt-5 flex gap-3.5 rounded-2xl bg-white p-4 text-left shadow-soft ring-1 ring-brand-orange/25">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
              <IconoLlamada className="h-6 w-6" />
            </span>
            <div>
              <p className="font-heading text-body font-bold leading-snug text-brand-green">Te vamos a contactar en minutos</p>
              <p className="mt-1 text-body-sm leading-snug text-brand-black/75">
                Te escribimos por WhatsApp o te llamamos al <CelularCliente pedidoId={pedido} /> para confirmar tu pedido. Contesta
                para que podamos despacharlo.
              </p>
            </div>
          </div>
        )}
        {despacho && (
          <div className="animate-rise anim-d2 mt-5 inline-flex flex-col items-center gap-1">
            <p className="inline-flex items-center gap-2.5 rounded-full bg-brand-green px-4 py-2 font-heading text-body-sm font-bold text-white shadow-soft">
              <span className="gr-latido h-2 w-2 rounded-full bg-[#7CE0A8]" aria-hidden />
              Tu pedido sale {despacho.texto}
            </p>
            <p className="text-[13px] text-brand-black/55">{TIEMPO_ENTREGA}</p>
          </div>
        )}
      </div>
    </section>
  );
}
