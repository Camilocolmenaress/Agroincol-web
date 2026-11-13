import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

// FAQ de objeciones del home — zero-JS (<details>/<summary>) para no sumar
// JavaScript ni afectar INP. Responde las dudas que frenan la conversión.
const faqs = [
  {
    q: '¿Es seguro para niños y mascotas?',
    a: 'Sí. Usamos productos registrados ante el ICA y aprobados por la OMS, de baja toxicidad para humanos y animales. Le indicamos cuánto tiempo ventilar antes de volver al área tratada.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Depende del tipo de propiedad, el tamaño, la plaga y si es un servicio puntual o un programa recurrente. Escríbanos con su caso y le enviamos la cotización el mismo día, gratis y sin compromiso.',
  },
  {
    q: '¿Entregan certificado de fumigación?',
    a: 'Sí, el mismo día. Es válido ante el INVIMA y la Secretaría de Salud de Santander conforme al Decreto 1843 de 1991 — sirve para auditorías, conjuntos residenciales y arrendadores.',
  },
  {
    q: '¿Qué pasa si la plaga vuelve?',
    a: 'Nuestros planes incluyen garantía: si la plaga reaparece entre visitas, volvemos sin costo dentro del período acordado. Respondemos en menos de 24 horas.',
  },
  {
    q: '¿En qué zonas atienden y qué tan rápido?',
    a: 'Bucaramanga, Floridablanca, Piedecuesta y Girón. Escríbanos por WhatsApp: respondemos en menos de 5 minutos y, desde nuestra sede en Floridablanca, coordinamos la visita el mismo día en el Área Metropolitana.',
  },
];

export default function HomeFAQ() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-custom max-w-3xl">
        <div className="reveal text-center mb-10">
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.6rem)] uppercase leading-[0.95] tracking-[-0.025em] text-marca-verde text-balance">
            Lo que suelen preguntarnos antes de contratar
          </h2>
        </div>
        <div className="reveal space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-[24px] border border-marca-verde/15 bg-white p-5 transition-colors open:bg-marca-menta/40 md:p-6 [&_summary]:list-none"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-heading font-semibold text-brand-green">
                {f.q}
                <ChevronDown
                  size={20}
                  className="shrink-0 text-marca-verde transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="text-brand-gray text-body mt-3 text-pretty">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="reveal text-center text-brand-gray text-body mt-8">
          ¿Otra duda?{' '}
          <Link href="#contacto" className="font-semibold text-marca-verde underline decoration-marca-naranja decoration-2 underline-offset-4 hover:text-marca-letra">
            Escríbanos y le respondemos hoy →
          </Link>
        </p>
      </div>
    </section>
  );
}
