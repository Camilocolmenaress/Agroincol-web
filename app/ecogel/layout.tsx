import MetaPixel from '@/components/analytics/MetaPixel';
import PostHogInit from '@/components/analytics/PostHogInit';

// Misma medición aislada que /lp (ver el comentario largo en app/lp/layout.tsx):
// el Pixel vive aquí y no en el layout raíz para no contaminar la atribución.
export default function EcogelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MetaPixel />
      <PostHogInit />
    </>
  );
}
