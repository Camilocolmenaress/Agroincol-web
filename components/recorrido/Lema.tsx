import localFont from 'next/font/local';

// Caveat Brush: una sola vez por página y en una sección que solo lleva el titular en League
// Spartan y el remate en Caveat (manual v2, decisión del 13-nov). Aquí va el lema oficial, la única
// vez que aparece como texto en el home (las vueltas del aro son adorno aria-hidden).
// Subconjunto con solo las letras de los remates de la marca ("la tranquilidad se queda.",
// "Llegó AGROINCOL. Nos vamos."): 67 KB → unos pocos KB. Si se agrega otro remate en Caveat,
// regenerar con pyftsubset (ver docs/rediseno/plan-fases.md).
const caveat = localFont({
  src: '../../public/fonts/caveat-brush-remates.woff2',
  display: 'swap',
  preload: false,
});

export default function Lema() {
  return (
    <section className="relative overflow-hidden bg-marca-verde py-24 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/patrones/patron-gel-oscuro.webp')] bg-[length:520px] opacity-30"
        aria-hidden
      />
      <p className="container-custom relative text-center">
        <span className="block font-display text-[clamp(2.4rem,8.4vw,7.6rem)] uppercase leading-[0.88] tracking-[-0.035em] text-white">
          Las plagas se van,
        </span>{' '}
        <span className={`${caveat.className} mt-2 block -rotate-2 text-[clamp(2.4rem,7vw,5.5rem)] leading-none text-marca-naranja`}>
          la tranquilidad se queda.
        </span>
      </p>
    </section>
  );
}
