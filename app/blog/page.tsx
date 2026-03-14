import type { Metadata } from 'next';
import Link from 'next/link';
import { ImageIcon, ArrowRight } from 'lucide-react';
import Hero from '@/components/sections/Hero';
import Button from '@/components/ui/Button';
import { BUSINESS, BLOG_POSTS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Blog de Fumigación y Control de Plagas | AGROINCOL',
  description: 'Consejos de expertos sobre fumigación, control de plagas y normativa sanitaria en Bucaramanga y Santander. Más de 40 años de experiencia.',
  alternates: {
    canonical: 'https://agroincol.com/blog',
  },
  openGraph: {
    title: 'Blog de Fumigación y Control de Plagas | AGROINCOL',
    description: 'Consejos de expertos sobre fumigación, control de plagas y normativa sanitaria en Bucaramanga y Santander.',
    url: 'https://agroincol.com/blog',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Blog de Fumigación y Control de Plagas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog de Fumigación y Control de Plagas | AGROINCOL',
    description: 'Consejos de expertos sobre fumigación, control de plagas y normativa sanitaria en Bucaramanga y Santander.',
  },
};

export default function BlogPage() {
  return (
    <>
      <Hero
        title="Blog — Control de Plagas y Fumigación"
        subtitle="Consejos de expertos con más de 40 años de experiencia protegiendo Bucaramanga y Santander"
        primaryCta={{ text: 'Ver Artículos', href: '#articulos' }}
        centeredText
      />

      {/* Articles Grid */}
      <section id="articulos" className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {BLOG_POSTS.map((post) => {
              const formattedDate = new Date(post.publishDate).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <article key={post.slug} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image placeholder */}
                  <div className="bg-gray-100 aspect-video flex items-center justify-center">
                    <ImageIcon size={40} className="text-gray-300" />
                  </div>

                  <div className="p-5 md:p-6">
                    {/* Category */}
                    <span className="inline-block bg-brand-orange/10 text-brand-orange text-xs font-semibold font-body px-3 py-1 rounded-full mb-3">
                      {post.category}
                    </span>

                    {/* Title */}
                    <h2 className="font-heading text-lg font-bold text-brand-green mb-2 leading-snug">
                      <Link href={`/blog/${post.slug}`} className="hover:text-brand-orange transition-colors">
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-brand-gray text-body-sm line-clamp-2 mb-3">
                      {post.description}
                    </p>

                    {/* Meta + CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-gray-400 text-xs font-body">{formattedDate}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-1 text-brand-orange font-semibold text-body-sm hover:text-brand-orange-dark transition-colors"
                      >
                        Leer más <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-green">
        <div className="container-custom text-center">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-white mb-4">
            ¿Necesita fumigación? Cotice gratis
          </h2>
          <p className="text-gray-300 text-body-lg mb-6 max-w-2xl mx-auto">
            40+ años de experiencia en el Área Metropolitana de Bucaramanga. Respuesta en menos de 2 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" href="#contacto">
              Solicitar Cotización
            </Button>
            <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
              WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
