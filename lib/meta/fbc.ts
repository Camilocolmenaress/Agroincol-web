/**
 * El parámetro `fbc`: el identificador del clic en el anuncio, con el formato
 * que exige Meta: `fb.1.<milisegundos>.<fbclid>`.
 *
 * Regla que manda sobre todo lo demás: el fbclid NO SE TOCA. Meta lo compara
 * contra el clic que emitió y distingue mayúsculas. Recortarlo, pasarlo a
 * minúsculas o quitarle un carácter lo invalida, y el panel lo reporta como
 * "el servidor envía un fbclid modificado". Si algo no encaja se descarta
 * entero; nunca se "arregla".
 *
 * De dónde sale, en orden:
 * 1. Si la URL trae `fbclid` y la cookie `_fbc` no lleva ESE mismo fbclid, se
 *    construye desde la URL. Cubre la primera visita desde un anuncio (el Pixel
 *    aún no escribió la cookie) y el clic nuevo sobre una cookie vieja.
 * 2. Si no, la cookie tal cual, con su fecha de creación original.
 */
export function resolverFbc(
  cookie: string | undefined,
  sourceUrl: string,
  ahoraMs = Date.now()
): string | undefined {
  const fbclid = fbclidDeUrl(sourceUrl);
  if (fbclid && !cookie?.endsWith(`.${fbclid}`)) return `fb.1.${ahoraMs}.${fbclid}`;
  return cookie || undefined;
}

function fbclidDeUrl(sourceUrl: string): string | undefined {
  try {
    const valor = new URL(sourceUrl).searchParams.get('fbclid');
    // Vacío o con espacios no es un clic de Meta. Se descarta, no se limpia.
    if (!valor || /\s/.test(valor)) return undefined;
    return valor;
  } catch {
    return undefined;
  }
}
