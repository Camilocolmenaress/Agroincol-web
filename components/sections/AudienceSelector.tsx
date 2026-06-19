import Link from 'next/link';
import { Home, UtensilsCrossed, Factory } from 'lucide-react';

// Segmentación por público: cada visitante encuentra "su" mensaje y su miedo.
// El mayor salto de relevancia para un negocio multi-público como AGROINCOL.
const audiences = [
  {
    icon: Home,
    label: 'Mi hogar',
    pain: 'Cucarachas, roedores o zancudos. Productos seguros para niños y mascotas.',
    cta: 'Proteger mi casa',
    href: '/servicios/fumigacion-residencial',
  },
  {
    icon: UtensilsCrossed,
    label: 'Mi restaurante',
    pain: 'Cumpla el INVIMA y evite multas. Certificado válido el mismo día.',
    cta: 'Cumplir con INVIMA',
    href: '/servicios/fumigacion-restaurantes',
    featured: true,
  },
  {
    icon: Factory,
    label: 'Mi empresa o industria',
    pain: 'Bodegas y plantas. Documentación lista para auditorías e ISO.',
    cta: 'Proteger mi operación',
    href: '/servicios/fumigacion-industrial',
  },
];

export default function AudienceSelector() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-custom">
        <div className="reveal text-center mb-10">
          <span className="eyebrow">Soluciones a su medida</span>
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-3">
            ¿Qué necesita proteger?
          </h2>
          <p className="text-brand-gray text-body-lg mt-3 max-w-2xl mx-auto text-pretty">
            Elija su caso y vea exactamente cómo lo resolvemos.
          </p>
        </div>
        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-5">
          {audiences.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                href={a.href}
                className={`group relative flex flex-col rounded-2xl bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover ${
                  a.featured ? 'border-animated' : 'border border-brand-gray-light/70 hover:border-brand-orange/30'
                }`}
              >
                {a.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-orange-gradient px-3 py-1 text-xs font-heading font-bold text-white shadow-brand ring-1 ring-white/20">
                    Más solicitado
                  </span>
                )}
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-gradient shadow-brand transition-transform duration-300 group-hover:scale-110">
                  <Icon size={26} className="text-white" />
                </span>
                <h3 className="font-heading font-semibold text-h3 text-brand-green mt-5">{a.label}</h3>
                <p className="text-brand-gray text-body mt-2 flex-1 text-pretty">{a.pain}</p>
                <span className="text-brand-orange font-semibold mt-5 inline-flex items-center gap-1.5">
                  {a.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
