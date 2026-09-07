"use client";

import { useState } from "react";
import type { FaqSection } from "@/types/cms";

type ManagedFaqSection = FaqSection & { tempId: string };

type DragState = {
  type: "section" | "question";
  sectionIndex: number;
  questionIndex?: number;
};

function sectionIdFromTitle(title: string, fallbackIndex: number) {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || `section-${fallbackIndex}`;
}

export function FaqForm({
  sections: initialSections,
  onSubmit,
}: {
  sections: FaqSection[];
  onSubmit: (formData: FormData) => void;
}) {
  const [sections, setSections] = useState<ManagedFaqSection[]>(
    initialSections.map((s) => ({ ...s, tempId: crypto.randomUUID() })),
  );
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const toggleQuestion = (sectionIndex: number, questionIndex: number) => {
    const key = `${sectionIndex}-${questionIndex}`;
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const addSection = () => {
    const sectionIndex = sections.length + 1;
    setSections([
      ...sections,
      {
        tempId: crypto.randomUUID(),
        id: `section-${sectionIndex}`,
        title: "",
        questions: [],
      },
    ]);
  };

  const updateSection = (index: number, updates: Partial<ManagedFaqSection>) => {
    const currentSection = sections[index];
    const nextUpdates =
      updates.title !== undefined && currentSection?.id.startsWith("section-")
        ? { ...updates, id: sectionIdFromTitle(updates.title, index + 1) }
        : updates;

    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...nextUpdates } : s)),
    );
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const addQuestion = (sectionIndex: number) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              questions: [
                ...section.questions,
                {
                  question: "",
                  answer: "",
                  mobileQuestion: undefined,
                  mobileOnly: false,
                },
              ],
            }
          : section,
      ),
    );
  };

  const updateQuestion = (
    sectionIndex: number,
    questionIndex: number,
    updates: any,
  ) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              questions: section.questions.map((q, j) =>
                j === questionIndex ? { ...q, ...updates } : q,
              ),
            }
          : section,
      ),
    );
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              questions: section.questions.filter((_, j) => j !== questionIndex),
            }
          : section,
      ),
    );
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      next.delete(`${sectionIndex}-${questionIndex}`);
      return next;
    });
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newSections = [...sections];
    const [section] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, section);
    setSections(newSections);
  };

  const moveQuestion = (
    sectionIndex: number,
    fromIndex: number,
    toIndex: number,
  ) => {
    if (fromIndex === toIndex) return;
    setSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              questions: (() => {
                const newQuestions = [...section.questions];
                const [question] = newQuestions.splice(fromIndex, 1);
                newQuestions.splice(toIndex, 0, question);
                return newQuestions;
              })(),
            }
          : section,
      ),
    );
  };

  const handleDragStart = (state: DragState) => {
    setDragState(state);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSectionDrop = (toIndex: number) => {
    if (dragState?.type === "section" && dragState.sectionIndex !== toIndex) {
      moveSection(dragState.sectionIndex, toIndex);
    }
    setDragState(null);
  };

  const handleQuestionDrop = (sectionIndex: number, toIndex: number) => {
    if (
      dragState?.type === "question" &&
      dragState.sectionIndex === sectionIndex &&
      dragState.questionIndex !== toIndex
    ) {
      moveQuestion(sectionIndex, dragState.questionIndex!, toIndex);
    }
    setDragState(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append("active-panel", "faq");

    sections.forEach((section, sectionIndex) => {
      formData.append(`section-${sectionIndex}-id`, section.id);
      formData.append(`section-${sectionIndex}-title`, section.title);

      section.questions.forEach((question, questionIndex) => {
        formData.append(
          `section-${sectionIndex}-question-${questionIndex}-text`,
          question.question,
        );
        formData.append(
          `section-${sectionIndex}-question-${questionIndex}-answer`,
          question.answer,
        );
        if (question.mobileQuestion) {
          formData.append(
            `section-${sectionIndex}-question-${questionIndex}-mobile-question`,
            question.mobileQuestion,
          );
        }
        if (question.mobileOnly) {
          formData.append(
            `section-${sectionIndex}-question-${questionIndex}-mobile-only`,
            "on",
          );
        }
      });
    });

    try {
      await onSubmit(formData);
    } finally {
      setIsSaving(false);
    }
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
              <div className="font-semibold text-sm mb-1">
                {section.title || `Section ${index + 1}`}
              </div>
              <div
                className={`text-xs ${
                  activeSectionIndex === index ? "text-white/80" : "text-[#6f6f6f]"
                }`}
              >
                {section.questions.length} question{section.questions.length !== 1 ? "s" : ""}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <form id="faq-form" onSubmit={handleSubmit} className="space-y-6">
        {isSaving ? <div className="fixed inset-0 z-[100] grid place-items-center bg-black/25 px-4 backdrop-blur-[2px]" role="status"><div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 text-sm font-semibold text-[#1f1f1f] shadow-2xl"><span className="size-5 animate-spin rounded-full border-2 border-[#e04d26]/25 border-t-[#e04d26]" aria-hidden="true" />Saving changes...</div></div> : null}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-lg font-semibold text-[#1f1f1f]">FAQ Sections</div>
          <button
            type="button"
            onClick={addSection}
            className="rounded-lg bg-[#e04d26] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9411f]"
          >
            Add section
          </button>
        </div>

        <div className="space-y-4">
        {sections.map((section, sectionIndex) => {
          const isExpanded = expandedSections.has(sectionIndex);

          return (
            <div
              key={section.tempId}
              draggable
              onDragStart={() => handleDragStart({ type: "section", sectionIndex })}
              onDragOver={handleDragOver}
              onDrop={() => handleSectionDrop(sectionIndex)}
              className={`rounded-lg border-2 transition-colors ${
                dragState?.type === "section" && dragState.sectionIndex === sectionIndex
                  ? "border-[#e04d26] bg-[#fff7e4]"
                  : "border-[#d0d0d0] bg-white"
              } ${dragState ? "cursor-move" : ""}`}
            >
              <div className="flex items-center gap-3 px-6 py-4">
                <button
                  type="button"
                  onClick={() => toggleSection(sectionIndex)}
                  className="min-w-0 flex-1 text-left"
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
                        {section.title || `Section ${sectionIndex + 1}`}
                      </div>
                      <div className="text-xs text-[#6f6f6f]">
                        {section.questions.length} question{section.questions.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  </div>
                </button>
                <button
                  type="button"
                  aria-label={`Edit ${section.title || `Section ${sectionIndex + 1}`}`}
                  title="Edit section title"
                  onClick={() => {
                    setActiveSectionIndex(sectionIndex);
                    setExpandedSections((prev) => new Set(prev).add(sectionIndex));
                    setEditingSectionIndex(sectionIndex);
                  }}
                  className="grid size-9 shrink-0 place-items-center rounded-md border border-[#e04d26]/25 text-[#e04d26] transition-colors hover:bg-[#fff3ef]"
                >
                  <svg className="size-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
              </div>

              {isExpanded ? (
                <div className="border-t border-[#e0e0e0] px-6 py-4 space-y-4">
                  <div className="grid gap-4 border-b border-[#e0e0e0] pb-4">
                    <label className="block text-sm">
                      <span className="font-medium text-[#1f1f1f]">Section Title</span>
                      <input
                        type="text"
                        placeholder="e.g., Products"
                        autoFocus={editingSectionIndex === sectionIndex}
                        value={section.title}
                        onChange={(e) =>
                          updateSection(sectionIndex, { title: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-[#b8b8b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                      />
                    </label>
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-[#fff7e4] px-3 py-2 text-xs text-[#6f6f6f]">
                      <span>Section link ID is generated automatically.</span>
                      <code className="font-semibold text-[#e04d26]">#{section.id || sectionIdFromTitle(section.title, sectionIndex + 1)}</code>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1f1f1f]">Questions</p>
                      <button
                        type="button"
                        onClick={() => addQuestion(sectionIndex)}
                        className="rounded-md bg-[#fab446]/20 px-3 py-1 text-xs font-semibold text-[#e04d26] transition-colors hover:bg-[#fab446]/35"
                      >
                        Add question
                      </button>
                    </div>

                    <div className="space-y-2">
                      {section.questions.map((question, questionIndex) => {
                        const qKey = `${sectionIndex}-${questionIndex}`;
                        const qExpanded = expandedQuestions.has(qKey);

                        return (
                          <div
                            key={questionIndex}
                            draggable
                            onDragStart={() =>
                              handleDragStart({
                                type: "question",
                                sectionIndex,
                                questionIndex,
                              })
                            }
                            onDragOver={handleDragOver}
                            onDrop={() => handleQuestionDrop(sectionIndex, questionIndex)}
                            className={`rounded-lg border transition-colors ${
                              dragState?.type === "question" &&
                              dragState.sectionIndex === sectionIndex &&
                              dragState.questionIndex === questionIndex
                                ? "border-[#e04d26] bg-[#fff7e4]"
                                : "border-[#e0e0e0] bg-[#fafafa]"
                            } ${dragState ? "cursor-move" : ""}`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleQuestion(sectionIndex, questionIndex)}
                              className="w-full px-4 py-3 text-left"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <svg
                                    className={`h-4 w-4 shrink-0 transition-transform text-[#e04d26] ${
                                      qExpanded ? "rotate-90" : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                  <p className="text-sm font-medium text-[#1f1f1f] truncate">
                                    {question.question || `Question ${questionIndex + 1}`}
                                  </p>
                                </div>
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-2 shrink-0"
                                >
                                  <span className="text-xs text-[#999]">⋮⋮</span>
                                  <div
                                    role="button"
                                    tabIndex={section.questions.length === 1 ? -1 : 0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (section.questions.length > 1) {
                                        removeQuestion(sectionIndex, questionIndex);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        if (section.questions.length > 1) {
                                          removeQuestion(sectionIndex, questionIndex);
                                        }
                                      }
                                    }}
                                    className={`rounded-md border border-[#e04d26]/30 px-2 py-1 text-xs font-semibold text-[#e04d26] transition-colors cursor-pointer ${
                                      section.questions.length === 1
                                        ? "opacity-40 cursor-not-allowed"
                                        : "hover:bg-[#fff3ef]"
                                    }`}
                                  >
                                    ×
                                  </div>
                                </div>
                              </div>
                            </button>

                            {qExpanded ? (
                              <div className="border-t border-[#e0e0e0] bg-white px-4 py-3 space-y-3">
                                <label className="block text-sm">
                                  <span className="font-medium text-[#1f1f1f]">
                                    Question *
                                  </span>
                                  <input
                                    type="text"
                                    placeholder="Enter the question"
                                    value={question.question}
                                    onChange={(e) =>
                                      updateQuestion(sectionIndex, questionIndex, {
                                        question: e.target.value,
                                      })
                                    }
                                    className="mt-1 block w-full rounded-lg border border-[#b8b8b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                                  />
                                </label>

                                <label className="block text-sm">
                                  <span className="font-medium text-[#1f1f1f]">
                                    Answer *
                                  </span>
                                  <textarea
                                    placeholder="Enter the answer"
                                    value={question.answer}
                                    onChange={(e) =>
                                      updateQuestion(sectionIndex, questionIndex, {
                                        answer: e.target.value,
                                      })
                                    }
                                    className="mt-1 block w-full min-h-24 rounded-lg border border-[#b8b8b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                                  />
                                </label>

                                <label className="block text-sm">
                                  <span className="font-medium text-[#1f1f1f]">
                                    Mobile Question (optional)
                                  </span>
                                  <input
                                    type="text"
                                    placeholder="Question for mobile display (if different)"
                                    value={question.mobileQuestion ?? ""}
                                    onChange={(e) =>
                                      updateQuestion(sectionIndex, questionIndex, {
                                        mobileQuestion: e.target.value || undefined,
                                      })
                                    }
                                    className="mt-1 block w-full rounded-lg border border-[#b8b8b8] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#e04d26] focus:outline-none focus:ring-2 focus:ring-[#fab446]/45"
                                  />
                                </label>

                                <label className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={question.mobileOnly ?? false}
                                    onChange={(e) =>
                                      updateQuestion(sectionIndex, questionIndex, {
                                        mobileOnly: e.target.checked,
                                      })
                                    }
                                    className="h-4 w-4 rounded border-[#b8b8b8] accent-[#e04d26]"
                                  />
                                  <span className="font-medium text-[#1f1f1f]">
                                    Mobile only
                                  </span>
                                </label>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-[#e0e0e0] pt-4">
                    <button
                      type="button"
                      disabled={sections.length === 1}
                      onClick={() => removeSection(sectionIndex)}
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
