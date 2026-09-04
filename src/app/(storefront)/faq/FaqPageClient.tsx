"use client";

import { useState } from "react";
import type { FaqSection } from "@/types/cms";
import { FaqAccordion } from "@/components/editorial/FaqAccordion";

export function FaqPageClient({ sections }: { sections: FaqSection[] }) {
  const [activeSection, setActiveSection] = useState<string | null>(
    sections[0]?.id || null,
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id)),
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`faq-section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      toggleSection(id);
    }
  };

  return (
    <div className="grid grid-cols-[52px_minmax(0,1fr)] gap-x-[18px] px-[32px] pb-[42px] pt-[39px] md:grid-cols-[290px_minmax(0,1000px)] md:gap-[50px] md:px-[50px] md:pb-32 md:pt-[163px]">
      <aside className="contents md:sticky md:top-[50px] md:block md:self-start">
        <h1 className="faq-title text-white">FAQ</h1>
        <nav className="flex flex-col gap-[5px] font-[family-name:var(--font-body)] text-[14px] font-semibold leading-none text-white md:mt-[36px] md:gap-[18px] md:text-[20px]">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(section.id);
                window.history.replaceState(null, "", `#${section.id}`);
              }}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </aside>
      <div className="col-span-2 mt-[42px] space-y-[58px] md:col-span-1 md:mt-0 md:space-y-[115px]">
        {sections.map((section) => (
          <div
            key={section.id}
            id={`faq-section-${section.id}`}
            onMouseEnter={() => setActiveSection(section.id)}
          >
            <FaqAccordion
              id={section.id}
              title={section.title}
              questions={section.questions}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
