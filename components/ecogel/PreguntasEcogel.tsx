import { ChevronDown } from 'lucide-react';
import type { Pregunta } from '@/lib/ecogel';

export default function PreguntasEcogel({ preguntas }: { preguntas: Pregunta[] }) {
  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">Preguntas frecuentes</h2>
      <div className="mt-5 space-y-2">
        {preguntas.map((p) => (
          <details key={p.pregunta} className="group rounded-xl bg-white px-4 py-3 shadow-soft">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading text-body font-semibold text-brand-green">
              {p.pregunta}
              <ChevronDown size={18} className="flex-none text-brand-orange transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="text-brand-black/75 text-body-sm mt-2">{p.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
