import { ChevronDown } from 'lucide-react';
import type { LandingConfig } from '@/lib/landing';

// Acordeón con <details>: accesible y sin una línea de JavaScript de cliente.
// Va al final, como en las landings que llevan años pagando — arriba compite con la conversión.

export default function LandingFAQ({ config }: { config: LandingConfig }) {
  return (
    <section className="section-padding bg-brand-light">
      <div className="container-custom max-w-3xl">
        <span className="eyebrow">Preguntas frecuentes</span>
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-3">
          Lo que más nos preguntan
        </h2>

        <div className="mt-7 space-y-3">
          {config.faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl bg-white px-5 py-4 shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading font-semibold text-brand-green">
                {faq.question}
                <ChevronDown
                  size={20}
                  className="flex-none text-brand-orange transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="text-brand-black/75 text-body-sm mt-3">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
