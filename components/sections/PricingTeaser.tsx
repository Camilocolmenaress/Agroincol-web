import Link from 'next/link';
import { Calculator, ArrowRight } from 'lucide-react';

// "Desde $X" califica leads y filtra curiosos antes del contacto.
const tiers = [
  { label: 'Hogares', from: '$140.000', detail: 'Servicio puntual · IVA incluido' },
  { label: 'Negocios y restaurantes', from: '$80.000', detail: 'Desde / mes · Certificado INVIMA' },
];

export default function PricingTeaser() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="reveal rounded-3xl border border-brand-gray-light/70 bg-white p-8 md:p-12 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="eyebrow">Precios claros</span>
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-3">
                Sin sorpresas ni letra pequeña
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {tiers.map((t) => (
                  <div
                    key={t.label}
                    className="rounded-2xl border border-brand-gray-light/70 bg-brand-cream/60 p-5"
                  >
                    <p className="font-heading font-semibold text-brand-green text-body">{t.label}</p>
                    <p className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-brand-gray text-body-sm">desde</span>
                      <span className="font-heading text-3xl md:text-4xl font-bold text-brand-green">{t.from}</span>
                    </p>
                    <p className="text-brand-gray text-xs mt-1.5">{t.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
              <Link
                href="/precios"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-gradient px-6 py-3 font-heading font-semibold text-white shadow-brand transition-all duration-300 hover:-translate-y-0.5 hover:shadow-brand-lg"
              >
                Ver todos los planes <ArrowRight size={18} />
              </Link>
              <Link
                href="/herramientas/calculadora-fumigacion"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-green px-6 py-3 font-heading font-semibold text-brand-green transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-green hover:text-white"
              >
                <Calculator size={18} /> Calcular mi caso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
