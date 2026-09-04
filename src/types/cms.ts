export type CmsImage = {
  src: string;
  alt: string;
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
    contactTitle: string;
    contactItems: Array<{ text: string; email: string }>;
  };
  home: {
    heroVideoUrl: string;
    mobileHeroVideoUrl: string;
    heroPoster: CmsImage;
    packShowcaseImage: CmsImage;
    mobileHeroPoster: CmsImage;
    imageShowcase: CmsMediaItem[];
  };
  productDetail: {
    mediaStrip: CmsMediaItem[];
    packageImage: CmsImage;
    slider: CmsImage[];
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
};
