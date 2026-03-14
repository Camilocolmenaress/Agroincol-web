import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ContactForm from '@/components/forms/ContactForm';
import { BUSINESS, BLOG_POSTS } from '@/lib/constants';

interface ArticleLayoutProps {
  title: string;
  description: string;
  publishDate: string;
  category: string;
  readTime: string;
  currentSlug: string;
  children: React.ReactNode;
}

export default function ArticleLayout({
  title,
  publishDate,
  category,
  readTime,
  currentSlug,
  children,
}: ArticleLayoutProps) {
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== currentSlug).slice(0, 3);

  const formattedDate = new Date(publishDate).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-green pt-24 md:pt-32">
        <div className="container-custom section-padding text-center">
          <div className="mb-4">
            <Badge icon={<Calendar size={14} />}>{category}</Badge>
          </div>
          <h1 className="text-hero-mobile md:text-hero text-white font-heading max-w-4xl mx-auto">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4 text-gray-300 text-body-sm">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readTime} de lectura
            </span>
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Article content */}
            <article className="lg:col-span-8 max-w-3xl">
              {children}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-brand-green rounded-2xl p-6 text-center">
                  <h3 className="font-heading text-lg text-white font-bold mb-2">
                    ¿Necesita fumigación?
                  </h3>
                  <p className="text-gray-300 text-body-sm mb-4">
                    40+ años protegiendo Bucaramanga y Santander
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button variant="primary" href="#blog-contacto" fullWidth>
                      Cotizar Gratis
                    </Button>
                    <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank" fullWidth>
                      WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Tools Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-heading text-lg text-brand-green font-bold mb-2">Herramientas</h3>
                  <p className="text-brand-gray text-body-sm mb-3">
                    Calcule cada cuánto debe fumigar su propiedad
                  </p>
                  <Link
                    href="/herramientas/calculadora-fumigacion"
                    className="text-brand-orange hover:text-brand-orange-dark font-semibold text-body-sm underline transition-colors"
                  >
                    Usar calculadora gratuita →
                  </Link>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-heading text-lg text-brand-green font-bold mb-4">Artículos relacionados</h3>
                    <ul className="space-y-3">
                      {relatedPosts.map((post) => (
                        <li key={post.slug}>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-brand-black text-body-sm hover:text-brand-orange transition-colors leading-snug block"
                          >
                            {post.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* About AGROINCOL — E-E-A-T */}
      <section className="bg-brand-light py-8">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
            <h3 className="font-heading text-lg text-brand-green font-bold mb-2">Sobre AGROINCOL</h3>
            <p className="text-brand-black text-body leading-relaxed">
              AGROINCOL es una empresa de fumigación y control de plagas con más de 40 años de experiencia en el Área
              Metropolitana de Bucaramanga. Nuestro equipo de técnicos certificados utiliza productos registrados ante el
              ICA y aprobados por la OMS. Emitimos certificados de fumigación válidos ante el INVIMA y la Secretaría de
              Salud de Santander.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-brand-light" id="blog-contacto">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                ¿Necesita Control de Plagas?
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Cotice gratis con AGROINCOL. Respuesta en menos de 2 horas en el Área Metropolitana de Bucaramanga.
              </p>
              <div className="mt-6">
                <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                  Escribir por WhatsApp
                </Button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <ContactForm formId="blog-contact" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
