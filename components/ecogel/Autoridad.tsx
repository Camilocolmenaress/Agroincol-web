import { BadgeCheck } from 'lucide-react';
import { AUTORIDAD, FIGURA } from '@/lib/ecogel';
import Marcador from './Marcador';

// El bloque "Aida Victoria la ama tanto…" de Lummia: una figura que lo probó,
// dos videos verticales y su tarjeta de perfil. Los datos salen de FIGURA; hasta
// que no sea una persona real, la tarjeta lo dice. Debajo, en una franja
// compacta, la autoridad de la empresa (años y restaurantes).
export default function Autoridad() {
  return (
    <section className="container-custom mt-10">
      <div className="rounded-2xl bg-brand-light p-5">
        <span className="inline-block rounded-full bg-brand-green px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-white">
          Recomendado por
        </span>
        <h2 className="font-heading text-h2-mobile mt-3 text-brand-green text-balance md:text-h2">
          {FIGURA.nombre} {FIGURA.titulo.charAt(0).toLowerCase() + FIGURA.titulo.slice(1)}
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Marcador etiqueta="Video 1 · la figura aplicando el gel en su cocina" medidas="1080×1350 · vertical" ratio="portrait" />
          <Marcador etiqueta="Video 2 · la figura contando el resultado" medidas="1080×1350 · vertical" ratio="portrait" />
        </div>

        <div className={`mt-4 rounded-2xl bg-white p-4 ${FIGURA.placeholder ? 'border-2 border-dashed border-brand-orange/50' : 'shadow-soft'}`}>
          <div className="flex items-center gap-3">
            <span
              className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-brand-gray-light font-heading text-xl font-bold text-brand-black/50"
              aria-hidden
            >
              {FIGURA.nombre.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1 font-heading text-body font-bold text-brand-black">
                <span className="truncate">{FIGURA.nombre}</span>
                <BadgeCheck size={18} className="flex-none text-brand-green" aria-label="Cuenta verificada" />
              </p>
              <p className="text-body-sm text-brand-black/60">{FIGURA.usuario}</p>
            </div>
          </div>
          {FIGURA.placeholder && (
            <p className="mt-3 inline-block rounded bg-brand-orange/15 px-2 py-0.5 text-[11px] font-bold uppercase text-brand-orange-dark">
              Placeholder: figura de autoridad por definir
            </p>
          )}
        </div>

        <div className="mt-4 rounded-2xl bg-brand-green px-4 py-3 text-center text-white">
          <p className="font-heading text-body font-bold">{AUTORIDAD.anios} años controlando plagas</p>
          <p className="text-body-sm text-white/80">{AUTORIDAD.restaurantes} restaurantes atendidos · el mismo gel que aplican nuestros técnicos</p>
          {AUTORIDAD.restaurantes === '+N' && (
            <p className="mt-2 inline-block rounded bg-brand-orange px-2 py-0.5 text-[11px] font-bold uppercase text-white">
              Placeholder: confirmar número real de restaurantes
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
