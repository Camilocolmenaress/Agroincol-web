import Image from 'next/image';
import { ArrowRight, Check, Eye, GraduationCap, Minus, RotateCcw, ShieldCheck, X } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { ENTREGA_AM, ENVIO_FUERA, GARANTIA, MUNICIPIOS_AM, RECLAMO, money } from '@/lib/laminas';
import { COMPARACION, ESTUDIO, FUENTES_COMPARACION, NO_ATRAPO, PREGUNTAS, PRIMEROS_DIAS, PUNTOS, TESTIMONIOS, whatsappLaminas } from '@/lib/laminas-contenido';
import ElegirPaquete from './ElegirPaquete';
import { Logo, fondoPatron } from './Marca';
import Video, { type VideoSlot } from './Video';

// Secciones bajo la caja de compra. Orden y ritmo de Grüns (banner oscuro →
// cifras grandes → prueba → objeciones → preguntas), con el contenido de la
// guía en vez de cifras que no tenemos.

const kicker = 'font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-brand-green';
const h2 = 'mt-2 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.01em] text-balance md:text-[2.6rem]';

export function Acordeon({ titulo, children, abierto = false }: { titulo: string; children: React.ReactNode; abierto?: boolean }) {
  return (
    <details className="group" open={abierto}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-heading text-[1.15rem] font-bold text-brand-black [&::-webkit-details-marker]:hidden">
        {titulo}
        <span className="text-2xl font-normal leading-none transition-transform group-open:rotate-45" aria-hidden>
          +
        </span>
      </summary>
      <div className="pb-5 text-body leading-relaxed text-brand-black/75">{children}</div>
    </details>
  );
}

const num = (n: number) => n.toLocaleString('es-CO');

/** Tarjeta bajo las fotos, como "Tested by Light Labs" de Grüns: el estudio que respalda la regla de oro. */
export function SelloEstudio() {
  const veces = Math.round(ESTUDIO.segundos.esquina / ESTUDIO.segundos.centro);
  return (
    <a
      href={ESTUDIO.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex items-center gap-3.5 rounded-xl border border-brand-black/10 bg-white px-4 py-3 shadow-soft"
    >
      <GraduationCap size={30} className="flex-none text-brand-green" aria-hidden />
      <span className="min-w-0 flex-1 border-l border-brand-black/10 pl-3.5">
        <span className="flex flex-wrap items-center gap-1.5 text-body-sm text-brand-black/80">
          Estudio de la {ESTUDIO.institucion}
          <span className="rounded bg-brand-mint px-1.5 py-0.5 text-[12px] font-semibold text-brand-green">{ESTUDIO.anio}</span>
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-body-sm font-semibold text-brand-black">
          Las ratas pasan {veces} veces más tiempo en las esquinas que en el centro
          <ArrowRight size={16} className="flex-none" aria-hidden />
        </span>
      </span>
    </a>
  );
}

export function ReglaDeOro() {
  return (
    <section className="bg-brand-green px-5 py-14 text-white md:py-20" style={fondoPatron('gel-oscuro')}>
      <div className="mx-auto max-w-3xl rounded-[28px] bg-brand-green px-5 py-12 text-center md:px-10">
        <p className={`${kicker} !text-brand-orange-light`}>La regla de oro</p>
        <h2 className={`${h2} text-white`}>Contra la pared. Nunca en la mitad.</h2>
        <p className="mx-auto mt-3 max-w-xl text-body-lg leading-snug text-white/80">
          Los roedores caminan pegados a la pared, como quien camina a oscuras tocando el muro. Por la mitad de un pasillo casi nunca pasan.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-body-sm leading-snug text-white/80">
          Un estudio de la {ESTUDIO.institucion} lo midió: las ratas pasaron {num(ESTUDIO.segundos.esquina)} segundos en las esquinas,{' '}
          {num(ESTUDIO.segundos.pared)} junto a una pared y {num(ESTUDIO.segundos.centro)} en el centro.
        </p>
        <div className="mt-7 overflow-hidden rounded-2xl bg-brand-mint p-2">
          <Image src="/tienda/laminas/diagrama-ruta.webp" alt="Plano: la lámina en la mitad del pasillo queda fuera de la ruta; contra la pared, la ruta pasa encima" width={1052} height={757} className="h-auto w-full" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-left">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="font-heading font-bold">✕ Así no</p>
            <p className="mt-1 text-body-sm text-white/80">En la mitad del paso, en el centro de la bodega o encima de una mesa.</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="font-heading font-bold text-white">✓ Así sí</p>
            <p className="mt-1 text-body-sm text-white/80">Con un lado contra la pared, en el camino que ellos ya usan.</p>
          </div>
        </div>
        <a href="#comprar" className="mt-8 inline-flex rounded-full bg-brand-orange px-8 py-3.5 font-heading text-[1.2rem] font-bold text-white shadow-brand">
          Elegir mis láminas
        </a>
      </div>
    </section>
  );
}

export function CuentaParedes() {
  const cifras = [
    { n: '1', t: 'lámina' },
    { n: '3 m', t: 'de pared' },
    { n: '+1', t: 'por puerta' },
  ];
  return (
    <section className="relative overflow-hidden bg-brand-mint py-14">
      {/* La hoja sola como apoyo (manual v2): asomada en la esquina, como en la portada de la marca. */}
      <Image src="/tienda/marca/hoja-verde.svg" alt="" width={220} height={220} unoptimized className="pointer-events-none absolute -right-12 -top-14 z-0 h-32 w-32 rotate-[-12deg] md:-right-10 md:-top-10 md:h-56 md:w-56" />
      <div className="container-custom relative z-10 max-w-3xl">
        <div className="text-center">
          <p className={kicker}>Cuántas necesita</p>
          <h2 className={`${h2} text-brand-green`}>Cuente paredes, no metros cuadrados</h2>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-2 text-center">
          {cifras.map((c) => (
            <div key={c.t}>
              <p className="font-heading text-[3.4rem] font-bold leading-none text-brand-green md:text-[4.5rem]">{c.n}</p>
              <p className="mt-1 text-body-sm font-semibold uppercase tracking-wide text-brand-black/70">{c.t}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-4 shadow-soft">
          <p className="font-heading text-body font-bold text-brand-green">Ejemplo: cocina con bodega pequeña</p>
          <Image src="/tienda/laminas/diagrama-cuantas.webp" alt="Plano de una cocina con bodega y las 12 láminas marcadas contra las paredes y junto a las puertas" width={1052} height={577} className="mt-3 h-auto w-full rounded-lg" />
          <dl className="mt-3 space-y-1 text-body-sm text-brand-black/80">
            <div className="flex justify-between"><dt>Cocina de 4 × 5 m → 18 m de pared ÷ 3</dt><dd className="font-bold">6</dd></div>
            <div className="flex justify-between"><dt>Bodega de 3 × 3 m → 12 m de pared ÷ 3</dt><dd className="font-bold">4</dd></div>
            <div className="flex justify-between"><dt>2 puertas</dt><dd className="font-bold">2</dd></div>
            <div className="flex justify-between border-t border-brand-black/10 pt-1.5 font-heading text-body font-bold text-brand-green"><dt>Total</dt><dd>12 = una docena</dd></div>
          </dl>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {[
            { n: 6, t: 'Cocina de apartamento o local pequeño' },
            { n: 12, t: 'Restaurante: cocina y bodega pequeña' },
            { n: 24, t: 'Bodega grande o local con varias áreas' },
          ].map((p) => (
            <div key={p.n} className={`flex flex-col rounded-2xl bg-white p-3 text-center ${p.n === 12 ? 'ring-2 ring-brand-orange' : ''}`}>
              <p className={`font-heading text-[2rem] font-bold leading-none ${p.n === 12 ? 'text-brand-orange' : 'text-brand-green'}`}>{p.n}</p>
              <p className="mt-1.5 flex-1 text-[12px] leading-tight text-brand-black/70">{p.t}</p>
              <ElegirPaquete cantidad={p.n} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SeisPuntos() {
  return (
    <section className="py-14">
      <div className="container-custom max-w-3xl">
        <div className="text-center">
          <p className={kicker}>Dónde ponerlas</p>
          <h2 className={`${h2} text-brand-green`}>Los 6 puntos que más se repiten</h2>
          <p className="mx-auto mt-3 max-w-xl text-body-lg leading-snug text-brand-black/70">
            Busque estos lugares en su cocina o bodega. Donde vea excremento, mordidas o rastros, ponga dos láminas juntas.
          </p>
        </div>
        <div className="mt-7 overflow-hidden rounded-2xl bg-brand-mint p-2">
          <Image src="/tienda/laminas/diagrama-puntos.webp" alt="Plano de cocina y bodega con los 6 puntos numerados" width={1052} height={580} className="h-auto w-full" />
        </div>
        <ol className="mt-6 space-y-3">
          {PUNTOS.map((p, i) => (
            <li key={p.titulo} className="flex items-start gap-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-green font-heading text-body-sm font-bold text-white">{i + 1}</span>
              <p className="pt-1 text-body leading-snug text-brand-black/75">
                <strong className="font-heading text-brand-green">{p.titulo}</strong> {p.texto}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Envio() {
  return (
    <section className="bg-white pb-14">
      {/* Portada de la marca: Bucaramanga y la hoja. Sin técnicos: las demás ilustraciones muestran el servicio, que el brief deja fuera. */}
      <div className="relative">
        <Image src="/tienda/marca/bucaramanga.webp" alt="Ilustración de Bucaramanga y su área metropolitana" width={1600} height={900} sizes="100vw" className="h-56 w-full object-cover object-bottom md:h-80" />
      </div>
      <div className="container-custom -mt-10 max-w-3xl">
        <div className="relative rounded-[28px] bg-white p-6 text-center shadow-card md:p-8">
          <p className={kicker}>Envíos</p>
          <h2 className={`${h2} text-brand-green`}>{ENTREGA_AM}</h2>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {MUNICIPIOS_AM.map((m) => (
              <li key={m} className="rounded-full bg-brand-mint px-4 py-1.5 font-heading text-body-sm font-bold text-brand-green">
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-body text-brand-black/70">
            Gratis desde 12 láminas. Al resto del país, {money(ENVIO_FUERA)} por pedido por transportadora.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Cierre con El Pillo, el roedor de Los Colados, igual que la última página de
 * la guía. Reglas del elenco: la plaga siempre se va, cierre fijo
 * "Llegó AGROINCOL. Nos vamos.", Caveat Brush solo aquí (una vez por pieza).
 */
export function Cierre() {
  return (
    <section className="bg-brand-green px-5 py-14 text-center text-white md:py-20" style={fondoPatron('gel-oscuro')}>
      {/* Como en la Regla de oro: el patrón enmarca, el texto va sobre verde liso. */}
      <div className="mx-auto max-w-xl rounded-[28px] bg-brand-green px-5 py-10">
        <Image src="/tienda/marca/el-pillo.webp" alt="El Pillo, el roedor de Los Colados, se va con su maleta" width={455} height={500} className="mx-auto h-auto w-48 md:w-60" />
        <p className="mt-4 font-lema text-[2rem] leading-tight text-brand-orange-light md:text-[2.4rem]">“Yo solo vine por un pedacito.”</p>
        <p className="mt-2 font-heading text-[2.2rem] font-extrabold leading-[1.05] md:text-[2.8rem]">
          Llegó AGROINCOL.
          <br />
          Nos vamos.
        </p>
        <a href="#comprar" className="mt-8 inline-flex rounded-full bg-brand-orange px-8 py-3.5 font-heading text-[1.2rem] font-bold text-white shadow-brand">
          Elegir mis láminas
        </a>
      </div>
    </section>
  );
}

export function DespuesDeInstalar({ videoB }: { videoB?: VideoSlot }) {
  const linea = PRIMEROS_DIAS;
  return (
    <section className="bg-white py-14">
      <div className="container-custom max-w-3xl">
        <div className="text-center">
          <p className={kicker}>Los primeros días</p>
          <h2 className={`${h2} text-brand-green`}>Paciencia: déjela quieta</h2>
          <p className="mx-auto mt-3 max-w-xl text-body-lg leading-snug text-brand-black/70">
            Las ratas desconfían de las cosas nuevas. Pueden pasar días o semanas antes de que se acerquen. Si la mueve, la desconfianza empieza de cero.
          </p>
        </div>

        <ol className="relative mt-8 grid grid-cols-3 gap-2 text-center">
          <span className="absolute left-[16%] right-[16%] top-5 h-0.5 bg-brand-green/25" aria-hidden />
          {linea.map((l, i) => (
            <li key={l.d} className="relative">
              <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full font-heading font-bold text-white bg-brand-green`}>
                {i === 0 ? '1' : i === 1 ? <Eye size={18} aria-hidden /> : <RotateCcw size={18} aria-hidden />}
              </span>
              <p className="mt-2 font-heading text-body font-bold text-brand-green">{l.d}</p>
              <p className="mt-0.5 text-body-sm leading-snug text-brand-black/70">{l.t}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-brand-mint p-5">
            <p className="font-heading text-body-lg font-bold text-brand-green">Revise todos los días</p>
            <p className="mt-1 text-body-sm text-brand-black/75">Si atrapó algo, retírela ese mismo día. Revisar a diario es parte de usarla bien.</p>
          </div>
          <div className="rounded-2xl bg-brand-mint p-5">
            <p className="font-heading text-body-lg font-bold text-brand-green">No la cambie de sitio</p>
            <p className="mt-1 text-body-sm text-brand-black/75">Antes de 2 semanas, solo muévala si se ensució o se mojó.</p>
          </div>
        </div>

        <h3 className="mt-12 text-center font-heading text-[1.6rem] font-bold leading-tight text-brand-green">¿No atrapó nada? Revise tres cosas antes de cambiarla</h3>
        <ol className="mt-5 space-y-2.5">
          {NO_ATRAPO.map((n, i) => (
            <li key={n.pregunta} className="flex items-center gap-3 rounded-2xl border-2 border-brand-green/80 px-4 py-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-green font-heading text-body-sm font-bold text-white">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-body font-bold text-brand-green">{n.pregunta}</p>
                <p className="text-body-sm text-brand-black/75">
                  <strong className="text-brand-green">{n.accion}</strong> {n.porque}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-3 flex gap-2.5 rounded-2xl bg-brand-mint px-4 py-3 text-body-sm text-brand-black/80">
          <Check size={18} className="mt-0.5 flex-none text-brand-green" aria-hidden />
          Bien puesta, quieta y limpia por varias semanas: por ese punto no están pasando. Es una buena noticia. Si ve rastros en otro lugar, pásela allá.
        </p>

        {videoB && (
          <div className="mx-auto mt-8 max-w-sm">
            <Video slot={videoB} titulo="¿Y si no pega? ¿Qué hago después?" />
          </div>
        )}

        <div id="garantia" className="mt-8 flex gap-4 rounded-2xl bg-brand-green p-5 text-white">
          <ShieldCheck size={36} className="flex-none text-brand-orange-light" aria-hidden />
          <div>
            <p className="font-heading text-body-lg font-bold">{GARANTIA}</p>
            <p className="mt-1.5 text-body-sm text-white/80">{RECLAMO}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Nosotros vs. ellos" de Grüns, con las guías de universidades como fuente de cada fila. */
export function Comparacion() {
  const celda = (v: boolean | null, destacada = false) =>
    v === null ? (
      <Minus size={18} className={destacada ? 'mx-auto text-white/80' : 'mx-auto text-brand-black/50'} aria-label="No aplica" />
    ) : v ? (
      <Check size={20} strokeWidth={3} className={destacada ? 'mx-auto text-white' : 'mx-auto text-brand-green'} aria-label="Sí" />
    ) : (
      <X size={20} strokeWidth={3} className={destacada ? 'mx-auto text-white' : 'mx-auto text-brand-black/70'} aria-label="No" />
    );
  return (
    <section className="bg-white py-14">
      <div className="container-custom max-w-3xl">
        <div className="text-center">
          <p className={kicker}>Compare</p>
          <h2 className={`${h2} text-brand-green`}>Láminas, veneno o trampa de golpe</h2>
          <p className="mx-auto mt-3 max-w-xl text-body-lg leading-snug text-brand-black/75">Lo que dicen las guías de control de roedores de tres universidades.</p>
        </div>
        <table className="mt-7 w-full table-fixed border-separate border-spacing-0 text-center text-body-sm">
          <thead>
            <tr>
              <th className="w-[38%]">
                <span className="sr-only">Característica</span>
              </th>
              <th className="rounded-t-xl bg-brand-green px-1 py-3 font-heading font-bold text-white">Láminas</th>
              <th className="px-1 py-3 font-heading font-bold text-brand-black">Veneno</th>
              <th className="px-1 py-3 font-heading font-bold text-brand-black">Trampa de golpe</th>
            </tr>
          </thead>
          <tbody>
            {COMPARACION.map((f, i) => (
              <tr key={f.fila}>
                <th scope="row" className="border-t border-brand-black/10 py-3.5 pr-2 text-left font-semibold leading-snug text-brand-black">
                  {f.fila}
                  <sup className="ml-0.5 font-normal text-brand-black/70">{f.fuente}</sup>
                </th>
                <td className={`bg-brand-green py-3.5 ${i === COMPARACION.length - 1 ? 'rounded-b-xl' : ''}`}>{celda(f.laminas, true)}</td>
                <td className="border-t border-brand-black/10 py-3.5">{celda(f.veneno)}</td>
                <td className="border-t border-brand-black/10 py-3.5">{celda(f.golpe)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-5 rounded-xl bg-brand-mint px-4 py-3 text-body-sm leading-snug text-brand-black">
          <strong className="text-brand-green">Lo que debe saber:</strong> con polvo o humedad la lámina pierde pegue (cámbiela) y no va donde lleguen niños o
          mascotas.
        </p>
        <ol className="mt-4 space-y-1 text-[12px] text-brand-black/70">
          {FUENTES_COMPARACION.map((f) => (
            <li key={f.n}>
              {f.n}.{' '}
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {f.texto}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** No se pinta mientras no haya testimonios reales (lib/laminas-contenido.ts). */
export function Testimonios() {
  if (TESTIMONIOS.length === 0) return null;
  return (
    <section className="bg-brand-mint py-14" id="testimonios">
      <div className="container-custom max-w-3xl">
        <h2 className={`${h2} text-center text-brand-green`}>Lo que dicen nuestros clientes</h2>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {TESTIMONIOS.map((t) => (
            <li key={t.nombre + t.texto} className="rounded-2xl bg-white p-5 shadow-soft">
              <p className="text-body leading-relaxed text-brand-black/80">“{t.texto}”</p>
              <p className="mt-3 font-heading text-body-sm font-bold text-brand-green">
                {t.nombre} · <span className="font-normal text-brand-black/70">{t.negocio}, {t.municipio}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Preguntas() {
  return (
    <section className="bg-brand-mint py-14">
      <div className="container-custom max-w-3xl">
        <h2 className={`${h2} text-center text-brand-green`}>¿Le quedan preguntas?</h2>
        <div className="mt-6 divide-y divide-brand-black/10 border-y border-brand-black/10">
          {PREGUNTAS.map((p) => (
            <Acordeon key={p.pregunta} titulo={p.pregunta}>
              {p.respuesta}
            </Acordeon>
          ))}
        </div>
        {/* WhatsApp: solo aquí, al final y como última opción (brief). */}
        <p className="mt-8 text-center text-body text-brand-black/70">
          ¿Tiene otra duda?{' '}
          <a href={whatsappLaminas()} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-green underline underline-offset-4">
            Escríbanos por WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}

/** conBarra: la página tiene la barra fija de compra (también en escritorio): el pie le deja espacio. */
export function Pie({ conBarra = false }: { conBarra?: boolean }) {
  return (
    <footer className={`bg-brand-green-dark px-4 pb-[calc(env(safe-area-inset-bottom)+96px)] pt-10 text-center text-white ${conBarra ? 'lg:pb-28' : 'lg:pb-10'}`}>
      <Logo blanco className="mx-auto h-[60px] w-auto" />
      <p className="mx-auto mt-1.5 max-w-md text-body-sm text-white/80">{BUSINESS.address.full}</p>
      <p className="text-body-sm text-white/80">
        {BUSINESS.phone} · {BUSINESS.email}
      </p>
      <p className="mt-4 text-body-sm text-white/80">
        <a href="/politica-de-privacidad" className="underline underline-offset-4">Política de privacidad</a>
        {' · '}
        <a href="/tienda/terminos" className="underline underline-offset-4">Términos y condiciones</a>
      </p>
      <p className="mt-3 text-body-sm text-white/80">© {new Date().getFullYear()} {BUSINESS.legalName}</p>
    </footer>
  );
}
