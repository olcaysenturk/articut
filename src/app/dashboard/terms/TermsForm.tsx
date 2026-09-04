"use client";

import { useState } from "react";
import type { LegalSectionContent } from "@/types/cms";
import { htmlToPlainText, plainTextToHtml } from "../legal-content-utils";

type ManagedSection = LegalSectionContent & { tempId: string };

type DragState = { sectionIndex: number } | null;

export function TermsForm({
  sections: initialSections,
  onSubmit,
}: {
  sections: LegalSectionContent[];
  onSubmit: (formData: FormData) => void;
}) {
  const [sections, setSections] = useState<ManagedSection[]>(
    initialSections.map((s) => ({ ...s, tempId: crypto.randomUUID() })),
  );
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [dragState, setDragState] = useState<DragState>(null);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const addSection = () => {
    setSections([
      ...sections,
      { tempId: crypto.randomUUID(), title: "", content: "" },
    ]);
  };

  const updateSection = (index: number, updates: Partial<ManagedSection>) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...updates } : s)));
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setSections((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (toIndex: number) => {
    if (dragState && dragState.sectionIndex !== toIndex) {
      moveSection(dragState.sectionIndex, toIndex);
    }
    setDragState(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("active-panel", "terms");

    sections.forEach((section, index) => {
      formData.append(`legal-section-${index}-title`, section.title);
      formData.append(`legal-section-${index}-content`, section.content);
    });

    onSubmit(formData);
  };

  return (
    <div className="grid grid-cols-[200px_1fr] gap-6">
      <aside className="h-fit sticky top-8">
        <div className="text-sm font-semibold text-[#1f1f1f] mb-4">Sections</div>
        <div className="space-y-2">
          {sections.map((section, index) => (
            <button
              key={section.tempId}
              type="button"
              onClick={() => {
                setActiveSectionIndex(index);
                toggleSection(index);
              }}
              className={`w-full rounded-lg px-4 py-3 text-left transition-all ${
                activeSectionIndex === index
                  ? "bg-[#e04d26] text-white shadow-md border border-[#c9411f]"
                  : "bg-white text-[#1f1f1f] border border-[#d0d0d0] hover:border-[#e04d26] hover:shadow-sm"
              }`}
            >
              <div className="font-semibold text-sm truncate">
                {section.title || `Section ${index + 1}`}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <form id="terms-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-lg font-semibold text-[#1f1f1f]">Terms &amp; Conditions Sections</div>
          <button
            type="button"
            onClick={addSection}
            className="rounded-lg bg-[#e04d26] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9411f]"
          >
            Add section
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => {
            const isExpanded = expandedSections.has(index);

            return (
              <div
                key={section.tempId}
                draggable
                onDragStart={() => setDragState({ sectionIndex: index })}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`rounded-lg border-2 transition-colors ${
                  dragState?.sectionIndex === index
                    ? "border-[#e04d26] bg-[#fff7e4]"
                    : "border-[#d0d0d0] bg-white"
                } ${dragState ? "cursor-move" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => toggleSection(index)}
                  className="w-full px-6 py-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg
                        className={`h-5 w-5 transition-transform text-[#e04d26] ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="text-left">
                        <div className="font-semibold text-[#1f1f1f]">
                          {section.title || `Section ${index + 1}`}
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs text-[#999]">⋮⋮</span>
                    </div>
                  </div>
                </button>

                {isExpanded ? (
                  <div className="border-t border-[#e0e0e0] px-6 py-4 space-y-4">
                    <label className="block text-sm">
                      <span className="font-medium text-[#1f1f1f]">Section Title</span>
                      <input
                        type="text"
                        placeholder="e.g., SECTION 1 - ONLINE STORE TERMS"
                        value={section.title}
                        onChange={(e) => updateSection(index, { title: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-[#b8b8b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                      />
                    </label>

                    <label className="block text-sm">
                      <span className="font-medium text-[#1f1f1f]">
                        Content (leave a blank line between paragraphs)
                      </span>
                      <textarea
                        placeholder="Write the section content here..."
                        value={htmlToPlainText(section.content)}
                        onChange={(e) =>
                          updateSection(index, { content: plainTextToHtml(e.target.value) })
                        }
                        className="mt-1 block w-full min-h-64 rounded-lg border border-[#b8b8b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                      />
                    </label>

                    <div className="border-t border-[#e0e0e0] pt-4">
                      <button
                        type="button"
                        disabled={sections.length === 1}
                        onClick={() => removeSection(index)}
                        className="rounded-md border border-[#e04d26]/30 px-3 py-2 text-sm font-semibold text-[#e04d26] transition-colors hover:bg-[#fff3ef] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Remove section
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
}
