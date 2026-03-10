"use client";

import type { InlineAiTarget, ResumeAiContext } from "@/modules/validation";
import { InlineAiAssist } from "./InlineAiAssist";

type BulletAiTarget = Extract<
  InlineAiTarget,
  "experience_bullets" | "education_bullets" | "project_bullets" | "custom_entry_bullets"
>;

interface BulletListProps {
  bullets: string[];
  onAdd: () => void;
  onUpdate: (index: number, text: string) => void;
  onRemove: (index: number) => void;
  max: number;
  aiAssist?: {
    target: BulletAiTarget;
    resume: ResumeAiContext;
    entityId: string;
    onApply: (bullets: string[]) => void;
  };
}

export function BulletList({ bullets, onAdd, onUpdate, onRemove, max, aiAssist }: BulletListProps) {
  const hasBullets = bullets.some((bullet) => bullet.trim().length > 0);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500">Key Achievements / Details</label>
      {aiAssist && (
        <InlineAiAssist
          target={aiAssist.target}
          resume={aiAssist.resume}
          entityId={aiAssist.entityId}
          labels={{
            generate: "AI draft bullets",
            improve: "AI improve bullets",
            tailor: "Tailor bullets",
            apply: hasBullets ? "Replace bullets" : "Use bullets",
          }}
          helpText="Generates concise bullet points from this entry and the rest of your resume."
          onApply={(result) => {
            if (result.kind === "list") {
              aiAssist.onApply(result.items.slice(0, max));
            }
          }}
        />
      )}
      {bullets.map((bullet, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-gray-300 mt-2.5 text-xs select-none">&bull;</span>
          <input
            type="text"
            placeholder="Describe an achievement or responsibility..."
            className="input-modern flex-1 text-sm"
            value={bullet}
            maxLength={220}
            onChange={(e) => onUpdate(i, e.target.value)}
          />
          <button
            onClick={() => onRemove(i)}
            className="p-1.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 mt-1 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      {bullets.length < max && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark px-1 py-0.5"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add bullet ({bullets.length}/{max})
        </button>
      )}
    </div>
  );
}
