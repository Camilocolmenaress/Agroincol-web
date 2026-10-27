import type { Metadata } from 'next';
import Image from 'next/image';
import { Clock3, FileCheck2, Leaf, RotateCcw, Star, Moon } from 'lucide-react';
import { LandingFooter } from '@/components/landing/LandingChrome';
import FormularioRestaurante from '@/components/restaurantes/FormularioRestaurante';
import { HORARIO_TEXTO, PanelCerrado } from '@/components/restaurantes/PanelCerrado';
import { estaAbierto, textoProximaApertura } from '@/lib/restaurantes/horario';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Inspección gratis para restaurantes | AGROINCOL',
  description:
    'Que ningún cliente vea una cucaracha en su restaurante. Inspección gratis fuera de su horario de atención en Bucaramanga y su área metropolitana.',
  // Landing de pauta: fuera de buscadores (ver app/lp/layout.tsx).
  robots: { index: false, follow: false },
};

// El horario lo decide el reloj del servidor en cada visita: una página
// cacheada mostraría el formulario abierto un sábado.
export const dynamic = 'force-dynamic';

const BLOQUES = [
  {
    Icono: Moon,
    titulo: 'Discreción',
    texto: 'Vamos cuando su restaurante está cerrado. Sus comensales nunca ven al fumigador.',
  },
  {
    Icono: Clock3,
    titulo: 'Plan a su medida',
    texto:
      'Si hay plaga: plan de choque de 6 visitas, una cada 15 días. Si quiere prevenir: visitas mensuales o trimestrales. Lo definimos en la inspección.',
  },
  {
    Icono: FileCheck2,
    titulo: 'Todo en regla, en un QR',
    texto: 'Acta, soportes, ficha técnica y hojas de seguridad, listos para cuando llegue la Secretaría de Salud.',
  },
  {
    Icono: Leaf,
    titulo: 'Productos de baja toxicidad',
    texto: 'Aprobados en salud pública. Seguros cerca de su cocina.',
  },
] as const;

export default function RestaurantesLandingPage() {
  const ahora = new Date();
  const abierto = estaAbierto(ahora);
  const vuelve = textoProximaApertura(ahora);

  return (
    <>
      <header className="relative isolate overflow-hidden bg-brand-green-dark text-white">
        <Image
          src="/images/hero/hero-restaurantes.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[62%_30%] opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-green-dark/70 via-brand-green-dark/85 to-brand-green-dark" />

        <div className="mx-auto max-w-[1120px] px-4 pb-12 pt-6 sm:px-6 lg:grid lg:grid-cols-[1fr_minmax(0,500px)] lg:items-start lg:gap-14 lg:pb-20 lg:pt-10">
          <div className="lg:sticky lg:top-10">
            <Image
              src="/images/logos/logo-horizontal.png"
              alt="AGROINCOL"
              width={420}
              height={140}
              priority
              className="h-9 w-auto rounded-md bg-brand-mint px-2 py-1 lg:h-11"
            />
            <h1 className="mt-7 max-w-[15ch] font-heading text-[2.35rem] font-bold leading-[1.02] tracking-[-0.02em] sm:text-[3rem] lg:mt-14 lg:text-[3.6rem]">
              Que ningún cliente vea una cucaracha en su restaurante.
            </h1>
            <p className="mt-4 max-w-[46ch] text-[1.08rem] leading-relaxed text-white/80 lg:text-body-lg">
              Inspección gratis, fuera de su horario de atención. Fumigamos con discreción y usted ve resultados en el
              primer mes.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-white/75">
              <li className="flex items-center gap-1.5">
                <Star size={16} className="fill-brand-amber text-brand-amber" aria-hidden />
                <span>
                  <strong className="text-white">4,9 estrellas en Google</strong> (35 opiniones)
                </span>
              </li>
              <li>
                <strong className="text-white">Más de 40 años</strong> de tradición familiar en control de plagas
              </li>
            </ul>
          </div>

          <div id="formulario" className="mt-8 scroll-mt-4 overflow-hidden rounded-[28px] bg-brand-cream text-brand-black shadow-premium lg:mt-0">
            {abierto ? <FormularioRestaurante /> : <PanelCerrado vuelve={vuelve} />}
          </div>
        </div>
      </header>

      <main className="bg-brand-cream">
        <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="max-w-[20ch] font-heading text-[1.85rem] font-bold leading-[1.1] text-brand-green-dark sm:text-[2.3rem]">
            Lo que pasa después de la inspección
          </h2>
          <ul className="mt-8 divide-y divide-brand-green/10 border-y border-brand-green/10 lg:grid lg:grid-cols-2 lg:gap-x-14 lg:divide-y-0 lg:border-0">
            {BLOQUES.map(({ Icono, titulo, texto }) => (
              <li key={titulo} className="flex gap-4 py-6 lg:border-t lg:border-brand-green/10">
                <Icono size={26} strokeWidth={1.8} className="mt-0.5 shrink-0 text-brand-orange" aria-hidden />
                <div>
                  <h3 className="font-heading text-[1.2rem] font-bold text-brand-green-dark">{titulo}</h3>
                  <p className="mt-1 max-w-[52ch] text-body text-brand-black/70">{texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* La objeción principal, respondida con la garantía y una reseña real. */}
        <section className="bg-brand-green text-white">
          <div className="mx-auto grid max-w-[1120px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-20">
            <div>
              <RotateCcw size={30} strokeWidth={1.8} className="text-brand-orange-light" aria-hidden />
              <h2 className="mt-4 font-heading text-[1.85rem] font-bold leading-[1.1] sm:text-[2.3rem]">
                ¿Ya fumigó y volvieron?
              </h2>
              <p className="mt-3 max-w-[48ch] text-body-lg text-white/80">
                Si la plaga vuelve mientras su plan esté activo, volvemos sin costo. Solo cumpla las recomendaciones del
                técnico después del primer servicio.
              </p>
            </div>
            <figure className="rounded-[24px] bg-white/[0.06] p-6 ring-1 ring-white/10">
              <div className="flex gap-0.5" aria-label="5 estrellas">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={18} className="fill-brand-amber text-brand-amber" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-3 text-[1.15rem] leading-relaxed">
                “Anteriormente he hecho fumigaciones con otras personas pero no funcionaba, en cambio con ellos me sirvió
                muchísimo”
              </blockquote>
              <figcaption className="mt-3 text-body-sm text-white/60">andres carvajal, reseña en Google</figcaption>
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] px-4 py-14 text-center sm:px-6">
          {abierto ? (
            <a
              href="#formulario"
              className="inline-flex min-h-[58px] items-center justify-center rounded-2xl bg-brand-orange px-8 font-heading text-[1.15rem] font-bold text-white shadow-brand transition hover:bg-brand-orange-dark"
            >
              Agende su inspección gratis
            </a>
          ) : (
            <p className="font-heading text-[1.4rem] font-bold text-brand-green-dark">Volvemos {vuelve}</p>
          )}
          <p className="mx-auto mt-4 max-w-md text-body-sm text-brand-black/60">
            {HORARIO_TEXTO} {abierto ? 'Lo contactamos en 5 minutos.' : ''}
          </p>
          <p className="mt-1 text-body-sm text-brand-black/45">{BUSINESS.address.city}, Santander</p>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
