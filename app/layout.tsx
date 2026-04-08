import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Partytown } from '@builder.io/partytown/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { GoogleTagManager, GoogleTagManagerNoscript } from '@/components/analytics/GoogleTagManager';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import WhatsAppClickTracker from '@/components/analytics/WhatsAppClickTracker';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const heading = localFont({
  src: [
    { path: '../public/fonts/LeagueSpartan-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/LeagueSpartan-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/LeagueSpartan-Medium.ttf', weight: '500', style: 'normal' },
  ],
  variable: '--font-heading',
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
});

const body = localFont({
  src: [
    { path: '../public/fonts/Nunito-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Nunito-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/Nunito-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/Nunito-Light.ttf', weight: '300', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
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
};

const globalSchema = {
  '@context': 'https://schema.org',
  '@type': 'PestControlService',
  '@id': 'https://agroincol.com/#organization',
  name: 'AGROINCOL',
  url: 'https://agroincol.com',
  telephone: '+573107891948',
  foundingDate: '1985',
  description: 'Empresa de fumigación y control de plagas con más de 40 años de experiencia en el Área Metropolitana de Bucaramanga, Santander, Colombia.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Cra 9 #3-34',
    addressLocality: 'Floridablanca',
    addressRegion: 'Santander',
    postalCode: '681003',
    addressCountry: 'CO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 7.0636,
    longitude: -73.0897,
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
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${heading.variable} ${body.variable}`}>
      <head>
        <Partytown
          debug={false}
          forward={[
            'dataLayer.push',
            'gtag',
            'google_tag_manager',
            'google_tag_data.ics.entry',
          ]}
          resolveUrl={(url, location) => {
            const proxyDomains = [
              'www.googletagmanager.com',
              'www.google-analytics.com',
              'analytics.google.com',
              'stats.g.doubleclick.net',
            ];
            if (proxyDomains.includes(url.hostname)) {
              const proxyUrl = new URL('/api/partytown-proxy', location.origin);
              proxyUrl.searchParams.set('url', url.href);
              return proxyUrl;
            }
            return url;
          }}
        />
        <GoogleTagManager />
        <GoogleAnalytics />
      </head>
      <body>
        <GoogleTagManagerNoscript />
        <SchemaMarkup schema={globalSchema} />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <WhatsAppClickTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
