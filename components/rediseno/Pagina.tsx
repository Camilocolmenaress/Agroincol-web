import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { paginaPrototipo, transformar } from '@/lib/rediseno/contenido';
import { jsonLdDe } from '@/lib/rediseno/seo';
import { conMensaje, mensajeWhatsApp } from '@/lib/rediseno/whatsapp';

// <main> de una página del prototipo aprobado, tal cual (con rutas e imágenes de producción), y el
// JSON-LD de esa ruta. El movimiento lo monta <Motor/> (components/rediseno/Motor.tsx).
export default function Pagina({ archivo, ruta }: { archivo: string; ruta: string }) {
  const mensaje = mensajeWhatsApp(ruta);
  const html = conMensaje(transformar(paginaPrototipo(archivo).main as string), mensaje);
  return (
    <>
      {jsonLdDe(ruta, archivo).map((j, i) => (
        <SchemaMarkup key={i} schema={j} />
      ))}
      <main id="contenido" data-wa={mensaje} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
