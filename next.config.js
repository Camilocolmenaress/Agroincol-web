/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      {
        source: '/restaurantes-control-de-plagas-bucaramanga',
        destination: '/servicios/fumigacion-restaurantes',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
