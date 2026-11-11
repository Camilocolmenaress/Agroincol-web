'use client';

import { Check, Receipt, ShieldCheck, Star, Truck } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { ENVIO_FUERA, GARANTIA, NOMBRE, cotizar, money } from '@/lib/laminas';
import { useCantidad } from './Cantidad';
import Selector from './Selector';
import Empujon from './Empujon';
import Calculadora from './Calculadora';
import Video, { type VideoSlot } from './Video';
import { ID_OFERTA } from './Rastreo';


const calificacion = BUSINESS.googleRating.replace('.', ',');

// Logos reales de los métodos aceptados (los mismos del checkout de EcoGel).
const LOGOS_PAGO = ['visa.svg', 'mastercard.svg', 'amex.svg', 'pse.svg', 'nequi.svg', 'bancolombia.svg', 'breb.svg'];

const PUNTOS = [
  'Se dobla en L: una mitad en el piso y la otra contra la pared',
  'Abierta mide de 31 × 21 a 32 × 22 cm',
  'El pegante viene cubierto con papel protector hasta instalarla',
  'Factura electrónica a nombre de su negocio',
];

// Caja de compra en el orden de Grüns: título → promesa → 4 checks → selector
// → botón → microtexto → garantía → 3 sellos → pagos → acordeones.
export default function CajaCompra({ videoA, children }: { videoA?: VideoSlot; children: React.ReactNode }) {
  const { cantidad, abrirCarrito } = useCantidad();
  const { total } = cotizar(cantidad, 'am');

  return (
    <div>
      {/* Calificación del perfil de Google de AGROINCOL (la empresa, no las láminas: por eso dice "en Google"). */}
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm font-semibold text-brand-black/80">
        <span className="flex text-brand-orange" role="img" aria-label={`${calificacion} de 5 estrellas`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={16} fill="currentColor" strokeWidth={0} aria-hidden />
          ))}
        </span>
        {calificacion} en Google · +300 clientes
      </p>
      <h1 className="mt-2 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.01em] text-brand-green sm:text-[2.4rem]">{NOMBRE}</h1>
      <p className="mt-2 text-body-lg leading-snug text-brand-black/75">
        Láminas adhesivas para atrapar ratas y ratones en restaurantes, fincas y bodegas.
      </p>

      <ul className="mt-4 space-y-2">
        {PUNTOS.map((t) => (
          <li key={t} className="flex gap-2.5 text-body leading-snug text-brand-black">
            <Check size={20} strokeWidth={2.5} className="mt-0.5 flex-none text-brand-green" aria-hidden />
            {t}
          </li>
        ))}
      </ul>

      <div id={ID_OFERTA} className="mt-6 border-t border-brand-black/10 pt-5">
        <Selector />
        <Empujon className="mt-3" />
        <div className="mt-3 space-y-3">
          {videoA && <Video slot={videoA} titulo="¿Cuántas necesito y dónde las pongo?" />}
          <Calculadora />
        </div>
      </div>

      <button
        type="button"
        onClick={abrirCarrito}
        className="mt-5 flex w-full items-center justify-center rounded-full bg-brand-orange px-6 py-4 font-heading text-[1.2rem] font-bold text-white shadow-brand transition-transform active:scale-[0.99]"
      >
        Agregar al carrito · {money(total)}
      </button>
      <p className="mt-2 text-center text-body-sm italic text-brand-black/70">
        {cantidad} láminas, precio en el área metropolitana. Fuera del área: envío {money(ENVIO_FUERA)}.
      </p>

      <p className="mt-4 rounded-xl bg-brand-mint px-4 py-3 text-body-sm leading-snug text-brand-black">
        <strong className="text-brand-green">Garantía:</strong> {GARANTIA}
      </p>

      <ul className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { Icono: ShieldCheck, t: 'Garantía' },
          { Icono: Receipt, t: 'Factura electrónica' },
          { Icono: Truck, t: 'Menos de 48 h en el área' },
        ].map(({ Icono, t }) => (
          <li key={t} className="flex flex-col items-center gap-1.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-brand-green text-brand-green">
              <Icono size={20} aria-hidden />
            </span>
            <span className="text-[13px] font-medium leading-tight text-brand-black/80">{t}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-4 flex flex-wrap items-center justify-center gap-1.5" aria-label="Métodos de pago">
        {LOGOS_PAGO.map((a) => (
          <li key={a} className="flex h-9 items-center rounded-md border border-brand-black/10 bg-white px-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/ecogel/pagos/${a}`} alt="" className="h-5 w-auto max-w-[60px] object-contain" />
          </li>
        ))}
        <li className="flex h-9 items-center rounded-md border border-brand-black/10 bg-white px-2 text-[12px] font-bold uppercase tracking-wide text-brand-black/70">
          Contraentrega
        </li>
      </ul>

      <div className="mt-5 divide-y divide-brand-black/10 border-y border-brand-black/10">{children}</div>
    </div>
  );
}
