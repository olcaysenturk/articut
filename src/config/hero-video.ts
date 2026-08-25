export const DEFAULT_HERO_VIDEO_URL =
  "https://player.vimeo.com/progressive_redirect/playback/1218870695/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&signature=9e163b09729e2009c057f3d2936e8e6bac42563673c8f3aca3eebbf31d1f5e48";

export const DEFAULT_MOBILE_HERO_VIDEO_URL =
  "https://player.vimeo.com/progressive_redirect/playback/1218872964/rendition/360p/file.mp4%20%28360p%29.mp4?loc=external&signature=70b1b382ec6bc46a2ecec493c9653886643731463652f1568ebdccc00631952d";

export const HERO_VIDEO_EMBED_URL =
  "https://player.vimeo.com/video/1218870695?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1";

export const MOBILE_HERO_VIDEO_EMBED_URL =
  "https://player.vimeo.com/video/1218872964?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1";

export const HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim() || DEFAULT_HERO_VIDEO_URL;

export const MOBILE_HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_MOBILE_HERO_VIDEO_URL?.trim() || DEFAULT_MOBILE_HERO_VIDEO_URL;

export const HERO_VIDEO_POSTER_URL = "/images/hero-poster.png";

export const DEFAULT_ABOUT_HERO_VIDEO_URL =
  "https://player.vimeo.com/progressive_redirect/playback/1218880252/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&signature=5b6ef1a7d3adfa4e94ad0c0a94ee4a7d086c0532783314683e6cc5141c80e16e";

export const ABOUT_HERO_VIDEO_EMBED_URL =
  "https://player.vimeo.com/video/1218880252?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1";

export const ABOUT_MOBILE_HERO_VIDEO_EMBED_URL =
  "https://player.vimeo.com/video/1218880253?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1";

export const ABOUT_HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_ABOUT_HERO_VIDEO_URL?.trim() || DEFAULT_ABOUT_HERO_VIDEO_URL;

export const ABOUT_MOBILE_HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_ABOUT_MOBILE_HERO_VIDEO_URL?.trim() || ABOUT_HERO_VIDEO_URL;

export const ABOUT_HERO_VIDEO_POSTER_URL = "/images/about-hero-poster.png";
