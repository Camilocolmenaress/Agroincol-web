import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { AUTORIDAD, GARANTIA } from '@/lib/ecogel';
import { IconoChat, IconoEscudo, IconoRuta } from './Iconos';

const BENEFICIOS = [
  { Icono: IconoEscudo, titulo: `Garantía de ${GARANTIA.dias} días`, texto: 'Si siguen, otro kit sin costo.' },
  { Icono: IconoChat, titulo: 'Soporte por WhatsApp', texto: 'Fumigadores que te guían.' },
  { Icono: IconoRuta, titulo: 'Envío con rastreo', texto: 'La guía llega a tu WhatsApp.' },
];

export function LoQueTienes() {
  return (
    <section className="reveal container-custom mt-12 max-w-xl">
      <p className="font-heading text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Con tu compra</p>
      <h2 className="mt-1 font-heading text-h2-mobile font-bold text-brand-green md:text-h2">Lo que tienes de nuestro lado</h2>
      <ul className="mt-5 grid grid-cols-3 gap-2.5">
        {BENEFICIOS.map(({ Icono, titulo, texto }) => (
          <li key={titulo} className="flex flex-col items-center rounded-2xl bg-white px-2 py-4 text-center shadow-soft ring-1 ring-brand-green/10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-mint text-brand-green">
              <Icono className="h-6 w-6" />
            </span>
            <p className="mt-2.5 font-heading text-[14px] font-bold leading-tight text-brand-green">{titulo}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-brand-black/65">{texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// La foto ya trae impreso "Respaldo de una fumigadora de verdad": no se repite
// como título, se completa debajo.
export function Respaldo({ foto }: { foto?: string }) {
  if (!foto) return null;
  return (
    <section className="reveal container-custom mt-12 max-w-xl">
      <Image
        src={foto}
        alt="Técnico de AGROINCOL aplicando EcoGel en el zócalo de una cocina"
        width={2048}
        height={2048}
        sizes="(max-width: 640px) 100vw, 576px"
        className="aspect-square w-full rounded-2xl object-cover shadow-soft"
      />
      <p className="mt-4 text-body text-brand-black/80">
        <span className="font-heading font-bold text-brand-green">El mismo gel que usamos en nuestras fumigaciones.</span> AGROINCOL lleva{' '}
        {AUTORIDAD.anios} años fumigando en Colombia: detrás de tu pedido hay un equipo que hace esto todos los días.
      </p>
    </section>
  );
}

export function Ayuda({ whatsapp, pedido }: { whatsapp: string; pedido: string }) {
  return (
    <section className="reveal container-custom mt-12 max-w-xl">
      <div className="relative overflow-hidden rounded-2xl bg-brand-green p-6 text-white">
        <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/[0.06]" aria-hidden />
        <span className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-white/[0.04]" aria-hidden />
        <p className="relative font-heading text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9FD9B9]">Estamos para ayudarte</p>
        <h2 className="relative mt-1 font-heading text-h2-mobile font-bold leading-tight">¿Dudas con tu pedido o con la aplicación?</h2>
        <p className="relative mt-2 text-body-sm text-white/80">Escríbenos por WhatsApp y te responde nuestro equipo.</p>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-heading text-body font-bold text-white"
        >
          <MessageCircle size={18} aria-hidden /> Escribir por WhatsApp
        </a>
        {pedido && (
          <p className="relative mt-4 text-center text-[13px] text-white/65">
            Guarda tu número de pedido, <span className="font-semibold text-white">{pedido}</span>: lo necesitas para cualquier reclamo o para la garantía.
          </p>
        )}
      </div>
    </section>
  );
}
