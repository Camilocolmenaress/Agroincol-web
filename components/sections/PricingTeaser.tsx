import Link from 'next/link';
import { Calculator, ArrowRight } from 'lucide-react';

// "Desde $X" califica leads y filtra curiosos antes del contacto.
const tiers = [
  { label: 'Hogares', from: '$90.000', detail: 'servicio puntual · IVA incl.' },
  { label: 'Negocios y restaurantes', from: '$80.000', detail: '/mes · certificado INVIMA' },
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
              <div className="flex flex-wrap gap-6 mt-6">
                {tiers.map((t) => (
                  <div key={t.label}>
                    <p className="text-brand-gray text-body-sm">{t.label}</p>
                    <p className="font-heading text-brand-green">
                      <span className="text-brand-gray text-body-sm">desde </span>
                      <span className="text-3xl md:text-4xl font-bold">{t.from}</span>
                    </p>
                    <p className="text-brand-gray text-xs mt-0.5">{t.detail}</p>
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
