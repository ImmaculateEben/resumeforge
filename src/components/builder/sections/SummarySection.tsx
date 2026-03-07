"use client";

import { SectionToggle } from "../shared/SectionToggle";

interface SummarySectionProps {
  summary: string;
  updateSummary: (summary: string) => void;
  open: boolean;
  onToggle: () => void;
}

export function SummarySection({ summary, updateSummary, open, onToggle }: SummarySectionProps) {
  return (
    <section>
      <SectionToggle title="Professional Summary" open={open} onClick={onToggle} />
      {open && (
        <div className="animate-fade-in">
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
        </div>
      )}
    </section>
  );
}
