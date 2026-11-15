import Button from '@/components/ui/Button';
import { BUSINESS } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="bg-brand-light min-h-screen flex items-center justify-center pt-20">
      <div className="text-center px-4">
        <p className="text-brand-orange font-heading text-[8rem] font-bold opacity-20 leading-none">404</p>
        <h1 className="font-heading text-h1-mobile md:text-h1 text-brand-green mt-4">
          Página no encontrada
        </h1>
        <p className="text-brand-gray text-body mt-4 max-w-md mx-auto">
          La página que busca no existe o fue movida. Puede volver al inicio o contactarnos si necesita ayuda.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button variant="primary" href="/">
            Volver al Inicio
          </Button>
          <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
            Contactar por WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
