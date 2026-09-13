// Reseñas reales del perfil de Google de AGROINCOL (4,9 ★ · 33 reseñas).
// REGLA: aquí solo van reseñas verificables copiadas textualmente de Google.
// Nunca inventar testimonios — ver la nota en components/sections/Testimonials.tsx.

export interface GoogleReview {
  name: string;
  /** Inicial para el avatar cuando no hay foto. */
  initial: string;
  /** Antigüedad tal como la muestra Google. */
  date: string;
  text: string;
  /** Plaga con la que la reseña conecta directamente; se muestra primero en esa landing. */
  topic?: 'chinches' | 'comejen';
}

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    name: 'karen T',
    initial: 'K',
    date: 'hace 2 meses',
    topic: 'chinches',
    text: 'Llevábamos semanas sufriendo una infestación de chinches y después de probar varios remedios caseros sin éxito, decidimos contactar con esta empresa. Ha sido la mejor decisión. El tratamiento fue muy eficaz y por fin hemos recuperado la tranquilidad en casa. Profesionales, puntuales y muy atentos en todo momento. Totalmente recomendables!!',
  },
  {
    name: 'andres carvajal',
    initial: 'A',
    date: 'hace 2 años',
    topic: 'comejen',
    text: 'Excelente servicio, fueron puntuales y concretos con el trabajo, necesitaba fumigación por moscas, zancudos y cucarachas y también termitas y me sirvió mucho!! Anteriormente he hecho fumigaciones con otras personas pero no funcionaba, en cambio con ellos me sirvió muchísimo. El precio estuvo bien y el servicio muy bien, los recomiendo a ojo cerrado, muchas gracias.',
  },
  {
    name: 'Eddy Carolina Basto Vera',
    initial: 'E',
    date: 'hace 3 meses',
    text: 'Muy buen servicio, atención excelente, muy puntuales y resultados efectivos. Totalmente recomendados.',
  },
  {
    name: 'Lorena Mueguez',
    initial: 'L',
    date: 'hace 3 años',
    text: 'Empresa que brinda excelente servicio, tiene toda la documentación al día, cuentan con personas experta y profesional en el área del control de plaga, realizan diagnósticos para cada situación y lo más importante los resultados son efectivos!.',
  },
  {
    name: 'Paula Andrea Mora Alvarez',
    initial: 'P',
    date: 'hace 3 años',
    text: 'Empresa muy cumplida, tienen productos de alta calidad y un excelente servicio, cumplen con todos los requerimientos y necesidades, los recomiendo.',
  },
  {
    name: 'Jose Guerrero',
    initial: 'J',
    date: 'hace 1 año',
    text: 'Muy buen servicio, todo tal cual como habíamos acordado 👍',
  },
  {
    name: 'Valentina Batista',
    initial: 'V',
    date: 'hace 2 años',
    text: 'Excelente servicio, muy puntuales y afectivos con cualquier tipo de plaga. Gracias',
  },
  {
    name: 'Dra. Ana Lineth Fuentes Costa',
    initial: 'A',
    date: 'hace 3 años',
    text: 'Excelente servicio de fumigación prestado en mi empresa, y muy buenos productos aplicados... Los recomiendo. 👍',
  },
];

/** Reseñas ordenadas para una landing: primero la que habla de esa plaga. */
export function reviewsFor(topic: 'chinches' | 'comejen'): GoogleReview[] {
  return [...GOOGLE_REVIEWS].sort((a, b) => {
    if (a.topic === topic && b.topic !== topic) return -1;
    if (b.topic === topic && a.topic !== topic) return 1;
    return 0;
  });
}

