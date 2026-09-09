"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getCmsContent, saveCmsContent } from "@/lib/cms-content";
import { cmsMediaUrl, uploadCmsMedia } from "@/lib/netlify-blobs";
import type { CmsImage, CmsMediaItem, CmsRevealSection, CmsStep } from "@/types/cms";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function faqSectionIdFromTitle(title: string, fallbackIndex: number) {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || `section-${fallbackIndex}`;
}

async function uploadedImagePath(formData: FormData, name: string) {
  const value = formData.get(name);
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  const extension = value.name.includes(".") ? value.name.slice(value.name.lastIndexOf(".")).toLowerCase() : ".jpg";
  const baseName = value.name
    .slice(0, value.name.length - extension.length)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
  const blob = await uploadCmsMedia(value, baseName || "image");
  if (blob) return cmsMediaUrl(blob.key);

  if (process.env.NETLIFY === "true" || process.env.NODE_ENV === "production") {
    throw new Error(
      "Media could not be uploaded because Netlify Blobs is not configured. Set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN.",
    );
  }

  const { mkdir, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
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

async function imageListFromForm(formData: FormData, prefix: string, indexes: number[]) {
  const images: CmsImage[] = [];

  // Upload one file at a time so multiple Blob writes cannot race each other.
  for (const index of indexes) {
    const image = await imageFromForm(formData, `${prefix}-${index}`);
    if (image) images.push(image);
  }

  return images;
}

async function stepsFromForm(
  formData: FormData,
  prefix: string,
  existingSteps: CmsStep[],
): Promise<CmsStep[]> {
  const indexes = Array.from(formData.keys())
    .map((key) => key.match(new RegExp(`^${prefix}-(\\d+)-title$`))?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);

  const steps: CmsStep[] = [];
  for (const index of indexes) {
    const title = field(formData, `${prefix}-${index}-title`);
    const description = field(formData, `${prefix}-${index}-description`);
    const image = await imageFromForm(formData, `${prefix}-${index}-image`, existingSteps[index]?.image.src);
    if (title && description && image) {
      steps.push({ title, description, image });
    }
  }

  return steps;
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
  const productImage = await imageFromForm(
    formData,
    "home-product-image",
    content.home.productImage.src,
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
      productImage: productImage ?? content.home.productImage,
      packShowcaseImage: packShowcaseImage ?? content.home.packShowcaseImage,
      mobileHeroPoster: mobileHeroPoster ?? content.home.mobileHeroPoster,
      imageShowcase: imageShowcase.length > 0 ? imageShowcase : content.home.imageShowcase,
    },
  });

  revalidateCmsContent();
}

async function revealSectionsFromForm(formData: FormData, prefix: string): Promise<CmsRevealSection[] | undefined> {
  const raw = formData.get(prefix);
  if (typeof raw !== "string") return undefined;
  const draftImage = z.object({ src: z.string(), alt: z.string() });
  const sections = z.array(z.discriminatedUnion("layout", [
    z.object({ layout: z.literal("single"), images: z.array(draftImage).min(1) }),
    z.object({ layout: z.literal("grid"), images: z.array(draftImage).min(2) }),
  ])).parse(JSON.parse(raw));

  // Validate every slot before starting uploads; a grid must have both images.
  sections.forEach((section, index) => section.images.forEach((image, imageIndex) => {
    const file = formData.get(`${prefix}-${index}-${imageIndex}-file`);
    if (!image.src.trim() && !(file instanceof File && file.size > 0)) {
      throw new Error("Upload every image in the product reveal sections before saving.");
    }
  }));
  return Promise.all(sections.map(async (section, index) => ({
    layout: section.layout,
    images: await Promise.all(section.images.map(async (image, imageIndex) => ({
      src: await uploadedImagePath(formData, `${prefix}-${index}-${imageIndex}-file`) ?? image.src.trim(),
      alt: image.alt.trim(),
    }))),
  })));
}

export async function saveProductDetailContentAction(formData: FormData) {
  const content = await getCmsContent();
  const packageImage = await imageFromForm(
    formData,
    "product-package-image",
    content.productDetail.packageImage.src,
  );
  const featureBackground = formData.has("product-feature-background-src")
    ? await imageFromForm(formData, "product-feature-background", content.productDetail.featureBackground.src)
    : null;
  const featureBackgroundMobile = formData.has("product-feature-background-mobile-src")
    ? await imageFromForm(formData, "product-feature-background-mobile", content.productDetail.featureBackgroundMobile?.src)
    : null;
  const featureTexts = formData.has("product-feature-texts")
    ? z.array(z.string().min(1)).min(1).parse(field(formData, "product-feature-texts").split(/\r?\n/).map((text) => text.trim()).filter(Boolean))
    : content.productDetail.featureTexts;
  const sliderIndexes = Array.from(formData.keys())
    .map((key) => key.match(/^slider-(\d+)-src$/)?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);
  const slider = await imageListFromForm(formData, "slider", sliderIndexes);
  const revealSections = await revealSectionsFromForm(formData, "reveal-sections");
  const revealSectionsMobile = await revealSectionsFromForm(formData, "reveal-sections-mobile");
  const mediaStripIndexes = Array.from(formData.keys())
    .map((key) => key.match(/^media-strip-(\d+)-type$/)?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);
  const mediaStrip = (
    await Promise.all(
      mediaStripIndexes.map((index) => mediaItemFromForm(formData, `media-strip-${index}`)),
    )
  ).filter((item): item is CmsMediaItem => Boolean(item));
  const steps = await stepsFromForm(formData, "product-step", content.productDetail.steps);

  await saveCmsContent({
    ...content,
    productDetail: {
      ...content.productDetail,
      featureBackground: featureBackground ?? content.productDetail.featureBackground,
      featureBackgroundMobile: featureBackgroundMobile ?? content.productDetail.featureBackgroundMobile,
      featureTexts,
      revealSections: revealSections ?? content.productDetail.revealSections,
      revealSectionsMobile: revealSectionsMobile ?? content.productDetail.revealSectionsMobile,
      packageImage: packageImage ?? content.productDetail.packageImage,
      mediaStrip: mediaStrip.length > 0 ? mediaStrip : content.productDetail.mediaStrip,
      slider: slider.length > 0 ? slider : content.productDetail.slider,
      steps: steps.length > 0 ? steps : content.productDetail.steps,
    },
  });

  revalidateCmsContent();
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
  const storyImageUpload = await uploadedImagePath(formData, "about-story-image");
  const storyImageUrl = storyImageUpload || field(formData, "about-story-image-url") || content.about.storyImageUrl;

  await saveCmsContent({
    ...content,
    about: {
      heroTitle: field(formData, "about-hero-title"),
      heroVideoUrl: field(formData, "about-hero-video-url"),
      heroMobileVideoUrl: field(formData, "about-hero-mobile-video-url"),
      heroPosterUrl,
      storyContent: field(formData, "about-story-content"),
      storyImageUrl,
      contactTitle: field(formData, "about-contact-title"),
      contactItems: contactItems.length > 0 ? contactItems : content.about.contactItems,
    },
  });

  revalidateCmsContent();
}

export async function saveFaqContentAction(formData: FormData) {
  const content = await getCmsContent();
  const sectionIndexes = Array.from(formData.keys())
    .map((key) => key.match(/^section-(\d+)-title$/)?.[1])
    .filter((index): index is string => Boolean(index))
    .map(Number)
    .sort((a, b) => a - b);

  const usedSectionIds = new Set<string>();
  const sections = sectionIndexes.map((sectionIndex, sectionPosition) => {
    const title = field(formData, `section-${sectionIndex}-title`);
    const requestedId = field(formData, `section-${sectionIndex}-id`);
    const baseId = requestedId || faqSectionIdFromTitle(title, sectionPosition + 1);
    let id = baseId;
    let suffix = 2;

    while (usedSectionIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    usedSectionIds.add(id);

    const questionIndexes = Array.from(formData.keys())
      .map((key) => key.match(new RegExp(`^section-${sectionIndex}-question-(\\d+)-text$`))?.[1])
      .filter((index): index is string => Boolean(index))
      .map(Number)
      .sort((a, b) => a - b);

    return {
      id,
      title,
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
}
