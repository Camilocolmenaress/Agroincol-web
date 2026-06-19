import { Search, SprayCan, ShieldCheck } from 'lucide-react';

// "Cómo trabajamos" genérico para el home: 3 pasos que bajan la ansiedad
// antes de pedir el contacto (qué pasa, en qué orden, qué reciben).
const steps = [
  {
    icon: Search,
    title: 'Diagnóstico gratis',
    description: 'Inspeccionamos su espacio, identificamos la plaga y le damos una cotización clara, sin compromiso.',
  },
  {
    icon: SprayCan,
    title: 'Tratamiento certificado',
    description: 'Técnicos capacitados aplican productos registrados ante el ICA y aprobados por la OMS, seguros para su familia.',
  },
  {
    icon: ShieldCheck,
    title: 'Certificado y garantía',
    description: 'Entregamos certificado válido ante INVIMA/Secretaría de Salud y respondemos sin costo si la plaga vuelve.',
  },
];

export default function HomeProcess() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="reveal text-center mb-12">
          <span className="eyebrow">Cómo trabajamos</span>
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-3">
            Simple, profesional y con respaldo
          </h2>
        </div>
        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-brand-gray-light/70 bg-white p-7 shadow-card"
              >
                <span className="absolute -top-4 right-6 font-heading text-5xl font-bold text-brand-orange/15">
                  0{i + 1}
                </span>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-soft">
                  <Icon size={26} className="text-brand-orange" />
                </span>
                <h3 className="font-heading font-semibold text-h3 text-brand-green mt-5">{step.title}</h3>
                <p className="text-brand-gray text-body mt-2 text-pretty">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
