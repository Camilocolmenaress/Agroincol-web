import Image from 'next/image';
import LeadForm from './LeadForm';
import { CoverageNote } from './LandingSections';
import { publicFileExists } from '@/lib/publicFiles';
import type { LandingConfig } from '@/lib/landing';

// El formulario vive en el hero porque es la conversión principal: es el evento que
// entrena al algoritmo de Meta y el único que llega calificado por municipio y franja.
// En escritorio el bloque queda apaisado; en móvil se apila con el titular primero.
//
// Sin animaciones de entrada: el titular está visible en el primer frame. Un opacity:0
// esperando hidratación destruye el LCP en móvil, que es de donde llega el tráfico pago.

export default function LandingHero({ config }: { config: LandingConfig }) {
  const hasPhoto = publicFileExists(config.infestationImage);

  return (
    <section id="agendar" className="bg-hero-radial pb-10 pt-8 md:pb-14 md:pt-12">
      <div className="container-custom grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div>
          <h1 className="font-heading text-[2.6rem] font-bold leading-[1.02] tracking-[-0.02em] text-white text-balance sm:text-6xl lg:text-[4.25rem]">
            {config.headline}
          </h1>

          <p className="font-heading text-h3 text-brand-orange-light mt-5 max-w-xl text-balance md:text-h2">
            {config.headlineAccent}
          </p>

          {hasPhoto && (
            <figure className="mt-6 m-0">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <Image
                  src={config.infestationImage}
                  alt={config.infestationAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-white/55 text-body-sm">
                Un caso real de {config.pest} que atendimos en Santander.
              </figcaption>
            </figure>
          )}
        </div>

        <div>
          {/* Encabezado de acción justo encima del formulario: enmarca los campos como
              el camino para que vayamos, no como un trámite de datos. */}
          <p className="font-heading text-h3 text-white mb-3 text-balance md:text-h2">
            Para agendar su inspección, responda esto:
          </p>

          <LeadForm
            categoria={config.slug}
            serviceType={config.serviceType}
            whatsappText={config.whatsappText}
            formId={`lp-${config.slug}`}
          />
          <div className="mt-4">
            <CoverageNote tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
