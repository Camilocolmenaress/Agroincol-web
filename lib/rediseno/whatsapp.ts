// Enlaces de WhatsApp del sitio con mensaje prellenado por página (un solo lugar para todos).
// - El <main> de cada página se marca en el servidor (components/rediseno/Pagina.tsx).
// - La cabecera, el menú, el pie y la barra móvil son HTML compartido que no sabe en qué ruta está:
//   salen con el mensaje general y Motor.tsx les pone el de la página en cada cambio de ruta
//   (ponerMensajeEnCromo).
// La medición no cambia: GTM (conversión de Ads) y CTAClickTracker reconocen el clic porque la URL
// contiene "wa.me". No usar api.whatsapp.com.

export const WHATSAPP = '573107891948';

export const MENSAJE_GENERAL = 'Hola, quiero cotizar una fumigación en Bucaramanga.';

const MENSAJES: Record<string, string> = {
  '/': 'Hola, necesito fumigación en Bucaramanga. ¿Me dan una cotización?',
  '/servicios/fumigacion-residencial': 'Hola, necesito fumigación para mi casa en Bucaramanga.',
  '/servicios/control-cucarachas': 'Hola, necesito fumigar cucarachas en Bucaramanga.',
  '/blog/como-eliminar-cucarachas-bucaramanga': 'Hola, necesito fumigar cucarachas en Bucaramanga.',
  '/blog/vi-cucaracha-en-mi-casa-que-hacer': 'Hola, necesito fumigar cucarachas en Bucaramanga.',
  '/servicios/fumigacion-restaurantes': 'Hola, necesito fumigación para mi restaurante en Bucaramanga.',
  '/blog/auditoria-invima-como-preparar-restaurante': 'Hola, necesito fumigación para mi restaurante en Bucaramanga.',
  '/blog/cuanto-cuesta-multa-invima-restaurante': 'Hola, necesito fumigación para mi restaurante en Bucaramanga.',
  '/blog/fumigacion-restaurantes-bucaramanga-norma': 'Hola, necesito fumigación para mi restaurante en Bucaramanga.',
  '/servicios/control-plagas-comercial': 'Hola, necesito control de plagas para mi negocio en Bucaramanga.',
  '/servicios/fumigacion-industrial': 'Hola, necesito fumigación para mi bodega o planta en Bucaramanga.',
  '/servicios/desratizacion': 'Hola, necesito desratización en Bucaramanga.',
  '/servicios/control-insectos-voladores': 'Hola, necesito control de insectos voladores en Bucaramanga.',
  '/servicios/control-comejen-termitas': 'Hola, necesito tratamiento contra comején en Bucaramanga.',
  '/blog/comejen-termitas-bucaramanga': 'Hola, necesito tratamiento contra comején en Bucaramanga.',
  '/servicios/eliminacion-abejas-avispas': 'Hola, necesito ayuda con abejas o avispas en Bucaramanga.',
  '/servicios/control-chinches': 'Hola, necesito eliminar chinches de cama en Bucaramanga.',
  '/empresas': 'Hola, necesito control de plagas para mi empresa en Bucaramanga.',
  '/zonas/fumigacion-bucaramanga': 'Hola, necesito fumigación en Bucaramanga.',
  '/zonas/fumigacion-floridablanca': 'Hola, necesito fumigación en Floridablanca.',
  '/zonas/fumigacion-piedecuesta': 'Hola, necesito fumigación en Piedecuesta.',
  '/zonas/fumigacion-giron': 'Hola, necesito fumigación en Girón.',
  '/certificado-de-fumigacion': 'Hola, necesito fumigación con certificado.',
};

export function mensajeWhatsApp(ruta: string): string {
  return MENSAJES[ruta.replace(/\/+$/, '') || '/'] ?? MENSAJE_GENERAL;
}

export function enlaceWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

// La cabecera, el menú, el pie y la barra móvil no se vuelven a pintar entre páginas: toman el mensaje
// de la página actual (<main data-wa>). Lo llama components/rediseno/Motor.tsx en cada cambio de ruta,
// sin esperar el chunk diferido del motor.
export function ponerMensajeEnCromo() {
  const mensaje = document.querySelector<HTMLElement>('main[data-wa]')?.dataset.wa ?? MENSAJE_GENERAL;
  document.querySelectorAll<HTMLAnchorElement>(`a[href^="https://wa.me/${WHATSAPP}"]`).forEach((a) => {
    if (!a.closest('main')) a.setAttribute('href', enlaceWhatsApp(mensaje));
  });
}

// Enlaces wa.me sin mensaje dentro de un HTML -> con el mensaje dado. Los que ya traen ?text= se respetan.
export function conMensaje(html: string, mensaje: string): string {
  return html.split(`href="https://wa.me/${WHATSAPP}"`).join(`href="${enlaceWhatsApp(mensaje)}"`);
}
