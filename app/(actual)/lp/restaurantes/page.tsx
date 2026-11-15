import type { Metadata } from 'next';
import Image from 'next/image';
import { Check, Clock3, FileCheck2, Leaf, Moon, QrCode, RotateCcw, Star } from 'lucide-react';
import { LandingFooter } from '@/components/landing/LandingChrome';
import FormularioRestaurante from '@/components/restaurantes/FormularioRestaurante';
import Cifra from '@/components/restaurantes/Cifra';
import Revelar from '@/components/restaurantes/Revelar';
import { HORARIO_TEXTO, cuandoContactamos, estaAbierto } from '@/lib/restaurantes/horario';

import cocina16x9 from '@/public/images/lp/restaurantes/cocina-noche-16x9.webp';
import cocina4x5 from '@/public/images/lp/restaurantes/cocina-noche-4x5.webp';
import comedor from '@/public/images/lp/restaurantes/comedor-cerrado.webp';
import gel from '@/public/images/lp/restaurantes/aplicacion-gel.webp';
import puerta from '@/public/images/lp/restaurantes/qr-puerta.webp';
import inspeccion from '@/public/images/lp/restaurantes/inspeccion-linterna.webp';

export const metadata: Metadata = {
  title: 'Inspección gratis para restaurantes | AGROINCOL',
  description:
    'Que ningún cliente vea una cucaracha en su restaurante. Inspección gratis fuera de su horario de atención en Bucaramanga y su área metropolitana.',
  // Landing de pauta: fuera de buscadores (ver app/lp/layout.tsx).
  robots: { index: false, follow: false },
};

// El horario lo decide el reloj del servidor en cada visita: una página
// cacheada prometería "en 5 minutos" un sábado.
export const dynamic = 'force-dynamic';

/*
 * Dirección visual: claro y "clínico", como una marca de salud y no como una
 * fumigadora de barrio. Fondo blanco, paneles en verde niebla, tipografía
 * semibold con tracking cerrado y el naranja SOLO en la acción principal.
 *
 * Las fotos son de AMBIENTE (cocinas y comedores cerrados, manos con guantes):
 * ninguna muestra caras ni uniformes, para que nadie las tome por el equipo.
 * Cuando haya fotos reales del técnico, reemplazan a la cocina del héroe.
 *
 * Entradas al hacer scroll con <Revelar> (CSS, sin Motion): títulos que pasan
 * de borrosos a nítidos palabra por palabra, bloques que suben y fotos que se
 * abren con zoom. El formulario NO entra animado: tiene que estar ahí ya.
 */

const DOCUMENTOS = ['Acta de servicio', 'Soportes', 'Ficha técnica', 'Hojas de seguridad'];

/** La carpeta del QR: lo que el dueño le muestra a la Secretaría de Salud. */
function CarpetaQR({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-[22px] bg-white/95 p-4 text-brand-black shadow-[0_24px_60px_-28px_rgba(13,43,32,0.5)] ring-1 ring-[#E3EAE6] backdrop-blur sm:p-5 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-green-dark text-white">
          <QrCode size={26} strokeWidth={1.6} aria-hidden />
        </span>
        <div>
          <p className="font-heading text-[1rem] font-semibold leading-tight text-brand-green-dark">Carpeta del restaurante</p>
          <p className="text-[0.82rem] text-[#5B6B63]">Un QR con todos los documentos</p>
        </div>
      </div>
      <ul className="mt-3.5 grid grid-cols-2 gap-1.5">
        {DOCUMENTOS.map((d) => (
          <li key={d} className="flex items-center gap-1.5 rounded-xl bg-[#F2F6F3] px-2.5 py-2 text-[0.8rem] font-semibold leading-tight text-brand-green-dark">
            <Check size={14} strokeWidth={3} className="shrink-0 text-brand-green-light" aria-hidden />
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Patrón de QR para el sticker en blanco de la foto de la puerta. Es
 * decorativo (no se escanea): los modelos de imagen dibujan QR falsos que se
 * ven mal, por eso el sticker se generó en blanco y el patrón va en código.
 */
function PatronQR({ className = '' }: { className?: string }) {
  const n = 21;
  const celdas: [number, number][] = [];
  let semilla = 7;
  const azar = () => (semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648;
  const enBuscador = (x: number, y: number) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!enBuscador(x, y) && azar() > 0.52) celdas.push([x, y]);
  const buscador = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={7} height={7} />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} preserveAspectRatio="none" className={className} aria-hidden shapeRendering="crispEdges">
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#fff" />
      <g fill="#0D2B20">
        {buscador(0, 0)}
        {buscador(n - 7, 0)}
        {buscador(0, n - 7)}
        {celdas.map(([x, y]) => (
          <rect key={`${x}:${y}`} x={x} y={y} width={1} height={1} />
        ))}
      </g>
    </svg>
  );
}

function Icono({ Componente, oscuro = false }: { Componente: typeof Moon; oscuro?: boolean }) {
  return (
    <span
      className={`grid h-12 w-12 place-items-center rounded-2xl ${oscuro ? 'bg-white/10 text-white' : 'bg-white text-brand-green shadow-soft'}`}
    >
      <Componente size={22} strokeWidth={1.8} aria-hidden />
    </span>
  );
}

export default function RestaurantesLandingPage() {
  const ahora = new Date();
  const abierto = estaAbierto(ahora);
  const contacto = cuandoContactamos(ahora);

  return (
    <div className="bg-white text-brand-black">
      {/* ─── Héroe ─── */}
      <header className="px-2.5 pt-2.5 sm:px-5 sm:pt-5">
        <div className="relative mx-auto max-w-[1240px] overflow-clip rounded-[30px] bg-[linear-gradient(165deg,#EEF4F0_0%,#E1EAE2_55%,#D3E2D8_100%)] sm:rounded-[40px]">
          {/* Anillos concéntricos: eco del QR y de la inspección. Solo decoran. */}
          <div
            className="pointer-events-none absolute -right-48 -top-48 h-[520px] w-[520px] rounded-full opacity-70 [background:repeating-radial-gradient(circle,transparent_0,transparent_38px,rgba(23,70,52,0.08)_39px,transparent_40px)] lg:-right-24 lg:-top-24 lg:h-[760px] lg:w-[760px]"
            aria-hidden
          />

          <div className="relative px-4 pb-4 pt-5 sm:px-8 sm:pb-8 lg:grid lg:grid-cols-[1fr_minmax(0,480px)] lg:items-start lg:gap-12 lg:px-12 lg:pb-14 lg:pt-10">
            <div className="lg:pt-2">
              <div className="flex items-center justify-between gap-3">
                <Image
                  src="/images/logos/logo-horizontal-transparente.png"
                  alt="AGROINCOL"
                  width={603}
                  height={162}
                  priority
                  className="h-8 w-auto lg:h-10"
                />
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[0.78rem] font-semibold text-brand-green-dark ring-1 ring-white">
                  <span className={`h-2 w-2 rounded-full ${abierto ? 'rr-latido bg-[#1FA855]' : 'bg-[#9AA39E]'}`} aria-hidden />
                  {abierto ? 'Atendiendo ahora' : 'Recibimos 24/7'}
                </span>
              </div>

              <Revelar
                como="h1"
                tipo="palabras"
                alCargar
                texto="Que ningún cliente vea una cucaracha en su restaurante."
                className="rr-heroe mt-5 max-w-[14ch] font-heading text-[2.2rem] font-semibold leading-[1] tracking-[-0.035em] text-brand-green-dark sm:text-[3.1rem] lg:mt-12 lg:text-[3.9rem]"
              />
              <Revelar
                como="p"
                alCargar
                retraso={300}
                className="mt-3 max-w-[44ch] text-[1rem] leading-[1.55] text-[#46564E] lg:mt-5 lg:text-[1.12rem]"
              >
                Inspección gratis, fuera de su horario de atención. Fumigamos con discreción y usted ve resultados en el
                primer mes.
              </Revelar>

              <Revelar
                como="ul"
                alCargar
                retraso={420}
                className="mt-4 flex flex-wrap gap-1.5 text-[0.78rem] sm:gap-2 sm:text-[0.82rem] lg:mt-6"
              >
                <li className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 font-semibold text-brand-green-dark shadow-soft sm:px-3">
                  <Star size={14} className="fill-brand-amber text-brand-amber" aria-hidden />
                  4,9 en Google <span className="font-normal text-[#5B6B63]">(35 opiniones)</span>
                </li>
                <li className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 font-semibold text-brand-green-dark shadow-soft sm:px-3">
                  40+ años <span className="font-normal text-[#5B6B63]">de tradición</span>
                </li>
              </Revelar>

              {/* Escritorio: la cocina cerrada con la carpeta del QR encima. En el celular la foto
                  baja después del formulario para no empujar la primera pregunta. */}
              <div className="relative mt-10 hidden lg:block">
                <Revelar tipo="imagen" alCargar retraso={200} className="relative aspect-[16/10] overflow-clip rounded-[26px]">
                  <Image
                    src={cocina16x9}
                    alt="Cocina de restaurante cerrada en la noche, impecable"
                    fill
                    sizes="(min-width: 1240px) 640px, 50vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                </Revelar>
                <Revelar alCargar retraso={650} className="absolute -bottom-7 left-6 w-[340px]">
                  <CarpetaQR />
                </Revelar>
              </div>
            </div>

            <div
              id="formulario"
              className="mt-5 scroll-mt-3 overflow-clip rounded-[26px] bg-white shadow-[0_30px_80px_-30px_rgba(13,43,32,0.45)] ring-1 ring-white lg:sticky lg:top-6 lg:mt-0"
            >
              <FormularioRestaurante contacto={contacto} />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ─── Celular: la foto del héroe, después del formulario ─── */}
        <section className="px-2.5 pt-2.5 sm:px-5 lg:hidden">
          <Revelar tipo="imagen" className="relative aspect-[4/5] overflow-clip rounded-[30px] [--rr-radio:30px]">
            <Image src={cocina4x5} alt="Cocina de restaurante cerrada en la noche, impecable" fill sizes="100vw" placeholder="blur" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-24">
              <p className="inline-flex rounded-full bg-white/15 px-3.5 py-2 text-[0.88rem] font-semibold text-white ring-1 ring-white/25 backdrop-blur">
                Inspección gratis, fuera de su horario de atención
              </p>
            </div>
          </Revelar>
        </section>

        {/* ─── Cifras reales ─── */}
        <section className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-8 lg:px-12 lg:pt-24">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {(
              [
                [<Cifra key="a" valor={40} sufijo="+" />, 'años de tradición familiar en control de plagas'],
                [<Cifra key="g" valor={4.9} decimales={1} />, 'estrellas en Google, con 35 opiniones'],
                ['$0', 'cuesta la inspección'],
                [<Cifra key="m" valor={5} sufijo=" min" />, 'para contactarlo en horario de atención'],
              ] as const
            ).map(([cifra, texto], i) => (
              <Revelar key={texto} retraso={i * 90} className="border-t border-[#E3EAE6] pt-4">
                <dt className="font-heading text-[2.6rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-brand-green-dark lg:text-[3.4rem]">
                  {cifra}
                </dt>
                <dd className="mt-2 max-w-[22ch] text-[0.9rem] leading-snug text-[#5B6B63]">{texto}</dd>
              </Revelar>
            ))}
          </dl>
        </section>

        {/* ─── Lo que incluye ─── */}
        <section className="mx-auto max-w-[1240px] px-4 py-14 sm:px-8 lg:px-12 lg:py-24">
          <Revelar
            como="h2"
            tipo="palabras"
            texto="Control de plagas pensado para restaurantes"
            className="max-w-[18ch] font-heading text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-brand-green-dark sm:text-[2.6rem]"
          />

          <div className="mt-8 grid gap-3 lg:mt-12 lg:grid-cols-3 lg:gap-4">
            {/* Discreción */}
            <Revelar como="article" className="overflow-clip rounded-[26px] bg-[#F5F8F6]">
              <Revelar tipo="imagen" className="relative aspect-[4/3] [--rr-radio:0px]">
                <Image src={comedor} alt="Comedor de restaurante cerrado, con las sillas sobre las mesas" fill sizes="(min-width: 1024px) 400px, 100vw" placeholder="blur" className="object-cover" />
              </Revelar>
              <div className="p-6 lg:p-7">
                <Icono Componente={Moon} />
                <h3 className="mt-4 font-heading text-[1.3rem] font-semibold tracking-[-0.01em] text-brand-green-dark">Discreción</h3>
                <p className="mt-1.5 text-[0.98rem] leading-relaxed text-[#5B6B63]">
                  Vamos cuando su restaurante está cerrado. Sus comensales nunca ven al fumigador.
                </p>
              </div>
            </Revelar>

            {/* Plan a su medida: la inspección en foto y el plan de choque dibujado (6 visitas, cada 15 días). */}
            <Revelar como="article" retraso={90} className="overflow-clip rounded-[26px] bg-[#F5F8F6]">
              <Revelar tipo="imagen" className="relative aspect-[4/3] [--rr-radio:0px]">
                <Image src={inspeccion} alt="Manos con guantes inspeccionando con linterna debajo de un mueble de acero inoxidable" fill sizes="(min-width: 1024px) 400px, 100vw" placeholder="blur" className="object-cover" />
              </Revelar>
              <div className="p-6 lg:p-7">
                <Icono Componente={Clock3} />
                <h3 className="mt-4 font-heading text-[1.3rem] font-semibold tracking-[-0.01em] text-brand-green-dark">Plan a su medida</h3>
                <p className="mt-1.5 text-[0.98rem] leading-relaxed text-[#5B6B63]">
                  Si hay plaga: plan de choque de 6 visitas, una cada 15 días. Si quiere prevenir: visitas mensuales o
                  trimestrales. Lo definimos en la inspección.
                </p>
                <div className="mt-5 flex items-center" aria-hidden>
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="flex flex-1 items-center last:flex-none">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-green-dark text-[0.75rem] font-bold text-white">
                        {i + 1}
                      </span>
                      {i < 5 ? <span className="h-px flex-1 bg-brand-green/25" /> : null}
                    </div>
                  ))}
                </div>
              </div>
            </Revelar>

            {/* Baja toxicidad */}
            <Revelar como="article" retraso={180} className="overflow-clip rounded-[26px] bg-[#F5F8F6]">
              <Revelar tipo="imagen" className="relative aspect-[4/3] [--rr-radio:0px]">
                <Image src={gel} alt="Mano con guante aplicando gel en la bisagra de un mueble de acero inoxidable" fill sizes="(min-width: 1024px) 400px, 100vw" placeholder="blur" className="object-cover" />
              </Revelar>
              <div className="p-6 lg:p-7">
                <Icono Componente={Leaf} />
                <h3 className="mt-4 font-heading text-[1.3rem] font-semibold tracking-[-0.01em] text-brand-green-dark">
                  Productos de baja toxicidad
                </h3>
                <p className="mt-1.5 text-[0.98rem] leading-relaxed text-[#5B6B63]">Aprobados en salud pública. Seguros cerca de su cocina.</p>
              </div>
            </Revelar>

            {/* Todo en regla, en un QR: el diferencial, a lo ancho. */}
            <Revelar como="article" className="grid overflow-clip rounded-[26px] bg-[#F5F8F6] lg:col-span-3 lg:grid-cols-[1fr_1.15fr]">
              <div className="p-6 lg:p-12 lg:pr-6">
                <Icono Componente={FileCheck2} />
                <Revelar
                  como="h3"
                  tipo="palabras"
                  texto="Todo en regla, en un QR"
                  className="mt-5 font-heading text-[1.8rem] font-semibold leading-[1.05] tracking-[-0.025em] text-brand-green-dark lg:text-[2.4rem]"
                />
                <Revelar como="p" retraso={200} className="mt-3 max-w-[42ch] text-[1.02rem] leading-relaxed text-[#5B6B63]">
                  Acta, soportes, ficha técnica y hojas de seguridad, listos para cuando llegue la Secretaría de Salud.
                </Revelar>
                <CarpetaQR className="mt-7 max-w-[400px]" />
              </div>
              <Revelar tipo="imagen" className="relative aspect-[4/3] self-center [--rr-radio:0px]">
                <Image src={puerta} alt="Puerta de acero inoxidable de una cocina con el QR de documentos" fill sizes="(min-width: 1024px) 640px, 100vw" placeholder="blur" className="object-cover" />
                {/* Encima del sticker en blanco de la foto: 993-1103 × 428-572 px del original de 1448 × 1086.
                    La foto va siempre en 4:3 para que estos porcentajes no se corran con el recorte. */}
                <PatronQR className="absolute left-[68.8%] top-[39.7%] h-[13%] w-[7.4%] rounded-[3px] opacity-95" />
              </Revelar>
            </Revelar>
          </div>
        </section>

        {/* ─── La objeción principal ─── */}
        <section className="px-2.5 sm:px-5">
          <div className="mx-auto grid max-w-[1240px] gap-8 rounded-[30px] bg-brand-green-dark px-5 py-12 text-white sm:rounded-[40px] sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14 lg:px-14 lg:py-20">
            <div>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-brand-orange-light">
                <RotateCcw size={22} strokeWidth={1.9} aria-hidden />
              </span>
              <Revelar
                como="h2"
                tipo="palabras"
                texto="¿Ya fumigó y volvieron?"
                className="mt-5 font-heading text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[2.6rem]"
              />
              <Revelar como="p" retraso={200} className="mt-3 max-w-[44ch] text-[1.05rem] leading-relaxed text-white/75">
                Si la plaga vuelve mientras su plan esté activo, volvemos sin costo. Solo cumpla las recomendaciones del
                técnico después del primer servicio.
              </Revelar>
            </div>
            {/* Texto literal de la reseña en Google (andres carvajal, 5 estrellas). */}
            <Revelar como="figure" retraso={150} className="rounded-[26px] bg-white p-6 text-brand-black shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)] lg:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#5E35B1] font-heading text-lg font-semibold text-white" aria-hidden>
                  a
                </span>
                <div>
                  <p className="font-semibold leading-tight">andres carvajal</p>
                  <div className="mt-1 flex gap-0.5" role="img" aria-label="5 estrellas">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={14} className="fill-brand-amber text-brand-amber" aria-hidden />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="mt-4 text-[1.08rem] leading-relaxed text-brand-black/85 lg:text-[1.2rem]">
                “Anteriormente he hecho fumigaciones con otras personas pero no funcionaba, en cambio con ellos me sirvió
                muchísimo”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2 text-[0.82rem] text-[#5B6B63]">
                <span className="font-semibold text-[#4285F4]">G</span> Reseña en Google Maps
              </figcaption>
            </Revelar>
          </div>
        </section>

        {/* ─── Cierre ─── */}
        <section className="mx-auto max-w-[760px] px-4 py-16 text-center lg:py-24">
          <Revelar
            como="h2"
            tipo="palabras"
            texto="Agende su inspección gratis"
            className="font-heading text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-brand-green-dark sm:text-[2.6rem]"
          />
          <Revelar como="p" retraso={200} className="mx-auto mt-3 max-w-md text-[0.98rem] leading-relaxed text-[#5B6B63]">
            {HORARIO_TEXTO} Si nos escribe ahora, lo contactamos {contacto}.
          </Revelar>
          <Revelar retraso={320}>
            <a
              href="#formulario"
              className="mt-7 inline-flex min-h-[58px] items-center justify-center rounded-full bg-brand-orange px-9 font-heading text-[1.2rem] font-bold text-white shadow-brand transition hover:bg-brand-orange-dark"
            >
              Agende su inspección gratis
            </a>
          </Revelar>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
