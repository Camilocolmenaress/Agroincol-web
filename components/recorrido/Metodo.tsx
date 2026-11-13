// "Cómo trabajamos" (antes HomeProcess): mismos textos. La forma es la ficha de producto de la
// referencia: texto centrado entre puntos de gel y una tabla de tres columnas con filetes.
// (Las columnas "Frecuencia" y "Garantía" esperan el texto aprobado: ver plan-fases.md.)
const pasos = [
  {
    titulo: 'Diagnóstico gratis',
    texto: 'Inspeccionamos su espacio, identificamos la plaga y le damos una cotización clara, sin compromiso.',
  },
  {
    titulo: 'Tratamiento certificado',
    texto: 'Técnicos capacitados aplican productos registrados ante el ICA y aprobados por la OMS, seguros para su familia.',
  },
  {
    titulo: 'Certificado y garantía',
    texto: 'Entregamos certificado válido ante INVIMA/Secretaría de Salud y respondemos sin costo si la plaga vuelve.',
  },
];

export default function Metodo() {
  return (
    <section className="bg-marca-menta py-20 md:py-28">
      <div className="container-custom">
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow">Cómo trabajamos</span>
          <span className="punto-gel mt-8" aria-hidden />
          <h2 className="mt-8 max-w-[16ch] text-balance font-display text-[clamp(2.2rem,5.5vw,4.25rem)] uppercase leading-[0.95] tracking-[-0.025em] text-marca-verde">
            Simple, profesional y con respaldo
          </h2>
          <span className="punto-gel mt-8" aria-hidden />
        </div>

        <ol className="mx-auto mt-12 grid max-w-5xl border-t border-marca-verde/20 md:mt-16 md:grid-cols-3">
          {pasos.map((p, i) => (
            <li
              key={p.titulo}
              className="border-b border-marca-verde/20 py-8 md:border-b-0 md:px-8 md:py-10 md:[&:not(:first-child)]:border-l"
            >
              <span className="font-display text-sm uppercase tracking-[0.18em] text-marca-letra/60" aria-hidden>
                0{i + 1}
              </span>
              <h3 className="mt-3 font-display text-xl uppercase tracking-[0.02em] text-marca-verde">{p.titulo}</h3>
              <p className="mt-3 text-body text-brand-gray text-pretty">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
