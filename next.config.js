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
  // PostHog pasa por /ingest en nuestro dominio en vez de hablar directo con
  // posthog.com: los bloqueadores de rastreadores cortan ese dominio y nos
  // dejarían sin buena parte de las sesiones. La región se cambia con
  // NEXT_PUBLIC_POSTHOG_HOST (US por defecto).
  //
  // NO usar skipTrailingSlashRedirect, aunque la documentación de PostHog lo
  // sugiera. Con trailingSlash:false, esa opción hace que /precios/ y /precios
  // devuelvan las dos un 200 en vez de redirigir: las 36 páginas del sitio
  // quedarían con URL duplicada. En un sitio que vive del orgánico eso cuesta
  // mucho más de lo que vale la comodidad del proxy. Sin la opción, Next
  // responde 308 a las rutas con barra final, y el 308 conserva método y
  // cuerpo, así que los POST de PostHog llegan igual con un salto extra.
  async rewrites() {
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
    const posthogAssets = posthogHost.replace('.i.posthog.com', '-assets.i.posthog.com');
    const posthog = [
      { source: '/ingest/static/:path*', destination: `${posthogAssets}/static/:path*` },
      { source: '/ingest/:path*', destination: `${posthogHost}/:path*` },
    ];

    const alivio = process.env.ALIVIO_ZONE_URL;
    if (!alivio) return posthog;
    const base = alivio.replace(/\/$/, '');
    return [
      ...posthog,
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
