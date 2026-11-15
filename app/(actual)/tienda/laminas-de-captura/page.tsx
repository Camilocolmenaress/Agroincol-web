import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import { ENTREGA_AM, ENVIO_AM, ENVIO_FUERA, GUIA_PDF, NOMBRE, money } from '@/lib/laminas';
import { CUIDADOS, PASOS } from '@/lib/laminas-contenido';
import { videoSlot } from '@/lib/laminas-medios';
import { CantidadProvider } from '@/components/tienda/Cantidad';
import Cabecera from '@/components/tienda/Cabecera';
import Galeria, { type Foto } from '@/components/tienda/Galeria';
import CajaCompra from '@/components/tienda/CajaCompra';
import Carrito from '@/components/tienda/Carrito';
import BarraSticky from '@/components/tienda/BarraSticky';
import { RastreoVista } from '@/components/tienda/Rastreo';
import { Acordeon, Cierre, Comparacion, SelloEstudio, CuentaParedes, DespuesDeInstalar, Envio, Pie, Preguntas, ReglaDeOro, SeisPuntos, Testimonios } from '@/components/tienda/Secciones';

export const metadata: Metadata = {
  title: `${NOMBRE} | Para restaurantes, fincas y bodegas`,
  description:
    'Láminas adhesivas plegables para atrapar ratas y ratones, con guía de ubicación y uso. Envío gratis desde 12 láminas en Bucaramanga, Floridablanca, Girón y Piedecuesta.',
  // Página de pauta: no compite con el sitio orgánico.
  robots: { index: false, follow: false },
  // Imagen para compartir del manual de marca (cuando mandan el enlace por WhatsApp).
  openGraph: { title: NOMBRE, images: [{ url: '/tienda/marca/compartir.png', width: 1200, height: 630 }] },
};

// Las 6 fotos de Camilo (orden: uso → caja → escala → detalle) y dos diagramas de la guía,
// como las infografías de la galería de Grüns.
const FOTOS: Foto[] = [
  { src: '/tienda/laminas/esquina.webp', alt: 'Lámina doblada en L contra la pared, en la esquina del piso' },
  { src: '/tienda/laminas/caja.webp', alt: 'Caja de láminas adhesivas, 2 láminas por caja' },
  { src: '/tienda/laminas/abierta-mano.webp', alt: 'Lámina abierta sostenida con la mano, para ver su tamaño' },
  { src: '/tienda/laminas/pegante.webp', alt: 'Detalle del pegante amarillo y el borde verde' },
  { src: '/tienda/laminas/caja-abierta.webp', alt: 'Caja abierta junto a una lámina cerrada como un libro' },
  { src: '/tienda/laminas/cajas-varias.webp', alt: 'Varias cajas de láminas' },
  { src: '/tienda/laminas/diagrama-ruta.webp', alt: 'Diagrama: la lámina va contra la pared, no en la mitad del pasillo', diagrama: true },
  { src: '/tienda/laminas/diagrama-cuantas.webp', alt: 'Diagrama: 1 lámina cada 3 metros de pared más 1 por puerta', diagrama: true },
];

export default function LaminasPage() {
  return (
    <CantidadProvider>
      <Cabecera />
      <div>
        <section id="comprar" className="container-custom scroll-mt-20 pb-12 pt-4 lg:grid lg:grid-cols-2 lg:gap-12 lg:pt-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Galeria fotos={FOTOS} />
            {/* Como "View Nutrition Label" de Grüns: el documento del producto, a un toque, bajo las fotos. */}
            <a
              href={GUIA_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-brand-black/80 bg-white px-5 py-3 font-heading text-body font-bold text-brand-black"
            >
              <BookOpen size={18} aria-hidden /> Ver la guía de ubicación y uso (PDF)
            </a>
            <SelloEstudio />
          </div>
          <div className="mt-6 lg:mt-0">
            <CajaCompra videoA={videoSlot('video-a')}>
              <Acordeon titulo="Qué trae la caja">
                Láminas plegables, como un libro: dos mitades con pegante y un borde verde para agarrarla. El pegante viene cubierto con un papel
                protector. Vienen 2 láminas por caja, en la caja original del fabricante. Con su pedido le enviamos la guía de ubicación y uso.
              </Acordeon>
              <Acordeon titulo="Seis cuidados que no se negocian">
                <ul className="grid grid-cols-2 gap-3">
                  {CUIDADOS.map((c) => (
                    <li key={c.titulo} className="rounded-xl bg-brand-mint p-3">
                      <p className="font-heading text-body-sm font-bold text-brand-green">{c.titulo}</p>
                      <p className="mt-0.5 text-body-sm leading-snug">{c.texto}</p>
                    </li>
                  ))}
                </ul>
              </Acordeon>
              <Acordeon titulo="Cómo instalarla: cinco pasos, dos minutos">
                <ol className="space-y-2.5">
                  {PASOS.map((p, i) => (
                    <li key={p.titulo} className="flex gap-3">
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-green font-heading text-[13px] font-bold text-white">{i + 1}</span>
                      <p className="leading-snug">
                        <strong className="font-heading text-brand-green">{p.titulo}.</strong> {p.texto}
                      </p>
                    </li>
                  ))}
                </ol>
              </Acordeon>
              <Acordeon titulo="Envíos y pagos">
                <p>
                  <strong>Área metropolitana</strong> (Bucaramanga, Floridablanca, Girón y Piedecuesta): {money(ENVIO_AM)} de 6 a 11 láminas, gratis
                  desde 12. {ENTREGA_AM}.
                </p>
                <p className="mt-2">
                  <strong>Resto del país:</strong> {money(ENVIO_FUERA)} por pedido, por transportadora.
                </p>
                <p className="mt-2">Pague en línea con tarjeta o PSE, por transferencia, o en efectivo al recibir (solo en el área metropolitana).</p>
              </Acordeon>
            </CajaCompra>
          </div>
        </section>

        <ReglaDeOro />
        <CuentaParedes />
        <SeisPuntos />
        <Envio />
        <Testimonios />
        <DespuesDeInstalar videoB={videoSlot('video-b')} />
        <Comparacion />
        <Preguntas />
        <Cierre />
      </div>
      <Pie conBarra />
      <Carrito />
      <BarraSticky />
      <RastreoVista />
    </CantidadProvider>
  );
}
