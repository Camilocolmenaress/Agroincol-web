import { Plus } from 'lucide-react';

// Preguntas frecuentes con <details>/<summary>: sin JavaScript, el contenido siempre en el HTML y
// abrible con teclado. Reemplaza los FAQAccordion de cada página (que ahora solo reexportan esto).
export default function PreguntasDetalles({ faqs }: { faqs: ReadonlyArray<{ question: string; answer: string }> }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group rounded-[24px] border border-marca-verde/15 bg-white px-5 py-4 transition-colors open:bg-marca-menta/40 md:px-6 md:py-5 [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4 font-heading font-semibold text-marca-letra">
            <span>{faq.question}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-marca-verde text-white transition-transform duration-300 group-open:rotate-45">
              <Plus size={16} aria-hidden />
            </span>
          </summary>
          <p className="mt-3 text-body text-brand-gray text-pretty">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
