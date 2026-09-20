// Todo lo que las landings y el checkout de EcoGel necesitan saber del producto:
// precios, copy por público y garantía. Sin imports de Node: lo usan cliente y servidor.
//
// Los precios viven SOLO aquí. El servidor recalcula el total desde este archivo;
// lo que mande el navegador nunca se usa como precio.

import { BUSINESS } from './constants';

export type Unidades = 1 | 2 | 3;
export type MetodoPago = 'online' | 'bancolombia' | 'nequi' | 'breb' | 'contraentrega';
export type Segmento = 'hogar' | 'restaurantes';

export interface Tier {
  unidades: Unidades;
  /** Precio del producto, sin envío. */
  producto: number;
  /** Lo que paga el cliente por el envío. 0 = gratis. */
  envio: number;
  /** Texto corto bajo el número de unidades. */
  etiqueta: string;
  masVendido: boolean;
}

export const PRECIO_UNIDAD = 39_900;
export const ENVIO_BASE = 20_000;
/** Descuento por pedido cuando NO es contraentrega: neutraliza el costo del rechazo contraentrega. */
export const DESCUENTO_ONLINE = 5_000;
export const TIER_POR_DEFECTO: Unidades = 3;

/** Cuentas reales para los métodos de pago manuales (sin pasarela: alguien confirma a mano en la hoja). */
export const CUENTAS_MANUALES = {
  bancolombia: { banco: 'Bancolombia', tipo: 'Ahorros', numero: '799-114544-54', titular: 'Erwing Andrés Colmenares Tuirán', cedula: '1095786836' },
  nequi: { numero: '3150642289', titular: 'Erwing Camilo Colmenares Gomez' },
  breb: { llave: '@ECG611', banco: 'Nu', titular: 'Erwing Camilo Colmenares Gomez' },
} as const;

export const TIERS: readonly Tier[] = [
  { unidades: 1, producto: PRECIO_UNIDAD, envio: ENVIO_BASE, etiqueta: 'Para probar', masVendido: false },
  { unidades: 2, producto: PRECIO_UNIDAD * 2, envio: 10_000, etiqueta: 'Cocina + baño', masVendido: false },
  { unidades: 3, producto: PRECIO_UNIDAD * 3, envio: 0, etiqueta: 'Todo el espacio · envío gratis', masVendido: true },
];

export function esUnidades(valor: unknown): valor is Unidades {
  return valor === 1 || valor === 2 || valor === 3;
}

export function tierDe(unidades: number): Tier {
  const tier = TIERS.find((t) => t.unidades === unidades);
  if (!tier) throw new Error(`tier inválido: ${unidades}`);
  return tier;
}

export function totalPedido(unidades: Unidades, metodo: MetodoPago) {
  const tier = tierDe(unidades);
  const descuento = metodo === 'contraentrega' ? 0 : DESCUENTO_ONLINE;
  return {
    producto: tier.producto,
    envio: tier.envio,
    descuento,
    total: tier.producto + tier.envio - descuento,
  };
}

export function money(n: number): string {
  return `$${n.toLocaleString('es-CO')}`;
}

// ---------------------------------------------------------------------------
// Copy por público
// ---------------------------------------------------------------------------

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export interface EcogelConfig {
  segmento: Segmento;
  metaTitle: string;
  metaDescription: string;
  /** H1: promesa + plazo. */
  titulo: string;
  /** Línea bajo el H1. */
  subtitulo: string;
  /** 4 beneficios cortos con ícono (nombre de ícono de lucide). */
  beneficios: { icono: 'ShieldCheck' | 'Wind' | 'Timer' | 'Bug' | 'Store' | 'Utensils' | 'FileCheck'; texto: string }[];
  /** "Qué es y cómo funciona": 3 párrafos antes del CTA. El tercero se pinta en cursiva. */
  queEs: [string, string, string];
  /** "Pagas lo mismo que…" de Lummia. */
  reencuadre: string;
  /** 5 objeciones en acordeón, pantalla 3. */
  objeciones: Pregunta[];
  /** 4 bloques largos. */
  beneficiosLargos: { titulo: string; texto: string }[];
  /** FAQ larga, al final. */
  preguntas: Pregunta[];
  /** Texto con el que abre WhatsApp. */
  whatsappTexto: string;
}

export const GARANTIA = {
  titulo: 'Si en 30 días siguen, te enviamos otro kit sin costo',
  texto: 'Nos escribes por WhatsApp con una foto y te despachamos la reposición. Sin formularios ni devoluciones.',
  dias: 30,
} as const;

export const AUTORIDAD = {
  anios: new Date().getFullYear() - BUSINESS.founded,
  /** PLACEHOLDER: confirmar con Camilo el número real antes de pautar. */
  restaurantes: '+N',
} as const;

const OBJECIONES_COMUNES: Pregunta[] = [
  {
    pregunta: '¿Cuándo hace efecto?',
    respuesta:
      'Las primeras cucarachas caen en 24-48 horas. Como el gel actúa con retardo, cada una que lo come contamina a las demás en el nido: la colonia completa cae en 1-2 semanas (Journal of Economic Entomology, 2000 y 2023).',
  },
  {
    pregunta: '¿Cuánto rinde una jeringa?',
    respuesta:
      'Una jeringa de 5 g alcanza para una cocina y un baño (unos 30-40 puntos del tamaño de un grano de arroz). Para una casa completa o una infestación fuerte recomendamos 3.',
  },
  {
    pregunta: '¿Y si no funciona?',
    respuesta: `${GARANTIA.titulo}. ${GARANTIA.texto}`,
  },
  {
    pregunta: '¿Cómo se aplica?',
    respuesta:
      'Puntos pequeños en rendijas, detrás de la nevera y la estufa, bajo el lavaplatos y en las esquinas de los gabinetes. Sin desalojar, sin tapar comida, sin olor. Con el pedido llega la guía paso a paso.',
  },
];

const PREGUNTAS_ENVIO_PAGO: Pregunta[] = [
  {
    pregunta: '¿Cuánto tarda el envío?',
    respuesta: '2 a 4 días hábiles a todo Colombia por transportadora. Te enviamos la guía por WhatsApp.',
  },
  {
    pregunta: '¿Cómo puedo pagar?',
    respuesta:
      'En línea con PSE, Nequi o tarjeta (con $5.000 de descuento) o en efectivo al recibir el paquete.',
  },
  {
    pregunta: '¿Cómo reclamo la garantía?',
    respuesta: `Si a los ${GARANTIA.dias} días siguen viendo cucarachas, nos escribes por WhatsApp con una foto y te enviamos otro kit sin costo.`,
  },
];

export const HOGAR: EcogelConfig = {
  segmento: 'hogar',
  metaTitle: 'EcoGel: cocina sin cucarachas en 48 horas',
  metaDescription:
    'Gel profesional para cucarachas, seguro con niños y mascotas. Envío a todo Colombia, paga en línea o al recibir. Garantía de 30 días.',
  titulo: 'Cocina sin cucarachas en 48 horas, sin fumigar ni salir de casa',
  subtitulo: 'El mismo gel que usamos en nuestras fumigaciones, en una jeringa que aplicas tú en 10 minutos.',
  beneficios: [
    { icono: 'ShieldCheck', texto: 'Seguro con niños y mascotas: lleva Bitrex' },
    { icono: 'Wind', texto: 'Sin olor, sin desalojar, sin tapar la comida' },
    { icono: 'Timer', texto: 'Primeros resultados en 24-48 horas' },
    { icono: 'Bug', texto: 'Elimina la colonia, no solo la que ves' },
  ],
  queEs: [
    'EcoGel es un cebo en gel para cucarachas: no las espanta, las atrae. Se aplica en puntos del tamaño de un grano de arroz en las rendijas donde viven, y ellas lo comen.',
    'Actúa con retardo: la que come vuelve al nido y contamina a las demás. Por eso en 24-48 horas ves las primeras caer y en 1-2 semanas desaparece la colonia, no solo la que viste.',
    'Lleva Bitrex, el amargante más potente que existe: si un niño o una mascota lo toca con la boca, lo escupe. Sin olor, sin vapores, sin salir de la casa.',
  ],
  reencuadre: 'Menos que el mercado que botas por una infestación',
  objeciones: [
    {
      pregunta: '¿Es seguro con niños y mascotas?',
      respuesta:
        'Sí. Lleva Bitrex, la sustancia más amarga que existe: si un niño o una mascota lo toca con la boca, lo escupe de inmediato. Se aplica en rendijas donde ellos no llegan, y no hay olor ni vapores. Y quitar las cucarachas importa: el NEJM asoció su presencia con el triple de hospitalizaciones en niños asmáticos.',
    },
    ...OBJECIONES_COMUNES,
  ],
  beneficiosLargos: [
    {
      titulo: 'Ataca el nido, no la cucaracha que viste',
      texto:
        'El aerosol mata la que sale y deja las 40 que están detrás de la nevera. El gel se lo llevan al nido y lo comparten: cae la colonia completa.',
    },
    {
      titulo: 'Sin olor y sin salir de la casa',
      texto:
        'No tienes que tapar la comida, sacar a los niños ni ventilar. Aplicas los puntos y sigues con tu día.',
    },
    {
      titulo: 'Diez minutos, una vez',
      texto:
        'Puntos del tamaño de un grano de arroz en los lugares que te indica la guía. El gel sigue actuando semanas después.',
    },
    {
      titulo: 'Respaldo de una fumigadora de verdad',
      texto: `Lo aplicamos hace ${new Date().getFullYear() - BUSINESS.founded} años en casas y restaurantes. No es un producto de importador: es lo que usan nuestros técnicos.`,
    },
  ],
  preguntas: [
    {
      pregunta: '¿Es seguro con niños y mascotas?',
      respuesta:
        'Sí. Lleva Bitrex, la sustancia más amarga que existe, y se aplica en rendijas donde ellos no llegan. Sin olor ni vapores.',
    },
    ...OBJECIONES_COMUNES,
    ...PREGUNTAS_ENVIO_PAGO,
    {
      pregunta: '¿Y si la infestación es muy grande?',
      respuesta:
        'Si ves cucarachas de día o en varias habitaciones, el gel ayuda pero lo honesto es una fumigación profesional. Escríbenos y te decimos cuál es tu caso.',
    },
  ],
  whatsappTexto: 'Hola, tengo una pregunta sobre EcoGel para mi casa',
};

export const RESTAURANTES: EcogelConfig = {
  segmento: 'restaurantes',
  metaTitle: 'EcoGel: cero cucarachas en tu cocina antes de sanidad',
  metaDescription:
    'Gel profesional para cucarachas apto para zona de alimentos, con registro INVIMA. Sin cerrar el local. Envío a todo Colombia.',
  titulo: 'Cero cucarachas en tu cocina antes de la próxima visita de sanidad',
  subtitulo: 'El gel que usamos en restaurantes, sin cerrar el local ni parar la cocina.',
  beneficios: [
    { icono: 'Store', texto: 'Sin cerrar el local ni parar un turno' },
    { icono: 'Utensils', texto: 'Apto para zona de alimentos: sin olor ni residuos' },
    { icono: 'Timer', texto: 'Actúa en 24-48 horas' },
    { icono: 'FileCheck', texto: 'Registro sanitario INVIMA 2009V0004964' },
  ],
  queEs: [
    'EcoGel es el cebo en gel que usamos en cocinas de restaurantes: se aplica en rendijas, bajo equipos y en zócalos, nunca sobre superficies de trabajo.',
    'Actúa con retardo: la cucaracha que lo come vuelve al nido y contamina a la colonia. Primeros resultados en 24-48 horas, colonia completa en 1-2 semanas.',
    'Sin olor, sin vapores y sin cerrar: diez minutos después del cierre, con la cocina apagada, y al día siguiente abres normal. Registro sanitario INVIMA 2009V0004964.',
  ],
  reencuadre: 'Menos que un cliente que ve una cucaracha y no vuelve',
  objeciones: [
    {
      pregunta: '¿Puedo aplicarlo con la cocina funcionando?',
      respuesta:
        'Sí. Se aplica en rendijas, bajo equipos y en zócalos, nunca sobre superficies de trabajo. No hay olor, no hay vapores y no hay que cerrar. La Resolución 2674 exige control de plagas; el gel cumple sin cerrar.',
    },
    ...OBJECIONES_COMUNES,
  ],
  beneficiosLargos: [
    {
      titulo: 'Lo que sanidad no debe encontrar',
      texto:
        'Una cucaracha en la inspección es un hallazgo crítico. El gel llega a las rendijas de los equipos donde el aerosol no entra y donde el inspector sí mira.',
    },
    {
      titulo: 'Sin cerrar ni un turno',
      texto:
        'Diez minutos después del cierre, con la cocina apagada. Al día siguiente abres normal.',
    },
    {
      titulo: 'Prevención, no solo emergencia',
      texto:
        'Un kit cada 2-3 meses en los puntos críticos mantiene la cocina limpia entre fumigaciones.',
    },
    {
      titulo: 'Respaldo de una fumigadora de verdad',
      texto: `Llevamos ${new Date().getFullYear() - BUSINESS.founded} años atendiendo restaurantes. Este es el gel que aplican nuestros técnicos.`,
    },
  ],
  preguntas: [
    {
      pregunta: '¿Puedo aplicarlo con la cocina funcionando?',
      respuesta: 'Sí. Va en rendijas y bajo equipos, nunca sobre superficies de trabajo. Sin olor ni vapores.',
    },
    ...OBJECIONES_COMUNES,
    ...PREGUNTAS_ENVIO_PAGO,
    {
      pregunta: '¿Sirve como plan de control de plagas para sanidad?',
      respuesta:
        'El gel es parte del control, no el plan completo. Sanidad pide un programa con registros y una empresa certificada. Si estás en Santander, nosotros lo hacemos; si no, te orientamos.',
    },
  ],
  whatsappTexto: 'Hola, tengo una pregunta sobre EcoGel para mi restaurante',
};

export function configDe(segmento: Segmento): EcogelConfig {
  return segmento === 'restaurantes' ? RESTAURANTES : HOGAR;
}

export function esSegmento(valor: unknown): valor is Segmento {
  return valor === 'hogar' || valor === 'restaurantes';
}

export function whatsappEcogel(texto: string): string {
  return `https://wa.me/${BUSINESS.phoneRaw.replace('+', '')}?text=${encodeURIComponent(texto)}`;
}
