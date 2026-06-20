'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // El portal solo puede montar en cliente (document.body no existe en SSR).
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Bloquea el scroll del body mientras el menú está abierto (evita scroll fantasma detrás).
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-green-dark/90 backdrop-blur-md shadow-premium border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="relative shrink-0">
          <Image
            src="/images/logos/logo-horizontal.png"
            alt="AGROINCOL — Fumigaci&oacute;n y Control de Plagas"
            width={180}
            height={40}
            priority
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-body font-semibold transition-colors duration-200 ${
                  isActive ? 'text-brand-orange' : 'text-white hover:text-brand-orange'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="primary" href="#contacto" className="text-sm px-4 py-2">
            Cotizar Ahora
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-white p-2"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
      </div>
    </nav>

    {/* Mobile drawer — vía portal a <body> para escapar del backdrop-filter del <nav>
        (en iOS, un ancestro con backdrop-filter atrapa el position:fixed del hijo). */}
    {mounted &&
      mobileOpen &&
      createPortal(
        <div
          className="fixed inset-0 z-[100] flex flex-col md:hidden animate-fade-in-up"
          style={{ backgroundColor: '#0D2B20' }}
        >
          <div className="flex items-center justify-between h-16 px-4">
            <Link href="/" className="relative shrink-0">
              <Image
                src="/images/logos/logo-horizontal.png"
                alt="AGROINCOL"
                width={180}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-white p-2"
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col px-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-4 border-b border-brand-green text-lg font-body font-semibold transition-colors duration-200 ${
                    isActive ? 'text-brand-orange' : 'text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-6">
              <Button variant="primary" href="#contacto" fullWidth>
                Cotizar Ahora
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
