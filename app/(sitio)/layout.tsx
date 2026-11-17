import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import CTAClickTracker from '@/components/analytics/CTAClickTracker';
import Motor from '@/components/rediseno/Motor';
import { CROMO } from '@/lib/rediseno/contenido';
import { globalSchema } from '@/lib/seo/esquema-global';
import { GTM_ID, GTM_INIT } from '@/lib/seo/gtm';
import './sitio.css';
import './ajustes.css';

// Layout raíz del sitio rediseñado (prototipo aprobado en _rediseno/). Las landings de pauta
// (/lp, /ecogel, /tienda) y /resena viven en app/(actual) con su layout de siempre: cada grupo
// carga solo su CSS y sus fuentes.

// Fuentes del manual (WOFF2 de _rediseno/site/fonts). Se precargan solo las del primer pintado.
const ls = localFont({
  src: [
    { path: './fuentes/league-spartan-latin-800-normal.woff2', weight: '800', style: 'normal' },
    { path: './fuentes/league-spartan-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--f-ls',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
const ms = localFont({
  src: [
    { path: './fuentes/montserrat-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fuentes/montserrat-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fuentes/montserrat-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--f-ms',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
const cb = localFont({
  src: './fuentes/caveat-brush-latin-400-normal.woff2',
  variable: '--f-cb',
  display: 'swap',
  fallback: ['cursive'],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://agroincol.com'),
  title: {
    default: 'AGROINCOL — Fumigación y Control de Plagas en Bucaramanga',
    template: '%s | AGROINCOL',
  },
  description: 'Empresa de fumigación y control de plagas con más de 40 años de experiencia en Bucaramanga, Santander.',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://agroincol.com',
    languages: { 'es-CO': 'https://agroincol.com', 'x-default': 'https://agroincol.com' },
  },
};

export const viewport: Viewport = { themeColor: '#164A38' };

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${ls.variable} ${ms.variable} ${cb.variable}`}>
      <body>
        <SchemaMarkup schema={globalSchema} />
        {/* Cabecera, menú, velo, cursor y barra de lectura del prototipo. */}
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: CROMO.antes }} />
        {children}
        {/* Pie y barra móvil del prototipo. */}
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: CROMO.despues }} />
        <Motor />
        <CTAClickTracker />
        <Analytics />
        <SpeedInsights />
        <Script id="gtm-init" strategy="afterInteractive">
          {GTM_INIT}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  );
}
