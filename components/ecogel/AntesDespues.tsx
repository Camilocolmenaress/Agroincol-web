import type { ResenaEcogel } from '@/lib/ecogel-resenas';
import Marcador from './Marcador';
import { Estrellas, NombreVerificado } from './Estrellas';

// Antes/después con la reseña de esa misma persona debajo: la foto prueba el
// resultado y la tarjeta le pone nombre. Mientras sea placeholder, lleva borde
// punteado y etiqueta.
export default function AntesDespues({ antes, despues, resena }: { antes?: string; despues?: string; resena: ResenaEcogel }) {
  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green text-balance md:text-h2">
        Esto es lo que pasa cuando dejas el aerosol y aplicas el gel
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <Marcador etiqueta="Antes" medidas="800×1000" ratio="portrait" src={antes} alt="Cocina con cucarachas, antes" />
          <p className="mt-1 text-center text-body-sm font-semibold text-brand-black/70">Antes</p>
        </div>
        <div>
          <Marcador etiqueta="Después (día 7)" medidas="800×1000" ratio="portrait" src={despues} alt="La misma cocina, día 7" />
          <p className="mt-1 text-center text-body-sm font-semibold text-brand-black/70">Después · día 7</p>
        </div>
      </div>
      <article
        className={`mt-4 rounded-2xl p-5 ${resena.placeholder ? 'border-2 border-dashed border-brand-orange/50 bg-brand-cream' : 'bg-white shadow-soft'}`}
      >
        {resena.placeholder && (
          <p className="mb-2 inline-block rounded bg-brand-orange/15 px-2 py-0.5 text-[11px] font-bold uppercase text-brand-orange-dark">
            Ejemplo — reemplazar por reseña real
          </p>
        )}
        <Estrellas n={resena.estrellas} />
        {resena.titulo && <p className="mt-2 font-heading text-body font-bold text-brand-green">{resena.titulo}</p>}
        <p className="mt-1.5 text-body-sm text-brand-black/80">“{resena.texto}”</p>
        <NombreVerificado nombre={resena.nombre} ciudad={resena.ciudad} className="mt-3" />
      </article>
    </section>
  );
}
