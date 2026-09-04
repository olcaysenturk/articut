"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCmsContent, saveCmsContent } from "@/lib/cms-content";
import type { CmsImage, CmsMediaItem } from "@/types/cms";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

async function uploadedImagePath(formData: FormData, name: string) {
  const value = formData.get(name);
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  const extension = path.extname(value.name).toLowerCase() || ".jpg";
  const baseName = path
    .basename(value.name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
  const fileName = `${Date.now()}-${baseName || "image"}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "cms");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), Buffer.from(await value.arrayBuffer()));

  return `/uploads/cms/${fileName}`;
}

async function imageFromForm(formData: FormData, prefix: string, fallbackSrc = ""): Promise<CmsImage | null> {
  const uploadedSrc = await uploadedImagePath(formData, `${prefix}-file`);
  const existingSrc = field(formData, `${prefix}-src`);
  const src = uploadedSrc ?? (existingSrc || fallbackSrc);

  if (!src) {
    return null;
  }

  return {
    src,
    alt: field(formData, `${prefix}-alt`),
  };
}

async function mediaItemFromForm(formData: FormData, prefix: string): Promise<CmsMediaItem | null> {
  const type = field(formData, `${prefix}-type`);

  if (type === "image") {
    const image = await imageFromForm(formData, prefix);
    return image ? { type: "image", ...image } : null;
  }

  if (type === "video") {
    const uploadedSrc = await uploadedImagePath(formData, `${prefix}-file`);
    const existingSrc = field(formData, `${prefix}-src`);
    const src = uploadedSrc ?? existingSrc;
    return src ? { type: "video", src } : null;
  }

  return null;
}

function revalidateCmsContent() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/cutpilot");
  revalidatePath("/faq");
  revalidatePath("/terms");
  revalidatePath("/privacy");
  revalidatePath("/dashboard");
}

function dashboardRedirect(panel: string) {
  const allowedPanel =
    panel === "about" ||
    panel === "home-desktop" ||
    panel === "home-mobile" ||
    panel === "home-pack-showcase" ||
    panel === "home-showcase" ||
    panel === "product-package" ||
    panel === "product-media-strip" ||
    panel === "product-detail" ||
    panel === "faq" ||
    panel === "terms" ||
    panel === "privacy"
      ? panel
      : "about";

  redirect(`/dashboard?panel=${allowedPanel}&saved=1`);
}

export async function saveHomeContentAction(formData: FormData) {
  const content = await getCmsContent();
  const heroPoster = await imageFromForm(formData, "home-hero-poster", content.home.heroPoster.src);
  const mobileHeroPoster = await imageFromForm(
    formData,
    "home-mobile-hero-poster",
    content.home.mobileHeroPoster.src,
  );
  const packShowcaseImage = await imageFromForm(
    formData,
    "home-pack-showcase-image",
    content.home.packShowcaseImage.src,
  );
  const showcaseIndexes = Array.from(formData.keys())
    .map((key) => key.match(/^showcase-(\d+)-type$/)?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);
  const imageShowcase = (
    await Promise.all(
      showcaseIndexes.map((index) => mediaItemFromForm(formData, `showcase-${index}`)),
    )
  ).filter((item): item is CmsMediaItem => Boolean(item));

  await saveCmsContent({
    ...content,
    home: {
      heroVideoUrl: field(formData, "home-hero-video-url"),
      mobileHeroVideoUrl: field(formData, "home-mobile-hero-video-url"),
      heroPoster: heroPoster ?? content.home.heroPoster,
      packShowcaseImage: packShowcaseImage ?? content.home.packShowcaseImage,
      mobileHeroPoster: mobileHeroPoster ?? content.home.mobileHeroPoster,
      imageShowcase: imageShowcase.length > 0 ? imageShowcase : content.home.imageShowcase,
    },
  });

  revalidateCmsContent();
  dashboardRedirect(field(formData, "active-panel"));
}

export async function saveProductDetailContentAction(formData: FormData) {
  const content = await getCmsContent();
  const packageImage = await imageFromForm(
    formData,
    "product-package-image",
    content.productDetail.packageImage.src,
  );
  const sliderIndexes = Array.from(formData.keys())
    .map((key) => key.match(/^slider-(\d+)-src$/)?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);
  const slider = (
    await Promise.all(
      sliderIndexes.map((index) => imageFromForm(formData, `slider-${index}`)),
    )
  ).filter((image): image is CmsImage => Boolean(image));
  const mediaStripIndexes = Array.from(formData.keys())
    .map((key) => key.match(/^media-strip-(\d+)-type$/)?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);
  const mediaStrip = (
    await Promise.all(
      mediaStripIndexes.map(async (index): Promise<CmsMediaItem | null> => {
        const prefix = `media-strip-${index}`;
        const type = field(formData, `${prefix}-type`);

        if (type === "image") {
          const image = await imageFromForm(formData, prefix);
          return image ? { type: "image", ...image } : null;
        }

        if (type === "video") {
          const src = field(formData, `${prefix}-src`);
          return src ? { type: "video", src } : null;
        }

        return null;
      }),
    )
  ).filter((item): item is CmsMediaItem => Boolean(item));

  await saveCmsContent({
    ...content,
    productDetail: {
      packageImage: packageImage ?? content.productDetail.packageImage,
      mediaStrip: mediaStrip.length > 0 ? mediaStrip : content.productDetail.mediaStrip,
      slider: slider.length > 0 ? slider : content.productDetail.slider,
    },
  });

  revalidateCmsContent();
  dashboardRedirect(field(formData, "active-panel"));
}

export async function saveAboutContentAction(formData: FormData) {
  const content = await getCmsContent();

  const heroPosterUpload = await uploadedImagePath(formData, "about-hero-poster-file");
  const heroPosterUrl = heroPosterUpload || field(formData, "about-hero-poster-src") || content.about.heroPosterUrl;

  const contactIndexes = Array.from(formData.keys())
    .map((key) => key.match(/^contact-(\d+)-text$/)?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);

  const contactItems = contactIndexes.map((index) => ({
    text: field(formData, `contact-${index}-text`),
    email: field(formData, `contact-${index}-email`),
  }));

  await saveCmsContent({
    ...content,
    about: {
      heroTitle: field(formData, "about-hero-title"),
      heroVideoUrl: field(formData, "about-hero-video-url"),
      heroMobileVideoUrl: field(formData, "about-hero-mobile-video-url"),
      heroPosterUrl,
      storyContent: field(formData, "about-story-content"),
      storyImageUrl: field(formData, "about-story-image-url"),
      contactTitle: field(formData, "about-contact-title"),
      contactItems: contactItems.length > 0 ? contactItems : content.about.contactItems,
    },
  });

  revalidateCmsContent();
  dashboardRedirect(field(formData, "active-panel"));
}

export async function saveFaqContentAction(formData: FormData) {
  const content = await getCmsContent();
  const sectionIndexes = Array.from(formData.keys())
    .map((key) => key.match(/^section-(\d+)-title$/)?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);

  const sections = sectionIndexes.map((sectionIndex) => {
    const questionIndexes = Array.from(formData.keys())
      .map((key) => key.match(new RegExp(`^section-${sectionIndex}-question-(\\d+)-text$`))?.[1])
      .filter((index): index is string => Boolean(index))
      .map(Number)
      .sort((a, b) => a - b);

    return {
      id: field(formData, `section-${sectionIndex}-id`),
      title: field(formData, `section-${sectionIndex}-title`),
      questions: questionIndexes
        .map((questionIndex) => ({
          question: field(formData, `section-${sectionIndex}-question-${questionIndex}-text`),
          answer: field(formData, `section-${sectionIndex}-question-${questionIndex}-answer`),
          mobileQuestion: field(formData, `section-${sectionIndex}-question-${questionIndex}-mobile-question`) || undefined,
          mobileOnly: formData.get(`section-${sectionIndex}-question-${questionIndex}-mobile-only`) === "on",
        }))
        .filter((q) => q.question && q.answer),
    };
  });

  await saveCmsContent({
    ...content,
    faq: {
      sections: sections.length > 0 ? sections : content.faq.sections,
    },
  });

  revalidateCmsContent();
  dashboardRedirect(field(formData, "active-panel"));
}

export async function saveTermsContentAction(formData: FormData) {
  const content = await getCmsContent();
  const sectionIndexes = Array.from(formData.keys())
    .map((key) => key.match(/^legal-section-(\d+)-title$/)?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);

  const sections = sectionIndexes
    .map((sectionIndex) => ({
      title: field(formData, `legal-section-${sectionIndex}-title`),
      content: field(formData, `legal-section-${sectionIndex}-content`),
    }))
    .filter((s) => s.title && s.content);

  await saveCmsContent({
    ...content,
    terms: {
      sections: sections.length > 0 ? sections : content.terms.sections,
    },
  });

  revalidateCmsContent();
  dashboardRedirect(field(formData, "active-panel"));
}

export async function savePrivacyContentAction(formData: FormData) {
  const content = await getCmsContent();
  const sectionIndexes = Array.from(formData.keys())
    .map((key) => key.match(/^legal-section-(\d+)-title$/)?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);

  const sections = sectionIndexes
    .map((sectionIndex) => ({
      title: field(formData, `legal-section-${sectionIndex}-title`),
      content: field(formData, `legal-section-${sectionIndex}-content`),
    }))
    .filter((s) => s.title && s.content);

  await saveCmsContent({
    ...content,
    privacy: {
      updated: field(formData, "privacy-updated") || content.privacy.updated,
      sections: sections.length > 0 ? sections : content.privacy.sections,
    },
  });

  revalidateCmsContent();
  dashboardRedirect(field(formData, "active-panel"));
}
