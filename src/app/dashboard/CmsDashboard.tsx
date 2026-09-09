"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useEffect, useState, type DragEvent, type ReactNode } from "react";
import type {
  saveAboutContentAction,
  saveHomeContentAction,
  saveProductDetailContentAction,
  saveFaqContentAction,
  saveTermsContentAction,
  savePrivacyContentAction,
} from "@/app/dashboard/actions";
import type { logoutAction } from "@/app/dashboard/login/actions";
import type { CmsContent, CmsImage, CmsMediaItem, CmsRevealSection, CmsStep } from "@/types/cms";
import { getRevealSections } from "@/lib/product-reveal";
import { FaqForm } from "./faq/FaqForm";
import { TermsForm } from "./terms/TermsForm";
import { PrivacyForm } from "./privacy/PrivacyForm";
import { ProfileForm } from "./profile/ProfileForm";

export type ActivePanel =
  | "about-hero"
  | "about-story"
  | "about-contact"
  | "home-hero"
  | "home-product"
  | "home-pack-showcase"
  | "home-showcase"
  | "product-features"
  | "product-package"
  | "product-media-strip"
  | "product-reveal"
  | "product-detail"
  | "product-steps"
  | "faq"
  | "terms"
  | "privacy"
  | "profile";

type ManagedImage = CmsImage & {
  file?: File;
  id: string;
  previewSrc?: string;
};

type ManagedMediaItem = CmsMediaItem & {
  file?: File;
  id: string;
  previewSrc?: string;
};

type ManagedStep = {
  id: string;
  title: string;
  description: string;
  image: ManagedImage;
};

type MediaDimensionSpec = {
  width: number;
  height: number;
  ratioLabel: string;
};

function specNote(spec: MediaDimensionSpec) {
  return `${spec.width}×${spec.height} (${spec.ratioLabel})`;
}

const MEDIA_SPECS = {
  desktopHero: { width: 1920, height: 1080, ratioLabel: "16:9" },
  mobileHero: { width: 1080, height: 1350, ratioLabel: "4:5, vertical" },
  packShowcase: { width: 2200, height: 1000, ratioLabel: "~2.2:1, ultra-wide" },
  webShowcase: { width: 1920, height: 1080, ratioLabel: "16:9" },
  storyImage: { width: 1920, height: 1080, ratioLabel: "16:9" },
  packageImage: { width: 2400, height: 1600, ratioLabel: "3:2" },
  combsImage: { width: 2880, height: 1620, ratioLabel: "16:9" },
  homeProduct: { width: 2400, height: 1600, ratioLabel: "3:2" },
  slider: { width: 1920, height: 1080, ratioLabel: "16:9" },
  mediaStrip: { width: 1080, height: 1920, ratioLabel: "9:16, vertical" },
  productReveal: { width: 1920, height: 1080, ratioLabel: "16:9" },
  stepImage: { width: 1200, height: 1200, ratioLabel: "1:1, square" },
} as const satisfies Record<string, MediaDimensionSpec>;

const homePanels = [
  { key: "home-hero" as const, label: "Hero video" },
  { key: "home-product" as const, label: "Product image" },
  { key: "home-pack-showcase" as const, label: "Pack showcase image" },
  { key: "home-showcase" as const, label: "Web image showcase" },
];

const panels = [
  { key: "homepage" as const, label: "Homepage", icon: "home", children: homePanels },
  {
    key: "product" as const,
    label: "Product Detail",
    icon: "cards",
    children: [
      { key: "product-package" as const, label: "Package image" },
      { key: "product-detail" as const, label: "Slider images" },
      { key: "product-media-strip" as const, label: "Media strip" },
      { key: "product-reveal" as const, label: "Product reveal" },
      { key: "product-steps" as const, label: "How-to-use steps" },
      { key: "product-features" as const, label: "Feature overlay" },
    ],
  },
  {
    key: "about" as const,
    label: "About",
    icon: "info",
    children: [
      { key: "about-hero" as const, label: "Hero section" },
      { key: "about-story" as const, label: "Story section" },
      { key: "about-contact" as const, label: "Contact section" },
    ],
  },
  { key: "faq" as const, label: "FAQ", icon: "faq" },
  { key: "terms" as const, label: "Terms & Conditions", icon: "terms" },
  { key: "privacy" as const, label: "Privacy Policy", icon: "terms" },
  { key: "profile" as const, label: "Profile & Security", icon: "profile" },
];

function createBlankImage(): ManagedImage {
  return { id: crypto.randomUUID(), src: "", alt: "" };
}

function toManagedImage(image: CmsImage, prefix: string, index: number): ManagedImage {
  return {
    ...image,
    id: `${prefix}-${index}-${image.src}`,
  };
}

function toManagedStep(step: CmsStep, prefix: string, index: number): ManagedStep {
  return {
    id: `${prefix}-${index}`,
    title: step.title,
    description: step.description,
    image: toManagedImage(step.image, `${prefix}-${index}-image`, index),
  };
}

function createBlankMediaItem(type: CmsMediaItem["type"] = "image"): ManagedMediaItem {
  return type === "image"
    ? { id: crypto.randomUUID(), type, src: "", alt: "" }
    : { id: crypto.randomUUID(), type, src: "" };
}

function toManagedMediaItem(item: CmsMediaItem, prefix: string, index: number): ManagedMediaItem {
  return {
    ...item,
    id: `${prefix}-${index}-${item.type}-${item.src}`,
  };
}

function isManagedImageMedia(item: ManagedMediaItem): item is Extract<ManagedMediaItem, { type: "image" }> {
  return item.type === "image";
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [current] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, current);
  return next;
}

function appendManagedImageFiles(formData: FormData, prefix: string, images: ManagedImage[]) {
  images.forEach((image, index) => {
    if (image.file) {
      formData.set(`${prefix}-${index}-file`, image.file);
    }
  });
}

function appendManagedMediaFiles(formData: FormData, prefix: string, items: ManagedMediaItem[]) {
  items.forEach((item, index) => {
    if (item.file) {
      formData.set(`${prefix}-${index}-file`, item.file);
    }
  });
}

function formIdForPanel(panel: ActivePanel) {
  if (panel.startsWith("about-")) return "about-form";
  if (panel.startsWith("product-")) return "product-detail-form";
  if (panel === "faq") return "faq-form";
  if (panel === "terms") return "terms-form";
  if (panel === "privacy") return "privacy-form";
  if (panel === "profile") return "profile-form";
  return "home-form";
}

function labelForPanel(panel: ActivePanel) {
  if (panel === "about-hero") return "Hero section";
  if (panel === "about-story") return "Story section";
  if (panel === "about-contact") return "Contact section";
  if (panel === "product-features") return "Feature overlay";
  if (panel === "product-package") return "Package image";
  if (panel === "product-media-strip") return "Media strip";
  if (panel === "product-reveal") return "Product reveal";
  if (panel === "product-steps") return "How-to-use steps";
  if (panel === "home-hero") return "Hero video";
  if (panel === "home-product") return "Product image";
  if (panel === "product-detail") return "Slider images";
  if (panel === "faq") return "FAQ";
  if (panel === "terms") return "Terms & Conditions";
  if (panel === "privacy") return "Privacy Policy";
  if (panel === "profile") return "Profile & Security";

  return homePanels.find((item) => item.key === panel)?.label ?? "Homepage";
}

function descriptionForPanel(panel: ActivePanel) {
  if (panel.startsWith("home-")) return "Manage the content shown on the homepage.";
  if (panel.startsWith("product-")) return "Manage the product detail experience.";
  if (panel.startsWith("about-")) return "Manage the brand story and contact content.";
  if (panel === "faq") return "Keep customer questions and answers up to date.";
  if (panel === "terms" || panel === "privacy") return "Manage the legal content shown to visitors.";
  if (panel === "profile") return "Manage dashboard access and security.";
  return "Manage your website content.";
}

function Icon({ name }: { name: string }) {
  if (name === "home") {
    return (
      <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" />
      </svg>
    );
  }

  if (name === "info") {
    return (
      <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  if (name === "faq") {
    return (
      <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  if (name === "terms") {
    return (
      <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }

  if (name === "profile") {
    return (
      <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  }

  if (name === "sales") {
    return (
      <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4.5-4.5 4 4L20 4.5M20 4.5h-4.5M20 4.5V9M4 19.5h16" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2m14 0V8a2 2 0 00-2-2h-3M5 11V8a2 2 0 012-2h3m0 0V4h4v2m-4 0h4" />
    </svg>
  );
}

function DashboardShell({
  activePanel,
  children,
  isSaved,
  saveVersion,
  onPanelChange,
  logoutAction,
}: {
  activePanel: ActivePanel;
  children: ReactNode;
  isSaved: boolean;
  saveVersion: number;
  onPanelChange: (panel: ActivePanel) => void;
  logoutAction: () => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSavedToast, setShowSavedToast] = useState(isSaved);
  const [expandedNavGroup, setExpandedNavGroup] = useState<string | null>(() => {
    if (activePanel.startsWith("home-")) return "homepage";
    if (activePanel.startsWith("product-")) return "product";
    if (activePanel.startsWith("about-")) return "about";
    return null;
  });
  const activeLabel = labelForPanel(activePanel);
  const activeDescription = descriptionForPanel(activePanel);

  useEffect(() => {
    if (activePanel.startsWith("home-")) {
      setExpandedNavGroup("homepage");
    } else if (activePanel.startsWith("product-")) {
      setExpandedNavGroup("product");
    } else if (activePanel.startsWith("about-")) {
      setExpandedNavGroup("about");
    } else {
      setExpandedNavGroup(null);
    }
  }, [activePanel]);

  useEffect(() => {
    if (isSaved) {
      setShowSavedToast(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("saved");
      window.history.replaceState({}, "", url.toString());
    }
  }, [isSaved]);

  useEffect(() => {
    if (saveVersion > 0) setShowSavedToast(true);
  }, [saveVersion]);

  useEffect(() => {
    if (!showSavedToast) return;

    const timeout = window.setTimeout(() => {
      setShowSavedToast(false);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [showSavedToast]);

  return (
    <main className="min-h-screen bg-[#d9d9d9] text-[#1f1f1f]">
      <div className={`grid min-h-screen transition-[grid-template-columns] duration-300 ${
        isSidebarOpen ? "md:grid-cols-[260px_1fr]" : "md:grid-cols-[76px_1fr]"
      }`}>
        <aside className="sticky top-0 z-20 hidden h-screen overflow-y-auto border-r border-[#e04d26]/20 bg-[#f4f4f4] md:block">
          <div className="py-4 text-[#6f6f6f]">
            <div className={`flex items-center ${isSidebarOpen ? "justify-between px-6" : "justify-center px-3"}`}>
              {isSidebarOpen ? (
                <div className="text-lg font-bold text-[#e04d26]">Articut CMS</div>
              ) : null}
              <button
                type="button"
                aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                onClick={() => setIsSidebarOpen((value) => !value)}
                className="grid size-10 place-items-center rounded-lg text-[#e04d26] hover:bg-[#fab446]/35"
              >
                <svg className={`h-5 w-5 transition-transform ${isSidebarOpen ? "" : "rotate-180"}`} aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <nav className="mt-6">
              {panels.map((panel) => {
                const isAboutPanel = panel.key === "about";
                const isProductPanel = panel.key === "product";
                const isHomePanel = panel.key === "homepage";
                const childPanels = "children" in panel ? panel.children : null;
                const isActive = isAboutPanel
                  ? activePanel.startsWith("about-")
                  : isProductPanel
                    ? activePanel.startsWith("product-")
                    : isHomePanel
                      ? activePanel.startsWith("home-")
                      : activePanel === panel.key;

                return (
                  <div key={panel.key}>
                    <button
                      type="button"
                      onClick={() => {
                        if (childPanels) {
                          setExpandedNavGroup((current) =>
                            current === panel.key ? null : panel.key,
                          );
                        }

                        if (isAboutPanel) {
                          onPanelChange("about-hero");
                        } else if (isProductPanel) {
                          onPanelChange("product-package");
                        } else if (isHomePanel) {
                          onPanelChange("home-hero");
                        } else {
                          onPanelChange(panel.key as ActivePanel);
                        }
                      }}
                      className={`relative flex w-full items-center py-3 text-left text-sm font-semibold transition-colors duration-150 hover:text-[#e04d26] ${
                        isActive ? "text-[#1f1f1f]" : "text-[#6f6f6f]"
                      } ${isSidebarOpen ? "px-6" : "justify-center px-3"}`}
                      title={panel.label}
                    >
                      {isActive ? (
                        <span className="absolute inset-y-0 left-0 w-1 rounded-br-lg rounded-tr-lg bg-[#e04d26]" aria-hidden="true" />
                      ) : null}
                      <Icon name={panel.icon} />
                      {isSidebarOpen ? <span className="ml-4">{panel.label}</span> : null}
                      {childPanels && isSidebarOpen ? (
                        <svg
                          className={`ml-auto mr-1 h-4 w-4 shrink-0 transition-transform ${
                            expandedNavGroup === panel.key ? "rotate-90" : ""
                          }`}
                          aria-hidden="true"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      ) : null}
                    </button>
                    {childPanels && isSidebarOpen && expandedNavGroup === panel.key ? (
                      <div className="mb-2 ml-[58px] mr-4 space-y-1">
                        {childPanels.map((child) => {
                          const isChildActive = activePanel === child.key;

                          return (
                            <button
                              key={child.key}
                              type="button"
                              onClick={() => onPanelChange(child.key)}
                              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-semibold transition-colors ${
                                isChildActive
                                  ? "text-[#e04d26]"
                                  : "text-[#6f6f6f] hover:text-[#e04d26]"
                              }`}
                            >
                              <svg className="h-3.5 w-3.5 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-10 bg-[#f4f4f4] py-4 shadow-sm">
            <div className="mx-auto flex h-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#e04d26]">Dashboard</p>
                <div className="text-[16px] font-semibold text-[#1f1f1f]">{activeLabel}</div>
                <p className="mt-0.5 hidden text-xs text-[#6f6f6f] sm:block">{activeDescription}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="sr-only" htmlFor="mobile-dashboard-panel">Navigate dashboard</label>
                <select
                  id="mobile-dashboard-panel"
                  value={activePanel}
                  onChange={(event) => onPanelChange(event.target.value as ActivePanel)}
                  className="h-10 max-w-[150px] rounded-lg border border-[#b8b8b8] bg-white px-2 text-xs font-semibold text-[#1f1f1f] md:hidden"
                >
                  <optgroup label="Homepage">
                    {homePanels.map((panel) => (
                      <option key={panel.key} value={panel.key}>{panel.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Product Detail">
                    {panels[1]?.children?.map((panel) => (
                      <option key={panel.key} value={panel.key}>{panel.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="About">
                    {panels[2]?.children?.map((panel) => (
                      <option key={panel.key} value={panel.key}>{panel.label}</option>
                    ))}
                  </optgroup>
                  <option value="faq">FAQ</option>
                  <option value="terms">Terms &amp; Conditions</option>
                  <option value="privacy">Privacy Policy</option>
                  <option value="profile">Profile &amp; Security</option>
                </select>
                <button
                  type="submit"
                  form={formIdForPanel(activePanel)}
                  aria-label={`Save changes for ${activeLabel}`}
                  className="hidden rounded-lg bg-[#e04d26] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9411f] md:inline-flex"
                >
                  Save changes
                </button>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="hidden rounded-lg border border-[#b8b8b8] px-4 py-2 text-sm font-semibold text-[#1f1f1f] transition-colors hover:bg-white md:inline-flex"
                  >
                    Log out
                  </button>
                </form>
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-[1440px] px-6 pb-28 pt-6 md:py-8">
            {children}
            {/* FAQ Form rendered here */}
          </section>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e04d26]/20 bg-[#f4f4f4]/95 p-3 shadow-[0_-8px_24px_rgba(31,31,31,0.08)] backdrop-blur md:hidden">
        <button
          type="submit"
          form={formIdForPanel(activePanel)}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-[#e04d26] text-sm font-semibold text-white transition-colors hover:bg-[#c9411f]"
        >
          Save changes
        </button>
      </div>
      <AnimatePresence>
        {showSavedToast ? (
          <>
            <motion.div
              className="fixed bottom-8 right-8 z-50 flex min-w-[280px] items-center gap-4 rounded-lg bg-green-500 px-6 py-4 text-sm font-semibold text-white shadow-2xl border border-green-600"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="grid size-7 place-items-center rounded-full bg-white/20" aria-hidden="true">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="flex-1 text-base">✓ Changes saved successfully!</span>
            <button
              type="button"
              onClick={() => setShowSavedToast(false)}
              className="grid size-8 place-items-center rounded-md text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="Close toast"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function SavingOverlay() {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/25 px-4 backdrop-blur-[2px]" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 text-sm font-semibold text-[#1f1f1f] shadow-2xl">
        <span className="size-5 animate-spin rounded-full border-2 border-[#e04d26]/25 border-t-[#e04d26]" aria-hidden="true" />
        Saving changes...
      </div>
    </div>
  );
}

function ImagePreview({
  image,
  label,
  recommendedNote,
}: {
  image: ManagedImage | CmsImage;
  label: string;
  recommendedNote?: string;
}) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const src = "previewSrc" in image && image.previewSrc ? image.previewSrc : image.src;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  };

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#b8b8b8]">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- CMS previews include uploaded object URLs and local public paths.
          <img src={src} alt={image.alt || label} className="h-full w-full object-cover" onLoad={handleImageLoad} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-4 text-center">
            <span className="text-sm font-semibold text-[#6f6f6f]">No image</span>
            {recommendedNote ? (
              <span className="text-xs text-[#8a8a8a]">Recommended: {recommendedNote}</span>
            ) : null}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-md bg-[#1f1f1f]/80 px-2 py-1 text-xs font-semibold text-white">
          {label}
        </span>
      </div>
      {dimensions ? (
        <p className="mt-2 text-xs text-[#6f6f6f]">Current: {dimensions.width}×{dimensions.height}</p>
      ) : null}
    </div>
  );
}

function TextInput({
  label,
  name,
  onChange,
  required,
  type = "text",
  value,
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-[#1f1f1f]">{label}</span>
      <input
        className="mt-1 block h-11 w-full rounded-lg border border-[#b8b8b8] bg-[#f4f4f4] px-3 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

const ASPECT_RATIO_TOLERANCE = 0.12;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 60;

function formatBytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
}

async function readVideoDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight });
      URL.revokeObjectURL(objectUrl);
    };
    video.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(objectUrl);
    };
    video.src = objectUrl;
  });
}

async function validateMediaFile(
  file: File,
  kind: "image" | "video",
  spec: MediaDimensionSpec,
): Promise<string | null> {
  const maxSizeMb = kind === "image" ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB;
  const sizeMb = file.size / (1024 * 1024);
  const warnings: string[] = [];

  if (sizeMb > maxSizeMb) {
    warnings.push(`File is ${formatBytes(file.size)} — larger than the recommended ${maxSizeMb}MB. It may load slowly on the site.`);
  }

  const recommendedAspectRatio = spec.width / spec.height;
  const dimensions = kind === "image" ? await readImageDimensions(file) : await readVideoDimensions(file);

  if (dimensions) {
    const { width, height } = dimensions;
    const aspectRatio = width / height;
    const aspectDelta = Math.abs(aspectRatio - recommendedAspectRatio) / recommendedAspectRatio;

    if (width < spec.width || height < spec.height) {
      warnings.push(
        `Resolution is ${width}×${height} — below the recommended ${specNote(spec)}. It may look blurry on large screens.`,
      );
    } else if (aspectDelta > ASPECT_RATIO_TOLERANCE) {
      warnings.push(
        `Aspect ratio is ${width}:${height} — this section expects ${spec.ratioLabel}. The ${kind} may get cropped oddly.`,
      );
    }
  }

  return warnings.length > 0 ? warnings.join(" ") : null;
}

function FileInput({
  accept = "image/*",
  kind = "image",
  label,
  name,
  onPreview,
  spec,
}: {
  accept?: string;
  kind?: "image" | "video";
  label: string;
  name: string;
  onPreview: (src: string, file: File) => void;
  spec: MediaDimensionSpec;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  async function handleFile(file: File) {
    onPreview(URL.createObjectURL(file), file);
    setWarning(await validateMediaFile(file, kind, spec));
  }

  return (
    <label
      className={`block rounded-lg border border-dashed p-3 text-sm transition-colors ${
        isDragging ? "border-[#e04d26] bg-[#fff0e9]" : "border-[#e04d26]/45 bg-[#fff7e4]"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) void handleFile(file);
      }}
    >
      <span className="flex items-center justify-between gap-3 font-medium text-[#1f1f1f]">
        <span>{label}</span>
        <span className="text-xs font-normal text-[#8a8a8a]">Drop or browse</span>
      </span>
      <input
        accept={accept}
        className="sr-only"
        name={name}
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;

          void handleFile(file);
        }}
      />
      <span className="mt-3 flex cursor-pointer items-center justify-center rounded-md border border-[#e04d26]/25 bg-white px-3 py-2 text-xs font-semibold text-[#e04d26]">
        Choose {kind}
      </span>
      {warning ? <span className="mt-2 block text-xs leading-[1.35] text-[#9a541b]">{warning}</span> : null}
    </label>
  );
}

function VideoEditor({
  filePrefix,
  isMobile = false,
  poster,
  posterAltName,
  posterFileName,
  posterSrcName,
  posterTitle,
  setPoster,
  setVideoUrl,
  spec,
  title,
  videoUrl,
  videoUrlName,
}: {
  filePrefix: string;
  isMobile?: boolean;
  poster: ManagedImage;
  posterAltName: string;
  posterFileName: string;
  posterSrcName: string;
  posterTitle: string;
  setPoster: (updater: (image: ManagedImage) => ManagedImage) => void;
  setVideoUrl: (value: string) => void;
  spec: MediaDimensionSpec;
  title: string;
  videoUrl: string;
  videoUrlName: string;
}) {
  return (
    <section className="rounded-xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <div className="mb-4 text-[16px] font-semibold text-[#1f1f1f]">{title}</div>
      <div className="space-y-6">
        <div className={`grid gap-6 ${isMobile ? "lg:grid-cols-[220px_1fr]" : "lg:grid-cols-[360px_1fr]"}`}>
          <ImagePreview image={poster} label={posterTitle} recommendedNote={specNote(spec)} />
          <div className="space-y-4">
            <FileInput
              label="Upload poster"
              name={posterFileName}
              onPreview={(previewSrc, file) => setPoster((image) => ({ ...image, file, previewSrc }))}
              spec={spec}
            />
            <p className="break-all rounded-lg bg-white px-3 py-2 text-xs text-[#6f6f6f]">
              {filePrefix}: {poster.src}
            </p>
          </div>
        </div>

        <div className={`grid gap-6 ${isMobile ? "lg:grid-cols-[220px_1fr]" : "lg:grid-cols-[360px_1fr]"}`}>
          <div className={`overflow-hidden rounded-lg bg-black ${isMobile ? "aspect-[9/16]" : "aspect-video"}`}>
            <video
              src={videoUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
              controls
              preload="metadata"
              poster={poster.previewSrc ?? poster.src}
            />
          </div>
          <div className="space-y-4">
            <TextInput name={videoUrlName} label="Video URL" value={videoUrl} required onChange={setVideoUrl} />
            <input name={posterSrcName} type="hidden" value={poster.src} />
            <TextInput
              name={posterAltName}
              label="Poster alt text"
              value={poster.alt}
              onChange={(alt) => setPoster((image) => ({ ...image, alt }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type ManagedRevealSection = { id: string; layout: CmsRevealSection["layout"]; images: ManagedImage[] };

function toManagedSections(sections: CmsRevealSection[], prefix: string): ManagedRevealSection[] {
  return sections.map((section, index) => ({
    id: `${prefix}-${index}`,
    layout: section.layout,
    images: section.images.map((image, imageIndex) => toManagedImage(image, `${prefix}-${index}`, imageIndex)),
  }));
}

function appendRevealSections(formData: FormData, prefix: string, sections: ManagedRevealSection[]) {
  if (sections.some((section) => section.images.some((image) => !image.src && !image.file))) {
    throw new Error("Upload every image in the product reveal sections before saving.");
  }
  formData.set(prefix, JSON.stringify(sections.map((section) => ({
    layout: section.layout,
    images: section.images.map(({ src, alt }) => ({ src, alt })),
  }))));
  sections.forEach((section, index) => section.images.forEach((image, imageIndex) => {
    if (image.file) formData.set(`${prefix}-${index}-${imageIndex}-file`, image.file);
  }));
}

function RevealSectionsEditor({ sections, setSections }: {
  sections: ManagedRevealSection[];
  setSections: (updater: (items: ManagedRevealSection[]) => ManagedRevealSection[]) => void;
}) {
  const [choosingLayout, setChoosingLayout] = useState(false);
  const buttonClass = "rounded-lg border border-[#e04d26]/30 px-3 py-2 text-sm font-semibold text-[#e04d26] hover:bg-[#fff3ef] disabled:opacity-40";
  function addSection(layout: CmsRevealSection["layout"]) {
    setSections((items) => [...items, {
      id: crypto.randomUUID(), layout,
      images: Array.from({ length: layout === "grid" ? 2 : 1 }, () => createBlankImage()),
    }]);
    setChoosingLayout(false);
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Product reveal sections</h2>
        <button type="button" className={buttonClass} onClick={() => setChoosingLayout(true)}>Add section</button>
      </div>
      {choosingLayout && (
        <div className="rounded-xl border border-[#e04d26]/30 bg-white p-5">
          <p className="mb-3 font-semibold">How should this section appear?</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={buttonClass} onClick={() => addSection("single")}>Single image</button>
            <button type="button" className={buttonClass} onClick={() => addSection("grid")}>Two-image grid</button>
            <button type="button" className={buttonClass} onClick={() => setChoosingLayout(false)}>Cancel</button>
          </div>
        </div>
      )}
      {sections.map((section, index) => (
        <section key={section.id} className="space-y-3 rounded-xl border border-[#d0d0d0] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold">{index + 1}. {section.layout === "grid" ? "Two-image grid" : "Single image"}</h3>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={buttonClass} onClick={() => setSections((items) => items.map((item) => item.id === section.id ? { ...item, images: [...item.images, createBlankImage()] } : item))}>Add image</button>
              <button type="button" className={buttonClass} disabled={index === 0} onClick={() => setSections((items) => moveItem(items, index, index - 1))}>Move up</button>
              <button type="button" className={buttonClass} disabled={index === sections.length - 1} onClick={() => setSections((items) => moveItem(items, index, index + 1))}>Move down</button>
              <button type="button" className={buttonClass} onClick={() => setSections((items) => items.filter((item) => item.id !== section.id))}>Remove</button>
            </div>
          </div>
          <div className={`grid gap-4 ${section.layout === "grid" ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {section.images.map((image, imageIndex) => (
            <div key={image.id} className="min-w-0 space-y-2">
            <SingleImageEditor
              compact={section.layout === "grid"}
              fieldPrefix={`reveal-editor-${section.id}-${imageIndex}`}
              image={image}
              label={section.layout === "grid" ? `Row ${Math.floor(imageIndex / 2) + 1} — ${imageIndex % 2 === 0 ? "Left" : "Right"} image` : `Image ${imageIndex + 1}`}
              spec={section.layout === "grid" ? MEDIA_SPECS.productReveal : MEDIA_SPECS.combsImage}
              setImage={(update) => setSections((items) => items.map((item) => item.id === section.id
                ? { ...item, images: item.images.map((current, position) => position === imageIndex ? update(current) : current) }
                : item))}
            />
            <button type="button" className={buttonClass}
              disabled={section.images.length <= (section.layout === "grid" ? 2 : 1)}
              onClick={() => setSections((items) => items.map((item) => item.id === section.id
                ? { ...item, images: item.images.filter((current) => current.id !== image.id) } : item))}
            >Remove image</button>
            </div>
          ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SingleImageEditor({
  compact = false,
  fieldPrefix,
  image,
  label,
  setImage,
  spec,
}: {
  compact?: boolean;
  fieldPrefix: string;
  image: ManagedImage;
  label: string;
  setImage: (updater: (image: ManagedImage) => ManagedImage) => void;
  spec: MediaDimensionSpec;
}) {
  return (
    <section className="rounded-xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <div className="mb-4 text-[16px] font-semibold text-[#1f1f1f]">{label}</div>
      <div className={`grid gap-6 ${compact ? "grid-cols-1" : "lg:grid-cols-[360px_1fr]"}`}>
        <ImagePreview image={image} label={label} recommendedNote={specNote(spec)} />
        <div className="space-y-4">
          <input name={`${fieldPrefix}-src`} type="hidden" value={image.src} />
          <FileInput
            label="Upload image"
            name={`${fieldPrefix}-file`}
            onPreview={(previewSrc, file) => setImage((item) => ({ ...item, file, previewSrc }))}
            spec={spec}
          />
          <TextInput
            name={`${fieldPrefix}-alt`}
            label="Alt text"
            value={image.alt}
            onChange={(alt) => setImage((item) => ({ ...item, alt }))}
          />
          {image.src ? (
            <p className="break-all rounded-lg bg-white px-3 py-2 text-xs text-[#6f6f6f]">
              Current file: {image.src}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ImageListEditor({
  addLabel,
  fieldPrefix,
  images,
  setImages,
  spec,
}: {
  addLabel: string;
  fieldPrefix: string;
  images: ManagedImage[];
  setImages: (updater: (items: ManagedImage[]) => ManagedImage[]) => void;
  spec: MediaDimensionSpec;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftImage, setDraftImage] = useState<ManagedImage>(createBlankImage());

  function handleDrop(event: DragEvent<HTMLDivElement>, targetIndex: number) {
    event.preventDefault();
    if (draggedIndex === null) return;

    setImages((items) => moveItem(items, draggedIndex, targetIndex));
    setDraggedIndex(null);
  }

  function addDraftImage() {
    setImages((items) => [...items, draftImage]);
    setDraftImage(createBlankImage());
    setIsModalOpen(false);
  }

  return (
    <section className="rounded-xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-[16px] font-semibold text-[#1f1f1f]">{addLabel}</div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-[#e04d26] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9411f]"
        >
          Add image
        </button>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence initial={false}>
          {images.map((image, index) => (
          <motion.div
            key={image.id}
            layout
            draggable
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{
              opacity: draggedIndex === index ? 0.72 : 1,
              scale: draggedIndex === index ? 1.04 : 1,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onDragStart={() => setDraggedIndex(index)}
            onDragEnd={() => setDraggedIndex(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, index)}
            className={`rounded-lg border bg-white p-3 transition-shadow ${
              draggedIndex === index ? "border-[#e04d26] shadow-2xl" : "border-[#d0d0d0] shadow-sm"
            }`}
          >
            <input name={`${fieldPrefix}-${index}-src`} type="hidden" value={image.src} />
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#1f1f1f]">Image {index + 1}</p>
              <div className="flex items-center gap-2">
                <span className="cursor-grab rounded-md bg-[#fff7e4] px-2 py-1 text-xs font-semibold text-[#e04d26] active:cursor-grabbing">
                  Drag
                </span>
                <button
                  type="button"
                  disabled={images.length === 1}
                  onClick={() => setImages((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                  className="rounded-md border border-[#e04d26]/30 px-2 py-1 text-xs font-semibold text-[#e04d26] transition-colors hover:bg-[#fff3ef] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>
            <ImagePreview image={image} label={`Image ${index + 1}`} recommendedNote={specNote(spec)} />
            <div className="mt-3 space-y-3">
              <FileInput
                label={image.src ? "Replace image" : "Upload image"}
                name={`${fieldPrefix}-${index}-file`}
                onPreview={(previewSrc, file) =>
                  setImages((items) =>
                    items.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, file, previewSrc } : item,
                    ),
                  )
                }
                spec={spec}
              />
              <TextInput
                name={`${fieldPrefix}-${index}-alt`}
                label="Alt text"
                value={image.alt}
                onChange={(alt) =>
                  setImages((items) =>
                    items.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, alt } : item,
                    ),
                  )
                }
              />
              {image.src ? (
                <p className="break-all rounded-lg bg-[#f4f4f4] px-3 py-2 text-xs text-[#6f6f6f]">
                  {image.src}
                </p>
              ) : null}
            </div>
          </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isModalOpen ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-[#1f1f1f]/55 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Add image to ${addLabel}`}
              className="w-full max-w-[560px] rounded-lg bg-[#f4f4f4] p-6 shadow-2xl"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#1f1f1f]">Add image</h3>
                  <p className="mt-1 text-sm text-[#6f6f6f]">{addLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDraftImage(createBlankImage());
                    setIsModalOpen(false);
                  }}
                  className="rounded-lg border border-[#b8b8b8] px-3 py-2 text-sm font-semibold text-[#1f1f1f] hover:bg-white"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
                <ImagePreview image={draftImage} label="New image" recommendedNote={specNote(spec)} />
                <div className="space-y-4">
                  <FileInput
                    label="Upload image"
                    name={`${fieldPrefix}-draft-file`}
                    onPreview={(previewSrc, file) =>
                      setDraftImage((image) => ({ ...image, file, previewSrc }))
                    }
                    spec={spec}
                  />
                  <TextInput
                    name={`${fieldPrefix}-draft-alt`}
                    label="Alt text"
                    value={draftImage.alt}
                    onChange={(alt) => setDraftImage((image) => ({ ...image, alt }))}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDraftImage(createBlankImage());
                    setIsModalOpen(false);
                  }}
                  className="rounded-lg border border-[#b8b8b8] px-4 py-2 text-sm font-semibold text-[#1f1f1f] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!draftImage.file}
                  onClick={addDraftImage}
                  className="rounded-lg bg-[#e04d26] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9411f] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add image
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function StepsEditor({
  fieldPrefix,
  steps,
  setSteps,
  spec,
}: {
  fieldPrefix: string;
  steps: ManagedStep[];
  setSteps: (updater: (items: ManagedStep[]) => ManagedStep[]) => void;
  spec: MediaDimensionSpec;
}) {
  return (
    <section className="rounded-xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <div className="mb-4 text-[16px] font-semibold text-[#1f1f1f]">How-to-use steps</div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.id} className="rounded-lg border border-[#d0d0d0] bg-white p-3 shadow-sm">
            <input name={`${fieldPrefix}-${index}-image-src`} type="hidden" value={step.image.src} />
            <p className="mb-3 text-sm font-semibold text-[#1f1f1f]">Step {index + 1}</p>
            <ImagePreview image={step.image} label={`Step ${index + 1}`} recommendedNote={specNote(spec)} />
            <div className="mt-3 space-y-3">
              <FileInput
                label={step.image.src ? "Replace image" : "Upload image"}
                name={`${fieldPrefix}-${index}-image-file`}
                onPreview={(previewSrc, file) =>
                  setSteps((items) =>
                    items.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, image: { ...item.image, file, previewSrc } } : item,
                    ),
                  )
                }
                spec={spec}
              />
              <TextInput
                name={`${fieldPrefix}-${index}-title`}
                label="Title"
                value={step.title}
                onChange={(title) =>
                  setSteps((items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, title } : item)))
                }
              />
              <TextInput
                name={`${fieldPrefix}-${index}-image-alt`}
                label="Alt text"
                value={step.image.alt}
                onChange={(alt) =>
                  setSteps((items) =>
                    items.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, image: { ...item.image, alt } } : item,
                    ),
                  )
                }
              />
              <label className="block text-sm">
                <span className="font-medium text-[#1f1f1f]">Description (shown after the title)</span>
                <textarea
                  name={`${fieldPrefix}-${index}-description`}
                  rows={3}
                  value={step.description}
                  onChange={(event) => {
                    const description = event.target.value;
                    setSteps((items) =>
                      items.map((item, itemIndex) => (itemIndex === index ? { ...item, description } : item)),
                    );
                  }}
                  className="mt-1 block w-full rounded-lg border border-[#b8b8b8] bg-[#f4f4f4] p-3 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MediaPreview({
  item,
  label,
  recommendedNote,
}: {
  item: ManagedMediaItem;
  label: string;
  recommendedNote?: string;
}) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const src = item.previewSrc ?? item.src;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setDimensions({ width: video.videoWidth, height: video.videoHeight });
  };

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#b8b8b8]">
        {src && item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element -- CMS previews include uploaded object URLs and local public paths.
          <img src={src} alt={item.alt || label} className="h-full w-full object-cover" onLoad={handleImageLoad} />
        ) : null}
        {src && item.type === "video" ? (
          <video
            src={src}
            className="h-full w-full object-cover"
            muted
            playsInline
            controls
            preload="metadata"
            onLoadedMetadata={handleVideoLoadedMetadata}
          />
        ) : null}
        {!src ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-4 text-center">
            <span className="text-sm font-semibold text-[#6f6f6f]">No media</span>
            {recommendedNote ? (
              <span className="text-xs text-[#8a8a8a]">Recommended: {recommendedNote}</span>
            ) : null}
          </div>
        ) : null}
        <span className="absolute left-3 top-3 rounded-md bg-[#1f1f1f]/80 px-2 py-1 text-xs font-semibold text-white">
          {label}
        </span>
      </div>
      {dimensions ? (
        <p className="mt-2 text-xs text-[#6f6f6f]">Current: {dimensions.width}×{dimensions.height}</p>
      ) : null}
    </div>
  );
}

function MediaTypeSelect({
  onChange,
  value,
}: {
  onChange: (type: CmsMediaItem["type"]) => void;
  value: CmsMediaItem["type"];
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-[#1f1f1f]">Type</span>
      <select
        className="mt-1 block h-11 w-full rounded-lg border border-[#b8b8b8] bg-[#f4f4f4] px-3 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
        value={value}
        onChange={(event) => onChange(event.target.value as CmsMediaItem["type"])}
      >
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>
    </label>
  );
}

function MediaStripEditor({
  addLabel = "Add media",
  fieldPrefix = "media-strip",
  items,
  setItems,
  spec,
  title = "Media strip",
}: {
  addLabel?: string;
  fieldPrefix?: string;
  items: ManagedMediaItem[];
  setItems: (updater: (items: ManagedMediaItem[]) => ManagedMediaItem[]) => void;
  spec: MediaDimensionSpec;
  title?: string;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftItem, setDraftItem] = useState<ManagedMediaItem>(createBlankMediaItem());

  function handleDrop(event: DragEvent<HTMLDivElement>, targetIndex: number) {
    event.preventDefault();
    if (draggedIndex === null) return;

    setItems((currentItems) => moveItem(currentItems, draggedIndex, targetIndex));
    setDraggedIndex(null);
  }

  function addDraftItem() {
    setItems((currentItems) => [...currentItems, draftItem]);
    setDraftItem(createBlankMediaItem());
    setIsModalOpen(false);
  }

  return (
    <section className="rounded-xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-[16px] font-semibold text-[#1f1f1f]">{title}</div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-[#e04d26] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9411f]"
        >
          {addLabel}
        </button>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnimatePresence initial={false}>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              draggable
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{
                opacity: draggedIndex === index ? 0.72 : 1,
                scale: draggedIndex === index ? 1.04 : 1,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onDragStart={() => setDraggedIndex(index)}
              onDragEnd={() => setDraggedIndex(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, index)}
              className={`rounded-lg border bg-white p-3 transition-shadow ${
                draggedIndex === index ? "border-[#e04d26] shadow-2xl" : "border-[#d0d0d0] shadow-sm"
              }`}
            >
              <input name={`${fieldPrefix}-${index}-type`} type="hidden" value={item.type} />
              <input name={`${fieldPrefix}-${index}-src`} type="hidden" value={item.src} />
              {isManagedImageMedia(item) ? (
                <input name={`${fieldPrefix}-${index}-alt`} type="hidden" value={item.alt} />
              ) : null}
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1f1f1f]">Media {index + 1}</p>
                  <p className="text-xs font-semibold capitalize text-[#6f6f6f]">{item.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="cursor-grab rounded-md bg-[#fff7e4] px-2 py-1 text-xs font-semibold text-[#e04d26] active:cursor-grabbing">
                    Drag
                  </span>
                  <button
                    type="button"
                    disabled={items.length === 1}
                    onClick={() => setItems((currentItems) => currentItems.filter((_, itemIndex) => itemIndex !== index))}
                    className="rounded-md border border-[#e04d26]/30 px-2 py-1 text-xs font-semibold text-[#e04d26] transition-colors hover:bg-[#fff3ef] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <MediaPreview item={item} label={`Media ${index + 1}`} recommendedNote={specNote(spec)} />
              <div className="mt-3 space-y-3">
                <MediaTypeSelect
                  value={item.type}
                  onChange={(type) =>
                    setItems((currentItems) =>
                      currentItems.map((currentItem, itemIndex) =>
                        itemIndex === index ? createBlankMediaItem(type) : currentItem,
                      ),
                    )
                  }
                />
                {item.type === "image" ? (
                  <>
                    <FileInput
                      kind="image"
                      label={item.src ? "Replace image" : "Upload image"}
                      name={`${fieldPrefix}-${index}-file`}
                      onPreview={(previewSrc, file) =>
                        setItems((currentItems) =>
                          currentItems.map((currentItem, itemIndex) =>
                            itemIndex === index ? { ...currentItem, file, previewSrc } : currentItem,
                          ),
                        )
                      }
                      spec={spec}
                    />
                    <TextInput
                      name={`${fieldPrefix}-${index}-alt-visible`}
                      label="Alt text"
                      value={item.alt}
                      onChange={(alt) =>
                        setItems((currentItems) =>
                          currentItems.map((currentItem, itemIndex) =>
                            itemIndex === index && currentItem.type === "image"
                              ? { ...currentItem, alt }
                              : currentItem,
                          ),
                        )
                      }
                    />
                  </>
                ) : (
                  <>
                    <FileInput
                      accept="video/*"
                      kind="video"
                      label={item.file ? "Replace video" : "Upload video"}
                      name={`${fieldPrefix}-${index}-file`}
                      onPreview={(previewSrc, file) =>
                        setItems((currentItems) =>
                          currentItems.map((currentItem, itemIndex) =>
                            itemIndex === index ? { ...currentItem, file, previewSrc } : currentItem,
                          ),
                        )
                      }
                      spec={spec}
                    />
                    <TextInput
                      name={`${fieldPrefix}-${index}-video-src-visible`}
                      label="or Video URL"
                      value={item.file ? "" : item.src}
                      onChange={(src) =>
                        setItems((currentItems) =>
                          currentItems.map((currentItem, itemIndex) =>
                            itemIndex === index && currentItem.type === "video"
                              ? { ...currentItem, src, file: undefined, previewSrc: undefined }
                              : currentItem,
                          ),
                        )
                      }
                    />
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isModalOpen ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-[#1f1f1f]/55 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={addLabel}
              className="w-full max-w-[620px] rounded-lg bg-[#f4f4f4] p-6 shadow-2xl"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[16px] font-semibold text-[#1f1f1f]">{addLabel}</div>
                  <p className="mt-1 text-sm text-[#6f6f6f]">Choose image or video, and upload a file or paste a URL.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDraftItem(createBlankMediaItem());
                    setIsModalOpen(false);
                  }}
                  className="rounded-lg border border-[#b8b8b8] px-3 py-2 text-sm font-semibold text-[#1f1f1f] hover:bg-white"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
                <MediaPreview item={draftItem} label="New media" recommendedNote={specNote(spec)} />
                <div className="space-y-4">
                  <MediaTypeSelect
                    value={draftItem.type}
                    onChange={(type) => setDraftItem(createBlankMediaItem(type))}
                  />
                  {draftItem.type === "image" ? (
                    <>
                      <FileInput
                        kind="image"
                        label="Upload image"
                        name={`${fieldPrefix}-draft-file`}
                        onPreview={(previewSrc, file) =>
                          setDraftItem((item) => ({ ...item, file, previewSrc }))
                        }
                        spec={spec}
                      />
                      <TextInput
                        name={`${fieldPrefix}-draft-alt`}
                        label="Alt text"
                        value={draftItem.alt}
                        onChange={(alt) =>
                          setDraftItem((item) =>
                            item.type === "image" ? { ...item, alt } : item,
                          )
                        }
                      />
                    </>
                  ) : (
                    <>
                      <FileInput
                        accept="video/*"
                        kind="video"
                        label="Upload video"
                        name={`${fieldPrefix}-draft-file`}
                        onPreview={(previewSrc, file) =>
                          setDraftItem((item) => ({ ...item, file, previewSrc }))
                        }
                        spec={spec}
                      />
                      <TextInput
                        name={`${fieldPrefix}-draft-video-src`}
                        label="or Video URL"
                        value={draftItem.file ? "" : draftItem.src}
                        onChange={(src) =>
                          setDraftItem((item) =>
                            item.type === "video" ? { ...item, src, file: undefined, previewSrc: undefined } : item,
                          )
                        }
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDraftItem(createBlankMediaItem());
                    setIsModalOpen(false);
                  }}
                  className="rounded-lg border border-[#b8b8b8] px-4 py-2 text-sm font-semibold text-[#1f1f1f] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={draftItem.type === "image" ? !draftItem.file : !draftItem.file && !draftItem.src}
                  onClick={addDraftItem}
                  className="rounded-lg bg-[#e04d26] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9411f] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {addLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

export function CmsDashboard({
  content,
  isSaved,
  initialPanel,
  saveAboutAction,
  saveHomeAction,
  saveProductDetailAction,
  saveFaqAction,
  saveTermsAction,
  savePrivacyAction,
  logoutAction: logoutActionProp,
  currentUsername,
}: {
  content: CmsContent;
  isSaved: boolean;
  initialPanel: ActivePanel;
  saveAboutAction: typeof saveAboutContentAction;
  saveHomeAction: typeof saveHomeContentAction;
  saveProductDetailAction: typeof saveProductDetailContentAction;
  saveFaqAction: typeof saveFaqContentAction;
  saveTermsAction: typeof saveTermsContentAction;
  savePrivacyAction: typeof savePrivacyContentAction;
  currentUsername: string;
  logoutAction: typeof logoutAction;
}) {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<ActivePanel>(initialPanel);
  const [saveVersion, setSaveVersion] = useState(0);

  async function completeSave() {
    setSaveVersion((version) => version + 1);
    router.refresh();
  }

  function handlePanelChange(panel: ActivePanel) {
    setActivePanel(panel);
    router.push(`/dashboard?panel=${encodeURIComponent(panel)}`, { scroll: false });
  }
  const [aboutHeroTitle, setAboutHeroTitle] = useState(content.about.heroTitle);
  const [aboutHeroPoster, setAboutHeroPoster] = useState<ManagedImage>({
    id: "about-hero-poster-0",
    src: content.about.heroPosterUrl,
    alt: "",
  });
  const [aboutHeroVideoUrl, setAboutHeroVideoUrl] = useState(content.about.heroVideoUrl);
  const [aboutHeroMobileVideoUrl, setAboutHeroMobileVideoUrl] = useState(content.about.heroMobileVideoUrl);
  const [aboutHeroViewport, setAboutHeroViewport] = useState<"desktop" | "mobile">("desktop");
  const [aboutStoryImage, setAboutStoryImage] = useState<ManagedImage>({
    id: "about-story-image-0",
    src: content.about.storyImageUrl,
    alt: "About story image",
  });
  const [aboutContactTitle, setAboutContactTitle] = useState(content.about.contactTitle);
  const [aboutContactItems, setAboutContactItems] = useState(content.about.contactItems);
  const [aboutStoryContent, setAboutStoryContent] = useState(content.about.storyContent);
  const [heroVideoUrl, setHeroVideoUrl] = useState(content.home.heroVideoUrl);
  const [mobileHeroVideoUrl, setMobileHeroVideoUrl] = useState(content.home.mobileHeroVideoUrl);
  const [heroPoster, setHeroPoster] = useState<ManagedImage>(
    toManagedImage(content.home.heroPoster, "hero-poster", 0),
  );
  const [packShowcaseImage, setPackShowcaseImage] = useState<ManagedImage>(
    toManagedImage(content.home.packShowcaseImage, "pack-showcase", 0),
  );
  const [homeProductImage, setHomeProductImage] = useState<ManagedImage>(
    toManagedImage(content.home.productImage, "home-product", 0),
  );
  const [mobileHeroPoster, setMobileHeroPoster] = useState<ManagedImage>(
    toManagedImage(content.home.mobileHeroPoster, "mobile-hero-poster", 0),
  );
  const [homeHeroViewport, setHomeHeroViewport] = useState<"desktop" | "mobile">("desktop");
  const [showcaseItems, setShowcaseItems] = useState<ManagedMediaItem[]>(
    content.home.imageShowcase.map((item, index) => toManagedMediaItem(item, "showcase", index)),
  );
  const [featureBackground, setFeatureBackground] = useState<ManagedImage>(
    toManagedImage(content.productDetail.featureBackground, "product-feature-background", 0),
  );
  const [featureBackgroundMobile, setFeatureBackgroundMobile] = useState<ManagedImage>(
    toManagedImage(content.productDetail.featureBackgroundMobile ?? content.productDetail.featureBackground, "product-feature-background-mobile", 0),
  );
  const [featureTexts, setFeatureTexts] = useState(content.productDetail.featureTexts.join("\n"));
  const [productPackageImage, setProductPackageImage] = useState<ManagedImage>(
    toManagedImage(content.productDetail.packageImage, "product-package", 0),
  );
  const [slides, setSlides] = useState<ManagedImage[]>(
    content.productDetail.slider.map((image, index) => toManagedImage(image, "slider", index)),
  );
  const [revealSections, setRevealSections] = useState(() => toManagedSections(getRevealSections(content.productDetail, "desktop"), "desktop"));
  const [revealSectionsMobile, setRevealSectionsMobile] = useState(() => toManagedSections(getRevealSections(content.productDetail, "mobile"), "mobile"));
  const [productRevealViewport, setProductRevealViewport] = useState<"desktop" | "mobile">("desktop");
  const [steps, setSteps] = useState<ManagedStep[]>(
    content.productDetail.steps.map((step, index) => toManagedStep(step, "product-step", index)),
  );
  const [mediaStripItems, setMediaStripItems] = useState<ManagedMediaItem[]>(
    content.productDetail.mediaStrip.map((item, index) => toManagedMediaItem(item, "media-strip", index)),
  );

  async function submitAboutContent(formData: FormData) {
    if (aboutHeroPoster.file) {
      formData.set("about-hero-poster-file", aboutHeroPoster.file);
    }

    formData.set("about-hero-title", aboutHeroTitle);
    formData.set("about-hero-video-url", aboutHeroVideoUrl);
    formData.set("about-hero-mobile-video-url", aboutHeroMobileVideoUrl);
    formData.set("about-story-content", aboutStoryContent);
    formData.set("about-story-image-url", aboutStoryImage.src);
    if (aboutStoryImage.file) {
      formData.set("about-story-image-file", aboutStoryImage.file);
    }
    formData.set("about-contact-title", aboutContactTitle);
    aboutContactItems.forEach((item, index) => {
      formData.set(`contact-${index}-text`, item.text);
      formData.set(`contact-${index}-email`, item.email);
    });
    await saveAboutAction(formData);
    await completeSave();
  }

  async function submitHomeContent(formData: FormData) {
    if (heroPoster.file) {
      formData.set("home-hero-poster-file", heroPoster.file);
    }

    if (mobileHeroPoster.file) {
      formData.set("home-mobile-hero-poster-file", mobileHeroPoster.file);
    }

    if (packShowcaseImage.file) {
      formData.set("home-pack-showcase-image-file", packShowcaseImage.file);
    }

    if (homeProductImage.file) {
      formData.set("home-product-image-file", homeProductImage.file);
    }

    appendManagedMediaFiles(formData, "showcase", showcaseItems);
    await saveHomeAction(formData);
    await completeSave();
  }

  async function submitProductDetailContent(formData: FormData) {
    if (featureBackgroundMobile.file) formData.set("product-feature-background-mobile-file", featureBackgroundMobile.file);
    if (featureBackground.file) formData.set("product-feature-background-file", featureBackground.file);
    if (productPackageImage.file) {
      formData.set("product-package-image-file", productPackageImage.file);
    }

    appendManagedImageFiles(formData, "slider", slides);
    appendRevealSections(formData, "reveal-sections", revealSections);
    appendRevealSections(formData, "reveal-sections-mobile", revealSectionsMobile);
    appendManagedMediaFiles(formData, "media-strip", mediaStripItems);
    steps.forEach((step, index) => {
      if (step.image.file) {
        formData.set(`product-step-${index}-image-file`, step.image.file);
      }
    });
    await saveProductDetailAction(formData);
    await completeSave();
  }

  return (
    <DashboardShell
      activePanel={activePanel}
      isSaved={isSaved}
      saveVersion={saveVersion}
      onPanelChange={handlePanelChange}
      logoutAction={logoutActionProp}
    >
      <form
        id="about-form"
        action={submitAboutContent}
        className={activePanel.startsWith("about-") ? "space-y-6" : "hidden"}
      >
        <input name="active-panel" type="hidden" value={activePanel} />
        <SavingOverlay />

        <div className={activePanel === "about-hero" ? "space-y-6" : "hidden"}>
          <section className="rounded-lg bg-[#f4f4f4] p-6 shadow-sm">
            <div className="mb-4 text-[16px] font-semibold text-[#1f1f1f]">Hero title</div>
            <label className="block text-sm">
              <span className="font-medium text-[#1f1f1f]">Title (Enter for line break)</span>
              <textarea
                className="mt-1 block w-full min-h-20 rounded-lg border border-[#b8b8b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] whitespace-pre-wrap focus:border-[#e04d26] focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                name="about-hero-title"
                value={aboutHeroTitle}
                onChange={(e) => setAboutHeroTitle(e.target.value)}
              />
            </label>
          </section>

          <div className="inline-flex rounded-lg border border-[#d0d0d0] bg-white p-1 shadow-sm" role="tablist" aria-label="About hero viewport">
            {(["desktop", "mobile"] as const).map((viewport) => (
              <button
                key={viewport}
                type="button"
                role="tab"
                aria-selected={aboutHeroViewport === viewport}
                onClick={() => setAboutHeroViewport(viewport)}
                className={`rounded-md px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                  aboutHeroViewport === viewport
                    ? "bg-[#e04d26] text-white"
                    : "text-[#6f6f6f] hover:bg-[#fff7e4] hover:text-[#e04d26]"
                }`}
              >
                {viewport}
              </button>
            ))}
          </div>

          <div className={aboutHeroViewport === "desktop" ? "block" : "hidden"}>
            <VideoEditor
              filePrefix="Current poster"
              poster={aboutHeroPoster}
              posterAltName="about-hero-poster-alt"
              posterFileName="about-hero-poster-file"
              posterSrcName="about-hero-poster-src"
              posterTitle="Hero poster"
              setPoster={setAboutHeroPoster}
              setVideoUrl={setAboutHeroVideoUrl}
              spec={MEDIA_SPECS.desktopHero}
              title="Desktop hero video"
              videoUrl={aboutHeroVideoUrl}
              videoUrlName="about-hero-video-url"
            />
          </div>

          <div className={aboutHeroViewport === "mobile" ? "block" : "hidden"}>
            <VideoEditor
              filePrefix="Current mobile poster"
              isMobile
              poster={aboutHeroPoster}
              posterAltName="about-hero-poster-alt"
              posterFileName="about-hero-poster-file"
              posterSrcName="about-hero-poster-src"
              posterTitle="Hero poster"
              setPoster={setAboutHeroPoster}
              setVideoUrl={setAboutHeroMobileVideoUrl}
              spec={MEDIA_SPECS.mobileHero}
              title="Mobile hero video"
              videoUrl={aboutHeroMobileVideoUrl}
              videoUrlName="about-hero-mobile-video-url"
            />
          </div>
        </div>

        <section className={activePanel === "about-story" ? "rounded-lg bg-[#f4f4f4] p-6 shadow-sm" : "hidden"}>
          <div className="mb-4 text-[16px] font-semibold text-[#1f1f1f]">Story section</div>
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-[#1f1f1f]">Story content (use \n\n for paragraph break, \n for line break)</span>
              <textarea
                className="mt-1 block w-full min-h-48 rounded-lg border border-[#b8b8b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                name="about-story-content"
                value={aboutStoryContent}
                onChange={(e) => setAboutStoryContent(e.target.value)}
              />
            </label>
            <div className="rounded-xl border border-[#e5e5e5] bg-white p-5 shadow-sm">
              <div className="mb-4 text-[16px] font-semibold text-[#1f1f1f]">Story image</div>
              <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
                <ImagePreview
                  image={aboutStoryImage}
                  label="Story image"
                  recommendedNote={specNote(MEDIA_SPECS.storyImage)}
                />
                <div className="space-y-4">
                  <FileInput
                    label="Upload story image"
                    name="about-story-image-file"
                    onPreview={(previewSrc, file) =>
                      setAboutStoryImage((image) => ({ ...image, file, previewSrc }))
                    }
                    spec={MEDIA_SPECS.storyImage}
                  />
                  <TextInput
                    name="about-story-image-url"
                    label="Or use image URL"
                    value={aboutStoryImage.src}
                    onChange={(src) => setAboutStoryImage((image) => ({ ...image, src, file: undefined, previewSrc: undefined }))}
                  />
                  <p className="text-xs text-[#6f6f6f]">If both are provided, the uploaded image is used.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={activePanel === "about-contact" ? "rounded-lg bg-[#f4f4f4] p-6 shadow-sm" : "hidden"}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="text-[16px] font-semibold text-[#1f1f1f]">Contact section</div>
            <button
              type="button"
              onClick={() => setAboutContactItems([...aboutContactItems, { text: "", email: "" }])}
              className="rounded-lg bg-[#e04d26] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9411f]"
            >
              Add contact
            </button>
          </div>
          <TextInput
            name="about-contact-title"
            label="Contact title"
            value={aboutContactTitle}
            onChange={setAboutContactTitle}
          />
          <div className="mt-4 space-y-3">
            {aboutContactItems.map((item, index) => (
              <div key={index} className="rounded-lg border border-[#d0d0d0] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#1f1f1f]">Contact {index + 1}</p>
                  <button
                    type="button"
                    disabled={aboutContactItems.length === 1}
                    onClick={() =>
                      setAboutContactItems((items) =>
                        items.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="rounded-md border border-[#e04d26]/30 px-2 py-1 text-xs font-semibold text-[#e04d26] transition-colors hover:bg-[#fff3ef] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <textarea
                    placeholder="Contact text"
                    value={item.text}
                    onChange={(e) =>
                      setAboutContactItems((items) =>
                        items.map((i, itemIndex) =>
                          itemIndex === index ? { ...i, text: e.target.value } : i,
                        ),
                      )
                    }
                    className="block w-full min-h-20 rounded-lg border border-[#b8b8b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={item.email}
                    onChange={(e) =>
                      setAboutContactItems((items) =>
                        items.map((i, itemIndex) =>
                          itemIndex === index ? { ...i, email: e.target.value } : i,
                        ),
                      )
                    }
                    className="block w-full rounded-lg border border-[#b8b8b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </form>

      <form
        id="home-form"
        action={submitHomeContent}
        className={activePanel.startsWith("home-") ? "space-y-6" : "hidden"}
      >
        <input name="active-panel" type="hidden" value={activePanel} />
        <SavingOverlay />
        <div className={activePanel === "home-hero" ? "space-y-4" : "hidden"}>
          <div className="inline-flex rounded-lg border border-[#d0d0d0] bg-white p-1 shadow-sm" role="tablist" aria-label="Homepage hero viewport">
            {(["desktop", "mobile"] as const).map((viewport) => (
              <button
                key={viewport}
                type="button"
                role="tab"
                aria-selected={homeHeroViewport === viewport}
                onClick={() => setHomeHeroViewport(viewport)}
                className={`rounded-md px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                  homeHeroViewport === viewport
                    ? "bg-[#e04d26] text-white"
                    : "text-[#6f6f6f] hover:bg-[#fff7e4] hover:text-[#e04d26]"
                }`}
              >
                {viewport}
              </button>
            ))}
          </div>
        </div>

        <div className={activePanel === "home-hero" && homeHeroViewport === "desktop" ? "block" : "hidden"}>
          <VideoEditor
            filePrefix="Current desktop poster"
            poster={heroPoster}
            posterAltName="home-hero-poster-alt"
            posterFileName="home-hero-poster-file"
            posterSrcName="home-hero-poster-src"
            posterTitle="Desktop poster"
            setPoster={setHeroPoster}
            setVideoUrl={setHeroVideoUrl}
            spec={MEDIA_SPECS.desktopHero}
            title="Desktop hero video"
            videoUrl={heroVideoUrl}
            videoUrlName="home-hero-video-url"
          />
        </div>

        <div className={activePanel === "home-hero" && homeHeroViewport === "mobile" ? "block" : "hidden"}>
          <VideoEditor
            filePrefix="Current mobile poster"
            isMobile
            poster={mobileHeroPoster}
            posterAltName="home-mobile-hero-poster-alt"
            posterFileName="home-mobile-hero-poster-file"
            posterSrcName="home-mobile-hero-poster-src"
            posterTitle="Mobile poster"
            setPoster={setMobileHeroPoster}
            setVideoUrl={setMobileHeroVideoUrl}
            spec={MEDIA_SPECS.mobileHero}
            title="Mobile hero video"
            videoUrl={mobileHeroVideoUrl}
            videoUrlName="home-mobile-hero-video-url"
          />
        </div>

        <div className={activePanel === "home-pack-showcase" ? "block" : "hidden"}>
          <SingleImageEditor
            fieldPrefix="home-pack-showcase-image"
            image={packShowcaseImage}
            label="Pack showcase image"
            setImage={setPackShowcaseImage}
            spec={MEDIA_SPECS.packShowcase}
          />
        </div>

        <div className={activePanel === "home-product" ? "block" : "hidden"}>
          <SingleImageEditor
            fieldPrefix="home-product-image"
            image={homeProductImage}
            label="Homepage product image"
            setImage={setHomeProductImage}
            spec={MEDIA_SPECS.homeProduct}
          />
        </div>

        <div className={activePanel === "home-showcase" ? "block" : "hidden"}>
          <MediaStripEditor
            addLabel="Add media"
            fieldPrefix="showcase"
            items={showcaseItems}
            setItems={setShowcaseItems}
            spec={MEDIA_SPECS.webShowcase}
            title="Web showcase"
          />
        </div>
      </form>

      <form
        id="product-detail-form"
        action={submitProductDetailContent}
        className={activePanel.startsWith("product-") ? "space-y-6" : "hidden"}
      >
        <input name="active-panel" type="hidden" value={activePanel} />
        <SavingOverlay />
        <div className={activePanel === "product-features" ? "space-y-4" : "hidden"}>
          <div className="grid gap-4 md:grid-cols-2 [&>section]:min-w-0">
          <SingleImageEditor
            compact
            fieldPrefix="product-feature-background"
            image={featureBackground}
            label="Desktop background image"
            setImage={setFeatureBackground}
            spec={MEDIA_SPECS.webShowcase}
          />
          <SingleImageEditor
            compact
            fieldPrefix="product-feature-background-mobile"
            image={featureBackgroundMobile}
            label="Mobile background image"
            setImage={setFeatureBackgroundMobile}
            spec={MEDIA_SPECS.mediaStrip}
          />
          </div>
          <p className="text-sm text-[#6f6f6f]">The desktop image is used by default. Upload a different image to customize the mobile background.</p>
          <label className="block rounded-xl border border-[#e5e5e5] bg-white p-6 text-sm shadow-sm">
            <span className="font-semibold">Animated text</span>
            <span id="feature-texts-help" className="mt-1 block text-xs text-[#6f6f6f]">Enter one message per line. Messages appear in this order while scrolling.</span>
            <textarea name="product-feature-texts" aria-describedby="feature-texts-help" rows={6} required
              value={featureTexts} onChange={(event) => setFeatureTexts(event.target.value)}
              className="mt-3 w-full rounded-lg border border-[#b8b8b8] p-3 focus:border-[#e04d26] focus:outline-none" />
          </label>
        </div>
        <div className={activePanel === "product-package" ? "block" : "hidden"}>
          <SingleImageEditor
            fieldPrefix="product-package-image"
            image={productPackageImage}
            label="Package image"
            setImage={setProductPackageImage}
            spec={MEDIA_SPECS.packageImage}
          />
        </div>

        <div className={activePanel === "product-detail" ? "block" : "hidden"}>
          <ImageListEditor
            addLabel="Product detail slider"
            fieldPrefix="slider"
            images={slides}
            setImages={setSlides}
            spec={MEDIA_SPECS.slider}
          />
        </div>

        <div className={activePanel === "product-media-strip" ? "block" : "hidden"}>
          <MediaStripEditor
            items={mediaStripItems}
            setItems={setMediaStripItems}
            spec={MEDIA_SPECS.mediaStrip}
          />
        </div>

        <div className={activePanel === "product-reveal" ? "space-y-4" : "hidden"}>
          <div className="inline-flex rounded-lg border border-[#d0d0d0] bg-white p-1 shadow-sm" role="tablist" aria-label="Product reveal viewport">
            {(["desktop", "mobile"] as const).map((viewport) => (
              <button
                key={viewport}
                type="button"
                role="tab"
                aria-selected={productRevealViewport === viewport}
                onClick={() => setProductRevealViewport(viewport)}
                className={`rounded-md px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                  productRevealViewport === viewport
                    ? "bg-[#e04d26] text-white"
                    : "text-[#6f6f6f] hover:bg-[#fff7e4] hover:text-[#e04d26]"
                }`}
              >
                {viewport}
              </button>
            ))}
          </div>

          <RevealSectionsEditor
            key={productRevealViewport}
            sections={productRevealViewport === "desktop" ? revealSections : revealSectionsMobile}
            setSections={productRevealViewport === "desktop" ? setRevealSections : setRevealSectionsMobile}
          />
        </div>

        <div className={activePanel === "product-steps" ? "block" : "hidden"}>
          <StepsEditor
            fieldPrefix="product-step"
            steps={steps}
            setSteps={setSteps}
            spec={MEDIA_SPECS.stepImage}
          />
        </div>
      </form>

      {activePanel === "faq" ? (
        <FaqForm
          sections={content.faq.sections}
          onSubmit={async (formData) => {
            await saveFaqAction(formData);
            await completeSave();
          }}
        />
      ) : null}

      {activePanel === "terms" ? (
        <TermsForm
          sections={content.terms.sections}
          onSubmit={async (formData) => {
            await saveTermsAction(formData);
            await completeSave();
          }}
        />
      ) : null}

      {activePanel === "privacy" ? (
        <PrivacyForm
          sections={content.privacy.sections}
          updated={content.privacy.updated}
          onSubmit={async (formData) => {
            await savePrivacyAction(formData);
            await completeSave();
          }}
        />
      ) : null}

      {activePanel === "profile" ? <ProfileForm currentUsername={currentUsername} /> : null}

    </DashboardShell>
  );
}
