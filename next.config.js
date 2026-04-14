/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
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
