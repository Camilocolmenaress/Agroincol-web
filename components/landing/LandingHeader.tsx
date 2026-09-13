import Image from 'next/image';

// Franja mínima con el logo, arriba del todo. El fondo es exactamente el del PNG
// (#E1EAE2, muestreado del archivo) para que el borde de la imagen no se note.
// Sin enlaces: en una landing de pauta hasta el logo clicable es una fuga.
export default function LandingHeader() {
  return (
    <header className="bg-brand-mint py-3">
      <div className="container-custom flex justify-center md:justify-start">
        <Image
          src="/images/logos/logo-horizontal.png"
          alt="AGROINCOL"
          width={420}
          height={140}
          priority
          className="h-10 w-auto md:h-12"
        />
      </div>
    </header>
  );
}
