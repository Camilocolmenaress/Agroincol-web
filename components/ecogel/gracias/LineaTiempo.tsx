import type { ComponentType, ReactNode } from 'react';
import { GARANTIA, money } from '@/lib/ecogel';
import { REGLA_DESPACHO, type Despacho } from '@/lib/ecogel-despacho';
import {
  IconoBillete,
  IconoBrillo,
  IconoCaja,
  IconoCasa,
  IconoComprobante,
  IconoCucaracha,
  IconoEscudo,
  IconoGota,
  IconoLlamada,
  IconoNido,
  IconoPago,
} from './Iconos';

type Hito = { cuando: string; titulo: ReactNode; texto: string; Icono: ComponentType<{ className?: string }>; acento?: boolean };

const LLEGA: Hito = {
  cuando: '1-2 días hábiles',
  titulo: 'Llega a tu puerta',
  texto: 'En ciudades principales. Al resto del país, en 2-4 días hábiles.',
  Icono: IconoCasa,
};

function sale(despacho: Despacho): Hito {
  return {
    cuando: despacho.hoy ? 'Hoy' : despacho.texto.charAt(0).toUpperCase() + despacho.texto.slice(1),
    titulo: `Tu pedido sale ${despacho.texto}`,
    texto: 'Te enviamos la guía de la transportadora por WhatsApp.',
    Icono: IconoCaja,
  };
}

function hitosDeEnvio(estado: string, despacho: Despacho, total?: number): Hito[] {
  if (estado === 'cod') {
    return [
      { cuando: 'En minutos', titulo: 'Te contactamos para confirmar', texto: 'Por WhatsApp o llamada. Contesta para que podamos despacharlo.', Icono: IconoLlamada, acento: true },
      sale(despacho),
      LLEGA,
      {
        cuando: 'Al recibir',
        titulo: 'Pagas en efectivo',
        texto: total ? `Ten listos ${money(total)} para el mensajero.` : 'Ten el valor listo para el mensajero.',
        Icono: IconoBillete,
      },
    ];
  }
  if (estado === 'approved') {
    return [{ cuando: 'Listo', titulo: 'Pago confirmado', texto: 'Ya tenemos tu pedido en preparación.', Icono: IconoPago }, sale(despacho), LLEGA];
  }
  const despachoAlConfirmar: Hito = { cuando: 'Al confirmarlo', titulo: 'Despachamos tu pedido', texto: REGLA_DESPACHO, Icono: IconoCaja };
  if (estado === 'pending') {
    return [
      { cuando: 'En minutos', titulo: 'Se confirma tu pago', texto: 'PSE puede tardar unos minutos. Te avisamos apenas entre.', Icono: IconoPago, acento: true },
      despachoAlConfirmar,
      LLEGA,
    ];
  }
  return [
    { cuando: 'Ahora', titulo: 'Envía el comprobante', texto: 'Por WhatsApp, con tu número de pedido.', Icono: IconoComprobante, acento: true },
    despachoAlConfirmar,
    LLEGA,
  ];
}

// Mismas afirmaciones que ya hacen la página de producto y "Cómo aplicarlo":
// aquí no se promete nada nuevo.
const RESULTADOS: Hito[] = [
  { cuando: 'Día 1', titulo: 'Aplicas el gel', texto: 'Unos puntos donde se esconden. Te toma 10 minutos.', Icono: IconoGota },
  {
    cuando: '24 a 48 horas',
    titulo: (
      <>
        Vas a ver <span className="text-brand-orange">MÁS</span> cucarachas
      </>
    ),
    texto: 'Es buena señal: están saliendo a comerse el gel.',
    Icono: IconoCucaracha,
    acento: true,
  },
  { cuando: 'Después de 48 horas', titulo: 'Empiezan a desaparecer', texto: 'Lo llevan al nido y lo comparten con el resto.', Icono: IconoNido },
  { cuando: '1 a 2 semanas', titulo: 'Cae la colonia completa', texto: 'No solo la que viste: también la que estaba escondida.', Icono: IconoBrillo },
  { cuando: `${GARANTIA.dias} días`, titulo: 'Tu garantía te respalda', texto: `${GARANTIA.titulo}.`, Icono: IconoEscudo },
];

function Riel({ hitos }: { hitos: Hito[] }) {
  return (
    <ol className="mt-5">
      {hitos.map(({ cuando, titulo, texto, Icono, acento }, i) => (
        <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
          {/* Un tramo por hito, de su nodo al siguiente: así el riel nunca pasa del
              último. Crece con el scroll donde el navegador lo soporta. */}
          {i < hitos.length - 1 && (
            <span className="gr-riel absolute bottom-0 left-[21px] top-11 w-0.5 bg-gradient-to-b from-brand-green/70 to-brand-green/25" aria-hidden />
          )}
          <span
            className={`relative z-10 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white shadow-soft ring-1 ${
              acento ? 'text-brand-orange ring-brand-orange/30' : 'text-brand-green ring-brand-green/15'
            }`}
          >
            <Icono className="h-[22px] w-[22px]" />
          </span>
          <div className="pt-0.5">
            <p className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-orange">{cuando}</p>
            <p className="mt-0.5 font-heading text-body font-bold leading-snug text-brand-green">{titulo}</p>
            <p className="mt-0.5 text-body-sm leading-snug text-brand-black/70">{texto}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function LineaTiempo({ estado, despacho, total }: { estado: string; despacho: Despacho; total?: number }) {
  return (
    <section className="container-custom mt-12 max-w-xl">
      <p className="font-heading text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Qué pasa ahora</p>
      <h2 className="mt-1 font-heading text-h2-mobile font-bold text-brand-green text-balance md:text-h2">De tu pedido a una cocina sin cucarachas</h2>

      <div className="reveal mt-6 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-brand-green/10">
        <h3 className="font-heading text-body font-bold text-brand-black">Tu envío</h3>
        <Riel hitos={hitosDeEnvio(estado, despacho, total)} />
      </div>

      <div className="reveal mt-4 rounded-2xl bg-brand-mint p-5">
        <h3 className="font-heading text-body font-bold text-brand-black">Tus resultados</h3>
        <Riel hitos={RESULTADOS} />
      </div>
    </section>
  );
}
