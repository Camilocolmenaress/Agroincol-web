/** Estado de la hoja según el status del pago en Mercado Pago. null = no cambiar nada. */
export function estadoDesdeMp(status: string): 'pagado' | 'pago_fallido' | null {
  if (status === 'approved') return 'pagado';
  if (status === 'rejected' || status === 'cancelled') return 'pago_fallido';
  return null;
}
