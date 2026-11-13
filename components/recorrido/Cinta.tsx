import { Shield, Award, Clock, MapPin } from 'lucide-react';
import Contador from './Contador';

// Barra de confianza del home como cinta continua sobre el verde del aro. El texto va una vez;
// la copia que cierra el bucle es aria-hidden (no se lee dos veces).
const items = [
  { icon: Shield, texto: <><Contador valor={40} />+ Años de Experiencia</> },
  { icon: Award, texto: 'Certificación Vigente' },
  { icon: Clock, texto: 'Respuesta < 5 Minutos' },
  { icon: MapPin, texto: 'Área Metropolitana de Bucaramanga' },
];

function Pista({ copia = false }: { copia?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={copia || undefined}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <li key={i} className="flex items-center gap-3 px-6 md:px-8">
            <Icon size={20} className="shrink-0 text-marca-naranja" aria-hidden />
            <span className="whitespace-nowrap font-display text-[0.95rem] uppercase tracking-[0.06em] text-white md:text-base">
              {copia && i === 0 ? '40+ Años de Experiencia' : item.texto}
            </span>
            <span className="punto-gel ml-6 md:ml-8" aria-hidden />
          </li>
        );
      })}
    </ul>
  );
}

export default function Cinta() {
  return (
    <section className="marquee-wrap overflow-hidden border-y border-white/10 bg-marca-verde py-5">
      <div className="animate-marquee flex w-max">
        <Pista />
        <Pista copia />
      </div>
    </section>
  );
}
