import Link from 'next/link';
import { Clock, Phone, Star } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/lib/constants';
import Objeto from './Objeto';
import { OBJETOS, profundidad } from './objetos';

// Lema oficial del manual. Aquí va solo como adorno (aria-hidden): el texto real aparece una
// vez en la sección <Lema/> más abajo.
const LEMA_ANILLO = 'LAS PLAGAS SE VAN · LA TRANQUILIDAD SE QUEDA · ';

// Ángulos iniciales del desfile sobre el arco del aro (0° = arriba). Los objetos van a los
// costados del H1 y, al bajar, el aro los hace girar (components/recorrido/Movimiento.tsx).
function angulos(n: number) {
  if (n === 1) return [-48];
  return Array.from({ length: n }, (_, i) => -64 + (i * 128) / (n - 1));
}


// Entrada de la primera visita de la sesión. Corre antes del primer pintado y solo marca el
// <html>; la animación es CSS, va detrás del contenido y nunca toca el H1 ni los botones.
const SCRIPT_ENTRADA = `try{if(!sessionStorage.getItem('ag_entrada')){document.documentElement.setAttribute('data-entrada','');sessionStorage.setItem('ag_entrada','1')}}catch(e){}`;

function Anillo() {
  return (
    <svg viewBox="0 0 1000 1000" className="aro-anillo absolute inset-0 h-full w-full" aria-hidden focusable="false">
      <defs>
        <path id="aro-trazo" d="M 500,500 m -462,0 a 462,462 0 1,1 924,0 a 462,462 0 1,1 -924,0" />
      </defs>
      {/* Arco naranja: el acento del logo, girando con el lema (no es el logo: sin hoja ni aro completo). */}
      {/* Contorno que se dibuja en la entrada (pathLength=1: el trazo va de 0 a 1 sin medir). */}
      <circle cx="500" cy="500" r="497" fill="none" className="aro-contorno stroke-marca-menta/40" strokeWidth="3" pathLength={1} />
      <path
        d="M 41.4,333.1 A 488,488 0 0 1 220.1,100.2"
        fill="none"
        stroke="#F5682E"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <text className="fill-marca-naranja font-display" fontSize="31" letterSpacing="3">
        <textPath href="#aro-trazo" textLength="2890" lengthAdjust="spacing">
          {LEMA_ANILLO.repeat(3)}
        </textPath>
      </text>
    </svg>
  );
}

// Hojas y puntos de gel planos de la entrada: caen desde los bordes, detrás del aro.
function Entrada() {
  // x/y = posición de reposo: quedan como adorno en el blanco alrededor del aro.
  const piezas = [
    { t: 'hoja', x: '5%', y: '16%', r: -30, d: 0 },
    { t: 'gel', x: '13%', y: '9%', r: 0, d: 0.12 },
    { t: 'hoja', x: '90%', y: '12%', r: 40, d: 0.05 },
    { t: 'gel', x: '95%', y: '22%', r: 0, d: 0.2 },
    { t: 'hoja', x: '19%', y: '4%', r: 15, d: 0.28 },
    { t: 'gel', x: '80%', y: '5%', r: 0, d: 0.34 },
  ];
  return (
    <div className="entrada pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <span className="entrada-barrido absolute -left-1/4 top-0 h-[140%] w-[150%] rounded-full border-[18px] border-marca-naranja/90 border-b-transparent border-l-transparent" />
      {piezas.map((p, i) => (
        <span
          key={i}
          className="entrada-pieza absolute"
          style={{ left: p.x, top: p.y, ['--r' as string]: `${p.r}deg`, animationDelay: `${p.d}s` }}
        >
          {p.t === 'hoja' ? (
            <svg viewBox="0 0 40 60" className="h-12 w-8">
              <path d="M20 2C34 16 38 38 20 58 2 38 6 16 20 2Z" className="fill-marca-verde" />
              <path d="M20 8v46" className="stroke-marca-menta" strokeWidth="2" fill="none" />
            </svg>
          ) : (
            <span className="block h-4 w-4 rounded-full bg-marca-naranja" />
          )}
        </span>
      ))}
    </div>
  );
}

export default function HeroRecorrido() {
  const objetos = OBJETOS;
  const as = angulos(objetos.length);
  return (
    <section className="hero-recorrido relative isolate overflow-hidden bg-white pt-[72px] md:pt-[88px]">
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_ENTRADA }} />
      <Entrada />

      {/* El aro: elemento gráfico derivado del aro del logo (como el patrón Arcos), no el logo. */}
      <div className="aro absolute left-1/2 z-[1] -translate-x-1/2 rounded-full bg-marca-verde" aria-hidden>
        {/* La máscara (quieta) deja ver el lema solo en la mitad de arriba; el anillo gira por dentro. */}
        <div className="aro-mascara absolute inset-0">
          <div className="aro-giro absolute inset-0">
            <Anillo />
          </div>
        </div>
      </div>
      {/* Debajo del centro del aro todo es verde: empalma con la cinta sin mostrar la curva de abajo. */}
      <div className="aro-base absolute inset-x-0 bottom-0 z-[1] bg-marca-verde" aria-hidden />

      {/* Desfile de objetos 3D: sobre el arco en escritorio, carrusel con scroll-snap en celular. */}
      <div className="desfile-orbita z-[2]">
        <ul className="desfile-lista">
          {objetos.map((o, i) => {
            const { escala, desenfoque } = profundidad(as[i]);
            return (
              <li
                key={o.id}
                className="desfile-objeto"
                style={{ ['--a' as string]: `${as[i]}deg`, ['--s' as string]: escala, ['--b' as string]: `${desenfoque}px` }}
              >
                <Link href={o.href} data-cursor="Ver servicio" className="desfile-enlace block">
                  <Objeto objeto={o} sizes="(min-width: 1024px) 240px, 45vw" className="h-auto w-full" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hero-contenido container-custom relative z-[3] flex flex-col items-center text-center">
        <Badge icon={<Clock size={16} />}>Respondemos por WhatsApp en menos de 5 minutos</Badge>
        <h1 className="mt-6 max-w-[17ch] text-balance text-[clamp(2.4rem,6.2vw,5rem)] uppercase leading-[0.95] tracking-[-0.02em] text-white">
          Fumigación y Control de Plagas en Bucaramanga
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-body-lg text-white/80">
          Más de 40 años protegiendo hogares, restaurantes e industrias en Bucaramanga, Floridablanca, Piedecuesta y Girón.
        </p>
        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <span data-cursor="WhatsApp" className="w-full sm:w-auto">
            <Button variant="primary" href={BUSINESS.whatsappLink} fullWidth>
              Cotizar por WhatsApp
            </Button>
          </span>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-heading font-semibold text-white ring-2 ring-white/40 transition-colors hover:bg-white hover:text-marca-verde sm:w-auto"
          >
            <Phone size={18} aria-hidden /> Llamar ahora
          </a>
        </div>
        <a
          href={BUSINESS.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20 transition-colors hover:bg-white/15"
        >
          <span className="flex items-center gap-0.5 text-marca-naranja">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="fill-current" aria-hidden />
            ))}
          </span>
          <span className="text-body-sm font-semibold text-white">{BUSINESS.googleRating}</span>
          <span className="text-body-sm text-white/75">· {BUSINESS.googleReviewCount} reseñas en Google</span>
        </a>
        <span className="hero-baje mt-10 hidden items-center gap-2 font-display text-[0.7rem] uppercase tracking-[0.2em] text-white/70 md:inline-flex" aria-hidden>
          <span className="hero-baje-punto h-1.5 w-1.5 rounded-full bg-marca-naranja" />
          Baje para descubrir
        </span>
      </div>
    </section>
  );
}
