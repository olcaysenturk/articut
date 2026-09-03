import type { Metadata } from "next";
import { EditorialFooter } from "@/components/editorial/EditorialFooter";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import {
  FaqAccordion,
  FaqSectionNav,
  type FaqItem,
} from "@/components/editorial/FaqAccordion";

export const metadata: Metadata = { title: "FAQ" };

const defaultAnswer =
  "Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.";
const mobileQuestion = "Are Articut products dishwasher safe?";

const productQuestions: FaqItem[] = [
  {
    question: "Are Articut products dishwasher safe?",
    answer: defaultAnswer,
    mobileQuestion,
  },
  {
    question: "Is Articut environmentally friendly?",
    answer:
      "Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Gorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
  ...Array.from({ length: 4 }, () => ({
    question: mobileQuestion,
    mobileQuestion,
    answer: defaultAnswer,
    mobileOnly: true,
  })),
];

const placeholderQuestions: FaqItem[] = Array.from({ length: 6 }, () => ({
  question: "Lorem ipsum dolor sit amet? Lorem Ipsum Dolor ?",
  mobileQuestion,
  answer: defaultAnswer,
}));

export default function FaqPage() {
  return (
    <div className="bg-[#e94b24] text-black">
      <main className="relative bg-[#e94b24] md:min-h-[3527px]">
        <div className="faq-pattern" aria-hidden />
        <div className="relative z-10">
          <EditorialHeader dark />
          <div className="grid grid-cols-[52px_minmax(0,1fr)] gap-x-[18px] px-[32px] pb-[42px] pt-[39px] md:grid-cols-[290px_minmax(0,1000px)] md:gap-[50px] md:px-[50px] md:pb-32 md:pt-[163px]">
            <aside className="contents md:sticky md:top-[50px] md:block md:self-start">
              <h1 className="faq-title text-white">FAQ</h1>
              <FaqSectionNav />
            </aside>
            <div className="col-span-2 mt-[42px] space-y-[58px] md:col-span-1 md:mt-0 md:space-y-[115px]">
              <FaqAccordion
                id="products"
                title="Products"
                questions={productQuestions}
              />
              <FaqAccordion
                id="shipping"
                title="Shipping"
                questions={placeholderQuestions}
              />
              <FaqAccordion
                id="orders"
                title="Orders and Payments"
                questions={placeholderQuestions.slice(0, 4)}
              />
              <FaqAccordion
                id="returns"
                title="Returns and Refunds"
                questions={placeholderQuestions.slice(0, 4)}
              />
            </div>
          </div>
        </div>
      </main>
      <EditorialFooter />
    </div>
  );
}
