import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import MobileCTABar from '@/components/ui/MobileCTABar';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import CTAClickTracker from '@/components/analytics/CTAClickTracker';
import SiteChrome, { MarcaRuta } from '@/components/layout/SiteChrome';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const heading = localFont({
  src: [
    { path: '../public/fonts/LeagueSpartan-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/LeagueSpartan-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/LeagueSpartan-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-heading',
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
});

const body = localFont({
  src: [
    { path: '../public/fonts/Nunito-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Nunito-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/Nunito-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/Nunito-Light.woff2', weight: '300', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['sans-serif'],
  // No preload: el texto body usa display:swap (fallback sans-serif de métricas similares).
  // Evita ~200KB de TTF compitiendo con la imagen LCP del hero en el burst de preload.
  preload: false,
});

// ── Fuentes del manual de marca v2 (sitio). Las de arriba quedan para las landings de pauta. ──
// League Spartan ExtraBold: H1 y titulares gigantes. Es la letra del LCP: la única que se precarga.
const display = localFont({
  src: [{ path: '../public/fonts/league-spartan-latin-800-normal.woff2', weight: '800', style: 'normal' }],
  variable: '--font-display',
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
});

// Montserrat reemplaza a Nunito en el sitio. Pesos del manual: Regular, Medium y Bold (sin 600).
// Mismos archivos que /tienda: el navegador los descarga una sola vez.
const texto = localFont({
  src: [
    { path: './tienda/fuentes/montserrat-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './tienda/fuentes/montserrat-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './tienda/fuentes/montserrat-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-texto',
  display: 'swap',
  fallback: ['sans-serif'],
  preload: false,
});

// Color de la barra del navegador en celular: Verde Con Sello (código de favicon del manual).
export const viewport: Viewport = {
  themeColor: '#164A38',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://agroincol.com'),
  title: {
    default: 'AGROINCOL — Fumigación y Control de Plagas en Bucaramanga',
    template: '%s | AGROINCOL',
  },
  description: 'Empresa de fumigación y control de plagas con más de 40 años de experiencia en Bucaramanga, Santander.',
  // Favicon del manual v2 (07_Web_y_Redes/codigo-favicon-para-la-web.html), sin su og:image:
  // el og:image queda pendiente de aprobación aparte.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon-180.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://agroincol.com',
    languages: {
      'es-CO': 'https://agroincol.com',
      'x-default': 'https://agroincol.com',
    },
  },
};

const globalSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'PestControlService'],
  '@id': 'https://agroincol.com/#organization',
  name: 'AGROINCOL',
  url: 'https://agroincol.com',
  telephone: '+573107891948',
  foundingDate: '1985',
  description: 'Empresa de fumigación y control de plagas con más de 40 años de experiencia en el Área Metropolitana de Bucaramanga, Santander, Colombia.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Cra. 36 #197-30 local A11, Paseo Comercial Paraguitas, Casco Antiguo',
    addressLocality: 'Floridablanca',
    addressRegion: 'Santander',
    postalCode: '681003',
    addressCountry: 'CO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 7.0650746,
    longitude: -73.0848828,
  },
  areaServed: [
    { '@type': 'City', name: 'Bucaramanga', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Floridablanca', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Piedecuesta', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Girón', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '07:00', closes: '12:00' },
  ],
  priceRange: '$$',
  image: 'https://agroincol.com/og-image.jpg',
  // Sin aggregateRating: Google no permite reseñas auto-referenciales en el LocalBusiness
  // propio (riesgo de acción manual y no se renderiza). Las reseñas reales viven en el GBP (sameAs).
  sameAs: [
    'https://www.instagram.com/agroincolcorp',
    'https://maps.google.com/?cid=5252561969072218591',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CO" className={`${heading.variable} ${body.variable} ${display.variable} ${texto.variable}`}>
      <body>
        <MarcaRuta>
        <SchemaMarkup schema={globalSchema} />
        <SiteChrome>
          <Navbar />
        </SiteChrome>
        <main className="pb-[calc(env(safe-area-inset-bottom)+84px)] md:pb-0">{children}</main>
        <SiteChrome>
          <Footer />
          {/* Botón flotante WhatsApp solo en desktop; en móvil lo cubre la barra fija inferior */}
          <div className="hidden md:block">
            <WhatsAppButton />
          </div>
          <MobileCTABar />
        </SiteChrome>
        </MarcaRuta>
        <CTAClickTracker />
        <Analytics />
        <SpeedInsights />

        {/* GTM con afterInteractive: carga justo después de la hidratación, sin bloquear el
            render inicial, pero a tiempo para no perder conversiones de Google Ads (AW-) ni
            pageviews de rebotes rápidos. lazyOnload (idle) perdía conversiones de tráfico pagado.
            En previews de Vercel (*.vercel.app) carga solo con `?gtm=1` (queda en la sesión): así
            Lighthouse mide el preview igual que producción sin que cada visita de revisión ensucie
            GA4 ni las conversiones de Ads. `?gtm=0` lo apaga.
            Tres salidas antes de cargar nada: fuera de agroincol.com (localhost), en
            /ecogel y /tienda (la tienda mide solo con su Pixel, sin GTM) y en modo prueba (`?test=1`, misma
            clave de sessionStorage que lib/meta/modo-prueba.ts). */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){var o=w.location,h=o.hostname,p=o.pathname;var pv=/\\.vercel\\.app$/.test(h);if(pv){try{var g=new URLSearchParams(o.search).get('gtm');if(g==='1')w.sessionStorage.setItem('agroincol_gtm','1');if(g==='0')w.sessionStorage.removeItem('agroincol_gtm');if(w.sessionStorage.getItem('agroincol_gtm')!=='1')return;}catch(e){if(!/[?&]gtm=1(&|$)/.test(o.search))return;}}else if(h!=='agroincol.com'&&h!=='www.agroincol.com')return;if(p==='/ecogel'||p.indexOf('/ecogel/')===0||p==='/tienda'||p.indexOf('/tienda/')===0)return;try{var t=new URLSearchParams(o.search).get('test');if(t==='1')w.sessionStorage.setItem('agroincol_test','1');if(t==='0')w.sessionStorage.removeItem('agroincol_test');if(w.sessionStorage.getItem('agroincol_test')==='1')return;}catch(e){if(/[?&]test=1(&|$)/.test(o.search))return;}w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NLH5NQRR');`}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NLH5NQRR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  );
}
