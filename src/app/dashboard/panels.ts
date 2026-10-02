// Single source of truth for dashboard panels. Kept outside the "use client"
// CmsDashboard module so the server page can import the runtime values too.
export const ACTIVE_PANELS = [
  "about-hero",
  "about-story",
  "about-contact",
  "home-hero",
  "home-product",
  "home-pack-showcase",
  "home-showcase",
  "product-features",
  "product-package",
  "product-media-strip",
  "product-reveal",
  "product-detail",
  "product-faq",
  "product-steps",
  "faq",
  "terms",
  "privacy",
  "returns",
  "safety",
  "profile",
] as const;

export type ActivePanel = (typeof ACTIVE_PANELS)[number];

export function isActivePanel(value: string | undefined): value is ActivePanel {
  return (ACTIVE_PANELS as readonly string[]).includes(value ?? "");
}

// Exhaustive on purpose: a missing case used to fall through to "home-form",
// so the header Save button silently re-saved the homepage instead of the active panel.
export function formIdForPanel(panel: ActivePanel): string {
  switch (panel) {
    case "about-hero":
    case "about-story":
    case "about-contact":
      return "about-form";
    case "home-hero":
    case "home-product":
    case "home-pack-showcase":
    case "home-showcase":
      return "home-form";
    case "product-features":
    case "product-package":
    case "product-media-strip":
    case "product-reveal":
    case "product-detail":
    case "product-faq":
    case "product-steps":
      return "product-detail-form";
    case "faq":
      return "faq-form";
    case "terms":
      return "terms-form";
    case "privacy":
      return "privacy-form";
    case "returns":
      return "returns-form";
    case "safety":
      return "safety-form";
    case "profile":
      return "profile-form";
  }
}
