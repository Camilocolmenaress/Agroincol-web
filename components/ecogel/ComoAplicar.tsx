import { Ban, Droplet, Grid3x3, MapPin, ShieldCheck } from 'lucide-react';

// Los anuncios prometen "mira cómo llegar al nido en 10 minutos": esta sección
// lo cumple con texto, al lado de los videos. El ancla #como-aplicar es el
// destino de los anuncios; no cambiarla sin actualizar las URLs en Meta.
const PASOS = [
  { Icono: Droplet, titulo: 'Puntos pequeños', texto: 'del tamaño de una lenteja.' },
  {
    Icono: MapPin,
    titulo: 'Donde se esconden',
    texto: 'detrás de la nevera, debajo del lavaplatos y en las bisagras de los gabinetes.',
  },
  { Icono: Grid3x3, titulo: 'Varios puntos, no uno grande', texto: 'de 20 a 30 puntos para una cocina.' },
  { Icono: Ban, titulo: 'No limpies encima de los puntos.' },
];

// En /gracias la línea de tiempo ya cuenta "qué va a pasar": ahí se omite.
export default function ComoAplicar({ conQueEsperar = true }: { conQueEsperar?: boolean }) {
  return (
    <section id="como-aplicar" className="container-custom mt-10 scroll-mt-4">
      <h2 className="font-heading text-h2-mobile text-brand-green text-balance md:text-h2">Así se aplica en 10 minutos.</h2>
      <p className="mt-1 text-body text-brand-black/70">Unos puntos de gel donde se esconden. Ellas hacen el resto.</p>

      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {PASOS.map(({ Icono, titulo, texto }, i) => (
          <li key={titulo} className="flex items-start gap-3 rounded-2xl border border-brand-gray-light bg-white p-4">
            <div className="relative flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-green text-white">
              <Icono size={20} aria-hidden />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[11px] font-bold leading-none">
                {i + 1}
              </span>
            </div>
            <p className="text-body-sm text-brand-black/75">
              <span className="font-heading text-body font-bold text-brand-green">{titulo}</span>
              {texto && <>: {texto}</>}
            </p>
          </li>
        ))}
      </ol>

      {conQueEsperar && (
        <div className="mt-4 rounded-2xl bg-brand-mint p-5">
          <h3 className="font-heading text-body font-bold text-brand-green">Qué va a pasar</h3>
          <ul className="mt-3 space-y-3 text-body-sm text-brand-black/80">
            <li>
              <strong className="text-brand-green">Primeras 24 a 48 horas:</strong> vas a ver{' '}
              <strong className="text-brand-orange">MÁS</strong> cucarachas de lo normal. Es buena señal: están saliendo a
              comerse el gel.
            </li>
            <li>
              <strong className="text-brand-green">Después de 48 horas:</strong> empiezan a desaparecer, porque lo llevan al
              nido y lo comparten con el resto.
            </li>
          </ul>
        </div>
      )}

      <p className="mt-3 flex items-start gap-2 text-body-sm text-brand-black/70">
        <ShieldCheck size={18} className="mt-0.5 flex-none text-brand-green" aria-hidden />
        Aplícalo donde no lleguen niños ni mascotas, siguiendo las instrucciones de la etiqueta.
      </p>
    </section>
  );
}
