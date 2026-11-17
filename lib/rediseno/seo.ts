// Metadatos y JSON-LD de cada página del sitio rediseñado.
// Las páginas que ya existen conservan exactamente los de producción (README §5): se toman de la
// línea base (content/rediseno/seo-produccion.json, generada por scripts/rediseno/extraer-prototipo.py).
// Las páginas nuevas usan el title y la description del prototipo.
import type { Metadata } from 'next';
import seo from '@/content/rediseno/seo-produccion.json';
import { paginaPrototipo } from './contenido';
import { globalSchema } from '@/lib/seo/esquema-global';

type Social = Record<string, string>;
type SeoRuta = {
  title: string | null;
  description: string | null;
  canonical: string | null;
  hreflang: { lang: string; href: string }[];
  robots: string | null;
  social: Social;
  jsonLd: Record<string, unknown>[];
};
const SEO = seo as unknown as Record<string, SeoRuta>;

function robots(valor: string | null): Metadata['robots'] {
  if (!valor) return undefined;
  const v = valor.toLowerCase();
  return { index: !v.includes('noindex'), follow: !v.includes('nofollow') };
}

export function metadataDe(ruta: string, archivo: string): Metadata {
  const s = SEO[ruta];
  if (!s) {
    // Página nueva: title y description del prototipo, canonical propio.
    const p = paginaPrototipo(archivo);
    const url = `https://agroincol.com${ruta}`;
    return {
      title: { absolute: p.title ?? 'AGROINCOL' },
      description: p.description ?? undefined,
      alternates: { canonical: url },
      openGraph: { title: p.title ?? undefined, description: p.description ?? undefined, url, siteName: 'AGROINCOL', locale: 'es_CO', type: 'website' },
    };
  }
  const so = s.social ?? {};
  const imagen = so['og:image']
    ? [{ url: so['og:image'], width: so['og:image:width'] ? Number(so['og:image:width']) : undefined, height: so['og:image:height'] ? Number(so['og:image:height']) : undefined, alt: so['og:image:alt'] }]
    : undefined;
  return {
    title: { absolute: s.title ?? 'AGROINCOL' },
    description: s.description ?? undefined,
    alternates: {
      canonical: s.canonical ?? undefined,
      ...(s.hreflang?.length ? { languages: Object.fromEntries(s.hreflang.map((h) => [h.lang, h.href])) } : {}),
    },
    robots: robots(s.robots),
    openGraph: so['og:title']
      ? {
          title: so['og:title'],
          description: so['og:description'],
          url: so['og:url'],
          siteName: so['og:site_name'],
          locale: so['og:locale'],
          type: (so['og:type'] as 'website' | 'article') ?? 'website',
          images: imagen,
          ...(so['article:published_time'] ? { publishedTime: so['article:published_time'] } : {}),
          ...(so['article:modified_time'] ? { modifiedTime: so['article:modified_time'] } : {}),
        }
      : undefined,
    twitter: so['twitter:card']
      ? {
          card: so['twitter:card'] as 'summary_large_image',
          title: so['twitter:title'],
          description: so['twitter:description'],
          images: so['twitter:image'] ? [{ url: so['twitter:image'], width: so['twitter:image:width'] ? Number(so['twitter:image:width']) : undefined, height: so['twitter:image:height'] ? Number(so['twitter:image:height']) : undefined, alt: so['twitter:image:alt'] }] : undefined,
        }
      : undefined,
  };
}

const texto = (h: string) =>
  h
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

// Preguntas frecuentes visibles en la página (<details><summary>…</summary><p>…</p></details>).
function faqVisible(archivo: string) {
  const main = paginaPrototipo(archivo).main as string;
  const re = /<details><summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g;
  const out: { '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } }[] = [];
  for (let m = re.exec(main); m; m = re.exec(main)) out.push({
    '@type': 'Question',
    name: texto(m[1]),
    acceptedAnswer: { '@type': 'Answer', text: texto(m[2]) },
  });
  return out;
}

const ORG = { '@id': 'https://agroincol.com/#organization' };
const migas = (items: [string, string?][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(item ? { item } : {}) })),
});

// JSON-LD de las páginas nuevas (no existen en producción): Service, FAQPage, BreadcrumbList.
const NUEVAS: Record<string, () => Record<string, unknown>[]> = {
  '/empresas': () => [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Control de plagas para empresas e industria en Bucaramanga',
      serviceType: 'Manejo Integrado de Plagas (MIP)',
      description: 'Programa de Manejo Integrado de Plagas documentado para negocios, bodegas y plantas de producción en Bucaramanga y el Área Metropolitana.',
      provider: ORG,
      areaServed: ['Bucaramanga', 'Floridablanca', 'Piedecuesta', 'Girón'].map((name) => ({ '@type': 'City', name })),
      url: 'https://agroincol.com/empresas',
    },
    migas([['Inicio', 'https://agroincol.com'], ['Empresas']]),
  ],
  '/servicios/control-cucarachas': () => [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Fumigación y control de cucarachas en Bucaramanga',
      serviceType: 'Control de cucarachas',
      description: 'Control de cucarachas con gel cucarachicida, aspersión perimetral y seguimiento, para casas, apartamentos y negocios en Bucaramanga y el Área Metropolitana.',
      provider: ORG,
      areaServed: ['Bucaramanga', 'Floridablanca', 'Piedecuesta', 'Girón'].map((name) => ({ '@type': 'City', name })),
      url: 'https://agroincol.com/servicios/control-cucarachas',
    },
    migas([['Inicio', 'https://agroincol.com'], ['Servicios', 'https://agroincol.com/servicios'], ['Control de cucarachas']]),
  ],
  '/herramientas': () => [migas([['Inicio', 'https://agroincol.com'], ['Herramientas']])],
  '/herramientas/plaga': () => [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: '¿Qué plaga tengo? Identificador de plagas',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP' },
      provider: ORG,
      url: 'https://agroincol.com/herramientas/plaga',
    },
    migas([['Inicio', 'https://agroincol.com'], ['Herramientas', 'https://agroincol.com/herramientas'], ['¿Qué plaga tengo?']]),
  ],
  '/herramientas/checklist': () => [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Qué hacer antes de fumigar: lista',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP' },
      provider: ORG,
      url: 'https://agroincol.com/herramientas/checklist',
    },
    migas([['Inicio', 'https://agroincol.com'], ['Herramientas', 'https://agroincol.com/herramientas'], ['Antes de fumigar']]),
  ],
};

// JSON-LD de la ruta: el de producción, sin el LocalBusiness global (lo pone el layout).
// FAQPage: si la página muestra preguntas desplegables, el esquema lleva exactamente esas (Google
// exige que el marcado refleje lo visible); si no, se conserva el de producción.
export function jsonLdDe(ruta: string, archivo: string): Record<string, unknown>[] {
  const s = SEO[ruta];
  const visibles = faqVisible(archivo);
  const faq = visibles.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: visibles }] : [];
  if (!s) return [...(NUEVAS[ruta]?.() ?? []), ...faq];
  const prod = s.jsonLd.filter((j) => j['@id'] !== globalSchema['@id']);
  if (!visibles.length) return prod;
  return [...prod.filter((j) => j['@type'] !== 'FAQPage'), ...faq];
}
