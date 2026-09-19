export default function Beneficios({ bloques }: { bloques: { titulo: string; texto: string }[] }) {
  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">Lo que el gel hace por ti</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {bloques.map((b) => (
          <div key={b.titulo} className="rounded-2xl bg-brand-light p-5">
            <h3 className="font-heading text-body font-bold text-brand-green">{b.titulo}</h3>
            <p className="text-brand-black/75 text-body-sm mt-2">{b.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
