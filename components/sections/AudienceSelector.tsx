import Link from 'next/link';
import { Home, UtensilsCrossed, Factory } from 'lucide-react';
import Carousel from '@/components/ui/Carousel';

type Audience = {
  icon: typeof Home;
  label: string;
  pain: string;
  cta: string;
  href: string;
  featured?: boolean;
};

function AudienceCard({ a }: { a: Audience }) {
  const Icon = a.icon;
  return (
    <Link
      href={a.href}
      className={`group relative flex h-full flex-col rounded-2xl bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover ${
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
}

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
        {/* Móvil: carrusel auto-rotando, centrado, con puntos. */}
        <div className="reveal md:hidden">
          <Carousel
            autoPlay
            align="center"
            controls="dots"
            itemClassName="basis-[88%]"
            ariaLabel="¿Qué necesita proteger?"
          >
            {audiences.map((a) => (
              <AudienceCard key={a.label} a={a} />
            ))}
          </Carousel>
        </div>

        {/* Desktop: las 3 visibles en grilla (no se esconde ninguna opción). */}
        <div className="reveal hidden md:grid grid-cols-3 gap-5 pt-3">
          {audiences.map((a) => (
            <AudienceCard key={a.label} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
