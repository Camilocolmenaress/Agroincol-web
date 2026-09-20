import { ChevronDown } from 'lucide-react';
import type { Pregunta } from '@/lib/ecogel';

export default function Objeciones({ objeciones }: { objeciones: Pregunta[] }) {
  return (
    <section className="container-custom mt-10">
      <div className="space-y-2">
        {objeciones.map((o, i) => (
          <details key={o.pregunta} open={i === 0} className="group rounded-xl border border-brand-gray-light bg-white px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading text-body font-semibold text-brand-green">
              {o.pregunta}
              <ChevronDown size={18} className="flex-none text-brand-orange transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="text-brand-black/75 text-body-sm mt-2">{o.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
