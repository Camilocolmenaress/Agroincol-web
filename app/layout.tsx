import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Script from 'next/script';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import MobileCTABar from '@/components/ui/MobileCTABar';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import WhatsAppClickTracker from '@/components/analytics/WhatsAppClickTracker';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://agroincol.com'),
  title: {
    default: 'AGROINCOL — Fumigación y Control de Plagas en Bucaramanga',
    template: '%s | AGROINCOL',
  },
  description: 'Empresa de fumigación y control de plagas con más de 40 años de experiencia en Bucaramanga, Santander.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
    <html lang="es-CO" className={`${heading.variable} ${body.variable}`}>
      <body>
        <SchemaMarkup schema={globalSchema} />
        <Navbar />
        <main className="pb-[calc(env(safe-area-inset-bottom)+84px)] md:pb-0">{children}</main>
        <Footer />
        {/* Botón flotante WhatsApp solo en desktop; en móvil lo cubre la barra fija inferior */}
        <div className="hidden md:block">
          <WhatsAppButton />
        </div>
        <MobileCTABar />
        <WhatsAppClickTracker />
        <Analytics />
        <SpeedInsights />

        {/* GTM diferido (lazyOnload): se inicializa en tiempo de inactividad del navegador,
            fuera de la ruta crítica de hidratación. Antes pesaba ~150KB en preload y competía
            con la interactividad. El tracking sigue funcionando, solo arranca ~1-2s después. */}
        <Script id="gtm-init" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NLH5NQRR');`}
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
