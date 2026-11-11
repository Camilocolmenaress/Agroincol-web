// Textos de la página de las láminas. Salen de la "Guía de ubicación y uso"
// (public/tienda/laminas/guia-laminas-de-captura.pdf) y de las respuestas de
// Camilo del 9-nov-2026. Trato de usted.
//
// PROHIBIDO aquí (brief): "reposición instantánea", "evita sellos/clausuras",
// "cumple normas sanitarias", "100 %", "inofensiva", "humana", "no tóxico",
// fumigación, inspección, promesas de capturas o resultados. lib/laminas-contenido.test.ts lo vigila.

import { BUSINESS } from './constants';
import { ENTREGA_AM, ENVIO_AM, ENVIO_FUERA, GARANTIA, RECLAMO, money } from './laminas';

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export interface Testimonio {
  nombre: string;
  negocio: string;
  municipio: string;
  texto: string;
}

/** Vacío a propósito: Camilo pasa testimonios reales después. Vacío = la sección no se pinta. */
export const TESTIMONIOS: Testimonio[] = [];

export const CUIDADOS: { titulo: string; texto: string }[] = [
  { titulo: 'Solo adentro', texto: 'Nunca en patios, jardines ni terrazas.' },
  { titulo: 'Lejos de niños y mascotas', texto: 'El pegante también atrapa pelo y plumas.' },
  { titulo: 'Use guantes', texto: 'Para instalar, revisar y botar.' },
  { titulo: 'No toque el pegante', texto: 'Agárrela solo por el borde verde.' },
  { titulo: 'Lejos de la comida', texto: 'Nunca sobre mesones, platos ni alimentos.' },
  { titulo: 'Lejos del agua', texto: 'Mojada deja de pegar.' },
];

export const PASOS: { titulo: string; texto: string }[] = [
  { titulo: 'Limpie y seque', texto: 'Barra el punto. Sin polvo ni agua la lámina dura más.' },
  { titulo: 'Abra por el doblez', texto: 'Agárrela solo por el borde verde.' },
  { titulo: 'Quite el papel', texto: 'Despéguelo despacio, sin tocar el pegante.' },
  { titulo: 'Dóblela en L', texto: 'Una mitad en el piso y la otra contra la pared. El doblez va en la esquina.' },
  { titulo: 'Anote la fecha', texto: 'Escriba el día en el borde. Así sabe cuándo cambiarla.' },
];

export const PUNTOS: { titulo: string; texto: string }[] = [
  { titulo: 'Detrás de la nevera.', texto: 'El motor da calor y nadie mira ahí.' },
  { titulo: 'Al lado de la estufa.', texto: 'Donde caen migas y hay calor.' },
  { titulo: 'Debajo del lavaplatos.', texto: 'Agua, tubos y oscuridad.' },
  { titulo: 'Esquinas de la bodega.', texto: 'Toda esquina es un cruce de caminos.' },
  { titulo: 'Base de estanterías y estibas.', texto: 'Detrás de la mercancía, contra la pared.' },
  { titulo: 'Junto a las puertas.', texto: 'Por ahí entran y salen.' },
];

/** Los primeros días después de instalar (guía, pág. 6). Lo usan la página y el checkout. */
export const PRIMEROS_DIAS: { d: string; t: string }[] = [
  { d: 'Día 1', t: 'Instale' },
  { d: 'Días 2 a 14', t: 'Revise todos los días, sin moverla' },
  { d: 'Semana 3', t: '¿Sigue limpia? Pruebe otro punto' },
];

export const NO_ATRAPO: { pregunta: string; accion: string; porque: string }[] = [
  { pregunta: '¿Está contra la pared?', accion: 'NO → Pásela a la pared.', porque: 'Es la causa más común.' },
  { pregunta: '¿La movió seguido?', accion: 'SÍ → Déjela quieta.', porque: 'Desconfían de lo nuevo.' },
  { pregunta: '¿Tiene polvo o humedad?', accion: 'SÍ → Cámbiela.', porque: 'El polvo le quita el pegue.' },
];

export const PREGUNTAS: Pregunta[] = [
  {
    pregunta: '¿Cuántas láminas necesito?',
    respuesta:
      'Cuente paredes, no metros cuadrados: 1 lámina cada 3 metros de pared, más 1 por puerta. Una cocina de 4 × 5 m con una bodega de 3 × 3 m y dos puertas necesita 12.',
  },
  {
    pregunta: '¿Dónde las pongo?',
    respuesta:
      'Siempre con un lado contra la pared, en el camino que ellos ya usan: detrás de la nevera, al lado de la estufa, debajo del lavaplatos, en las esquinas de la bodega, en la base de estanterías y estibas, y junto a las puertas. Donde vea excremento, mordidas o rastros, ponga dos láminas juntas.',
  },
  {
    pregunta: '¿En cuánto tiempo llega?',
    respuesta: `${ENTREGA_AM} (Bucaramanga, Floridablanca, Girón y Piedecuesta). Fuera del área metropolitana se envía por transportadora y le mandamos la guía de seguimiento por WhatsApp.`,
  },
  {
    pregunta: '¿Cuánto cuesta el envío?',
    respuesta: `En el área metropolitana: ${money(ENVIO_AM)} de 6 a 11 láminas y gratis desde 12. Fuera del área metropolitana: ${money(ENVIO_FUERA)} por pedido.`,
  },
  {
    pregunta: '¿Cómo puedo pagar?',
    respuesta:
      'En línea con tarjeta o PSE, por transferencia a Bancolombia, Nequi o Bre-B, o en efectivo al recibir. El pago contra entrega es solo para el área metropolitana.',
  },
  {
    pregunta: '¿Me dan factura?',
    respuesta: 'Sí, factura electrónica. Al hacer el pedido escoja NIT y escriba el de su negocio.',
  },
  { pregunta: '¿Qué pasa si llega dañado o la lámina no pega?', respuesta: `${GARANTIA} ${RECLAMO}` },
  {
    pregunta: '¿Cómo vienen empacadas?',
    respuesta:
      'En la caja original del fabricante, con 2 láminas por caja. Cada lámina es plegable, como un libro: dos mitades con pegante y un borde verde. El pegante viene cubierto con un papel protector.',
  },
  {
    pregunta: '¿Las puedo poner donde hay niños o mascotas?',
    respuesta: 'Póngalas donde niños y mascotas no lleguen: el pegante también atrapa pelo y plumas. Úselas solo adentro, lejos de la comida y del agua.',
  },
  {
    pregunta: '¿Cuándo la cambio y cómo la boto?',
    respuesta:
      'Cámbiela cuando atrapó algo, cuando tiene polvo o suciedad, o si se mojó. Para botarla: con guantes, ciérrela como un libro con el pegante adentro, métala en una bolsa, amárrela y bótela con la basura. Nunca la queme ni la deje en la calle, y nunca reutilice una lámina usada.',
  },
];

/**
 * Sello del estudio (el "Tested by Light Labs" de Grüns). Cifras copiadas del
 * resumen publicado; nunca "las láminas fueron probadas por…": el estudio mide
 * por dónde caminan las ratas, que es la regla de oro de la guía.
 */
export const ESTUDIO = {
  institucion: 'Universidad Nacional de Colombia',
  anio: 2008,
  cita: 'Lamprea, Cardenas, Setem y Morato. "Thigmotactic responses in an open-field". Braz. J. Med. Biol. Res. 41(2):135-140',
  url: 'https://refinementdatabase.org/publications/thigmotactic-responses-in-an-open-field/',
  /** Segundos promedio por cuadro según cuántas paredes tenía (primer campo abierto del estudio). */
  segundos: { esquina: 37.2, pared: 7.7, centro: 1.8 },
};

/**
 * Tabla "Nosotros vs. ellos" de Grüns, con lo que dicen las guías de
 * extensión de universidades de EE. UU. Solo filas con fuente y nada sobre
 * toxicidad (ver la lista PROHIBIDO arriba).
 * true = sí, false = no, null = no aplica.
 */
export const COMPARACION: { fila: string; laminas: boolean | null; veneno: boolean | null; golpe: boolean | null; fuente: number }[] = [
  { fila: 'Usted ve si atrapó algo', laminas: true, veneno: false, golpe: true, fuente: 1 },
  { fila: 'Sin olor de animales muertos escondidos', laminas: true, veneno: false, golpe: true, fuente: 1 },
  { fila: 'Indicada donde el veneno es un problema', laminas: true, veneno: false, golpe: true, fuente: 2 },
  { fila: 'Sin riesgo de golpearse los dedos al ponerla', laminas: true, veneno: null, golpe: false, fuente: 3 },
];

export const FUENTES_COMPARACION = [
  { n: 1, texto: 'University of California, Pest Notes: House Mouse', url: 'https://ipm.ucanr.edu/legacy_assets/pdf/pestnotes/pnhousemouse.pdf' },
  { n: 2, texto: 'University of Kentucky, ENTFACT-617', url: 'https://entomology.mgcafe.uky.edu/ef617' },
  { n: 3, texto: 'NC State Extension', url: 'https://content.ces.ncsu.edu/surveillance-and-management-of-common-structure-invading-mice' },
];

export const WHATSAPP_TEXTO = 'Hola, tengo una pregunta sobre las Láminas de Captura';

export function whatsappLaminas(texto: string = WHATSAPP_TEXTO): string {
  return `https://wa.me/${BUSINESS.phoneRaw.replace('+', '')}?text=${encodeURIComponent(texto)}`;
}
