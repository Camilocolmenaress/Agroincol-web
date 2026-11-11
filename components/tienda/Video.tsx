// Los videos A y B: ver videoSlot() en lib/laminas-medios.ts (servidor).
export interface VideoSlot {
  src: string;
  poster: string;
}

export default function Video({ slot, titulo }: { slot: VideoSlot; titulo: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-brand-green-dark">
      <video src={slot.src} poster={slot.poster} controls playsInline preload="none" className="aspect-[9/16] max-h-[70vh] w-full object-cover" />
      <figcaption className="px-4 py-2.5 font-heading text-body-sm font-bold text-white">{titulo}</figcaption>
    </figure>
  );
}
