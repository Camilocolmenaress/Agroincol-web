import Link from 'next/link';
import Objeto from './Objeto';
import { objetoPorId } from './objetos';
import ColadosHogar from './ColadosHogar';

// "¿Qué necesita proteger?" (antes AudienceSelector): mismo H2, mismos textos y mismas rutas.
// Cambia la forma: el H2 gigante con el objeto cruzando entre sus dos líneas y los tres
// segmentos como palabras gigantes. Una sola versión en el HTML (antes había carrusel + grilla
// con los H3 duplicados).
const segmentos = [
  {
    label: 'Mi hogar',
    pain: 'Cucarachas, roedores o zancudos. Productos seguros para niños y mascotas.',
    cta: 'Proteger mi casa',
    href: '/servicios/fumigacion-residencial',
    objeto: 'casa',
  },
  {
    label: 'Mi restaurante',
    pain: 'Cumpla el INVIMA y evite multas. Certificado válido el mismo día.',
    cta: 'Cumplir con INVIMA',
    href: '/servicios/fumigacion-restaurantes',
    objeto: 'cocina',
    destacado: 'Más solicitado',
  },
  {
    label: 'Mi empresa o industria',
    pain: 'Bodegas y plantas. Documentación lista para auditorías e ISO.',
    cta: 'Proteger mi operación',
    href: '/servicios/fumigacion-industrial',
    objeto: 'bodega',
  },
];

function Foco() {
  const casa = objetoPorId('casa');
  return (
    <div className="foco relative">
      <div className="text-center">
        <span className="eyebrow">Soluciones a su medida</span>
      </div>
      {/* Las dos líneas del H2 y el objeto en medio: la línea 1 queda detrás, la 2 delante. */}
      <div className="relative mt-8">
        <h2 className="text-center font-display text-[clamp(3rem,11.5vw,10.5rem)] uppercase leading-[0.86] tracking-[-0.035em] text-marca-verde">
          <span className="relative z-0 block">¿Qué necesita</span>{' '}
          <span className="relative z-20 block">proteger?</span>
        </h2>
        {casa && (
          <div className="foco-objeto pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(44vw,420px)] -translate-x-1/2 -translate-y-1/2">
            <div className="foco-caida -rotate-[10deg]">
              <Objeto objeto={casa} decorativo sizes="(min-width: 768px) 420px, 62vw" className="h-auto w-full" />
            </div>
          </div>
        )}
        {/* Etiquetas laterales, como en una etiqueta de producto. Adorno: aria-hidden. */}
        <span
          className="absolute -bottom-10 left-0 hidden font-display text-sm uppercase tracking-[0.18em] text-marca-letra/70 lg:block"
          aria-hidden
        >
          Hogar · Restaurante · Empresa
        </span>
        <span
          className="absolute -bottom-10 right-0 hidden text-right font-display text-sm uppercase tracking-[0.18em] text-marca-letra/70 lg:block"
          aria-hidden
        >
          Desde 1985 · Santander
        </span>
      </div>
      <p className="mx-auto mt-10 max-w-2xl lg:mt-16 text-center text-body-lg text-brand-gray text-pretty">
        Elija su caso y vea exactamente cómo lo resolvemos.
      </p>
    </div>
  );
}

export default function Segmentos() {
  return (
    <section className="overflow-hidden bg-white py-20 md:py-32">
      <div className="container-custom">
        <Foco />
        <ul className="mt-16 border-t border-marca-verde/15 md:mt-24">
          {segmentos.map((s) => {
            const objeto = objetoPorId(s.objeto);
            return (
              <li key={s.label} className="segmento-fila relative border-b border-marca-verde/15">
                <Link
                  href={s.href}
                  data-cursor="Ver servicio"
                  className="segmento group relative grid items-center gap-4 py-8 md:grid-cols-[1.35fr_1fr] md:gap-10 md:py-12"
                >
                  <div className="relative">
                    {s.destacado && (
                      <span className="mb-3 inline-block rounded-full bg-marca-verde px-3 py-1 font-display text-xs uppercase tracking-[0.12em] text-white">
                        {s.destacado}
                      </span>
                    )}
                    <h3 className="relative inline-block font-display text-[clamp(2.4rem,7vw,6rem)] uppercase leading-[0.9] tracking-[-0.03em] text-marca-verde transition-colors group-hover:text-marca-letra">
                      {s.label}
                      {/* El arco naranja subraya al pasar el cursor. */}
                      <svg viewBox="0 0 300 24" preserveAspectRatio="none" className="segmento-arco absolute -bottom-3 left-0 h-4 w-full" aria-hidden>
                        <path d="M4 18 Q150 -6 296 18" fill="none" stroke="#F5682E" strokeWidth="6" strokeLinecap="round" pathLength={1} />
                      </svg>
                    </h3>
                  </div>
                  <div className="relative flex flex-col gap-4 md:pl-6">
                    <p className="max-w-md text-body-lg text-brand-gray text-pretty">{s.pain}</p>
                    <span className="inline-flex items-center gap-2 font-display text-base uppercase tracking-[0.06em] text-marca-verde">
                      {s.cta}
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>→</span>
                    </span>
                    {objeto && (
                      <span className="segmento-objeto pointer-events-none absolute -right-14 -top-28 hidden w-32 md:block" aria-hidden>
                        <Objeto objeto={objeto} decorativo sizes="192px" className="h-auto w-full" />
                      </span>
                    )}
                  </div>
                </Link>
                {/* Fuera del enlace: los Colados no cambian el texto del enlace. */}
                {s.objeto === 'casa' && <ColadosHogar />}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
