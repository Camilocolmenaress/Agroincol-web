import { BUSINESS } from './constants';

// Configuración de las landings de pauta (Meta). Una por plaga, porque la página
// tiene que continuar la conversación que abrió el anuncio (message match).
// El año NUNCA se escribe a mano: sale de BUSINESS.founded para que la landing
// no pueda contradecir al resto del sitio ni al schema markup.

export const FOUNDED = BUSINESS.founded;
export const YEARS_ACTIVE = new Date().getFullYear() - FOUNDED;

/** Corte horario para servicio el mismo día. Un plazo exacto vende; "rápido" no. */
export const SAME_DAY_CUTOFF = '11:30 a.m.';

export const METRO_MUNICIPALITIES = [
  'Bucaramanga',
  'Floridablanca',
  'Girón',
  'Piedecuesta',
] as const;

export const OTHER_MUNICIPALITY = 'Otro municipio de Santander';

export const CALL_SLOTS = [
  'Ahora mismo',
  'En la mañana',
  'En la tarde',
  'En la noche',
] as const;

export interface TreatmentStep {
  title: string;
  text: string;
}

export interface LandingConfig {
  slug: 'chinches' | 'comejen';
  pest: string;
  /** Tipo de servicio que viaja al webhook. */
  serviceType: string;
  metaTitle: string;
  metaDescription: string;
  /** Titular del hero, partido para poder darle jerarquía tipográfica. */
  headline: string;
  headlineAccent: string;
  price: number;
  visits: number;
  steps: TreatmentStep[];
  signs: string[];
  faqs: { question: string; answer: string }[];
  whatsappText: string;
  /** Foto de una infestación real de esta plaga, junto a la del equipo. */
  infestationImage: string;
  infestationAlt: string;
}

const money = (n: number) => `$${n.toLocaleString('es-CO')}`;

export const CHINCHES: LandingConfig = {
  slug: 'chinches',
  pest: 'chinches',
  serviceType: 'Control de Chinches',
  metaTitle: 'Control de Chinches en Bucaramanga | AGROINCOL',
  metaDescription: `Acabamos con las chinches en 3 visitas por ${money(420000)}. Inspección sin costo y 60 días de garantía desde la última visita. Bucaramanga y todo Santander.`,
  headline: 'Nadie duerme con chinches en la casa.',
  headlineAccent: 'Las acabamos en 3 visitas. Si vuelven en 60 días, volvemos nosotros.',
  price: 420000,
  visits: 3,
  steps: [
    {
      title: 'Inspección sin costo',
      text: 'Revisamos colchones, somieres, cabeceras, zócalos, grietas, muebles y tomas eléctricas para mapear todos los focos de la infestación, no solo la cama.',
    },
    {
      title: 'Tratamiento de la habitación completa',
      text: 'Aplicamos productos con registro sanitario en colchones, costuras, zócalos, grietas y todos los escondites identificados, con técnicas que alcanzan donde los aerosoles caseros no llegan.',
    },
    {
      title: 'Visitas de seguimiento',
      text: 'Los huevos de chinche resisten la mayoría de tratamientos. Las visitas siguientes eliminan las ninfas recién nacidas y rompen el ciclo de reproducción definitivamente.',
    },
  ],
  signs: [
    'Ronchas rojas en hilera o en grupos de tres, en brazos, cuello, espalda y piernas.',
    'Manchas de sangre en las sábanas y puntos negros en las costuras del colchón y del somier.',
    'Insectos del tamaño de una semilla de manzana, café rojizo, en costuras, cabeceras y zócalos.',
  ],
  faqs: [
    {
      question: '¿Por qué no sirve cambiar el colchón?',
      answer: 'Porque las chinches no viven solo en el colchón. Viven en las uniones del marco, detrás del zócalo, en las grietas de la pared y hasta en los tomacorrientes. Un colchón nuevo en una habitación infestada vuelve a tener chinches en cuestión de días, y usted habrá gastado varias veces el valor del tratamiento sin resolver nada.',
    },
    {
      question: '¿Por qué son 3 visitas y no una sola?',
      answer: 'Los huevos de chinche resisten la mayoría de los tratamientos. La primera visita elimina los adultos y las ninfas; las siguientes eliminan lo que nace después y cierran el ciclo de reproducción. Un tratamiento de una sola visita deja los huevos vivos y la infestación regresa.',
    },
    {
      question: '¿Cuánto cuesta?',
      answer: `El tratamiento completo de chinches cuesta ${money(420000)} e incluye las 3 visitas. La inspección previa no tiene costo y es la que confirma el alcance real de la infestación antes de que usted decida.`,
    },
    {
      question: '¿Tengo que salir de la casa?',
      answer: 'El técnico le indica el tiempo de reingreso a la habitación tratada según el producto aplicado y las condiciones del inmueble. En la mayoría de los casos el resto de la vivienda se puede usar con normalidad.',
    },
    {
      question: '¿Qué cubre la garantía de 60 días?',
      answer: 'Si aparece actividad de chinches dentro de los 60 días siguientes a la última visita del tratamiento, volvemos sin costo adicional. El plazo se cuenta desde la última visita, no desde la primera. Aplican términos y condiciones que el técnico le explica antes de iniciar.',
    },
    {
      question: '¿Atienden fuera del área metropolitana?',
      answer: 'Sí. Atendemos todo Santander. En municipios fuera del área metropolitana de Bucaramanga aplica un recargo por movilidad que se le informa antes de agendar, nunca después.',
    },
  ],
  whatsappText: 'Hola, tengo chinches y quiero agendar la inspección sin costo.',
  infestationImage: '/images/lp/infestacion-chinches.webp',
  infestationAlt: 'Infestación severa de chinches en la costura de un colchón, con excremento y mudas',
};

export const COMEJEN: LandingConfig = {
  slug: 'comejen',
  pest: 'comején',
  serviceType: 'Control de Comején y Termitas',
  metaTitle: 'Control de Comején y Termitas en Bucaramanga | AGROINCOL',
  metaDescription: `Sacamos el comején en 2 visitas por ${money(340000)}. Inspección sin costo y 60 días de garantía desde la última visita. Bucaramanga y todo Santander.`,
  headline: 'El comején se come la casa por dentro.',
  headlineAccent: 'Lo sacamos en 2 visitas. Si vuelve en 60 días, volvemos nosotros.',
  price: 340000,
  visits: 2,
  steps: [
    {
      title: 'Inspección sin costo',
      text: 'Revisamos marcos, puertas, zócalos, vigas y muebles para encontrar hasta dónde llegó la colonia. Le decimos qué está comprometido y qué todavía no, con evidencia.',
    },
    {
      title: 'Tratamiento de la colonia',
      text: 'No basta con tratar la madera visible. Aplicamos sobre las galerías y las vías de acceso para llegar a la colonia completa, que es la única forma de que no vuelva a salir por otro lado.',
    },
    {
      title: 'Visita de verificación',
      text: 'La segunda visita confirma que la actividad cesó y cierra el tratamiento. De ahí arrancan los 60 días de garantía.',
    },
  ],
  signs: [
    'Polvillo o arenilla fina acumulada debajo de las puertas y en los marcos.',
    'Puertas, marcos, zócalos o vigas que suenan huecos al golpearlos o se hunden con presión leve.',
    'Pintura abombada, madera con ondas, o pequeñas alas transparentes cerca de ventanas y lámparas.',
  ],
  faqs: [
    {
      question: 'El polvillo aparece pero la madera se ve bien. ¿Es grave?',
      answer: 'El polvillo es lo que el comején expulsa cuando ya lleva meses comiendo por dentro. Para cuando se ve por fuera, las galerías ya están hechas. La madera se ve intacta hasta que se toca y suena hueca. Por eso la inspección es lo primero: le decimos exactamente hasta dónde llegó.',
    },
    {
      question: '¿Por qué son 2 visitas?',
      answer: 'La primera trata la colonia y sus vías de acceso. La segunda verifica que la actividad cesó y cierra el tratamiento. Desde esa última visita corren los 60 días de garantía.',
    },
    {
      question: '¿Cuánto cuesta?',
      answer: `El tratamiento completo de comején cuesta ${money(340000)} e incluye las 2 visitas. La inspección previa no tiene costo.`,
    },
    {
      question: '¿Hay que cambiar la madera dañada?',
      answer: 'Depende de cuánto avanzó. El tratamiento detiene la colonia; la madera que ya perdió estructura es una decisión aparte que usted toma con la información de la inspección. Lo que sí es seguro es que tratar hoy cuesta menos que reemplazar mañana.',
    },
    {
      question: '¿Qué cubre la garantía de 60 días?',
      answer: 'Si aparece actividad de comején dentro de los 60 días siguientes a la última visita del tratamiento, volvemos sin costo adicional. El plazo se cuenta desde la última visita, no desde la primera. Aplican términos y condiciones que el técnico le explica antes de iniciar.',
    },
    {
      question: '¿Atienden fuera del área metropolitana?',
      answer: 'Sí. Atendemos todo Santander. En municipios fuera del área metropolitana de Bucaramanga aplica un recargo por movilidad que se le informa antes de agendar, nunca después.',
    },
  ],
  whatsappText: 'Hola, creo que tengo comején y quiero agendar la inspección sin costo.',
  infestationImage: '/images/lp/infestacion-comejen.webp',
  infestationAlt: 'Marco de madera destruido por comején, con galerías y polvillo acumulado',
};

export const LANDINGS = { chinches: CHINCHES, comejen: COMEJEN } as const;

export function whatsappUrl(text: string) {
  return `https://wa.me/${BUSINESS.phoneRaw.replace('+', '')}?text=${encodeURIComponent(text)}`;
}

export { money };
