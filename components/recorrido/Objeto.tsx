/* eslint-disable @next/next/no-img-element -- los renders ya salen optimizados (AVIF/WebP a 512 y 1024 px):
   pasar por el optimizador de next/image los recomprimiría. */
import { fuentes, type Objeto3D, type Pose } from './objetos';

type Props = {
  objeto: Objeto3D;
  pose?: Pose;
  // Ancho con que se muestra (para que el navegador elija 512 o 1024).
  sizes: string;
  className?: string;
  // Si es decorativo (el mismo objeto ya está descrito en otra parte de la página), alt vacío.
  decorativo?: boolean;
};

// Render 3D con AVIF y respaldo WebP. Nunca con prioridad: el LCP del sitio es el H1 de texto.
export default function Objeto({ objeto, pose = 'frente34', sizes, className = '', decorativo = false }: Props) {
  const f = fuentes(objeto.id, pose);
  return (
    <picture>
      <source type="image/avif" srcSet={f.avif} sizes={sizes} />
      <img
        src={f.src}
        srcSet={f.webp}
        sizes={sizes}
        alt={decorativo ? '' : objeto.alt}
        width={512}
        height={512}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={className}
      />
    </picture>
  );
}
