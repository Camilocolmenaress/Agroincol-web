'use client';

import { useEffect, useState } from 'react';

// El celular no viaja en la URL (es dato personal y la URL llega a analítica):
// el checkout lo deja en sessionStorage y aquí se lee solo si es del mismo
// pedido. Sin almacenamiento se queda el texto genérico, que también es cierto.
export default function CelularCliente({ pedidoId }: { pedidoId: string }) {
  const [celular, setCelular] = useState<string | null>(null);

  useEffect(() => {
    try {
      const c = JSON.parse(window.sessionStorage.getItem('ecogel_compra') ?? 'null') as { pedidoId?: string; celular?: string } | null;
      const digitos = (c?.celular ?? '').replace(/\D/g, '');
      if (c?.pedidoId === pedidoId && digitos.length === 10) {
        setCelular(`${digitos.slice(0, 3)} ${digitos.slice(3, 6)} ${digitos.slice(6)}`);
      }
    } catch {
      // Almacenamiento bloqueado: queda el texto genérico.
    }
  }, [pedidoId]);

  return <strong className="whitespace-nowrap font-bold text-brand-green">{celular ?? 'el celular que registraste'}</strong>;
}
