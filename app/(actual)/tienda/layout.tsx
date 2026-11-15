import localFont from 'next/font/local';
import MetaPixel from '@/components/analytics/MetaPixel';
import PostHogInit from '@/components/analytics/PostHogInit';

// Tipografías del manual de marca (v2, oct-2026), archivos WOFF2 del propio
// manual: Montserrat para texto y Caveat Brush para el lema (una vez por pieza).
// League Spartan (títulos) ya la carga el layout raíz. Solo /tienda las usa:
// el resto del sitio sigue igual.
const montserrat = localFont({
  src: [
    { path: './fuentes/montserrat-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fuentes/montserrat-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fuentes/montserrat-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fuentes/montserrat-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
});

// Solo aparece al final de la página: sin precarga, para no competir con la foto principal.
const caveat = localFont({
  src: './fuentes/caveat-brush-latin-400-normal.woff2',
  variable: '--font-lema',
  display: 'swap',
  preload: false,
});

// Misma medición aislada que /ecogel: el Pixel de la tienda (TIENDA AGROINCOL)
// se decide por la ruta en lib/meta/cuentas.ts y vive aquí, no en el layout raíz.
export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-tienda className={`${montserrat.variable} ${caveat.variable} bg-[#FBFBF7] font-body text-brand-black`}>
      {children}
      <MetaPixel />
      <PostHogInit />
    </div>
  );
}
