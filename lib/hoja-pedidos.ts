// Hoja de Google Sheets "Pedidos EcoGel". Es la base de datos de pedidos: desde
// ahí se despacha, se marca entregado/rechazado y se lee la economía real.
// Mismo mecanismo que la hoja de leads (ver docs/hoja-de-leads.md y
// app/api/contact/route.ts): Apps Script con doPost + secreto, y 302 como
// respuesta normal.

export const COLUMNAS_PEDIDO = [
  'estado', 'guia', 'fecha', 'pedidoId', 'unidades', 'producto', 'envio', 'descuento', 'total',
  'metodoPago', 'nombre', 'celular', 'correo', 'direccion', 'barrio', 'ciudad', 'departamento',
  'ofertas', 'origen', 'ip', 'eventId', 'fbp', 'fbc', 'externalId', 'navegador', 'url', 'mpPagoId',
  // Al final y no junto a 'correo': insertarlas en medio descuadraría las filas
  // que ya existen en la hoja (el Apps Script reescribe solo el encabezado).
  'tipoDocumento', 'documento',
] as const;

function credenciales() {
  return { url: process.env.HOJA_PEDIDOS_URL ?? '', secreto: process.env.HOJA_PEDIDOS_SECRETO ?? '' };
}

/** /api/ecogel/pedido no acepta pedidos sin esto: serían pedidos que nadie ve. */
export function hojaPedidosConfigurada(): boolean {
  const { url, secreto } = credenciales();
  return url.length > 0 && secreto.length > 0;
}

async function llamar(cuerpo: Record<string, unknown>, fetchFn: typeof fetch): Promise<void> {
  const { url, secreto } = credenciales();
  if (!url || !secreto) return;
  const respuesta = await fetchFn(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secreto, ...cuerpo }),
    redirect: 'manual', // Apps Script responde 302 tras escribir; seguirlo solo pierde tiempo
    signal: AbortSignal.timeout(10000),
  });
  if (respuesta.status !== 200 && respuesta.status !== 302) {
    throw new Error(`la hoja de pedidos respondió ${respuesta.status}`);
  }
}

export function crearFilaPedido(fila: Record<string, unknown>, fetchFn: typeof fetch = fetch) {
  return llamar({ accion: 'crear', fila }, fetchFn);
}

export function actualizarFilaPedido(pedidoId: string, cambios: Record<string, unknown>, fetchFn: typeof fetch = fetch) {
  return llamar({ accion: 'actualizar', pedidoId, cambios }, fetchFn);
}

/**
 * Lee de vuelta una fila ya guardada. La usa el webhook de Mercado Pago para
 * armar el Purchase de un pedido "online" solo cuando el pago se confirma: el
 * servidor no guarda esos datos en memoria entre la creación del pedido y el
 * webhook (son invocaciones serverless distintas), así que la hoja es la única
 * fuente. A diferencia de crear/actualizar, aquí sí hace falta el cuerpo de la
 * respuesta, así que se sigue el 302 en vez de tratarlo como éxito silencioso.
 */
export async function leerFilaPedido(pedidoId: string, fetchFn: typeof fetch = fetch): Promise<Record<string, unknown> | null> {
  const { url, secreto } = credenciales();
  if (!url || !secreto) return null;
  const respuesta = await fetchFn(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secreto, accion: 'leer', pedidoId }),
    signal: AbortSignal.timeout(10000),
  });
  if (!respuesta.ok) return null;
  const json = (await respuesta.json()) as { ok: boolean; fila?: Record<string, unknown> };
  return json.ok && json.fila ? json.fila : null;
}
