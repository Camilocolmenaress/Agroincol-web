import { AUTORIDAD } from '@/lib/ecogel';
import Marcador from './Marcador';

export default function Autoridad({ equipo }: { equipo?: string }) {
  return (
    <section className="mt-10 bg-brand-green px-4 py-8 text-white">
      <div className="container-custom grid gap-5 md:grid-cols-2 md:items-center">
        <Marcador etiqueta="Técnico de AGROINCOL aplicando gel en un restaurante" medidas="1200×900" ratio="video" src={equipo} className="border-white/30 bg-white/10" />
        <div>
          <p className="eyebrow !text-brand-orange-light">Quién te lo vende</p>
          <h2 className="font-heading text-h2-mobile mt-2 text-balance md:text-h2">
            {AUTORIDAD.anios} años controlando plagas. {AUTORIDAD.restaurantes} restaurantes atendidos.
          </h2>
          <p className="mt-3 text-body text-white/80">
            No somos un importador con una tienda. Somos la empresa que va a la cocina cuando el problema ya es grande. Este es el gel que aplican nuestros técnicos, en una jeringa para que lo apliques tú antes de que llegue a eso.
          </p>
          {AUTORIDAD.restaurantes === '+N' && (
            <p className="mt-3 inline-block rounded bg-brand-orange/30 px-2 py-1 text-body-sm font-semibold">
              Placeholder: confirmar número real de restaurantes
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
