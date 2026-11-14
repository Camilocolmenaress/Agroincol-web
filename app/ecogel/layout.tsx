import MetaPixel from '@/components/analytics/MetaPixel';
import { titulosLanding } from '@/components/layout/titulos-landing';
import PostHogInit from '@/components/analytics/PostHogInit';

// Misma medición aislada que /lp (ver el comentario largo en app/lp/layout.tsx):
// el Pixel vive aquí y no en el layout raíz para no contaminar la atribución.
export default function EcogelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Títulos con precarga solo aquí (components/layout/titulos-landing.ts). */}
      <div className={titulosLanding.variable} style={{ display: 'contents' }}>
        {children}
      </div>
      <MetaPixel />
      <PostHogInit />
    </>
  );
}
