// Hoja de Google Sheets "Pedidos EcoGel". Es la base de datos de pedidos: desde
// ahí se despacha, se marca entregado/rechazado y se lee la economía real.
// Mismo mecanismo que la hoja de leads (ver docs/hoja-de-leads.md y
// app/api/contact/route.ts): Apps Script con doPost + secreto, y 302 como
// respuesta normal.

import { esIdPremio, type IdPremio } from './ecogel-premios';

export const COLUMNAS_PEDIDO = [
  'estado', 'guia', 'fecha', 'pedidoId', 'unidades', 'producto', 'envio', 'descuento', 'total',
  'metodoPago', 'nombre', 'celular', 'correo', 'direccion', 'barrio', 'ciudad', 'departamento',
  'ofertas', 'origen', 'ip', 'eventId', 'fbp', 'fbc', 'externalId', 'navegador', 'url', 'mpPagoId',
  // Al final y no junto a 'correo': insertarlas en medio descuadraría las filas
  // que ya existen en la hoja (el Apps Script reescribe solo el encabezado).
  'tipoDocumento', 'documento', 'autorizaWhatsapp',
  // Ruleta: el código canjeado, el premio y lo que cambió (unidadesRegalo = cuántas enviar de más).
  'codigoPremio', 'premio', 'descuentoPremio', 'unidadesRegalo',
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
 * Llamada que necesita el cuerpo de la respuesta (leer, y las acciones de la
 * ruleta). A diferencia de crear/actualizar, aquí se sigue el 302 de Apps
 * Script en vez de tratarlo como éxito silencioso. null = sin configurar, error
 * de red o respuesta que no es JSON: quien llama decide qué hacer.
 */
async function llamarJson<T>(cuerpo: Record<string, unknown>, fetchFn: typeof fetch): Promise<T | null> {
  const { url, secreto } = credenciales();
  if (!url || !secreto) return null;
  try {
    const respuesta = await fetchFn(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secreto, ...cuerpo }),
      signal: AbortSignal.timeout(10000),
    });
    if (!respuesta.ok) return null;
    return (await respuesta.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Lee de vuelta una fila ya guardada. La usa el webhook de Mercado Pago para
 * armar el Purchase de un pedido "online" solo cuando el pago se confirma: el
 * servidor no guarda esos datos en memoria entre la creación del pedido y el
 * webhook (son invocaciones serverless distintas), así que la hoja es la única
 * fuente.
 */
export async function leerFilaPedido(pedidoId: string, fetchFn: typeof fetch = fetch): Promise<Record<string, unknown> | null> {
  const json = await llamarJson<{ ok: boolean; fila?: Record<string, unknown> }>({ accion: 'leer', pedidoId }, fetchFn);
  return json?.ok && json.fila ? json.fila : null;
}

// ---------------------------------------------------------------------------
// Ruleta: pestaña "Ruleta" de la misma hoja (ver docs/hoja-de-pedidos.md §6).
// El Apps Script hace cada operación bajo LockService: un correo gira una
// sola vez y un código se canjea una sola vez aunque lleguen dos a la vez.
// ---------------------------------------------------------------------------

export interface RegistroRuleta {
  fecha: string;
  correo: string;
  premio: IdPremio;
  codigo: string;
  /** ISO 8601. */
  vence: string;
  estado: 'disponible' | 'usado';
  pedidoId: string;
  fechaUso: string;
  autorizaDatos: 'sí';
  url: string;
}

/** Guarda el giro y manda el correo con el código. Si el correo ya giró, devuelve su premio de entonces. */
export async function registrarGiro(
  registro: RegistroRuleta,
  correo: { asunto: string; cuerpo: string },
  fetchFn: typeof fetch = fetch,
): Promise<{ nuevo: boolean; registro: RegistroRuleta } | null> {
  const json = await llamarJson<{ ok: boolean; nuevo?: boolean; registro?: RegistroRuleta }>({ accion: 'ruleta_girar', registro, correo }, fetchFn);
  return json?.ok && json.registro ? { nuevo: json.nuevo === true, registro: json.registro } : null;
}

export async function consultarCodigo(codigo: string, fetchFn: typeof fetch = fetch): Promise<RegistroRuleta | null> {
  const json = await llamarJson<{ ok: boolean; registro?: RegistroRuleta }>({ accion: 'ruleta_consultar', codigo }, fetchFn);
  return json?.ok && json.registro ? json.registro : null;
}

export type MotivoCanje = 'no-existe' | 'usado' | 'vencido' | 'primer-pedido' | 'sin-conexion';

/**
 * Marca el código como usado por este pedido. Idempotente para el mismo
 * pedidoId (el reintento tras un fallo de Mercado Pago no lo gasta dos veces).
 * El bono de próxima compra solo se canjea si el celular ya tiene un pedido
 * pagado, despachado o entregado.
 */
export async function canjearCodigo(
  codigo: string,
  pedidoId: string,
  celular: string,
  fetchFn: typeof fetch = fetch,
): Promise<{ ok: true; premio: IdPremio } | { ok: false; motivo: MotivoCanje }> {
  const json = await llamarJson<{ ok: boolean; premio?: unknown; motivo?: MotivoCanje }>(
    { accion: 'ruleta_canjear', codigo, pedidoId, celular },
    fetchFn,
  );
  if (!json) return { ok: false, motivo: 'sin-conexion' };
  if (json.ok && esIdPremio(json.premio)) return { ok: true, premio: json.premio };
  return { ok: false, motivo: json.motivo ?? 'no-existe' };
}
