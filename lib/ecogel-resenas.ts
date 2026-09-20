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

import type { Caso, Segmento } from './ecogel';

export interface ResenaEcogel {
  nombre: string;
  ciudad: string;
  estrellas: 1 | 2 | 3 | 4 | 5;
  /** Titular corto en negrita (tarjeta bajo el antes/después). Opcional. */
  titulo?: string;
  texto: string;
  /** Fecha de la reseña, ISO (AAAA-MM-DD). Se muestra arriba de cada reseña. */
  fecha: string;
  placeholder: boolean;
}

export const RESENAS_ECOGEL: ResenaEcogel[] = [
  {
    nombre: 'Nombre de ejemplo',
    ciudad: 'Ciudad',
    estrellas: 5,
    titulo: 'Ejemplo: Se acabaron de verdad',
    texto: 'A los dos días dejé de ver cucarachas en la cocina. Fácil de aplicar y sin olor.',
    fecha: '2026-09-01',
    placeholder: true,
  },
  {
    nombre: 'Nombre de ejemplo',
    ciudad: 'Ciudad',
    estrellas: 5,
    texto: 'Lo usé detrás de la nevera y la estufa. En una semana no quedó ninguna.',
    fecha: '2026-09-01',
    placeholder: true,
  },
  {
    nombre: 'Nombre de ejemplo',
    ciudad: 'Ciudad',
    estrellas: 4,
    texto: 'Funcionó, aunque tardó más de lo que esperaba en los baños.',
    fecha: '2026-09-01',
    placeholder: true,
  },
];

export const CASOS_ECOGEL: Record<Segmento, Caso[]> = {
  hogar: [
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'Cucarachas alemanas detrás de la nevera desde hace 3 meses',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'Apartamento nuevo con cucarachas que venían del ducto',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'Bebé en casa: no quería usar aerosol',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
  ],
  restaurantes: [
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'Visita de sanidad en 10 días y cucarachas bajo la plancha',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'No podía cerrar el local para fumigar',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'Prevención entre fumigaciones trimestrales',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
  ],
};

export function resumenResenas() {
  const distribucion: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let suma = 0;
  RESENAS_ECOGEL.forEach((r) => {
    distribucion[r.estrellas] += 1;
    suma += r.estrellas;
  });
  const total = RESENAS_ECOGEL.length;
  return {
    promedio: total ? Math.round((suma / total) * 10) / 10 : 0,
    total,
    distribucion,
    esEjemplo: RESENAS_ECOGEL.some((r) => r.placeholder),
  };
}
