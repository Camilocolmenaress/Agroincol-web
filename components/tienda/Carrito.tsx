'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { BookOpen, Lock, Receipt, ShieldCheck, X } from 'lucide-react';
import { DESDE_ENVIO_GRATIS, ENVIO_FUERA, NOMBRE, cotizar, faltanParaEnvioGratis, money, urlCheckout } from '@/lib/laminas';
import { useCantidad } from './Cantidad';
import Stepper from './Stepper';
import Empujon from './Empujon';

// Carrito lateral de Grüns: barra de progreso al envío gratis, el producto con
// − / +, el empujón al paquete siguiente, subtotal y "Pagar de forma segura".
export default function Carrito() {
  const { cantidad, setCantidad, carritoAbierto, cerrarCarrito } = useCantidad();
  const c = cotizar(cantidad, 'am');
  const faltan = faltanParaEnvioGratis(cantidad);
  const progreso = Math.min(100, Math.round((cantidad / DESDE_ENVIO_GRATIS) * 100));

  const panel = useRef<HTMLDivElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);

  // Diálogo modal de verdad: el foco entra al abrir, Tab no se sale y al cerrar
  // vuelve al botón que lo abrió (Agregar al carrito, la bolsa o la barra fija).
  useEffect(() => {
    if (!carritoAbierto) return;
    const origen = document.activeElement as HTMLElement | null;
    cerrar.current?.focus();
    const alTeclado = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return cerrarCarrito();
      if (e.key !== 'Tab' || !panel.current) return;
      const enfocables = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (!panel.current.contains(document.activeElement)) {
        e.preventDefault();
        primero.focus();
      } else if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener('keydown', alTeclado);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alTeclado);
      document.body.style.overflow = anterior;
      origen?.focus?.();
    };
  }, [carritoAbierto, cerrarCarrito]);

  return (
    // invisible (no solo pointer-events): cerrado, nada de adentro recibe foco con Tab.
    <div className={`fixed inset-0 z-50 ${carritoAbierto ? 'visible' : 'pointer-events-none invisible transition-[visibility] duration-300'}`}>
      <div
        className={`absolute inset-0 bg-brand-green-dark/40 transition-opacity duration-300 ${carritoAbierto ? 'opacity-100' : 'opacity-0'}`}
        onClick={cerrarCarrito}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Su carrito"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white shadow-premium transition-transform duration-300 ${
          carritoAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-black/10 px-4 py-3.5">
          <p className="font-heading text-[1.35rem] font-bold text-brand-black">Su carrito</p>
          <button ref={cerrar} type="button" onClick={cerrarCarrito} aria-label="Cerrar carrito" className="flex h-10 w-10 items-center justify-center rounded-full text-brand-black">
            <X size={24} aria-hidden />
          </button>
        </div>

        <div className="bg-brand-mint px-4 py-3">
          <p className="text-center text-body-sm font-semibold text-brand-black">
            {faltan > 0 ? (
              <>
                Le {faltan === 1 ? 'falta' : 'faltan'} <span className="text-brand-green">{faltan} {faltan === 1 ? 'lámina' : 'láminas'}</span> para el{' '}
                <span className="text-brand-green">ENVÍO GRATIS</span>
              </>
            ) : (
              <>
                ¡Tiene <span className="text-brand-green">ENVÍO GRATIS</span> en el área metropolitana!
              </>
            )}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-label="Avance al envío gratis" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progreso}>
            <div className="h-full rounded-full bg-brand-green transition-all duration-500" style={{ width: `${progreso}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex gap-3.5">
            <div className="relative h-20 w-20 flex-none overflow-hidden rounded-xl bg-brand-mint">
              <Image src="/tienda/laminas/esquina.webp" alt="" fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-body font-bold leading-tight text-brand-black">{NOMBRE}</p>
              <p className="mt-0.5 text-body-sm text-brand-black/70">
                {cantidad} láminas · {money(c.precioUnidad)} c/u
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <Stepper valor={cantidad} onChange={setCantidad} tamano="sm" />
                <p className="font-heading text-body font-bold text-brand-black">{money(c.producto)}</p>
              </div>
            </div>
          </div>

          <Empujon className="mt-4" />

          <p className="mt-4 flex items-center gap-2 rounded-xl border border-brand-green/20 px-3.5 py-2.5 text-body-sm text-brand-black/80">
            <BookOpen size={18} className="flex-none text-brand-green" aria-hidden />
            Incluye la guía de ubicación y uso
          </p>
        </div>

        <div className="border-t border-brand-black/10 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
          <dl className="space-y-1 text-body-sm">
            <div className="flex justify-between">
              <dt className="text-brand-black/70">Subtotal</dt>
              <dd className="font-semibold">{money(c.producto)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-black/70">Envío en el área metropolitana</dt>
              <dd className={c.envio === 0 ? 'font-semibold text-brand-green' : 'font-semibold'}>{c.envio === 0 ? 'Gratis' : money(c.envio)}</dd>
            </div>
            <div className="flex justify-between pt-1 font-heading text-body-lg font-bold text-brand-black">
              <dt>Total</dt>
              <dd>{money(c.total)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-[12px] text-brand-black/70">Fuera del área metropolitana el envío es de {money(ENVIO_FUERA)}; se calcula al pagar.</p>
          <a
            href={urlCheckout(cantidad)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-4 font-heading text-[1.2rem] font-bold text-white shadow-brand"
          >
            Pagar de forma segura <Lock size={18} aria-hidden />
          </a>
          <ul className="mt-3 grid grid-cols-3 gap-2 text-center text-[12px] leading-tight text-brand-black/70">
            <li className="flex flex-col items-center gap-1"><ShieldCheck size={16} className="text-brand-green" aria-hidden />Garantía</li>
            <li className="flex flex-col items-center gap-1"><Receipt size={16} className="text-brand-green" aria-hidden />Factura electrónica</li>
            <li className="flex flex-col items-center gap-1"><BookOpen size={16} className="text-brand-green" aria-hidden />Guía incluida</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
