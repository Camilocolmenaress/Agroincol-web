import Link from 'next/link';
import { Clock, Phone, Star } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/lib/constants';
import Objeto from './Objeto';
import { OBJETOS, profundidad, PASO_DESFILE } from './objetos';

// Hero del recorrido, medido contra agrumeafarm.it (docs/rediseno/referencia-agrumea):
// - el aro ocupa ~3/4 del ancho y empieza a media pantalla; sobre su borde solo va el lema;
// - los objetos 3D son grandes y desfilan por un arco por encima del aro;
// - dentro del verde, solo lo obligatorio: el H1 y los botones (WhatsApp desde el primer pintado).
// La píldora y el párrafo conservan su texto y bajan justo después del primer pantallazo.

// Lema oficial. En el aro va como adorno (aria-hidden); el texto real aparece una vez en <Lema/>.
const LEMA_ANILLO = 'LAS PLAGAS SE VAN · LA TRANQUILIDAD SE QUEDA · ';

// Entrada de la primera visita de la sesión: marca el <html> antes del primer pintado; la
// animación es CSS, ocurre detrás del contenido y nunca toca el H1 ni los botones.
const SCRIPT_ENTRADA = `try{if(!sessionStorage.getItem('ag_entrada')){document.documentElement.setAttribute('data-entrada','');sessionStorage.setItem('ag_entrada','1')}}catch(e){}`;

function Anillo() {
  return (
    <svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
      <defs>
        <path id="aro-trazo" d="M 500,500 m -448,0 a 448,448 0 1,1 896,0 a 448,448 0 1,1 -896,0" />
      </defs>
      {/* Contorno que se dibuja en la entrada (pathLength=1). */}
      <circle cx="500" cy="500" r="497" fill="none" className="aro-contorno stroke-marca-menta/50" strokeWidth="3" pathLength={1} />
      {/* Arco naranja: acento derivado del logo (sin hoja ni aro completo), gira con el lema. */}
      <path d="M 51.5,327.4 A 485,485 0 0 1 222.8,103.1" fill="none" stroke="#F5682E" strokeWidth="12" strokeLinecap="round" />
      <text className="fill-marca-naranja font-display" fontSize="50" letterSpacing="2">
        <textPath href="#aro-trazo" textLength="2800" lengthAdjust="spacing">
          {LEMA_ANILLO.repeat(2)}
        </textPath>
      </text>
    </svg>
  );
}

// Hojas y gotas de gel planas que caen desde los bordes y salen por abajo, detrás del aro.
// No quedan regadas: al terminar no hay nada en pantalla.
function Entrada() {
  const piezas = [
    { t: 'hoja', x: '4%', r: -30, d: 0 },
    { t: 'gel', x: '11%', r: 0, d: 0.1 },
    { t: 'hoja', x: '19%', r: 25, d: 0.22 },
    { t: 'gel', x: '78%', r: 0, d: 0.06 },
    { t: 'hoja', x: '86%', r: 40, d: 0.16 },
    { t: 'gel', x: '94%', r: 0, d: 0.3 },
    { t: 'hoja', x: '30%', r: -15, d: 0.34 },
    { t: 'gel', x: '68%', r: 0, d: 0.26 },
  ];
  return (
    <div className="entrada pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <span className="entrada-barrido absolute left-1/2 top-[55%] aspect-square w-[160vmax] -translate-x-1/2 rounded-full border-[2.2vmax] border-marca-naranja border-b-transparent border-l-transparent" />
      {piezas.map((p, i) => (
        <span key={i} className="entrada-pieza absolute -top-24" style={{ left: p.x, ['--r' as string]: `${p.r}deg`, animationDelay: `${p.d}s` }}>
          {p.t === 'hoja' ? (
            <svg viewBox="0 0 40 60" className="h-16 w-11">
              <path d="M20 2C34 16 38 38 20 58 2 38 6 16 20 2Z" className="fill-marca-verde" />
              <path d="M20 8v46" className="stroke-marca-menta" strokeWidth="2" fill="none" />
            </svg>
          ) : (
            <span className="block h-6 w-6 rounded-full bg-marca-naranja" />
          )}
        </span>
      ))}
    </div>
  );
}

export default function HeroRecorrido() {
  // El segundo objeto arranca en la cima; el primero a su izquierda y el resto a la derecha.
  const centro = Math.min(1, OBJETOS.length - 1);
  return (
    <>
      <section className="hero-recorrido relative isolate overflow-hidden bg-marca-menta">
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ENTRADA }} />
        <Entrada />

        {/* El aro: elemento gráfico derivado del aro del logo (como el patrón Arcos), no el logo. */}
        <div className="aro absolute left-1/2 z-[1] -translate-x-1/2 rounded-full bg-marca-verde" aria-hidden>
          <div className="aro-mascara absolute inset-0">
            <div className="aro-giro absolute inset-0">
              <Anillo />
            </div>
          </div>
        </div>
        <div className="aro-base absolute inset-x-0 bottom-0 z-[1] bg-marca-verde" aria-hidden />

        {/* Desfile: arco por encima del aro (escritorio); carrusel con scroll-snap arriba (celular). */}
        <div className="desfile-orbita z-[2]">
          <ul className="desfile-lista">
            {OBJETOS.map((o, i) => {
              const a = (i - centro) * PASO_DESFILE;
              const { escala, desenfoque } = profundidad(a);
              return (
                <li
                  key={o.id}
                  className="desfile-objeto"
                  style={{ ['--a' as string]: `${a}deg`, ['--s' as string]: escala, ['--b' as string]: `${desenfoque}px` }}
                >
                  <Link href={o.href} data-cursor="Ver servicio" className="block">
                    <Objeto objeto={o} sizes="(min-width: 1024px) 38svh, 52vw" className="h-auto w-full" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Dentro del verde: el H1 y los botones. */}
        <div className="hero-contenido absolute inset-x-0 z-[3] flex flex-col items-center px-4 text-center">
          <h1 className="hero-h1 max-w-[19ch] text-balance uppercase leading-[0.95] tracking-[-0.02em] text-white">
            Fumigación y Control de Plagas en Bucaramanga
          </h1>
          <div className="mt-6 flex w-full flex-col items-center justify-center gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
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
            className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 transition-colors hover:bg-white/10"
          >
            <span className="flex items-center gap-0.5 text-marca-naranja">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="fill-current" aria-hidden />
              ))}
            </span>
            <span className="text-body-sm font-semibold text-white">{BUSINESS.googleRating}</span>
            <span className="text-body-sm text-white/75">· {BUSINESS.googleReviewCount} reseñas en Google</span>
          </a>
        </div>

        <span
          className="hero-baje absolute bottom-5 left-1/2 z-[3] hidden -translate-x-1/2 items-center gap-2 font-display text-[0.68rem] uppercase tracking-[0.22em] text-white/70 lg:inline-flex"
          aria-hidden
        >
          <span className="hero-baje-punto h-1.5 w-1.5 rounded-full bg-marca-naranja" />
          Baje para descubrir
        </span>
      </section>

      {/* Justo después del primer pantallazo, sobre el mismo verde: la promesa de respuesta y el
          párrafo del hero (mismo texto de antes). */}
      <div className="bg-marca-verde pb-12 pt-4 md:pb-16">
        <div className="container-custom flex flex-col items-center gap-5 text-center">
          <Badge icon={<Clock size={16} />}>Respondemos por WhatsApp en menos de 5 minutos</Badge>
          <p className="max-w-2xl text-pretty text-body-lg text-white/80">
            Más de 40 años protegiendo hogares, restaurantes e industrias en Bucaramanga, Floridablanca, Piedecuesta y Girón.
          </p>
        </div>
      </div>
    </>
  );
}
