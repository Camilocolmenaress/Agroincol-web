import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Página no encontrada', robots: { index: false, follow: true } };

// 404 con las piezas del prototipo (page-hero y cta-final) y el texto de la 404 anterior.
export default function NoEncontrada() {
  return (
    <main id="contenido">
      <section className="page-hero">
        <p className="crumb">
          <a href="/" data-transition>
            Inicio
          </a>{' '}
          · 404
        </p>
        <h1 className="display xl">
          <span>Página no</span> <span>encontrada</span>
        </h1>
        <p className="page-lead">La página que busca no existe o fue movida. Puede volver al inicio o contactarnos si necesita ayuda.</p>
      </section>
      <section className="cta-final">
        <div>
          <h2 className="display">
            ¿Tiene una plaga
            <br />
            ahora?
          </h2>
          <p>Escríbanos. Le respondemos por WhatsApp en menos de 5 minutos.</p>
          <div className="btns">
            <a className="btn btn-naranja" href="/" data-transition>
              Volver al Inicio
            </a>
            <a className="btn btn-linea" href="https://wa.me/573107891948">
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
