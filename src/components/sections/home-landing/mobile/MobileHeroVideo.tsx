import { VideoMuteButton } from "@/components/media/VideoMuteButton";
import { VideoPlaybackButton } from "@/components/media/VideoPlaybackButton";
import { HERO_VIDEO_POSTER_URL, MOBILE_HERO_VIDEO_URL } from "@/config/hero-video";

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
        poster={HERO_VIDEO_POSTER_URL}
      >
        <source src={MOBILE_HERO_VIDEO_URL} type="video/mp4" />
      </video>
      <VideoPlaybackButton className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 scale-[0.82]" />
      <VideoMuteButton className="absolute bottom-[18px] right-[18px] z-20 scale-[0.82]" />
    </section>
  );
}
