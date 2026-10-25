// Aviso a EcoGel Cuentas (app aparte donde Camilo lleva margen y cobros).
// La hoja sigue siendo la base de los pedidos: si la app de cuentas no
// responde, el checkout no se entera. Por eso esta función nunca lanza.

export async function avisarCuentas(
  ruta: 'pedido' | 'pago',
  cuerpo: Record<string, unknown>,
  fetchFn: typeof fetch = fetch,
): Promise<void> {
  const url = process.env.CUENTAS_ECOGEL_URL;
  const secreto = process.env.CUENTAS_ECOGEL_SECRETO;
  if (!url || !secreto) return;
  try {
    const r = await fetchFn(`${url.replace(/\/$/, '')}/api/ingesta/${ruta}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-ecogel-secreto': secreto },
      body: JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) console.error('[cuentas-ecogel] respondió', r.status, ruta, cuerpo.pedidoId);
  } catch (error) {
    console.error('[cuentas-ecogel] no se pudo avisar', ruta, cuerpo.pedidoId, error instanceof Error ? error.message : error);
  }
}
