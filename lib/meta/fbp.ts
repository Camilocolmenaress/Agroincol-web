/**
 * El parámetro `fbp`: el identificador del navegador que el Pixel guarda en la
 * cookie `_fbp`.
 *
 * Cuando el Pixel no corre (bloqueador, Safari cortando scripts de terceros) la
 * cookie nunca existe y el evento sale solo con IP y user agent. Para Meta eso
 * es un evento sin claves de coincidencia: no lo atribuye a nadie y no sirve
 * para optimizar.
 *
 * Meta permite generarlo desde el servidor con el mismo formato del Pixel. El
 * servidor lo crea una vez y lo devuelve como cookie de primera parte, así los
 * eventos siguientes de ese navegador llevan el mismo identificador. Si el
 * Pixel carga después, respeta la cookie que ya existe.
 */

/** Lo que dura la cookie del Pixel: 90 días. */
export const FBP_DURACION_S = 90 * 24 * 60 * 60;

const FORMATO_FBP = /^fb\.\d+\.\d+\.\d+$/;

export function nuevoFbp(ahoraMs = Date.now(), aleatorio = Math.random()): string {
  const numero = Math.floor(aleatorio * 1e10).toString().padStart(10, '0');
  return `fb.1.${ahoraMs}.${numero}`;
}

/**
 * La cookie si existe y tiene el formato del Pixel; si no, una nueva.
 * `generado` le dice a la ruta que debe devolverla al navegador.
 */
export function resolverFbp(cookie: string | undefined): { fbp: string; generado: boolean } {
  if (cookie && FORMATO_FBP.test(cookie)) return { fbp: cookie, generado: false };
  return { fbp: nuevoFbp(), generado: true };
}
