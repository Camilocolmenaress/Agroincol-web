import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react';
import { BUSINESS, SERVICES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-brand-green-dark">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="font-heading text-2xl font-bold text-white">
              AGROINCOL
            </Link>
            <p className="text-brand-gray text-body-sm mt-2">{BUSINESS.slogan}</p>
            <p className="text-gray-400 text-body-sm mt-4">
              Empresa de fumigación y control de plagas líder en el Área Metropolitana de Bucaramanga.
              Servicio certificado conforme al Decreto 1843 de 1991.
            </p>
          </div>

          {/* Column 2 — Services */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">Servicios</h3>
            <ul className="space-y-2">
              {SERVICES.map((service) =>
                'hasPage' in service && service.hasPage && 'href' in service ? (
                  <li key={service.slug}>
                    <Link href={service.href} className="text-gray-400 text-body-sm hover:text-brand-orange transition-colors">
                      {service.title}
                    </Link>
                  </li>
                ) : (
                  <li key={service.slug}>
                    <span className="text-gray-400 text-body-sm">{service.title}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3 — Legal */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">Normativa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/certificaciones-y-normativa" className="text-gray-400 text-body-sm hover:text-brand-orange transition-colors">
                  Certificaciones y Normativa
                </Link>
              </li>
              <li>
                <span className="text-gray-400 text-body-sm">Decreto 1843 de 1991</span>
              </li>
              <li>
                <span className="text-gray-400 text-body-sm">Resolución 2674 de 2013</span>
              </li>
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-orange mt-0.5 shrink-0" />
                <span className="text-gray-400 text-body-sm">{BUSINESS.address.full}</span>
              </li>
              <li>
                <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-3 text-gray-400 text-body-sm hover:text-brand-orange transition-colors">
                  <Phone size={18} className="text-brand-orange shrink-0" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a href={BUSINESS.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 text-body-sm hover:text-brand-orange transition-colors">
                  <MessageCircle size={18} className="text-brand-orange shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-brand-orange mt-0.5 shrink-0" />
                <div className="text-gray-400 text-body-sm">
                  <p>L-V: {BUSINESS.hours.weekdays}</p>
                  <p>Sáb: {BUSINESS.hours.saturday}</p>
                  <p>Dom: {BUSINESS.hours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-6">
          <p className="text-gray-400 text-body-sm text-center">
            © 2025 AGROINCOL. Todos los derechos reservados. Fumigación y control de plagas en Bucaramanga, Santander.
          </p>
        </div>
      </div>
    </footer>
  );
}
