// Objetos 3D del recorrido (renders de Blender, ver docs/rediseno/plan-fases.md, fase 2).
// Solo se listan los que ya tienen render aprobado; el resto entra aquí cuando exista.
// Archivos: public/images/3d/<id>-<pose>-<512|1024>.<avif|webp> (scripts/3d-web.sh).

export type Pose = 'frente34' | 'picado';

export type Objeto3D = {
  id: string;
  alt: string;
  // Servicio al que lleva el objeto (cursor "Ver servicio").
  href: string;
  // Encuadre en el selector: los renders son cuadrados con aire alrededor; esto iguala el tamaño
  // visible (n = escala) y centra la silueta (dx, dy en % del ancho), medido sobre el alfa.
  encuadre: { n: number; dx: number; dy: number };
  // El objeto "vuela" a su página solo si el hero de destino muestra ese mismo objeto.
  vuela: boolean;
};

// Orden = orden del desfile del hero: el 2.º arranca en la cima del aro (nítido) y el resto
// entra por la derecha al bajar. En celular, el carrusel empieza por el primero.
export const OBJETOS: Objeto3D[] = [
  {
    id: 'casa',
    alt: 'Casa santandereana con techo de teja, en 3D: fumigación para hogares de AGROINCOL',
    href: '/servicios/fumigacion-residencial',
    encuadre: { n: 0.98, dx: 0.1, dy: 0.1 },
    vuela: true,
  },
  {
    id: 'cocina',
    alt: 'Cocina de restaurante con estufa y ollas, en 3D: control de plagas para restaurantes de AGROINCOL',
    href: '/servicios/fumigacion-restaurantes',
    encuadre: { n: 1.0, dx: 0.1, dy: 1.6 },
    vuela: true,
  },
  {
    id: 'bomba',
    alt: 'Bomba de aspersión de espalda, en 3D: control de zancudos y moscas de AGROINCOL',
    href: '/servicios/control-insectos-voladores',
    encuadre: { n: 0.96, dx: 1.3, dy: 1.6 },
    vuela: true,
  },
  {
    id: 'bodega',
    alt: 'Estiba con cajas de bodega, en 3D: fumigación industrial y control de plagas para empresas de AGROINCOL',
    href: '/servicios/fumigacion-industrial',
    encuadre: { n: 0.99, dx: 0.1, dy: -1.5 },
    vuela: true,
  },
  {
    id: 'estacion',
    alt: 'Estación cebadera para roedores, en 3D: desratización de AGROINCOL',
    href: '/servicios/desratizacion',
    encuadre: { n: 0.98, dx: -0.1, dy: -4.2 },
    vuela: true,
  },
  {
    id: 'gel',
    alt: 'Gotas de gel insecticida sobre una baldosa, en 3D: control de cucarachas en negocios de AGROINCOL',
    href: '/servicios/control-plagas-comercial',
    encuadre: { n: 0.96, dx: 0, dy: -4.3 },
    vuela: false,
  },
  {
    id: 'aplicador',
    alt: 'Aplicador de gel en jeringa, en 3D: tratamiento de comején y termitas de AGROINCOL',
    href: '/servicios/control-comejen-termitas',
    encuadre: { n: 1.03, dx: -1.4, dy: -2.8 },
    vuela: true,
  },
  {
    id: 'caja',
    alt: 'Caja del kit de bienvenida para empresas con el logo de AGROINCOL, en 3D: control de plagas comercial',
    href: '/servicios/control-plagas-comercial',
    encuadre: { n: 0.98, dx: 0.2, dy: -4.9 },
    vuela: true,
  },
  {
    id: 'acta',
    alt: 'Acta de hallazgos con sello y código QR, en 3D: el documento que AGROINCOL entrega después de cada servicio',
    href: '/certificado-de-fumigacion',
    encuadre: { n: 1.01, dx: 1.1, dy: 3.2 },
    vuela: false,
  },
  {
    id: 'gorra',
    alt: 'Gorra blanca con el símbolo de AGROINCOL bordado, en 3D: técnicos con equipo de protección para retiro de abejas y avispas',
    href: '/servicios/eliminacion-abejas-avispas',
    encuadre: { n: 1.36, dx: 0, dy: -1.1 },
    vuela: true,
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
