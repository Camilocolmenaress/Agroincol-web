// Hoja de Google Sheets "Pedidos EcoGel". Es la base de datos de pedidos: desde
// ahí se despacha, se marca entregado/rechazado y se lee la economía real.
// Mismo mecanismo que la hoja de leads (ver docs/hoja-de-leads.md y
// app/api/contact/route.ts): Apps Script con doPost + secreto, y 302 como
// respuesta normal.

export const COLUMNAS_PEDIDO = [
  'estado', 'guia', 'fecha', 'pedidoId', 'unidades', 'producto', 'envio', 'descuento', 'total',
  'metodoPago', 'nombre', 'celular', 'correo', 'direccion', 'barrio', 'ciudad', 'departamento',
  'ofertas', 'origen', 'ip', 'eventId', 'fbp', 'fbc', 'externalId', 'navegador', 'url', 'mpPagoId',
] as const;

function credenciales() {
  return { url: process.env.HOJA_PEDIDOS_URL ?? '', secreto: process.env.HOJA_PEDIDOS_SECRETO ?? '' };
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
