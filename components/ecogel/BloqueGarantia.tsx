import { ShieldCheck } from 'lucide-react';
import { GARANTIA } from '@/lib/ecogel';

// El bloque rosa de Lummia ("Resultados en 90 días o devolvemos tu dinero"),
// con la garantía nacional: reposición, no devolución.
export default function BloqueGarantia() {
  return (
    <section className="container-custom mt-5">
      <div className="flex items-start gap-4 rounded-2xl bg-brand-orange/10 p-4">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-brand-orange text-white">
          <ShieldCheck size={28} aria-hidden />
        </div>
        <div>
          <h2 className="font-heading text-body font-bold text-brand-green">{GARANTIA.titulo}</h2>
          <p className="text-brand-black/70 text-body-sm mt-1">{GARANTIA.texto}</p>
        </div>
      </div>
    </section>
  );
}
