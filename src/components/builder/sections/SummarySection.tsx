"use client";

import type { ResumeAiContext } from "@/modules/validation";
import { SectionToggle } from "../shared/SectionToggle";
import { InlineAiAssist } from "../shared/InlineAiAssist";

interface SummarySectionProps {
  summary: string;
  updateSummary: (summary: string) => void;
  resume: ResumeAiContext;
  open: boolean;
  onToggle: () => void;
}

export function SummarySection({ summary, updateSummary, resume, open, onToggle }: SummarySectionProps) {
  const hasSummary = summary.trim().length > 0;

  return (
    <section>
      <SectionToggle title="Professional Summary" open={open} onClick={onToggle} />
      {open && (
        <div className="space-y-2 animate-fade-in">
          <textarea
            placeholder="Write a brief professional summary..."
            rows={4}
            className="input-modern resize-none"
            maxLength={1000}
            value={summary}
            onChange={(e) => updateSummary(e.target.value)}
          />
          <div className="flex justify-between mt-1.5">
            <p className="text-xs text-gray-400">2-4 sentences recommended</p>
            <p className={`text-xs ${summary.length > 900 ? "text-amber-500" : "text-gray-400"}`}>
              {summary.length}/1000
            </p>
          </div>
          <InlineAiAssist
            target="summary"
            resume={resume}
            labels={{
              generate: "AI draft summary",
              improve: "AI improve summary",
              tailor: "Tailor summary",
              apply: hasSummary ? "Replace summary" : "Use summary",
            }}
            helpText="Uses your job title, experience, education, projects, and skills for context."
            onApply={(result) => {
              if (result.kind === "text") {
                updateSummary(result.text);
              }
            }}
          />
        </div>
      )}
    </section>
  );
}
