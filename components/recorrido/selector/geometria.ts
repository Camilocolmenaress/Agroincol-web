// Geometría y coreografía del selector del home: copiadas de agrumeafarm.it (motor del slider,
// docs/rediseno/descomposicion-agrumea/anexos/a-codigo.md §4). Funciones puras: las usa el
// servidor para pintar la posición de reposo (en vw, sin JS) y el motor en cada cuadro.

export const ANGULO_FILA = 10; // grados: la fila baja en diagonal hacia la derecha

// Desfase vertical propio de cada objeto (× su alto), para que la fila no sea una regla.
const DESFASE = [-0.053, 0.043, -0.024, 0.057, -0.048, 0.029, -0.038, 0.053];

export const C = {
  escalaMin: 0.55, // en los bordes
  escalaMax: 1.35, // en el centro
  reduccion: 0.1, // encogimiento extra por distancia al centro (en pasos)
  brilloMin: 0.7,
  brilloMax: 1.1,
  ondulacion: 18, // grados de la ondulación de rotación (periodo: 3 objetos)
  tanhA: 0.55, // el centro va 1,55× más rápido y separado; los bordes, más lentos
  tanhB: 0.16,
  ganancia: 1.15, // px de fila por px de rueda o de scroll
  arrastre: 1.5, // px de fila por px de arrastre
  lanzaMs: 190, // proyección del lanzamiento al soltar
  lanzaMax: 3.5, // px/ms
  tasaLibre: 2.3, // 1/s: seguimiento exponencial (τ ≈ 0,43 s)
  tasaArrastre: 11, // 1/s mientras se arrastra (τ ≈ 0,09 s)
  vNorm: 2400, // px/s de referencia para los efectos de velocidad
  inclinMax: 6, // grados de inclinación por velocidad
  encoge: 0.05, // encogimiento por velocidad
  giroLema: -0.012, // grados de lema por px de fila (escritorio)
  giroLemaMovil: -0.03,
  umbralArrastre: 6, // px antes de considerar que es arrastre (y cancelar el clic)
};

export type Geometria = { G: number; movil: boolean; N: number; u: number; F: number };

// G = ancho de la ventana, alto = alto de la ventana, n = número de objetos.
export function geometria(G: number, alto: number, n: number, sinTope = false): Geometria {
  const movil = G <= 480;
  const tablet = !movil && G <= 1024;
  const Z = G / (movil || tablet ? 3 : 4); // ancho de "columna"
  const N = Z * (movil ? 1.15 : tablet ? 1.265 : 0.92); // paso entre objetos
  // Nuestros objetos son cuadrados (los frascos de la referencia, de 630×1013): la caja ocupa casi
  // todo el paso y se limita por el alto para que el central (×1,35) no se salga de la pantalla.
  let u = N * (movil ? 1.3 : 0.95);
  const tope = alto * (movil ? 0.36 : 0.46);
  if (!sinTope && u > tope) u = tope;
  return { G, movil, N, u, F: n * N };
}

// Desplazamiento inicial: el primer objeto (la casa) queda en el centro.
export const inicio = (g: Geometria) => g.G / 2 - g.u / 2;

export type Extra = { inclina?: number; jalonX?: number; jalonY?: number; eleva?: number; v?: number };

// Pose de un objeto i para el desplazamiento H. Devuelve x (borde izquierdo) e y (desde el eje de
// la fila) en las mismas unidades que G.
export function pose(i: number, H: number, g: Geometria, e: Extra = {}) {
  const { G, N, u, F, movil } = g;
  const margen = u * 2; // reaparece por el otro lado dos anchos fuera de pantalla
  let c = (i * N + u / 2 + H + margen) % F;
  if (c < 0) c += F;
  const fe = c - margen;
  const q = fe / G; // 0 = borde izquierdo, 1 = borde derecho
  const ft = (q + C.tanhA * C.tanhB * Math.tanh((q - 0.5) / C.tanhB)) * G;
  const campana = q >= 0 && q <= 1 ? Math.sin(q * Math.PI) : 0;
  const pasos = Math.abs(q - 0.5) / (N / G);
  const vn = Math.min(1, Math.abs(e.v ?? 0) / C.vNorm);
  const escala =
    (C.escalaMin + campana * (C.escalaMax - C.escalaMin)) *
    (1 - C.reduccion * Math.min(1, pasos)) *
    (1 - vn * vn * C.encoge) *
    (1 + (e.eleva ?? 0));
  const brillo = C.brilloMin + campana * (C.brilloMax - C.brilloMin);
  const desenfoque = Math.min(movil ? 2 : 4, pasos * pasos) + vn * vn * (movil ? 1.6 : 3.2);
  const rot = Math.sin(((i * N + H) / (3 * N)) * 2 * Math.PI) * C.ondulacion + (e.inclina ?? 0);
  return {
    x: ft - u / 2 + (e.jalonX ?? 0),
    y: DESFASE[i % DESFASE.length] * u + (e.jalonY ?? 0),
    rot,
    escala,
    brillo,
    desenfoque,
    q,
  };
}

// Reposo para el servidor: posiciones en vw (G = 100) para escritorio, tablet y celular. La caja
// se calcula sin tope de alto (el motor lo corrige al montar si la pantalla es baja).
export function reposo(n: number) {
  const anchos = { d: 1440, t: 800, m: 390 } as const;
  return Array.from({ length: n }, (_, i) => {
    const vars: Record<string, string> = {};
    (Object.keys(anchos) as (keyof typeof anchos)[]).forEach((k) => {
      const real = geometria(anchos[k], 10000, n, true);
      const g: Geometria = { ...real, G: 100, N: (real.N / real.G) * 100, u: (real.u / real.G) * 100, F: (real.F / real.G) * 100 };
      const p = pose(i, inicio(g), g);
      vars[`--x${k}`] = p.x.toFixed(3);
      vars[`--y${k}`] = p.y.toFixed(3);
      vars[`--r${k}`] = p.rot.toFixed(2);
      vars[`--s${k}`] = p.escala.toFixed(3);
      vars[`--b${k}`] = p.brillo.toFixed(3);
      vars[`--f${k}`] = p.desenfoque.toFixed(2);
    });
    return vars;
  });
}
