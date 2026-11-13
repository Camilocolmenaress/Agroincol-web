import Link from 'next/link';
import { Home, Building2, UtensilsCrossed, MousePointer2, Bug, Factory, type LucideIcon } from 'lucide-react';
import { SERVICES } from '@/lib/constants';
import Objeto from './Objeto';
import { OBJETOS } from './objetos';

// Servicios (antes ServicesGrid): mismos textos y enlaces a las 9 rutas. Tarjetas que se
// inclinan (máx. 6°) y muestran el patrón gel tono sobre tono al pasar el cursor.
// Una sola lista en el HTML: en celular es una fila con scroll-snap (antes, carrusel + grilla
// duplicaban los nueve H3).
const iconos: Record<string, LucideIcon> = { Home, Building2, UtensilsCrossed, MousePointer2, Bug, Factory };
const objetoDe = (href: string) => OBJETOS.find((o) => o.href === href);

// excluir: en una página de servicio, la ruta actual. Ahí la sección es "Otros servicios" y sus
// títulos no son encabezados (no agregan H2/H3 a una página que ya tiene su estructura).
export default function OtrosServicios({ excluir }: { excluir?: string } = {}) {
  const otros = !!excluir;
  const servicios = SERVICES.filter((s) => 'hasPage' in s && s.hasPage && 'href' in s && s.href !== excluir) as unknown as {
    slug: string;
    title: string;
    shortDescription: string;
    icon: string;
    href: string;
  }[];

  return (
    <section className="overflow-hidden bg-white py-20 md:py-32">
      <div className="container-custom">
        {otros ? (
          <p className="font-display text-[clamp(2.4rem,7vw,6rem)] uppercase leading-[0.9] tracking-[-0.03em] text-marca-verde">
            Otros servicios
          </p>
        ) : (
          <>
            <span className="eyebrow">Servicios</span>
            <h2 className="mt-6 max-w-[18ch] font-display text-[clamp(2.4rem,6.4vw,5.6rem)] uppercase leading-[0.9] tracking-[-0.03em] text-marca-verde">
              Nuestros Servicios de Fumigación y Control de Plagas
            </h2>
            <p className="mt-6 max-w-2xl text-body-lg text-brand-gray text-pretty">
              Soluciones profesionales para cada sector en Bucaramanga y el Área Metropolitana
            </p>
          </>
        )}
      </div>

      <ul className="servicios-lista container-custom mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:mt-16 md:grid md:snap-none md:grid-cols-2 md:gap-5 md:overflow-visible lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {servicios.map((s) => {
          const Icono = iconos[s.icon] ?? Bug;
          const objeto = objetoDe(s.href);
          const Titulo = otros ? 'p' : 'h3';
          return (
            <li key={s.slug} className="w-[80vw] shrink-0 snap-center sm:w-[58vw] md:w-auto">
              <Link
                href={s.href}
                data-cursor="Ver servicio"
                className={`tarjeta-servicio group relative flex h-full ${otros ? 'min-h-[220px]' : 'min-h-[300px]'} flex-col overflow-hidden rounded-[28px] border border-marca-verde/15 bg-marca-menta/50 p-7 transition-[transform,background-color,box-shadow] duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] md:p-8`}
              >
                {/* Patrón gel tono sobre tono: aparece con el verde al pasar el cursor. */}
                <span
                  className="tarjeta-patron pointer-events-none absolute inset-0 bg-[url('/images/patrones/patron-gel-oscuro.webp')] bg-[length:360px] opacity-0 transition-opacity duration-500"
                  aria-hidden
                />
                <span className="relative flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-marca-verde text-white transition-colors duration-500 group-hover:bg-white group-hover:text-marca-verde">
                    <Icono size={22} aria-hidden />
                  </span>
                  {objeto && (
                    <span className="-mr-3 -mt-6 w-28 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" aria-hidden>
                      <Objeto objeto={objeto} decorativo sizes="112px" className="h-auto w-full" />
                    </span>
                  )}
                </span>
                <Titulo className="relative mt-auto pt-10 font-display text-2xl uppercase leading-[1] tracking-[-0.01em] text-marca-verde transition-colors duration-500 group-hover:text-white">
                  {s.title}
                </Titulo>
                {/* En "Otros servicios" va solo el nombre: repetir las nueve descripciones en cada
                    página de servicio sería texto de relleno idéntico entre páginas. */}
                {!otros && (
                  <p className="relative mt-3 text-body text-brand-gray transition-colors duration-500 group-hover:text-white/80">
                    {s.shortDescription}
                  </p>
                )}
                <span className="relative mt-5 inline-flex items-center gap-1.5 font-display text-sm uppercase tracking-[0.08em] text-marca-verde transition-colors duration-500 group-hover:text-white">
                  Más información
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
