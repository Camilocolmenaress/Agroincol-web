import { GARANTIA, whatsappEcogel } from '@/lib/ecogel';

export default function SinRiesgo() {
  return (
    <section className="container-custom mt-10">
      <div className="rounded-2xl bg-brand-light p-6">
        <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">Pruébalo sin riesgo</h2>
        <p className="mt-2 text-body text-brand-black/80">{GARANTIA.titulo}.</p>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-body-sm text-brand-black/75">
          <li>Aplicas el gel siguiendo la guía que llega con el pedido.</li>
          <li>Si a los {GARANTIA.dias} días siguen apareciendo, nos mandas una foto por WhatsApp.</li>
          <li>Te despachamos otro kit sin costo. Sin devoluciones ni formularios.</li>
        </ol>
        <a href={whatsappEcogel('Hola, quiero saber cómo funciona la garantía de EcoGel')} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-body-sm font-semibold text-brand-green underline underline-offset-2">
          Preguntar por la garantía
        </a>
      </div>
    </section>
  );
}
