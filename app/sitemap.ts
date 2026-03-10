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
      url: 'https://agroincol.com/certificaciones-y-normativa',
      lastModified: new Date('2026-03-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://agroincol.com/politica-de-privacidad',
      lastModified: new Date('2026-03-07'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
