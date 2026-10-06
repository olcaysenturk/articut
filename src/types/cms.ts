export type CmsImage = {
  src: string;
  alt: string;
};

export type CmsRevealSection = {
  layout: "single" | "grid";
  images: CmsImage[];
};

export type CmsStep = {
  title: string;
  image: CmsImage;
  description: string;
};

export type CmsMediaItem =
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "video";
      src: string;
    };

export type FaqItem = {
  question: string;
  answer: string;
  mobileQuestion?: string;
  mobileOnly?: boolean;
};

export type FaqSection = {
  id: string;
  title: string;
  questions: FaqItem[];
};

export type LegalSectionContent = {
  title: string;
  content: string;
};

export type CmsContent = {
  about: {
    heroTitle: string;
    heroVideoUrl: string;
    heroMobileVideoUrl: string;
    heroPosterUrl: string;
    storyContent: string;
    storyImageUrl: string;
    storyMobileImageUrl?: string;
    contactTitle: string;
    contactItems: Array<{ text: string; email: string }>;
  };
  home: {
    heroVideoUrl: string;
    mobileHeroVideoUrl: string;
    heroPoster: CmsImage;
    productImage: CmsImage;
    packShowcaseImage: CmsImage;
    mobilePackShowcaseImage: CmsImage;
    mobileHeroPoster: CmsImage;
    imageShowcase: CmsMediaItem[];
  };
  productDetail: {
    mediaStrip: CmsMediaItem[];
    packageImage: CmsImage;
    featureBackground: CmsImage;
    featureBackgroundMobile?: CmsImage;
    featureTexts: string[];
    combsImage: CmsImage;
    slider: CmsImage[];
    productReveal: CmsImage[];
    productRevealMobile: CmsImage[];
    revealSections?: CmsRevealSection[];
    revealSectionsMobile?: CmsRevealSection[];
    steps: CmsStep[];
    faq: FaqItem[];
  };
  faq: {
    sections: FaqSection[];
  };
  terms: {
    sections: LegalSectionContent[];
  };
  privacy: {
    updated: string;
    sections: LegalSectionContent[];
  };
  returns: {
    updated: string;
    sections: LegalSectionContent[];
  };
  safety: {
    updated: string;
    sections: LegalSectionContent[];
  };
};
