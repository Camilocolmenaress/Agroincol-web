/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    // AVIF primero (≈20% más liviano que webp); webp como respaldo.
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/restaurantes-control-de-plagas-bucaramanga{/}?',
        destination: '/servicios/fumigacion-restaurantes',
        permanent: true,
      },
    ];
  },
  // Multi-Zones: agroincol.com/alivio lo sirve la app Alivio (zona aparte).
  // ALIVIO_ZONE_URL = URL de producción de la zona Alivio en Vercel
  // (p.ej. https://alivio-web.vercel.app), SIN slash final.
  // Si la env no está, no se añade rewrite (el sitio sigue igual).
  async rewrites() {
    const alivio = process.env.ALIVIO_ZONE_URL;
    if (!alivio) return [];
    const base = alivio.replace(/\/$/, '');
    return [
      { source: '/alivio', destination: `${base}/alivio` },
      // cubre páginas, /api y /_next (assetPrefix también es /alivio)
      { source: '/alivio/:path+', destination: `${base}/alivio/:path+` },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
