"use client";

import { useState } from "react";
import type {
  InlineAiMode,
  InlineAiResult,
  InlineAiTarget,
  InlineAiTone,
  ResumeAiContext,
} from "@/modules/validation";

interface InlineAiAssistProps {
  target: InlineAiTarget;
  resume: ResumeAiContext;
  entityId?: string;
  labels: {
    generate: string;
    improve: string;
    tailor: string;
    apply: string;
  };
  helpText?: string;
  onApply: (result: InlineAiResult) => void;
}

interface ApiErrorShape {
  error?: {
    message?: string;
  };
}

interface ApiSuccessShape {
  data?: InlineAiResult;
}

const modeOptions: { value: InlineAiMode; label: string }[] = [
  { value: "generate", label: "Generate fresh" },
  { value: "improve", label: "Improve existing" },
  { value: "tailor", label: "Tailor to job description" },
];

const toneOptions: { value: InlineAiTone; label: string }[] = [
  { value: "concise", label: "Concise" },
  { value: "executive", label: "Executive" },
  { value: "technical", label: "Technical" },
  { value: "entry-level", label: "Entry-level" },
];

export function InlineAiAssist({
  target,
  resume,
  entityId,
  labels,
  helpText = "Uses the rest of your resume for context.",
  onApply,
}: InlineAiAssistProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InlineAiResult | null>(null);
  const [error, setError] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [mode, setMode] = useState<InlineAiMode>("generate");
  const [tone, setTone] = useState<InlineAiTone>("concise");
  const [jobDescription, setJobDescription] = useState("");
  const [instruction, setInstruction] = useState("");

  const primaryActionLabel = result
    ? "Regenerate"
    : mode === "improve"
      ? labels.improve
      : mode === "tailor"
        ? labels.tailor
        : labels.generate;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/inline-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target,
          entityId,
          mode,
          tone,
          jobDescription,
          instruction,
          resume,
        }),
      });

      const payload = (await response.json()) as ApiErrorShape & ApiSuccessShape;

      if (!response.ok || !payload.data) {
        throw new Error(payload.error?.message || "Unable to generate AI content right now.");
      }

      setResult(payload.data);
    } catch (generationError) {
      setResult(null);
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Unable to generate AI content right now."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!result || result.status !== "ready") {
      return;
    }

    onApply(result);
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-white px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-50 disabled:cursor-wait disabled:opacity-70"
        >
          <svg className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364 6.364-2.121-2.121M8.757 8.757 6.636 6.636m11.728 0-2.121 2.121M8.757 15.243l-2.121 2.121" />
          </svg>
          {isLoading ? "Generating..." : primaryActionLabel}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOptions((current) => !current)}
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            {showOptions ? "Hide options" : "AI options"}
          </button>
          <p className="text-[11px] text-gray-400">{helpText}</p>
        </div>
      </div>

      {showOptions && (
        <div className="rounded-xl border border-gray-200 bg-white px-3 py-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                Mode
              </label>
              <select
                className="input-modern text-sm"
                value={mode}
                onChange={(event) => setMode(event.target.value as InlineAiMode)}
              >
                {modeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                Tone
              </label>
              <select
                className="input-modern text-sm"
                value={tone}
                onChange={(event) => setTone(event.target.value as InlineAiTone)}
              >
                {toneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {mode === "tailor" && (
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                Job Description
              </label>
              <textarea
                rows={4}
                className="input-modern resize-none text-sm"
                placeholder="Paste the job description here so AI can tailor this field to the role..."
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Regenerate Instruction
            </label>
            <input
              type="text"
              className="input-modern text-sm"
              placeholder="Optional: make this more results-focused"
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}

      {result?.status === "needs_context" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <p>{result.message}</p>
          {result.missingFields.length > 0 && (
            <p className="mt-1 font-medium">
              Fill first: {result.missingFields.join(", ")}
            </p>
          )}
        </div>
      )}

      {result?.status === "ready" && (
        <div className="rounded-xl border border-primary/15 bg-primary-50/40 px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-primary">
            AI Draft
          </p>
          <p className="mt-1 text-xs text-gray-500">{result.message}</p>

          {result.kind === "text" ? (
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{result.text}</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {result.items.map((item, index) => (
                <li key={`${index}-${item}`} className="flex gap-2">
                  <span className="mt-1 text-primary">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
            >
              {labels.apply}
            </button>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
