// Reseñas y casos de EcoGel.
//
// REGLA DEL REPO: nunca inventar testimonios (ver lib/reviews.ts). Todo lo que
// está aquí con `placeholder: true` es TEXTO DE EJEMPLO para diseñar la página
// y se pinta con una etiqueta visible que lo dice. No se quita con un flag: se
// quita reemplazando cada entrada por una reseña real, copiada textualmente.
// No se manda pauta mientras haya un solo placeholder visible.
//
// `texto` va sin comillas ni prefijo "Ejemplo:": las comillas las pone cada
// tarjeta y la etiqueta "Ejemplo" sale de `placeholder`, no del texto.

export interface ResenaEcogel {
  nombre: string;
  ciudad: string;
  /** Sin dato de calificación no se inventa: queda sin definir. */
  estrellas?: 1 | 2 | 3 | 4 | 5;
  /** Titular corto en negrita (tarjeta bajo el antes/después). Opcional. */
  titulo?: string;
  texto: string;
  /** Fecha de la reseña, ISO (AAAA-MM-DD). Se muestra arriba de cada reseña. */
  fecha: string;
  placeholder: boolean;
}

// Reseñas reales recogidas por WhatsApp (sin calificación en estrellas: el
// cliente no la dio, y no se inventa).
export const RESENAS_ECOGEL: ResenaEcogel[] = [
  {
    nombre: 'Juan Rojas',
    ciudad: 'Bucaramanga',
    texto: 'Súper recomendado, es una compra súper segura en el tema de cucarachas',
    fecha: '2026-02-12',
    placeholder: false,
  },
  {
    nombre: 'Valentina Gómez',
    ciudad: 'Medellín',
    texto: 'Me fue súper bien con el, tengo una mascota y aplico el producto con precaución y me ha funcionado muy bien',
    fecha: '2026-05-27',
    placeholder: false,
  },
  {
    nombre: 'Andrés Ramírez',
    ciudad: 'Cali',
    texto: 'Recomendado a ojo cerrado!!!, es muy fácil su uso y entrega rápida',
    fecha: '2026-01-09',
    placeholder: false,
  },
  {
    nombre: 'Mariana Rodríguez',
    ciudad: 'Bogotá',
    texto: 'Cumplió mis expectativas, la verdad no le tenía fe a ningún producto, pero me decidí por este y fue un SI rotundo',
    fecha: '2026-07-18',
    placeholder: false,
  },
  {
    nombre: 'Nicolás Herrera',
    ciudad: 'Barranquilla',
    texto: 'Muy buen producto',
    fecha: '2026-03-03',
    placeholder: false,
  },
  {
    nombre: 'Laura Castillo',
    ciudad: 'Cartagena',
    texto: 'Me resolvió el problema que tenía',
    fecha: '2026-08-22',
    placeholder: false,
  },
  {
    nombre: 'Santiago Morales',
    ciudad: 'Pereira',
    texto: 'LO AMÉ!!!',
    fecha: '2026-06-11',
    placeholder: false,
  },
  {
    nombre: 'Camila Jiménez',
    ciudad: 'Cúcuta',
    texto: 'Excelente producto, me solucionó la infestacion de cucarachas que tenía en mi casa',
    fecha: '2026-08-29',
    placeholder: false,
  },
];

export function resumenResenas() {
  const conEstrellas = RESENAS_ECOGEL.filter((r): r is ResenaEcogel & { estrellas: 1 | 2 | 3 | 4 | 5 } => r.estrellas != null);
  const distribucion: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let suma = 0;
  conEstrellas.forEach((r) => {
    distribucion[r.estrellas] += 1;
    suma += r.estrellas;
  });
  const totalConEstrellas = conEstrellas.length;
  return {
    promedio: totalConEstrellas ? Math.round((suma / totalConEstrellas) * 10) / 10 : 0,
    total: RESENAS_ECOGEL.length,
    totalConEstrellas,
    hayCalificaciones: totalConEstrellas > 0,
    distribucion,
    esEjemplo: RESENAS_ECOGEL.some((r) => r.placeholder),
  };
}
