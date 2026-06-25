import { Sparkles, ShieldCheck, Droplets, Sofa, BedDouble, ArrowRight } from 'lucide-react';

/**
 * AlivioTeaser — punto de acceso a la zona /alivio (Multi-Zones).
 *
 * IMPORTANTE: el CTA usa <a href="/alivio">, NO <Link> de next/link.
 * En Multi-Zones, <Link> intenta prefetch + soft-navigation entre zonas y falla;
 * un <a> fuerza la navegación dura correcta a la app independiente de Alivio.
 *
 * Identidad propia (teal #1A9E94 / #1FB3A7 sobre negro #0E0E0E) endosada por el
 * sello "by AGROINCOL". Colores aislados en valores arbitrarios para no contaminar
 * los tokens del sitio principal (verde/naranja AGROINCOL).
 */

const surfaces = [
  { icon: BedDouble, label: 'Colchones' },
  { icon: Sofa, label: 'Sofás y sillas' },
  { icon: Droplets, label: 'Tapizados' },
];

export default function AlivioTeaser() {
  return (
    <section
      aria-labelledby="alivio-heading"
      className="section-padding bg-brand-light"
    >
      <div className="container-custom">
        <div className="reveal relative overflow-hidden rounded-3xl bg-[#0E0E0E] px-6 py-12 md:px-12 md:py-16 shadow-premium">
          {/* Glow teal — atmósfera de frescura/descanso */}
          <div
            className="glow-pulse pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#1FB3A7] opacity-40 blur-[110px]"
            aria-hidden
          />
          <div
            className="glow-pulse pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#1A9E94] opacity-25 blur-[120px]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-20" aria-hidden />

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Columna texto */}
            <div>
              {/* Eyebrow + sello de endoso */}
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#1FB3A7]/40 bg-[#1FB3A7]/10 px-3 py-1 font-heading text-body-sm font-semibold uppercase tracking-[0.14em] text-[#1FB3A7]">
                  <Sparkles size={14} aria-hidden /> Nueva línea
                </span>
                <span className="text-body-sm font-semibold text-white/55">
                  by <span className="text-white/80">AGROINCOL</span> · 40 años de respaldo
                </span>
              </div>

              {/* Wordmark Alivio */}
              <h2 id="alivio-heading" className="mt-5">
                <span className="block font-serif text-5xl md:text-6xl font-semibold leading-none tracking-tight text-white">
                  Alivio
                </span>
                <span className="mt-3 block font-serif text-2xl md:text-3xl font-medium italic text-[#1FB3A7]">
                  Renovamos tu descanso.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-body-lg text-white/70">
                Lavado y desinfección profesional de muebles, colchones, sillas y tapizados,
                a domicilio en Bucaramanga y el área metropolitana. No solo limpiamos:
                desinfectamos y eliminamos ácaros, chinches y alérgenos.
              </p>

              {/* Diferenciador */}
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {[
                  { icon: ShieldCheck, text: 'Desinfección, no solo limpieza' },
                  { icon: Droplets, text: 'Elimina ácaros y alérgenos' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2 text-body-sm font-semibold text-white/85">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1FB3A7]/15 text-[#1FB3A7]">
                      <Icon size={16} aria-hidden />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>

              {/* CTA — <a> obligatorio para cruzar de zona */}
              <div className="mt-8">
                <a
                  href="/alivio"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A9E94] px-7 py-3.5 font-heading font-semibold text-white shadow-[0_14px_40px_-12px_rgba(26,158,148,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1FB3A7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1FB3A7]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E]"
                >
                  Conoce Alivio
                  <ArrowRight size={18} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Columna visual — tarjetas glass de superficies tratadas */}
            <div className="relative" aria-hidden>
              <div className="relative mx-auto grid max-w-md grid-cols-2 gap-4">
                {/* Tarjeta destacada */}
                <div className="col-span-2 flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A9E94] to-[#0f6b64] px-5 py-5 shadow-card">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                    <Sparkles size={24} />
                  </span>
                  <div>
                    <p className="font-serif text-xl font-semibold text-white">Como nuevo, otra vez</p>
                    <p className="text-body-sm text-white/75">Frescura e higiene profunda a domicilio</p>
                  </div>
                </div>

                {/* Superficies */}
                {surfaces.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-sm"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3F1]/10 text-[#1FB3A7]">
                      <Icon size={22} />
                    </span>
                    <span className="text-body-sm font-semibold text-white/85">{label}</span>
                  </div>
                ))}

                {/* Tarjeta sello */}
                <div className="flex flex-col justify-center gap-1 rounded-2xl border border-[#1FB3A7]/30 bg-[#1FB3A7]/[0.08] px-5 py-5">
                  <span className="font-serif text-2xl font-semibold leading-none text-white">Alivio</span>
                  <span className="text-body-sm font-semibold text-[#1FB3A7]">by AGROINCOL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
