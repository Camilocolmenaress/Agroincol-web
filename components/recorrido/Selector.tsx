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

// Entrada (primera visita de la sesión, 1,2 s como máximo, detrás del contenido): gotas de gel que
// caen con física, se amontonan abajo y se van por el fondo; la forma sube, el sello gira a su sitio
// y la fila se asienta. Todo con transform: el H1 y los objetos se ven desde el primer pintado.
// Sin JS o con reduce-motion no pasa nada.
const ENTRADA = `(function(){try{
if(sessionStorage.getItem('ag_entrada')||location.search.indexOf('sin-entrada')>-1||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
sessionStorage.setItem('ag_entrada','1');
var d=document.documentElement;d.setAttribute('data-entrada','');
var cv=document.getElementById('sel-gotas');if(!cv)return;var sec=cv.parentNode;
var W=sec.clientWidth,H=sec.clientHeight,dpr=Math.min(2,devicePixelRatio||1);
cv.width=W*dpr;cv.height=H*dpr;var c=cv.getContext('2d');c.scale(dpr,dpr);
var k=W<480?0.7:1,col=['#164A38','#164A38','#164A38','#FFFFFF','#FFFFFF','#F5682E'],g=[];
for(var i=0;i<24;i++){var r=(10+Math.random()*18)*k;g.push({x:r+Math.random()*(W-2*r),y:-r-Math.random()*H*0.5,vx:(Math.random()-.5)*60,vy:0,r:r,c:col[i%col.length]});}
var t0=performance.now(),tp=t0,FIN=1200,ABRE=760;
function paso(t){var dt=Math.min(.033,(t-tp)/1000);tp=t;var e=t-t0,suelo=e<ABRE?H-(W<768?96:8):1e9;
for(var i=0;i<g.length;i++){var p=g[i];p.vy+=3200*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
if(p.y+p.r>suelo){p.y=suelo-p.r;p.vy*=-0.25;p.vx*=0.9;}
if(p.x<p.r){p.x=p.r;p.vx*=-0.4;}if(p.x>W-p.r){p.x=W-p.r;p.vx*=-0.4;}}
for(var a=0;a<g.length;a++)for(var b=a+1;b<g.length;b++){var A=g[a],B=g[b],dx=B.x-A.x,dy=B.y-A.y,m=A.r+B.r,q=dx*dx+dy*dy;
if(q<m*m&&q>0.01){var l=Math.sqrt(q),o=(m-l)/2,nx=dx/l,ny=dy/l;A.x-=nx*o;A.y-=ny*o;B.x+=nx*o;B.y+=ny*o;
var rv=(B.vx-A.vx)*nx+(B.vy-A.vy)*ny;if(rv<0){var j=-rv*0.6;A.vx-=j*nx;A.vy-=j*ny;B.vx+=j*nx;B.vy+=j*ny;}}}
c.clearRect(0,0,W,H);c.globalAlpha=e>FIN-200?Math.max(0,(FIN-e)/200):1;
for(var i=0;i<g.length;i++){var p=g[i];c.beginPath();c.arc(p.x,p.y,p.r,0,6.2832);c.fillStyle=p.c;c.fill();}
if(e<FIN)requestAnimationFrame(paso);else{c.clearRect(0,0,W,H);d.removeAttribute('data-entrada');}}
requestAnimationFrame(paso);}catch(e){}})();`;

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

        {/* Lienzo de la entrada (gotas de gel); el script lo quita al terminar. */}
        <canvas id="sel-gotas" className="sel-gotas" aria-hidden />

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
        <script dangerouslySetInnerHTML={{ __html: ENTRADA }} />
      </section>
      <SelectorMotor />
    </div>
  );
}
