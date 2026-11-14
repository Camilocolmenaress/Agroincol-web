import localFont from 'next/font/local';

// League Spartan de títulos (la misma del layout raíz) con precarga, solo para las landings de pauta.
// El sitio v2 ya no la precarga: competía con el LCP del home. Las landings la aplican en un
// envoltorio con display: contents (mismo archivo, mismos pesos: se ven idénticas).
export const titulosLanding = localFont({
  src: [
    { path: '../../public/fonts/LeagueSpartan-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/LeagueSpartan-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/LeagueSpartan-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-heading',
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
});
