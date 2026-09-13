'use client';

/**
 * PostHog: embudo, tiempo en página y grabaciones de sesión.
 *
 * En Next 15.3+ esto iría en `instrumentation-client.ts`, que corre antes de la
 * hidratación. Este proyecto está en Next 14, donde ese archivo no existe, así
 * que se inicializa en un componente cliente montado en el layout raíz.
 *
 * Sin NEXT_PUBLIC_POSTHOG_KEY no se inicializa nada, y la librería ni siquiera
 * se descarga: el import es dinámico y va después de la hidratación.
 *
 * Privacidad, en orden de importancia:
 *
 * - maskAllInputs: en las grabaciones, todo lo que la persona escribe se ve
 *   como asteriscos. Nombre y celular nunca se graban.
 * - mask_all_element_attributes: los clics automáticos no guardan atributos del
 *   elemento. Importa por el enlace de WhatsApp, cuyo href lleva el mensaje.
 * - person_profiles 'identified_only': no se crea un perfil por visitante
 *   anónimo. Nunca llamamos a identify().
 *
 * Todo pasa por /ingest, un proxy en nuestro propio dominio (ver
 * next.config.mjs): los bloqueadores que cortan posthog.com no ven nada raro.
 */

import { useEffect } from 'react';
import { registrarClienteAnalitica } from '@/lib/analitica/posthog';

const CLAVE = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';

export default function PostHogInit() {
  useEffect(() => {
    if (!CLAVE) return;
    let cancelado = false;

    // Import dinámico: saca ~100 kB del bundle inicial de la landing. La
    // medición no necesita estar lista en el primer frame; el titular sí.
    void import('posthog-js')
      .then(({ default: posthog }) => {
        if (cancelado) return;
        posthog.init(CLAVE, {
          api_host: '/ingest',
          ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ?? 'https://us.posthog.com',
          person_profiles: 'identified_only',
          mask_all_element_attributes: true,
          capture_exceptions: false,
          session_recording: { maskAllInputs: true },
        });
        registrarClienteAnalitica(posthog);
      })
      .catch(() => {
        // Bloqueador o red: sin medición el sitio funciona igual.
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return null;
}
