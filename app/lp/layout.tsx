import MetaPixel from '@/components/analytics/MetaPixel';
import PostHogInit from '@/components/analytics/PostHogInit';

/**
 * Medición EXCLUSIVA de las landings de pauta.
 *
 * El Pixel de Meta y PostHog viven aquí y no en el layout raíz por una razón de
 * limpieza de datos, no de rendimiento:
 *
 * El sitio orgánico recibe tráfico de Google Ads y de búsqueda. Si el Pixel
 * corriera ahí, Meta registraría conversiones que trajo Google y se colgaría
 * medallas ajenas: la campaña de Meta se vería mejor de lo que es y el algoritmo
 * optimizaría con señal contaminada. Justo lo contrario de lo que queremos, que
 * es medir con precisión cuánto cuesta de verdad un lead de Meta.
 *
 * UN SOLO pixel para las dos landings. Meta no permite que un conjunto de
 * anuncios optimice hacia dos pixeles, y el presupuesto solo alcanza para un
 * conjunto; además el historial del pixel es un activo que se acumula y
 * partirlo lo divide a la mitad para siempre. La separación por plaga se hace
 * con el parámetro content_category, que cada landing envía en sus eventos.
 *
 * El costo de aislarlo del sitio orgánico: se pierde el remarketing sobre esos
 * visitantes. Es una audiencia buena y gratuita, pero no vale ensuciar la
 * atribución del único mes que existe para medir el CPL y la tasa de cierre.
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MetaPixel />
      <PostHogInit />
    </>
  );
}
