// Objetos 3D del recorrido (renders de Blender, ver docs/rediseno/plan-fases.md, fase 2).
// Solo se listan los que ya tienen render aprobado; el resto entra aquí cuando exista.
// Archivos: public/images/3d/<id>-<pose>-<512|1024>.<avif|webp> (scripts/3d-web.sh).

export type Pose = 'frente34' | 'picado';

export type Objeto3D = {
  id: string;
  alt: string;
  // Servicio al que lleva el objeto (cursor "Ver servicio").
  href: string;
};

export const OBJETOS: Objeto3D[] = [
  {
    id: 'casa',
    alt: 'Casa santandereana con techo de teja, en 3D: fumigación para hogares de AGROINCOL',
    href: '/servicios/fumigacion-residencial',
  },
];

export const objetoPorId = (id: string) => OBJETOS.find((o) => o.id === id);

export function fuentes(id: string, pose: Pose) {
  const base = `/images/3d/${id}-${pose}`;
  return {
    avif: `${base}-512.avif 512w, ${base}-1024.avif 1024w`,
    webp: `${base}-512.webp 512w, ${base}-1024.webp 1024w`,
    src: `${base}-512.webp`,
  };
}

// Profundidad del desfile: el objeto más lejos de la cima del aro se ve más chico y desenfocado.
export function profundidad(angulo: number) {
  const a = Math.min(Math.abs(angulo), 120);
  return { escala: 1 - a / 260, desenfoque: Math.max(0, a - 40) / 18 };
}
