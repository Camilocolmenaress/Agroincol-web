import Marcador from './Marcador';

export default function AntesDespues({ antes, despues }: { antes?: string; despues?: string }) {
  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green text-balance md:text-h2">
        Esto es lo que pasa cuando dejas el aerosol y aplicas el gel
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <Marcador etiqueta="Antes" medidas="800×1000" ratio="portrait" src={antes} alt="Cocina con cucarachas, antes" />
          <p className="mt-1 text-center text-body-sm font-semibold text-brand-black/70">Antes</p>
        </div>
        <div>
          <Marcador etiqueta="Después (día 7)" medidas="800×1000" ratio="portrait" src={despues} alt="La misma cocina, día 7" />
          <p className="mt-1 text-center text-body-sm font-semibold text-brand-black/70">Después · día 7</p>
        </div>
      </div>
    </section>
  );
}
