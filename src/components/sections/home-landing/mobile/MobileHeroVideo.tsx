import { VideoMuteButton } from "@/components/media/VideoMuteButton";

export function MobileHeroVideo() {
  return (
    <section data-video-frame className="absolute left-0 top-0 h-[492px] w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero-poster.png"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <VideoMuteButton className="absolute bottom-[18px] right-[18px] z-20 scale-[0.82]" />
    </section>
  );
}
