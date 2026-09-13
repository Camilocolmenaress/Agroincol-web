'use client';

import { nuevoEventId } from './eventos';

/**
 * Identificador anónimo y estable del dispositivo (`external_id` de Meta).
 *
 * Es un número aleatorio, no un dato de la persona: no sale de un nombre, un
 * correo ni un teléfono, y no sirve para identificar a nadie fuera de este
 * sitio. Lo único que le dice a Meta es "estos eventos son del mismo
 * visitante", y con eso mejora la atribución cuando las cookies fallan.
 *
 * El servidor lo hashea antes de mandarlo.
 */
const CLAVE = 'agroincol_vid_v1';

export function idDeVisitante(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const guardado = window.localStorage.getItem(CLAVE);
    if (guardado) return guardado;
    const nuevo = nuevoEventId();
    window.localStorage.setItem(CLAVE, nuevo);
    return nuevo;
  } catch {
    // Modo privado de iOS o almacenamiento bloqueado: se sigue sin este dato.
    return undefined;
  }
}
