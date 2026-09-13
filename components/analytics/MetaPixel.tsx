'use client';

/**
 * Carga del Pixel de Meta.
 *
 * `afterInteractive`: el script entra después de que la página es usable, no
 * compitiendo con ella. En el navegador interno de Instagram con datos
 * móviles, cargar el Pixel antes de tiempo retrasa el LCP, y eso cuesta más
 * conversiones de las que la medición ayuda a ganar.
 *
 * Sin NEXT_PUBLIC_META_PIXEL_ID no se carga nada: el sitio funciona igual.
 *
 * `autoConfig: false` va ANTES del init y apaga dos comportamientos que Meta
 * trae encendidos de fábrica:
 *
 * 1. La detección automática de eventos, que lee los botones de la página y
 *    dispara eventos por su cuenta. Genera más ruido que señal: nosotros
 *    disparamos los tres eventos exactos en el momento exacto.
 * 2. Las coincidencias avanzadas automáticas, que leen los campos del
 *    formulario y los mandan a Meta SIN pasar por la casilla de autorización.
 *    Eso volvería decorativo todo el diseño de consentimiento y nos sacaría de
 *    la Ley 1581.
 *
 * Lo segundo también se apaga desde el panel de Meta, pero dejarlo en el código
 * significa que si alguien lo vuelve a encender por allá, aquí sigue apagado.
 */

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { PIXEL_ID, enviarACapi, pixelActivo, soloPixel } from '@/lib/meta/pixel';

/**
 * Espera a que se cumpla una condición, hasta un máximo. Resuelve igual si se
 * agota el tiempo: la medición nunca puede quedarse colgada esperando.
 */
function esperarA(condicion: () => boolean, maxMs: number): Promise<void> {
  return new Promise((listo) => {
    if (condicion()) return listo();
    const desde = Date.now();
    const id = setInterval(() => {
      if (condicion() || Date.now() - desde > maxMs) {
        clearInterval(id);
        listo();
      }
    }, 100);
  });
}

const hayFbq = () => typeof window.fbq === 'function';
const hayCookieFbp = () => /(^|;\s*)_fbp=/.test(document.cookie);

export default function MetaPixel() {
  const yaContado = useRef(false);

  /**
   * El PageView se manda desde nuestro código y no con el `fbq('track',
   * 'PageView')` del snippet: así lleva un event_id que la API de Conversiones
   * puede repetir para deduplicar.
   *
   * Dos esperas, cada una con su motivo:
   *
   * 1. A que exista `window.fbq`. NO sirve el `onReady` de next/script: para un
   *    script inline se dispara ANTES de que el fragmento se inyecte, así que
   *    `fbq` todavía no existe, la llamada se pierde en el `?.` sin error y el
   *    Pixel del navegador nunca registra el PageView. El servidor sí lo
   *    recibía, lo que hace el fallo difícil de ver: en el panel de Meta
   *    aparece "instalado pero no ha registrado eventos".
   * 2. A la cookie `_fbp`, solo para la llamada al servidor. Si sale antes, el
   *    PageView llega sin ella y queda como el evento de más volumen con la
   *    identidad más débil.
   *
   * Si alguna espera se agota, se dispara igual. Con un bloqueador de anuncios
   * `fbq` nunca aparece y el camino del servidor tiene que seguir funcionando.
   */
  useEffect(() => {
    if (!pixelActivo || yaContado.current) return;
    yaContado.current = true;
    let cancelado = false;

    void esperarA(hayFbq, 5000).then(() => {
      if (cancelado) return;
      const eventId = soloPixel('PageView');
      if (!eventId) return;
      void esperarA(hayCookieFbp, 3000).then(() => {
        if (!cancelado) enviarACapi('/api/meta', { evento: 'PageView', eventId });
      });
    });

    return () => {
      cancelado = true;
    };
  }, []);

  if (!pixelActivo) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('set','autoConfig',false,'${PIXEL_ID}');
fbq('init','${PIXEL_ID}');`}
    </Script>
  );
}
