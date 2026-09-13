/**
 * Único punto de salida hacia la API de Conversiones de Meta.
 *
 * Dos rutas mandan eventos (/api/meta y /api/contact). Tener el fetch a
 * graph.facebook.com en un solo sitio evita que un cambio de versión de la API
 * o del manejo de errores haya que hacerlo dos veces y terminen distintos.
 *
 * Las credenciales se leen en cada llamada y no al cargar el módulo: así las
 * pruebas pueden variarlas, y en Vercel da igual porque no cambian en vida de
 * la función.
 */

/** Versión de la Graph API. Meta mantiene cada una unos dos años. */
const VERSION_API = 'v21.0';

export type ResultadoEnvio =
  | { ok: true }
  | { ok: false; motivo: 'sin-configurar' | 'meta' | 'red'; detalle?: string };

function credenciales() {
  return {
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
    /** Solo en el servidor. NUNCA con prefijo NEXT_PUBLIC_. */
    token: process.env.META_CAPI_TOKEN ?? '',
    codigoPrueba: process.env.META_TEST_EVENT_CODE ?? '',
  };
}

/** Sin credenciales el sitio funciona igual, solo sin medición. */
export function capiConfigurada(): boolean {
  const { pixelId, token } = credenciales();
  return pixelId.length > 0 && token.length > 0;
}

/**
 * Manda un evento ya armado. No lanza: devuelve el motivo para que cada ruta
 * decida qué responder. El detalle es para los logs del servidor, nunca para el
 * navegador.
 */
export async function enviarEventoAMeta(
  evento: Record<string, unknown>,
  fetchFn: typeof fetch = fetch
): Promise<ResultadoEnvio> {
  const { pixelId, token, codigoPrueba } = credenciales();
  if (!pixelId || !token) return { ok: false, motivo: 'sin-configurar' };

  const cuerpo: Record<string, unknown> = { data: [evento] };
  if (codigoPrueba) cuerpo.test_event_code = codigoPrueba;

  try {
    const respuesta = await fetchFn(
      `https://graph.facebook.com/${VERSION_API}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(cuerpo),
        // Si Meta se demora, no dejamos la función colgada.
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!respuesta.ok) {
      return { ok: false, motivo: 'meta', detalle: `${respuesta.status} ${await respuesta.text()}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, motivo: 'red', detalle: error instanceof Error ? error.message : String(error) };
  }
}
