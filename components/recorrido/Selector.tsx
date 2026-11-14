import Link from 'next/link';
import Objeto from './Objeto';
import SelectorMotor from './SelectorMotor';
import { OBJETOS } from './objetos';
import { reposo } from './selector/geometria';

// Primera pantalla del home: un selector de servicios, como el de agrumeafarm.it
// (docs/rediseno/descomposicion-agrumea). La rueda, el dedo y el arrastre recorren los objetos;
// cada objeto lleva a su servicio. Todo sale del servidor ya en su sitio (posiciones en vw): sin
// JS se ve igual y los enlaces funcionan; el motor solo agrega el movimiento.
// La pantalla queda fijada mientras se recorre una vuelta y después la página sigue.

// Lema oficial: aquí es adorno (aria-hidden). El texto real aparece una vez en <Lema/>.
const SIZES = '(max-width: 480px) 50vw, (max-width: 1024px) 45vw, 30vw';

const LEMA = 'LAS PLAGAS SE VAN · LA TRANQUILIDAD SE QUEDA · ';

function Sello() {
  return (
    <svg viewBox="0 0 1000 1000" className="h-full w-full" aria-hidden focusable="false">
      <defs>
        <path id="sello-trazo" d="M 500,500 m -448,0 a 448,448 0 1,1 896,0 a 448,448 0 1,1 -896,0" />
      </defs>
      {/* Una sola vuelta del lema, grande (como el sello de la referencia). */}
      <text className="fill-marca-naranja font-display" fontSize="86">
        <textPath href="#sello-trazo" textLength="2780" lengthAdjust="spacing">
          {LEMA}
        </textPath>
      </text>
    </svg>
  );
}

export default function Selector() {
  const poses = reposo(OBJETOS.length);
  return (
    <div className="sel-pista" data-selector>
      <section className="sel" aria-labelledby="sel-titulo">
        {/* H1 visible desde el primer pintado, pequeño y fuera de la forma (decisión del 14-nov). */}
        <h1 id="sel-titulo" className="sel-h1">
          Fumigación y Control de Plagas en Bucaramanga
        </h1>

        {/* La forma (verde) y el lema que gira con la fila. */}
        <div className="sel-forma" aria-hidden>
          <div className="sel-cupula" />
          <div className="sel-sello">
            <Sello />
          </div>
        </div>

        <div className="sel-ventana">
          <ul className="sel-fila" aria-label="Servicios de AGROINCOL">
            {OBJETOS.map((o, i) => (
              <li key={o.id} className="sel-item" style={poses[i]} data-i={i}>
                <Link
                  href={o.href}
                  className="sel-enlace"
                  data-cursor="Ver servicio"
                  data-vuela={o.vuela ? '' : undefined}
                  draggable={false}
                >
                  <span
                    className="sel-encuadre"
                    style={{ ['--n' as string]: o.encuadre.n, ['--dx' as string]: `${o.encuadre.dx}%`, ['--dy' as string]: `${o.encuadre.dy}%` }}
                  >
                    <Objeto
                      objeto={o}
                      sizes={SIZES}
                      prioridad={i === 0 ? 'alta' : undefined}
                      className="h-full w-full object-contain"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="sel-aviso" aria-hidden>
          <span className="punto-gel" />
          <span className="sel-aviso-escritorio">Baje para descubrir</span>
          <span className="sel-aviso-movil">Deslice para descubrir</span>
        </p>
      </section>
      <SelectorMotor />
    </div>
  );
}
