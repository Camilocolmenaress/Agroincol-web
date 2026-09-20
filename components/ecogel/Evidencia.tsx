'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AUTORIDAD, type Segmento } from '@/lib/ecogel';
import { EVIDENCIA, RESTAURANTES_CLIENTES, type Evidencia as Entrada } from '@/lib/ecogel-evidencia';
import { useCarrusel } from './useCarrusel';

// "Prueba, no promesas": estudios, norma y prensa como prueba social, en vez de
// una figura. Las tarjetas se ven ajenas a la página a propósito (serif, bordes
// rectos, blanco/papel/doble borde, sin colores de marca): son recortes traídos
// de afuera. La cabecera de la sección y las franjas de abajo sí usan la
// tipografía de la página.

const TITULO: Record<Segmento, string> = {
  hogar: 'Lo dice la ciencia, no nosotros',
  restaurantes: 'Lo dice la norma, la prensa y la ciencia',
};

const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

/** Las negritas del dato vienen marcadas con ** ** en la cadena; se parte, sin HTML. */
function Dato({ texto }: { texto: string }) {
  return (
    <>
      {texto.split('**').map((parte, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-[#111]">{parte}</strong> : parte))}
    </>
  );
}

function Enlace({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#111] underline underline-offset-2">
      {children} ↗
    </a>
  );
}

const TARJETA = 'relative flex w-full flex-col rounded-none text-[#222]';

function Estudio({ e }: { e: Entrada }) {
  return (
    <article className={`${TARJETA} border border-[#111] bg-white p-4 pr-8`} style={SERIF}>
      <p className="border-b-2 border-[#111] pb-2 text-[11px] uppercase tracking-[0.18em] text-[#111]">{e.fuente}</p>
      <p className="mt-2 text-[12px] leading-snug text-[#666]">{e.detalle}</p>
      <p className="mt-3 text-[15px] leading-[1.45]">
        <Dato texto={e.dato} />
      </p>
      <footer className="mt-auto pt-4">
        <p className="font-mono text-[11px] leading-snug text-[#555]">{e.cita}</p>
        <p className="mt-2 text-[13px]">
          <Enlace href={e.url}>Ver estudio</Enlace>
        </p>
      </footer>
      <span
        aria-hidden
        className="absolute right-2 top-4 text-[10px] uppercase tracking-[0.2em] text-[#888] [writing-mode:vertical-rl]"
      >
        Peer-reviewed
      </span>
    </article>
  );
}

function Noticia({ e }: { e: Entrada }) {
  return (
    <article className={`${TARJETA} border border-[#DCD7C6] bg-[#F7F5EE] p-4`} style={SERIF}>
      <p className="border-b border-[#333] pb-1.5 text-[20px] font-bold leading-none tracking-tight text-[#111]">{e.fuente}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[#555]">{e.detalle}</p>
      <p className="mt-3 max-w-[240px] text-[15px] leading-[1.45]">
        <Dato texto={e.dato} />
      </p>
      <footer className="mt-auto pt-4">
        <p className="text-[11px] italic leading-snug text-[#555]">{e.cita}</p>
        <p className="mt-2 text-[13px]">
          <Enlace href={e.url}>Leer la noticia</Enlace>
        </p>
      </footer>
    </article>
  );
}

function Norma({ e }: { e: Entrada }) {
  return (
    <article className={`${TARJETA} border-4 border-double border-[#333] bg-white p-4 text-center`} style={SERIF}>
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#333]">República de Colombia</p>
      <p className="mt-1.5 text-[16px] font-bold leading-tight text-[#111]">{e.fuente}</p>
      <p className="mt-1 text-[12px] leading-snug text-[#666]">{e.detalle}</p>
      <p className="mt-3 text-justify text-[15px] leading-[1.45]">
        <Dato texto={e.dato} />
      </p>
      <footer className="mt-auto pt-4">
        <p className="text-[11px] leading-snug text-[#555]">{e.cita}</p>
        <p className="mt-2 text-[13px]">
          <Enlace href={e.url}>Ver la resolución</Enlace>
        </p>
      </footer>
    </article>
  );
}

const TARJETAS = { estudio: Estudio, noticia: Noticia, norma: Norma } as const;

const FLECHA = 'flex h-8 w-8 items-center justify-center rounded-full border border-brand-gray-light bg-white text-brand-green';

export default function Evidencia({ segmento }: { segmento: Segmento }) {
  const entradas = EVIDENCIA[segmento];
  const { pista, activo, irA } = useCarrusel(entradas.length);

  return (
    <section className="mt-10" aria-label="Evidencia">
      <div className="container-custom">
        <span className="inline-block rounded-full bg-brand-green px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-white">
          Prueba, no promesas
        </span>
        <h2 className="font-heading text-h2-mobile mt-3 text-brand-green text-balance md:text-h2">{TITULO[segmento]}</h2>
      </div>

      {/* Las flechas van con los puntos, no sobre la pista: encima taparían el texto de las tarjetas. */}
      <div className="mt-5" aria-roledescription="carrusel" aria-label="Estudios, norma y prensa">
        <div
          ref={pista}
          className="container-custom relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {entradas.map((e, i) => {
            const Tarjeta = TARJETAS[e.tipo];
            return (
              <div key={e.url} className="flex w-[300px] flex-none snap-center" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${entradas.length}`}>
                <Tarjeta e={e} />
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-center gap-3">
          <button type="button" onClick={() => irA(activo - 1)} aria-label="Evidencia anterior" className={FLECHA}>
            <ChevronLeft size={18} aria-hidden />
          </button>
          <div className="flex gap-1.5" role="tablist" aria-label="Ir a la evidencia">
            {entradas.map((e, i) => (
              <button
                key={e.url}
                type="button"
                role="tab"
                aria-selected={i === activo}
                aria-label={`Evidencia ${i + 1}`}
                onClick={() => irA(i)}
                className={`h-2 rounded-full transition-all ${i === activo ? 'w-5 bg-brand-green' : 'w-2 bg-brand-gray-light'}`}
              />
            ))}
          </div>
          <button type="button" onClick={() => irA(activo + 1)} aria-label="Evidencia siguiente" className={FLECHA}>
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </div>

      {segmento === 'restaurantes' && (
        <div className="mt-8">
          <h3 className="container-custom font-heading text-h3 text-brand-green">Restaurantes que confían en AGROINCOL</h3>
          <ul className="container-custom mt-3 flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {RESTAURANTES_CLIENTES.map((c, i) => (
              <li
                key={i}
                className={`w-[160px] flex-none rounded-xl bg-white p-3 ${c.placeholder ? 'border-2 border-dashed border-brand-orange/50' : 'border border-brand-gray-light'}`}
              >
                <p className="font-heading text-body-sm font-bold text-brand-black">{c.nombre}</p>
                <p className="text-body-sm text-brand-black/60">{c.ciudad}</p>
                {c.placeholder && (
                  <p className="mt-2 inline-block rounded bg-brand-orange/15 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-tight text-brand-orange-dark">
                    Placeholder: cliente por autorizar
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="container-custom mt-6">
        <div className="rounded-2xl bg-brand-green px-4 py-3 text-center text-white">
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
