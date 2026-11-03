/**
 * Envía un cuerpo JSON al doPost de un Apps Script y confirma que respondió "ok".
 *
 * Apps Script corre doPost y responde 302 hacia script.googleusercontent.com.
 * Lo que devolvió doPost ("ok", "no", "error: …") está DETRÁS de esa
 * redirección y se lee con un GET. Contar el 302 como éxito escondía los
 * rechazos: secreto distinto, excepción del script, implementación borrada.
 * El visitante veía "Gracias" y la fila no existía.
 *
 * La redirección no se sigue con `fetch` (convertiría el POST en GET a su
 * manera y mezclaría los dos tiempos límite). Se pide aparte, con su propio
 * límite corto. Si esa lectura falla por red o tiempo, doPost YA corrió: se da
 * por guardado sin confirmar. Reportar fallo ahí haría reintentar al visitante
 * y duplicaría la fila.
 */

const LIMITE_POST_MS = 10000;
const LIMITE_LECTURA_MS = 4000;

export async function enviarAAppsScript(
  url: string,
  cuerpo: unknown,
  f: typeof fetch = fetch,
): Promise<{ confirmado: boolean }> {
  const r = await f(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(cuerpo),
    redirect: 'manual',
    signal: AbortSignal.timeout(LIMITE_POST_MS),
  });

  const destino = r.headers.get('location');
  let texto: string;
  if (r.status === 200) {
    texto = (await r.text()).trim(); // sin redirección: la respuesta viene directa
  } else if (r.status === 302 && destino) {
    try {
      const eco = await f(destino, { signal: AbortSignal.timeout(LIMITE_LECTURA_MS) });
      texto = (await eco.text()).trim();
    } catch {
      return { confirmado: false };
    }
  } else {
    throw new Error(`la hoja respondió ${r.status}`);
  }

  if (texto !== 'ok') throw new Error(`la hoja respondió: ${texto.slice(0, 120)}`);
  return { confirmado: true };
}
