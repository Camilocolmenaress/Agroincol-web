import { sha256 } from '@/lib/meta/hash';

/**
 * Firma que autoriza reutilizar un `pedidoId` en un reintento.
 *
 * Se usa el mismo secreto que autoriza escrituras en la hoja
 * (HOJA_PEDIDOS_SECRETO): quien logre falsificar esta firma ya podría escribir
 * directamente en la hoja, así que no se necesita un secreto aparte.
 *
 * Sin secreto configurado devuelve null: sin secreto no hay forma de firmar, y
 * un reintento sin firma válida simplemente crea un pedido nuevo.
 */
export async function firmaDePedido(pedidoId: string): Promise<string | null> {
  const secreto = process.env.HOJA_PEDIDOS_SECRETO ?? '';
  if (!secreto) return null;
  return sha256(`${secreto}:${pedidoId}`);
}
