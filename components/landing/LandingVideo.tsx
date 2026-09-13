'use client';

import { useEffect, useRef } from 'react';

// Clip corto del equipo trabajando, en bucle y sin sonido. Va después de las reseñas:
// la prueba escrita convence, pero ver a los técnicos con uniforme y protección es lo
// que responde "¿a quién estoy dejando entrar a mi casa?".
//
// preload="auto" por decisión explícita: empieza a descargar apenas carga la página.
// muted + playsInline son obligatorios para que los navegadores móviles permitan el
// autoplay; sin ellos iOS lo bloquea.

export default function LandingVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Quien pidió menos movimiento no debería recibir un bucle infinito sin haberlo
    // pedido: se pausa en el primer fotograma y se le dan los controles.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.pause();
      el.controls = true;
    }
  }, []);

  return (
    <section className="bg-brand-green-dark py-8 md:py-10">
      <div className="container-custom max-w-3xl">
        <span className="eyebrow text-brand-orange-light">Así trabajamos</span>
        <div className="mt-3 overflow-hidden rounded-2xl">
          <video
            ref={ref}
            className="block h-auto w-full"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/videos/lp/servicio-poster.webp"
            aria-label="Técnicos de AGROINCOL con uniforme y protección durante un servicio de fumigación"
          >
            <source src="/videos/lp/servicio.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
