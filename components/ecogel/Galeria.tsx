import Marcador from './Marcador';
import { GARANTIA } from '@/lib/ecogel';

// Sección 3 de Lummia: foto grande con sello de garantía encima y miniaturas.
// Sin carrusel con JavaScript: en móvil el 90 % no pasa de la primera foto y el
// resto de encuadres está justo debajo, en el orden en que importan.

export interface FotosEcogel {
  enUso?: string;
  producto?: string;
  antes?: string;
  despues?: string;
  equipo?: string;
}

export default function Galeria({ fotos }: { fotos: FotosEcogel }) {
  return (
    <section className="container-custom pt-4">
      <div className="relative">
        <Marcador
          etiqueta="Gel aplicándose en la rendija de una cocina"
          medidas="1200×1200"
          src={fotos.enUso}
          alt="Aplicación de EcoGel en una rendija de cocina"
          prioridad
        />
        <div className="absolute right-3 top-3 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-brand-orange text-center text-white shadow-brand">
          <span className="font-heading text-2xl font-bold leading-none">{GARANTIA.dias}</span>
          <span className="text-[10px] font-semibold uppercase leading-tight">días de garantía</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        <Marcador etiqueta="Jeringa" medidas="600×600" src={fotos.producto} alt="Jeringa EcoGel" className="!rounded-xl" />
        <Marcador etiqueta="Antes" medidas="600×600" src={fotos.antes} alt="Cocina antes" className="!rounded-xl" />
        <Marcador etiqueta="Después" medidas="600×600" src={fotos.despues} alt="Cocina después" className="!rounded-xl" />
        <Marcador etiqueta="Equipo" medidas="600×600" src={fotos.equipo} alt="Técnico de AGROINCOL aplicando" className="!rounded-xl" />
      </div>
    </section>
  );
}
