import type { Metadata } from 'next';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import ReviewsMarquee from '@/components/landing/ReviewsMarquee';
import LandingVideo from '@/components/landing/LandingVideo';
import LandingFAQ from '@/components/landing/LandingFAQ';
import { LandingFooter } from '@/components/landing/LandingChrome';
import FloatingContact from '@/components/landing/FloatingContact';
import LandingContactTracker from '@/components/landing/LandingContactTracker';
import {
  SignsSection,
  TreatmentSection,
  GuaranteeSection,
  TrustSection,
} from '@/components/landing/LandingSections';
import { CHINCHES } from '@/lib/landing';
import { reviewsFor } from '@/lib/reviews';
import { getReviewImages } from '@/lib/reviewImages';

export const metadata: Metadata = {
  title: CHINCHES.metaTitle,
  description: CHINCHES.metaDescription,
  // Es una landing de pauta, no de orgánico: no debe competir con las páginas de SEO
  // por las mismas consultas ni aparecer en resultados.
  robots: { index: false, follow: false },
};

export default function ChinchesLandingPage() {
  // Si hay capturas de Google, las tarjetas de texto no se usan: no tiene sentido
  // serializarlas al cliente.
  const reviewImages = getReviewImages();

  return (
    <>
      <LandingHeader />
      <LandingHero config={CHINCHES} />
      <ReviewsMarquee reviews={reviewImages.length ? [] : reviewsFor('chinches')} images={reviewImages} />
      <LandingVideo />
      <SignsSection config={CHINCHES} />
      <TreatmentSection config={CHINCHES} />
      <GuaranteeSection config={CHINCHES} />
      <TrustSection />
      <LandingFAQ config={CHINCHES} />
      <LandingFooter />
      <FloatingContact whatsappText={CHINCHES.whatsappText} />
      <LandingContactTracker categoria="chinches" />
    </>
  );
}
