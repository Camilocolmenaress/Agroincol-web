export interface ContactFormData {
  nombre: string;
  telefono: string;
  email: string;
  tipoServicio: string;
  direccion: string;
  mensaje: string;
  formId: string;
  page: string;
}

export interface ContactFormProps {
  preselectedService?: string;
  formId: string;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  imagePlaceholder?: string;
  centeredText?: boolean;
}

export interface ServiceCardData {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  keywords: readonly string[];
  hasPage?: boolean;
  href?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ImagePlaceholderProps {
  description: string;
  width: string;
  height: string;
  className?: string;
}
