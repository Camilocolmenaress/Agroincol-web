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
  { label: 'Precios', href: '/precios' },
  { label: 'Blog', href: '/blog' },
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

export const FAQS_DESRATIZACION = [
  {
    question: '¿Cuánto tiempo toma ver resultados después del servicio de desratización?',
    answer: 'Los primeros resultados se observan entre 24 y 72 horas después del tratamiento. Sin embargo, la eliminación completa de la infestación, incluyendo roedores que puedan estar en zonas no tratadas directamente, puede tomar entre 7 y 14 días. Realizamos visitas de seguimiento para verificar la efectividad del tratamiento.',
  },
  {
    question: '¿Es seguro el servicio de desratización si tengo mascotas o niños en casa?',
    answer: 'Sí, siempre y cuando se sigan las indicaciones del técnico. Los productos que utilizamos están registrados ante el ICA y son de uso controlado. Recomendamos mantener mascotas y niños fuera del área tratada durante el tiempo indicado por el técnico, que generalmente es de 2 a 4 horas.',
  },
  {
    question: '¿Cómo sé si tengo una infestación de roedores o solo fue un ratón ocasional?',
    answer: 'Las señales de infestación incluyen: heces de roedores (pequeñas y oscuras), marcas de dientes en cables, madera o alimentos, ruidos nocturnos en paredes o techos, olores a orina, y avistamiento de roedores durante el día. Si observa dos o más de estas señales, es probable que tenga una infestación activa.',
  },
  {
    question: '¿En qué consiste el sellado de puntos de entrada?',
    answer: 'El sellado de puntos de entrada es una parte fundamental de nuestro servicio. Identificamos todas las grietas, huecos alrededor de tuberías, espacios bajo puertas y otras vías de acceso que usan los roedores. Luego los cerramos con materiales resistentes a roedores como malla metálica, cemento o espuma selladora especial. Esto evita que nuevos roedores entren una vez eliminados los existentes.',
  },
  {
    question: '¿Cuánto cuesta un servicio de desratización en Bucaramanga?',
    answer: 'El costo varía según el tamaño de la propiedad, el nivel de infestación y el tipo de tratamiento necesario. Ofrecemos diagnóstico gratuito y sin compromiso para dar un presupuesto exacto. En general, un servicio básico para una vivienda parte desde precios accesibles, con planes de seguimiento disponibles para casos más severos.',
  },
  {
    question: '¿Con qué frecuencia se debe hacer desratización preventiva?',
    answer: 'Para propiedades residenciales en zonas urbanas de Bucaramanga, recomendamos un servicio preventivo cada 6 meses. Para establecimientos comerciales, bodegas o propiedades cercanas a alcantarillados o mercados, lo ideal es cada trimestre. Un programa preventivo regular es mucho más económico que tratar una infestación avanzada.',
  },
] as const;

export const FAQS_INSECTOS_VOLADORES = [
  {
    question: '¿Cuánto tiempo toma ver resultados después del tratamiento contra mosquitos?',
    answer: 'Los adultos son eliminados en las primeras 24 horas después del tratamiento. Sin embargo, el ciclo completo de control (incluyendo larvicidas para huevos y larvas) toma entre 7 y 14 días. Realizamos visita de seguimiento para verificar la efectividad y tratar posibles criaderos residuales.',
  },
  {
    question: '¿El tratamiento es seguro si tengo niños pequeños o mascotas en casa?',
    answer: 'Sí. Los productos que utilizamos están registrados ante el ICA y aprobados por la OMS para uso en áreas residenciales. Recomendamos mantener niños y mascotas fuera del área tratada durante 2 a 3 horas mientras los productos se secan. Después de ese tiempo, el espacio es completamente seguro.',
  },
  {
    question: '¿Con qué frecuencia se debe hacer el control de mosquitos en Bucaramanga?',
    answer: 'En el Área Metropolitana de Bucaramanga, recomendamos tratamientos preventivos cada 2 a 3 meses, con énfasis especial antes y durante las temporadas de lluvias (marzo-junio y septiembre-octubre). Para empresas, restaurantes o establecimientos con alta exposición, un plan mensual garantiza mayor efectividad.',
  },
  {
    question: '¿Pueden eliminar un nido de abejas o avispas en mi propiedad?',
    answer: 'Sí. AGROINCOL realiza retiro seguro de nidos de abejas y avispas con equipos de protección especializado. No intente eliminarlo por su cuenta: algunas especies reaccionan agresivamente ante perturbaciones y pueden representar un riesgo serio. Contáctenos para una evaluación y retiro seguro.',
  },
  {
    question: '¿El tratamiento también elimina huevos y larvas, o solo los adultos?',
    answer: 'Nuestro servicio es de ciclo completo: incluye adulticidas para eliminar los mosquitos adultos visibles, y larvicidas aplicados en posibles criaderos (recipientes con agua, canales, zonas húmedas) para interrumpir el ciclo de reproducción. Esto es clave para evitar que la población se recupere en pocos días.',
  },
  {
    question: '¿Qué debo hacer para preparar mi hogar o negocio antes del tratamiento?',
    answer: 'Retire o cubra alimentos y utensilios de cocina expuestos. Si tiene peceras, apague el aireador y cubra el tanque. Aleje mascotas y plantas del área de tratamiento. Deje acceso a todas las áreas interiores y exteriores donde haya actividad de insectos. El técnico le dará instrucciones específicas según las características de su propiedad.',
  },
] as const;

export const BLOG_POSTS = [
  {
    slug: 'auditoria-invima-como-preparar-restaurante',
    title: 'Auditoría del INVIMA: Cómo Preparar su Restaurante para Pasar sin Problemas',
    description: 'Guía completa para que su restaurante en Bucaramanga pase la auditoría del INVIMA sin sanciones. Checklist, normativa y errores comunes.',
    category: 'Restaurantes',
    publishDate: '2026-03-14',
    readTime: '8 min',
    image: '/images/hero/hero-restaurantes.jpg',
  },
  {
    slug: 'vi-cucaracha-en-mi-casa-que-hacer',
    title: '¿Vi una Cucaracha en mi Casa: Significa que Hay Más?',
    description: 'Qué hacer cuando ve una cucaracha en su hogar en Bucaramanga. Por qué aparecen, dónde se esconden y cuándo llamar a un profesional.',
    category: 'Hogares',
    publishDate: '2026-03-14',
    readTime: '6 min',
    image: '/images/servicios/fumigacion-interior.jpg',
  },
  {
    slug: 'plagas-temporada-lluvias-bucaramanga',
    title: 'Temporada de Lluvias en Bucaramanga: Las Plagas que Aparecen y Cómo Prevenirlas',
    description: 'Las lluvias en Santander disparan la aparición de mosquitos, cucarachas y roedores. Aprenda a proteger su hogar y negocio durante esta temporada.',
    category: 'Prevención',
    publishDate: '2026-03-14',
    readTime: '7 min',
    image: '/images/hero/hero-home.jpg',
  },
  {
    slug: 'cuanto-cuesta-multa-invima-restaurante',
    title: '¿Cuánto Cuesta una Multa del INVIMA por Plagas? Lo que Todo Restaurante Debe Saber',
    description: 'Las sanciones del INVIMA por problemas sanitarios pueden ir de 5 a 1,000 SMMLV. Conozca los costos reales y cómo evitarlos.',
    category: 'Restaurantes',
    publishDate: '2026-03-14',
    readTime: '5 min',
    image: '/images/certificaciones/entrega-certificado.jpg',
  },
  {
    slug: 'como-eliminar-cucarachas-bucaramanga',
    title: 'Cómo Eliminar Cucarachas en Bucaramanga: Guía Profesional 2026',
    description: 'Guía profesional para eliminar cucarachas en Bucaramanga. Tipos, tratamientos efectivos y cuándo llamar a un profesional.',
    category: 'Plagas',
    publishDate: '2026-03-21',
    readTime: '8 min',
    image: '/images/servicios/fumigacion-interior.jpg',
  },
  {
    slug: 'fumigacion-restaurantes-bucaramanga-norma',
    title: 'Fumigación para Restaurantes en Bucaramanga: Norma y Costos 2026',
    description: 'Todo sobre fumigación para restaurantes en Bucaramanga: Resolución 2674, certificado INVIMA, frecuencia y costos.',
    category: 'Restaurantes',
    publishDate: '2026-03-21',
    readTime: '9 min',
    image: '/images/hero/hero-restaurantes.jpg',
  },
  {
    slug: 'comejen-termitas-bucaramanga',
    title: 'Comején y Termitas en Bucaramanga: Cómo Identificar y Eliminar',
    description: 'Guía para identificar y eliminar comején y termitas en Bucaramanga. Señales de daño, tipos y tratamiento profesional.',
    category: 'Plagas',
    publishDate: '2026-03-21',
    readTime: '7 min',
    image: '/images/hero/hero-home.jpg',
  },
] as const;

export const BLOG_CATEGORIES = ['Restaurantes', 'Hogares', 'Prevención', 'Normativa', 'Plagas'] as const;

export const FAQS_RESIDENCIAL = [
  {
    question: '¿Cuánto tiempo debo salir de la casa después de fumigar?',
    answer: 'Recomendamos ausentarse del hogar entre 2 y 4 horas después de la aplicación, dependiendo del tipo de tratamiento. Para familias con niños pequeños, adultos mayores o mascotas, podemos coordinar el servicio en un horario conveniente y utilizamos productos de baja toxicidad aprobados por la OMS.',
  },
  {
    question: '¿Es seguro para mascotas y niños?',
    answer: 'Sí. Utilizamos productos registrados ante el ICA y aprobados por la OMS específicamente para uso en zonas residenciales. Son de baja toxicidad para humanos y animales domésticos. Recomendamos mantener mascotas y niños fuera del área tratada durante el tiempo indicado y ventilar bien antes de regresar.',
  },
  {
    question: '¿Cada cuánto se recomienda fumigar una vivienda?',
    answer: 'Para una vivienda en Bucaramanga y el Área Metropolitana, recomendamos fumigación preventiva cada 3 a 6 meses dependiendo de la zona, el historial de plagas y las características del inmueble. Propiedades cercanas a zonas verdes, quebradas o con historial de infestaciones pueden requerir mayor frecuencia.',
  },
  {
    question: '¿Qué debo hacer antes de la fumigación?',
    answer: 'Le recomendamos: guardar o cubrir alimentos y utensilios de cocina, retirar mascotas y sus accesorios del área a tratar, cubrir peceras o terrarios, limpiar pisos y superficies para mejorar el contacto de los productos, y despejar debajo de muebles y camas para facilitar el acceso del técnico.',
  },
  {
    question: '¿El servicio incluye certificado?',
    answer: 'Sí. AGROINCOL emite un certificado de fumigación que detalla los productos utilizados, las áreas tratadas y la fecha del servicio. Este documento es válido para conjuntos residenciales, arrendadores, o cualquier entidad que lo requiera como soporte sanitario.',
  },
] as const;

export const FAQS_COMERCIAL = [
  {
    question: '¿Debo cerrar el negocio durante la fumigación?',
    answer: 'Depende del tipo de tratamiento y del negocio. En la mayoría de los casos programamos el servicio en horario de baja actividad (antes de la apertura, durante el cierre o en días no laborales) para no interrumpir su operación. Coordinamos con usted el momento más conveniente.',
  },
  {
    question: '¿El servicio incluye certificado para inspecciones?',
    answer: 'Sí. Emitimos un certificado de fumigación que cumple con los requisitos del Decreto 1843 de 1991, válido como soporte ante inspecciones de la Secretaría de Salud de Santander y del INVIMA. El certificado incluye fecha, productos utilizados, áreas tratadas y firma del técnico responsable.',
  },
  {
    question: '¿Cada cuánto se recomienda el servicio para un negocio?',
    answer: 'Para establecimientos comerciales en Bucaramanga recomendamos un mínimo de cada 3 meses. Negocios con mayor riesgo (restaurantes, panaderías, tiendas de alimentos) pueden requerir frecuencia mensual o bimestral. Diseñamos el plan según el tipo de negocio y sus necesidades específicas.',
  },
  {
    question: '¿Trabajan fuera de horario comercial?',
    answer: 'Sí. Ofrecemos servicios en horarios flexibles incluyendo antes de la apertura (desde las 6 AM), después del cierre y los sábados en la mañana. Para negocios con operación continua coordinamos ventanas de tiempo que minimicen el impacto en sus actividades.',
  },
  {
    question: '¿Tienen programa de mantenimiento mensual?',
    answer: 'Sí. Contamos con planes de mantenimiento mensual, bimestral y trimestral diseñados para negocios. Cada plan incluye visitas programadas, aplicaciones preventivas, monitoreo continuo, certificados actualizados e informes de seguimiento para su archivo.',
  },
] as const;

export const FAQS_DESRATIZACION = [
  {
    question: '¿Cómo sé si tengo ratas o ratones?',
    answer: 'Las señales más comunes son: heces pequeñas en cajones, alacenas o detrás de electrodomésticos; marcas de mordeduras en cables, madera o alimentos; ruidos nocturnos en paredes o cielos rasos; manchas de grasa a lo largo de paredes (causadas por el pelaje de los roedores); y nidos hechos con materiales blandos. Si detecta alguna de estas señales, contáctenos para un diagnóstico.',
  },
  {
    question: '¿Usan veneno o trampas?',
    answer: 'Usamos la combinación más efectiva según el diagnóstico. Para infestaciones activas combinamos cebos rodenticidas de segunda generación (en estaciones de cebado seguras) con trampas mecánicas en puntos estratégicos. El método específico depende del nivel de infestación, el tipo de propiedad y si hay niños o mascotas presentes.',
  },
  {
    question: '¿Es peligroso el tratamiento para personas o mascotas?',
    answer: 'Los cebos rodenticidas se colocan en estaciones cerradas específicamente diseñadas para que solo los roedores puedan acceder. Esto los hace seguros en presencia de mascotas y niños cuando se instalan correctamente. Usamos productos registrados ante el ICA y seguimos protocolos de seguridad estrictos.',
  },
  {
    question: '¿Cuánto tiempo tarda en hacer efecto?',
    answer: 'Los primeros resultados visibles se observan entre 3 y 7 días después del tratamiento. La eliminación completa de la infestación puede tomar entre 2 y 4 semanas dependiendo del nivel de la misma. Realizamos visitas de seguimiento para verificar la efectividad y ajustar el tratamiento si es necesario.',
  },
  {
    question: '¿Incluye sellado de puntos de entrada?',
    answer: 'Sí. Nuestro servicio de desratización incluye la identificación de todos los puntos de acceso utilizados por los roedores y recomendaciones específicas de sellado. Para propiedades donde es posible, realizamos el sellado directamente durante el servicio. Esto es fundamental para evitar que la infestación regrese.',
  },
] as const;

export const FAQS_INSECTOS_VOLADORES = [
  {
    question: '¿Por qué hay más zancudos en temporada de lluvias?',
    answer: 'Las lluvias crean agua estancada en recipientes, canales, materas y cualquier superficie cóncava. El mosquito Aedes aegypti, principal vector del dengue en Bucaramanga, solo necesita agua limpia para reproducirse y completa su ciclo de larva a adulto en 7-10 días. Por eso las temporadas de lluvias (marzo-junio y septiembre-octubre) son el período de mayor riesgo en Santander.',
  },
  {
    question: '¿El tratamiento elimina también huevos y larvas?',
    answer: 'Sí. A diferencia de los insecticidas domésticos que solo eliminan adultos, nuestro tratamiento profesional incluye la aplicación de larvicidas en posibles criaderos y productos con efecto residual que interrumpen el ciclo reproductivo. Esto evita que nuevas generaciones emerjan y garantiza resultados duraderos.',
  },
  {
    question: '¿Cada cuánto se necesita el servicio?',
    answer: 'Para hogares y negocios sin historial severo de mosquitos, recomendamos tratamiento preventivo antes de cada temporada de lluvias (febrero y agosto). Para propiedades con mayor exposición (cercanas a quebradas, con jardines grandes o historial de dengue en el barrio) puede ser necesario un mantenimiento trimestral o bimestral.',
  },
  {
    question: '¿Qué hago si tengo un nido de abejas o avispas?',
    answer: 'No intente eliminarlo por su cuenta. Las abejas africanizadas, comunes en Bucaramanga, pueden atacar en grupo al sentirse amenazadas. AGROINCOL realiza el retiro seguro de nidos de abejas y avispas con equipos de protección especializados, minimizando el riesgo para usted, su familia o sus clientes.',
  },
  {
    question: '¿El tratamiento es seguro cerca de alimentos?',
    answer: 'Sí, utilizamos productos aprobados por la OMS y registrados ante el ICA para uso en áreas donde hay alimentos. Para restaurantes y cocinas comerciales seguimos protocolos específicos que garantizan la seguridad alimentaria. Recomendamos cubrir alimentos expuestos durante la aplicación y esperar el tiempo de secado indicado antes de reanudar actividades.',
  },
] as const;

export const FAQS_INDUSTRIAL = [
  {
    question: '¿El servicio incluye documentación para auditorías?',
    answer: 'Sí. Entregamos un expediente completo que incluye: fichas técnicas de todos los productos utilizados, registros de cada intervención firmados por técnico certificado, mapas de ubicación de trampas y estaciones de cebado, e informes de seguimiento periódicos. Esta documentación cumple con los requisitos del Decreto 1843 de 1991 y es válida para auditorías de INVIMA, Secretaría de Salud e ISO 22000.',
  },
  {
    question: '¿Trabajan en plantas de producción activas?',
    answer: 'Sí. Tenemos experiencia trabajando en plantas con producción activa, coordinando los tratamientos en horarios que minimicen la interferencia con sus procesos. Para áreas críticas como líneas de producción y salas blancas, utilizamos métodos y productos específicamente aprobados para estas condiciones.',
  },
  {
    question: '¿Qué normativas cubre el certificado?',
    answer: 'Nuestros certificados cumplen con el Decreto 1843 de 1991 (regulación de plaguicidas en Colombia), la Resolución 2674 de 2013 del INVIMA (para establecimientos de alimentos), y son compatibles con los requisitos de BPM (Buenas Prácticas de Manufactura) e ISO 22000 para gestión de seguridad alimentaria.',
  },
  {
    question: '¿Tienen experiencia en sector agroindustrial?',
    answer: 'Sí. AGROINCOL lleva más de 40 años atendiendo empresas del sector agroindustrial en Santander, incluyendo plantas procesadoras de alimentos, empresas lácteas, avícolas y bodegas de almacenamiento. Conocemos los requisitos específicos del sector y adaptamos nuestros protocolos a las normas de cada tipo de industria.',
  },
  {
    question: '¿Ofrecen programa de mantenimiento con visitas periódicas?',
    answer: 'Sí. Para industria recomendamos especialmente los planes de mantenimiento con visitas mensuales o bimestrales. Cada visita incluye inspección, monitoreo de trampas y estaciones, aplicaciones preventivas según necesidad, actualización de registros y entrega de informe. La frecuencia y el alcance se definen en el diagnóstico inicial según las características de su planta.',
  },
] as const;
