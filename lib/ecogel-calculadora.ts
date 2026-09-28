// Calculadora de jeringas: dos respuestas → cuántas unidades recomendar.
// La regla es la que ya publica la ficha (OBJECIONES_COMUNES en lib/ecogel.ts):
// una jeringa alcanza para cocina y baño; para toda la casa, un local o una
// infestación fuerte, 3. No da descuento ni pide datos.

import type { Unidades } from './ecogel';

export type Espacio = 'cocina' | 'cocina_bano' | 'todo';
export type Cantidad = 'pocas' | 'varias' | 'muchas';

export const ESPACIOS: { id: Espacio; texto: string }[] = [
  { id: 'cocina', texto: 'Solo en la cocina' },
  { id: 'cocina_bano', texto: 'Cocina y baño' },
  { id: 'todo', texto: 'Toda la casa o el local' },
];

export const CANTIDADES: { id: Cantidad; texto: string }[] = [
  { id: 'pocas', texto: 'Pocas, de noche' },
  { id: 'varias', texto: 'Varias cada día' },
  { id: 'muchas', texto: 'Muchas, también de día' },
];

export function recomendarUnidades(espacio: Espacio, cantidad: Cantidad): { unidades: Unidades; porque: string } {
  if (espacio === 'todo' || cantidad === 'muchas') {
    return { unidades: 3, porque: 'Para toda la casa o una infestación fuerte se necesitan 3 jeringas: así cubres cada punto donde se esconden.' };
  }
  if (cantidad === 'varias') {
    return { unidades: 2, porque: 'Si las ves cada día, hay un nido activo: con 2 jeringas repites la aplicación sin quedarte corto.' };
  }
  return { unidades: 1, porque: 'Una jeringa de 5 g alcanza para una cocina y un baño, unos 30 a 40 puntos.' };
}
