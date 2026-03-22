import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://agroincol.com',
      lastModified: new Date('2026-03-07'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://agroincol.com/servicios/fumigacion-restaurantes',
      lastModified: new Date('2026-03-07'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://agroincol.com/precios',
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://agroincol.com/certificaciones-y-normativa',
      lastModified: new Date('2026-03-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://agroincol.com/blog',
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://agroincol.com/blog/auditoria-invima-como-preparar-restaurante',
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://agroincol.com/blog/vi-cucaracha-en-mi-casa-que-hacer',
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://agroincol.com/blog/plagas-temporada-lluvias-bucaramanga',
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://agroincol.com/blog/cuanto-cuesta-multa-invima-restaurante',
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://agroincol.com/blog/como-eliminar-cucarachas-bucaramanga',
      lastModified: new Date('2026-03-21'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://agroincol.com/blog/fumigacion-restaurantes-bucaramanga-norma',
      lastModified: new Date('2026-03-21'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://agroincol.com/blog/comejen-termitas-bucaramanga',
      lastModified: new Date('2026-03-21'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://agroincol.com/herramientas/calculadora-fumigacion',
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: 'https://agroincol.com/zonas/fumigacion-floridablanca',
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: 'https://agroincol.com/zonas/fumigacion-piedecuesta',
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: 'https://agroincol.com/zonas/fumigacion-giron',
      lastModified: new Date('2026-03-14'),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: 'https://agroincol.com/politica-de-privacidad',
      lastModified: new Date('2026-03-07'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
