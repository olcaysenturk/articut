export const breakpoints = {
  mobile: 375,
  mobileLg: 390,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  desktopLg: 1440,
  desktopXl: 1920,
} as const;

export const mediaQueries = {
  mobileUp: `(min-width: ${breakpoints.mobile}px)`,
  tabletUp: `(min-width: ${breakpoints.tablet}px)`,
  laptopUp: `(min-width: ${breakpoints.laptop}px)`,
  desktopUp: `(min-width: ${breakpoints.desktop}px)`,
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;
