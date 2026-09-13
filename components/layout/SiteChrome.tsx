'use client';

import { usePathname } from 'next/navigation';

// Las landings de pauta (/lp/*) no llevan navegación: cada enlace de salida es un lead
// pagado que se va. Este envoltorio oculta el cromo global solo en esas rutas y deja
// el resto del sitio exactamente igual.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/lp')) return null;
  return <>{children}</>;
}
