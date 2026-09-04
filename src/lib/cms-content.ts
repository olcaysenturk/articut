import "server-only";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { CmsContent, LegalSectionContent } from "@/types/cms";

const DEFAULT_TERMS_SECTIONS: LegalSectionContent[] = [
  {
    title: "OVERVIEW",
    content: `<p>This website is operated by Articut™. Throughout the site, the terms "we", "us" and "our" refer to Articut™. Articut™ offers this website, including all information, tools and Services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
<p>By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>
<p>Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any Services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.</p>
<p>Any new features or tools which are added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.</p>
<p>Our store is hosted on Shopify Inc. They provide us with the online e-commerce platform that allows us to sell our products and Services to you.</p>`,
  },
  {
    title: "SECTION 1 - ONLINE STORE TERMS",
    content: `<p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.</p>
<p>You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction, including but not limited to copyright laws.</p>
<p>You must not transmit any worms or viruses or any code of a destructive nature.</p>
<p>A breach or violation of any of the Terms will result in an immediate termination of your Services.</p>`,
  },
  {
    title: "SECTION 2 - GENERAL CONDITIONS",
    content: `<p>We reserve the right to refuse Service to anyone for any reason at any time.</p>
<p>You understand that your content, not including credit card information, may be transferred unencrypted and involve transmissions over various networks and changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.</p>
<p>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, access to the Service or any contact on the website through which the Service is provided, without express written permission by us.</p>
<p>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>`,
  },
  {
    title: "SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION",
    content: `<p>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.</p>
<p>This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.</p>`,
  },
  {
    title: "SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES",
    content: `<p>Prices for our products are subject to change without notice.</p>
<p>We reserve the right at any time to modify or discontinue the Service, or any part or content thereof, without notice at any time.</p>
<p>We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.</p>`,
  },
  {
    title: "SECTION 5 - PRODUCTS OR SERVICES (if applicable)",
    content: `<p>Certain products or Services may be available exclusively online through the website. These products or Services may have limited quantities and are subject to return or exchange only according to our <a href="/returns" class="underline">Refund Policy</a>.</p>
<p>We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>
<p>We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis. We reserve the right to limit the quantities of any products or Services that we offer. All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time. Any offer for any product or Service made on this site is void where prohibited.</p>
<p>We do not warrant that the quality of any products, Services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.</p>`,
  },
  {
    title: "SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION",
    content: `<p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.</p>
<p>In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the email and/or billing address or phone number provided at the time the order was made.</p>
<p>We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers or distributors.</p>
<p>You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.</p>
<p>For more details, please review our <a href="/returns" class="underline">Refund Policy</a>.</p>`,
  },
  {
    title: "SECTION 7 - OPTIONAL TOOLS",
    content: `<p>We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.</p>
<p>You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement.</p>
<p>We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.</p>
<p>Any use by you of optional tools offered through the site is entirely at your own risk and discretion. You should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider.</p>
<p>We may also, in the future, offer new Services and/or features through the website, including the release of new tools and resources. Such new features and/or Services shall also be subject to these Terms of Service.</p>`,
  },
  {
    title: "SECTION 8 - THIRD-PARTY LINKS",
    content: `<p>Certain content, products and Services available via our Service may include materials from third-parties.</p>
<p>Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or Services of third-parties.</p>
<p>We are not liable for any harm or damages related to the purchase or use of goods, Services, resources, content, or any other transactions made in connection with any third-party websites. Please review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction. Questions regarding third-party products should be directed to the third-party.</p>`,
  },
  {
    title: "SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS",
    content: `<p>If, at our request, you send certain specific submissions or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise, you agree that we may at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation to maintain comments in confidence, pay compensation for comments, or respond to comments.</p>
<p>We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, obscene or otherwise objectionable or that violates any party's intellectual property or these Terms of Service.</p>
<p>You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your comments will not contain unlawful, abusive or obscene material, or any computer virus or other malware. You may not use a false email address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any comments. You are solely responsible for your comments and their accuracy.</p>`,
  },
  {
    title: "SECTION 10 - PERSONAL INFORMATION",
    content: `<p>Your submission of personal information through the store is governed by our <a href="/privacy" class="underline">Privacy Policy</a>.</p>`,
  },
  {
    title: "SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS",
    content: `<p>Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice, including after you have submitted your order.</p>
<p>We undertake no obligation to update, amend or clarify information in the Service or on any related website, including without limitation pricing information, except as required by law. No specified update or refresh date applied in the Service or on any related website should be taken to indicate that all information has been modified or updated.</p>`,
  },
  {
    title: "SECTION 12 - PROHIBITED USES",
    content: `<p>In addition to other prohibitions set forth in the Terms of Service, you are prohibited from using the site or its content:</p>
<p>(a) for any unlawful purpose;<br />(b) to solicit others to perform or participate in unlawful acts;<br />(c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances;<br />(d) to infringe upon or violate our intellectual property rights or those of others;<br />(e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate;<br />(f) to submit false or misleading information;<br />(g) to upload or transmit viruses or malicious code;<br />(h) to collect or track the personal information of others;<br />(i) to spam, phish, pharm, pretext, spider, crawl, or scrape;<br />(j) for any obscene or immoral purpose; or<br />(k) to interfere with or circumvent the security features of the Service or any related website.</p>
<p>We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.</p>`,
  },
  {
    title: "SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY",
    content: `<p>We do not guarantee, represent or warrant that your use of our Service will be uninterrupted, timely, secure or error-free.</p>
<p>We do not warrant that the results that may be obtained from the use of the Service will be accurate or reliable.</p>
<p>You agree that from time to time we may remove the Service for indefinite periods of time or cancel the Service at any time, without notice to you. You expressly agree that your use of, or inability to use, the Service is at your sole risk.</p>
<p>The Service and all products and Services delivered to you through the Service are, except as expressly stated by us, provided "as is" and "as available" without any representation, warranties or conditions of any kind, either express or implied, including implied warranties or conditions of merchantability, quality, fitness for a particular purpose, durability, title, and non-infringement.</p>
<p>In no case shall Articut™, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, Service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including lost profits, lost revenue, lost savings, loss of data, replacement costs, or similar damages arising from your use of the Service or any products procured using the Service. Because some states or jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, in such states or jurisdictions our liability shall be limited to the maximum extent permitted by law.</p>`,
  },
];

const DEFAULT_PRIVACY_UPDATED = "02.13.26";

const DEFAULT_PRIVACY_SECTIONS: LegalSectionContent[] = [
  {
    title: "Information We Collect",
    content: `<p>We only collect information through the following ways:</p>
<ul class="list-disc pl-[33px]">
<li>Contact Form: When you reach out via our contact form, we may collect your name, email address, and any other details you choose to share with us.</li>
<li>Meta Pixel: We use Meta Pixel to help us understand visitor interactions, measure campaign effectiveness, and improve our website experience. Meta Pixel may collect anonymized information about your browsing behavior.</li>
</ul>
<p>We do not collect other types of personal data such as phone numbers, payment information, or subscription details.</p>`,
  },
  {
    title: "Use of Information",
    content: `<p>The information we collect is used to:</p>
<ul class="list-disc pl-[33px]">
<li>Respond to your inquiries and communicate with you</li>
<li>Improve our website and services</li>
<li>Analyze website traffic and user behavior</li>
<li>Comply with legal obligations</li>
</ul>`,
  },
  {
    title: "Disclosure of Your Information",
    content: `<p>We do not sell, rent, or trade your personal information to third parties. Information may only be shared in the following limited situations:</p>
<ul class="list-disc pl-[33px]">
<li>To comply with legal obligations,</li>
<li>To protect the rights and property of Artı Stüdyo,</li>
<li>With your consent.</li>
</ul>
<p>Please note that anonymized data collected via Meta Pixel may be shared with Meta/Facebook services.</p>`,
  },
  {
    title: "Data Security",
    content: `<p>We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>`,
  },
  {
    title: "Your Choices",
    content: `<p>You can choose to:</p>
<ul class="list-disc pl-[33px]">
<li>Not provide certain information</li>
<li>Opt-out of Meta Pixel tracking through your browser settings</li>
<li>Request information about what data we hold about you</li>
<li>Request deletion of your information where applicable</li>
</ul>`,
  },
  {
    title: "Third-Party Links",
    content: `<p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these sites. Please review their privacy policies before providing any personal information.</p>`,
  },
  {
    title: "Children's Privacy",
    content: `<p>Our website is not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us to have it removed.</p>`,
  },
  {
    title: "Changes to Privacy Policy",
    content: `<p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated date at the top of this page. Your continued use of our website after changes constitutes acceptance of the updated policy.</p>`,
  },
  {
    title: "Contact Us",
    content: `<p>If you have any questions about this Privacy Policy, please contact us:</p>
<p>Articut™<br />Email: info@articut.com<br />Website: articut.com</p>`,
  },
];

const imageSchema = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim(),
});

const mediaItemSchema = z.discriminatedUnion("type", [
  imageSchema.extend({
    type: z.literal("image"),
  }),
  z.object({
    type: z.literal("video"),
    src: z.string().trim().min(1),
  }),
]);

const faqItemSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  mobileQuestion: z.string().trim().optional(),
  mobileOnly: z.boolean().optional(),
});

const faqSectionSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  questions: z.array(faqItemSchema).min(1),
});

const legalSectionSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
});

const cmsContentSchema = z.object({
  about: z.object({
    heroTitle: z.string().trim(),
    heroVideoUrl: z.string().trim().min(1),
    heroMobileVideoUrl: z.string().trim().min(1),
    heroPosterUrl: z.string().trim().min(1),
    storyContent: z.string().trim(),
    storyImageUrl: z.string().trim().min(1),
    contactTitle: z.string().trim(),
    contactItems: z.array(
      z.object({
        text: z.string().trim(),
        email: z.string().trim(),
      }),
    ),
  }),
  home: z.object({
    heroVideoUrl: z.string().trim().min(1),
    mobileHeroVideoUrl: z.string().trim().min(1),
    heroPoster: imageSchema,
    packShowcaseImage: imageSchema,
    mobileHeroPoster: imageSchema,
    imageShowcase: z.array(mediaItemSchema).min(1),
  }),
  productDetail: z.object({
    mediaStrip: z.array(mediaItemSchema).min(1),
    packageImage: imageSchema,
    slider: z.array(imageSchema).min(1),
  }),
  faq: z.object({
    sections: z.array(faqSectionSchema).min(1),
  }),
  terms: z.object({
    sections: z.array(legalSectionSchema).min(1),
  }),
  privacy: z.object({
    updated: z.string().trim().min(1),
    sections: z.array(legalSectionSchema).min(1),
  }),
});

const legacyCmsContentSchema = z.object({
  about: z.object({
    heroTitle: z.string().trim(),
    heroVideoUrl: z.string().trim().min(1),
    heroMobileVideoUrl: z.string().trim().min(1),
    heroPosterUrl: z.string().trim().min(1),
    storyContent: z.string().trim(),
    storyImageUrl: z.string().trim().min(1),
    contactTitle: z.string().trim(),
    contactItems: z.array(
      z.object({
        text: z.string().trim(),
        email: z.string().trim(),
      }),
    ),
  }).optional(),
  home: z.object({
    heroVideoUrl: z.string().trim().min(1),
    mobileHeroVideoUrl: z.string().trim().optional(),
    heroPoster: imageSchema.optional(),
    packShowcaseImage: imageSchema.optional(),
    mobileHeroPoster: imageSchema.optional(),
    imageShowcase: z.array(mediaItemSchema).optional(),
  }),
  productDetail: z.object({
    mediaStrip: z.array(mediaItemSchema).optional(),
    packageImage: imageSchema.optional(),
    slider: z.array(imageSchema).min(1),
  }),
  faq: z.object({
    sections: z.array(faqSectionSchema),
  }).optional(),
  terms: z.object({
    sections: z.array(legalSectionSchema),
  }).optional(),
  privacy: z.object({
    updated: z.string().trim().min(1),
    sections: z.array(legalSectionSchema),
  }).optional(),
});

const CMS_CONTENT_PATH = path.join(process.cwd(), "data", "cms-content.json");

export async function getCmsContent(): Promise<CmsContent> {
  const raw = await readFile(CMS_CONTENT_PATH, "utf8");
  const json = JSON.parse(raw);
  const parsed = cmsContentSchema.safeParse(json);

  if (parsed.success) {
    return parsed.data;
  }

  const legacy = legacyCmsContentSchema.parse(json);
  const defaultAnswer =
    "Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.";
  const mobileQuestion = "Are Articut products dishwasher safe?";

  return {
    about: legacy.about ?? {
      heroTitle: "We are Articut™. An innovative company designing tools\nthat make professional-quality haircuts possible at home.",
      heroVideoUrl: "https://player.vimeo.com/progressive_redirect/playback/1218880252/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&signature=5b6ef1a7d3adfa4e94ad0c0a94ee4a7d086c0532783314683e6cc5141c80e16e",
      heroMobileVideoUrl: "https://player.vimeo.com/progressive_redirect/playback/1218880252/rendition/360p/file.mp4?loc=external&signature=5b6ef1a7d3adfa4e94ad0c0a94ee4a7d086c0532783314683e6cc5141c80e16e",
      heroPosterUrl: "/images/about-hero-poster.png",
      storyContent: "Articut™ carries a dream that's been decades in the making. Sinan, the visionary behind Cutpilot by Articut™, grew up in a family of hairdressers. What began as a childhood dream evolved into a story of real collaboration.",
      storyImageUrl: "/images/editorial/about-barber.png",
      contactTitle: "Contact Us",
      contactItems: [
        { text: "Have a question? Reach out anytime.", email: "info@articut.com" },
        { text: "Looking to partner with us?", email: "business@articut.com" },
      ],
    },
    home: {
      heroVideoUrl: legacy.home.heroVideoUrl,
      mobileHeroVideoUrl: legacy.home.heroVideoUrl,
      heroPoster: {
        src: "/images/hero-poster.png",
        alt: "Homepage hero poster",
      },
      packShowcaseImage: {
        src: "/figma/cutpilot-pack.png",
        alt: "Cutpilot tool",
      },
      mobileHeroPoster: {
        src: "/images/hero-poster.png",
        alt: "Mobile homepage hero poster",
      },
      imageShowcase: legacy.home.imageShowcase ?? [{
        type: "image" as const,
        src: "/images/product-detail/cutpilot-slider-3.jpg",
        alt: "Cutpilot in use",
      }],
    },
    productDetail: {
      packageImage: {
        src: "/images/product-detail/package-room.jpg",
        alt: "Cutpilot product packaging",
      },
      mediaStrip: [
        {
          type: "image",
          src: "/images/product-detail/gallery-left.jpg",
          alt: "Cutpilot lifestyle 1",
        },
        {
          type: "video",
          src: "/videos/gallery-video-1.mp4",
        },
        {
          type: "image",
          src: "/images/product-detail/package-room.jpg",
          alt: "Cutpilot lifestyle 3",
        },
        {
          type: "video",
          src: "/videos/gallery-video-2.mp4",
        },
      ],
      slider: legacy.productDetail.slider,
    },
    faq: legacy.faq ?? {
      sections: [
        {
          id: "products",
          title: "Products",
          questions: [
            {
              question: "Are Articut products dishwasher safe?",
              answer: defaultAnswer,
              mobileQuestion,
            },
            {
              question: "Is Articut environmentally friendly?",
              answer: `Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Gorem ipsum dolor sit amet, consectetur adipiscing elit.`,
              mobileQuestion,
            },
            {
              question: "Lorem ipsum dolor sit amet? Lorem Ipsum Dolor ?",
              answer: defaultAnswer,
              mobileQuestion,
            },
            {
              question: "What is your packaging made from? Is it recyclable?",
              answer: defaultAnswer,
              mobileQuestion,
            },
            {
              question: "Lorem ipsum dolor sit amet? Lorem Ipsum Dolor ?",
              answer: defaultAnswer,
              mobileQuestion,
            },
            {
              question: "Lorem ipsum dolor sit amet? Lorem Ipsum Dolor ?",
              answer: defaultAnswer,
              mobileQuestion,
            },
          ],
        },
        {
          id: "shipping",
          title: "Shipping",
          questions: Array.from({ length: 6 }, () => ({
            question: "Lorem ipsum dolor sit amet? Lorem Ipsum Dolor ?",
            mobileQuestion,
            answer: defaultAnswer,
          })),
        },
        {
          id: "orders",
          title: "Orders and Payments",
          questions: Array.from({ length: 4 }, () => ({
            question: "Lorem ipsum dolor sit amet? Lorem Ipsum Dolor ?",
            mobileQuestion,
            answer: defaultAnswer,
          })),
        },
        {
          id: "returns",
          title: "Returns and Refunds",
          questions: Array.from({ length: 4 }, () => ({
            question: "Lorem ipsum dolor sit amet? Lorem Ipsum Dolor ?",
            mobileQuestion,
            answer: defaultAnswer,
          })),
        },
      ],
    },
    terms: legacy.terms ?? { sections: DEFAULT_TERMS_SECTIONS },
    privacy: legacy.privacy ?? { updated: DEFAULT_PRIVACY_UPDATED, sections: DEFAULT_PRIVACY_SECTIONS },
  };
}

export async function saveCmsContent(content: CmsContent): Promise<void> {
  const parsed = cmsContentSchema.parse(content);
  await writeFile(CMS_CONTENT_PATH, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
}
