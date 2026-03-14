export const BUSINESS = {
  name: 'AGROINCOL',
  legalName: 'AGROINCOL',
  domain: 'https://agroincol.com',
  phone: '+57 310 789 1948',
  phoneRaw: '+573107891948',
  whatsappLink: 'https://wa.me/573107891948?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20fumigaci%C3%B3n',
  email: 'info@agroincol.com',
  address: {
    street: 'Cra 9 #3-34',
    city: 'Floridablanca',
    region: 'Santander',
    country: 'Colombia',
    full: 'Cra 9 #3-34, Floridablanca, Santander, Colombia',
  },
  geo: { lat: 7.0636, lng: -73.0897 },
  founded: 1985,
  experience: '40+',
  hours: {
    weekdays: '7:00 AM - 5:00 PM',
    saturday: '7:00 AM - 12:00 PM',
    sunday: 'Cerrado',
  },
  serviceAreas: ['Bucaramanga', 'Floridablanca', 'Piedecuesta', 'Girón'],
  slogan: '40 años protegiendo Santander',
  googleMapsLink: 'https://maps.google.com/?q=7.0636,-73.0897',
} as const;

export const SERVICES = [
  {
    slug: 'fumigacion-residencial',
    title: 'Fumigación Residencial',
    shortDescription: 'Proteja su hogar y familia de plagas con nuestro servicio certificado para casas y apartamentos.',
    icon: 'Home',
    keywords: ['fumigación residencial Bucaramanga', 'fumigar casa Bucaramanga'],
  },
  {
    slug: 'control-plagas-comercial',
    title: 'Control de Plagas Comercial',
    shortDescription: 'Soluciones integrales para oficinas, locales y establecimientos comerciales en el área metropolitana.',
    icon: 'Building2',
    keywords: ['control plagas comercial Bucaramanga', 'fumigación oficinas Santander'],
  },
  {
    slug: 'fumigacion-restaurantes',
    title: 'Fumigación para Restaurantes',
    shortDescription: 'Cumpla con la Resolución 2674 del INVIMA. Servicio especializado para el sector de alimentos.',
    icon: 'UtensilsCrossed',
    keywords: ['fumigación restaurantes Bucaramanga', 'control plagas restaurantes'],
    hasPage: true,
    href: '/servicios/fumigacion-restaurantes',
  },
  {
    slug: 'desratizacion',
    title: 'Desratización',
    shortDescription: 'Eliminación profesional de roedores con métodos seguros y seguimiento garantizado.',
    icon: 'MousePointer2',
    keywords: ['desratización Bucaramanga', 'control roedores Santander'],
  },
  {
    slug: 'control-insectos-voladores',
    title: 'Control de Insectos Voladores',
    shortDescription: 'Control efectivo de mosquitos, moscas y zancudos. Prevención de dengue y enfermedades vectoriales.',
    icon: 'Bug',
    keywords: ['control mosquitos Bucaramanga', 'fumigación dengue Santander'],
  },
  {
    slug: 'fumigacion-industrial',
    title: 'Fumigación Industrial',
    shortDescription: 'Servicio de control de plagas para bodegas, plantas de producción y zonas industriales.',
    icon: 'Factory',
    keywords: ['fumigación industrial Santander', 'control plagas bodegas'],
  },
] as const;

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Fumigación Restaurantes', href: '/servicios/fumigacion-restaurantes' },
  { label: 'Certificaciones', href: '/certificaciones-y-normativa' },
  { label: 'Herramientas', href: '/herramientas/calculadora-fumigacion' },
  { label: 'Contacto', href: '#contacto' },
] as const;

export const SERVICE_TYPE_OPTIONS = [
  'Fumigación Residencial',
  'Fumigación para Restaurantes',
  'Control de Plagas Comercial',
  'Desratización',
  'Control de Insectos Voladores',
  'Fumigación Industrial',
  'Otro',
] as const;

export const FAQS_RESTAURANTES = [
  {
    question: '¿Cada cuánto se debe fumigar un restaurante en Colombia?',
    answer: 'Según la normativa colombiana y las recomendaciones del INVIMA, un restaurante debe fumigar como mínimo cada 3 meses. En AGROINCOL ofrecemos planes trimestrales con seguimiento mensual para garantizar el cumplimiento continuo de la Resolución 2674 de 2013.',
  },
  {
    question: '¿Qué productos utilizan? ¿Son seguros para áreas de alimentos?',
    answer: 'Utilizamos productos registrados ante el ICA (Instituto Colombiano Agropecuario) y aprobados por la OMS para uso en áreas de manipulación de alimentos. Son de baja toxicidad para humanos y animales domésticos, pero altamente efectivos contra plagas.',
  },
  {
    question: '¿Necesito cerrar mi restaurante durante la fumigación?',
    answer: 'Depende del tipo de tratamiento. Muchos de nuestros servicios se realizan en horarios de baja actividad (antes de la apertura o después del cierre) para no interrumpir su operación. Coordinamos con usted el mejor momento.',
  },
  {
    question: '¿El certificado de fumigación es válido ante el INVIMA y la Secretaría de Salud?',
    answer: 'Sí. AGROINCOL emite un certificado de fumigación que cumple con los requisitos del Decreto 1843 de 1991 y es válido como soporte documental ante visitas de inspección del INVIMA y la Secretaría de Salud de Santander.',
  },
  {
    question: '¿Cuánto tiempo toma el servicio de fumigación en un restaurante?',
    answer: 'El tiempo varía según el tamaño del establecimiento. Para un restaurante promedio, el servicio completo (inspección + aplicación) toma entre 1 y 3 horas. Entregamos el certificado el mismo día del servicio.',
  },
  {
    question: '¿Ofrecen planes de mantenimiento para restaurantes?',
    answer: 'Sí. Tenemos planes trimestrales, bimestrales y mensuales diseñados específicamente para el sector de alimentos. Cada plan incluye inspecciones programadas, aplicaciones preventivas, certificados actualizados y un informe de seguimiento.',
  },
] as const;
