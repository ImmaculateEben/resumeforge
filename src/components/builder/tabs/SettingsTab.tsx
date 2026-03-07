"use client";

import { useState, useRef } from "react";
import type { SectionOrder, SectionTitles, SectionKey } from "@/components/templates/types";
import { sectionLabels, cvOnlySections } from "../constants";
import { MoveButton } from "../shared/MoveButton";

interface SettingsTabProps {
  documentType: "resume" | "cv";
  setDocumentType: (type: "resume" | "cv") => void;
  sectionOrder: SectionOrder[];
  moveSection: (key: SectionKey, direction: "up" | "down") => void;
  toggleSectionVisibility: (key: SectionKey) => void;
  sectionTitles: SectionTitles;
  updateSectionTitle: (key: keyof SectionTitles, title: string) => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => boolean;
  clearAll: () => void;
}

export function SettingsTab({
  documentType, setDocumentType, sectionOrder, moveSection,
  toggleSectionVisibility, sectionTitles, updateSectionTitle,
  exportJSON, importJSON, clearAll,
}: SettingsTabProps) {
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [confirmClear, setConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = importJSON(ev.target?.result as string);
      setImportStatus(result ? "success" : "error");
      setTimeout(() => setImportStatus("idle"), 3000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const filteredSections = sectionOrder.filter((s) => {
    if (documentType === "resume" && cvOnlySections.includes(s.key)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Document Type */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Document Type</h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setDocumentType("resume")}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${
              documentType === "resume"
                ? "bg-primary/10 text-primary"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Resume
          </button>
          <button
            onClick={() => setDocumentType("cv")}
            className={`flex-1 py-2.5 text-sm font-medium transition-all border-l border-gray-200 ${
              documentType === "cv"
                ? "bg-primary/10 text-primary"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            CV
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {documentType === "resume"
            ? "Concise format, typically 1-2 pages"
            : "Comprehensive format with references section"}
        </p>
      </section>

      {/* Section Order */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Section Order</h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="space-y-1">
          {filteredSections.map((section, idx) => (
            <div
              key={section.key}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                !section.visible ? "opacity-40" : "hover:bg-gray-50"
              }`}
            >
              <button
                onClick={() => toggleSectionVisibility(section.key)}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
                title={section.visible ? "Hide section" : "Show section"}
              >
                {section.visible ? (
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
              <span className="flex-1 text-sm font-medium text-gray-700">
                {sectionLabels[section.key]}
              </span>
              <div className="flex gap-0.5">
                <MoveButton
                  direction="up"
                  onClick={() => moveSection(section.key, "up")}
                  disabled={idx === 0}
                />
                <MoveButton
                  direction="down"
                  onClick={() => moveSection(section.key, "down")}
                  disabled={idx === filteredSections.length - 1}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Title Overrides */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Section Titles</h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <p className="text-xs text-gray-400 mb-3">Override default section headings on your resume</p>
        <div className="space-y-2">
          {filteredSections
            .filter((s) => s.visible)
            .map((section) => (
              <div key={section.key} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-24 shrink-0">{sectionLabels[section.key]}</span>
                <input
                  type="text"
                  placeholder={sectionLabels[section.key]}
                  className="input-modern text-sm flex-1"
                  value={(sectionTitles as Record<string, string | undefined>)[section.key] || ""}
                  onChange={(e) => updateSectionTitle(section.key as keyof SectionTitles, e.target.value)}
                />
              </div>
            ))}
        </div>
      </section>

      {/* Import / Export */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Data</h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="space-y-2">
          <button onClick={exportJSON} className="btn-secondary text-sm w-full justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export as JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary text-sm w-full justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Import from JSON
          </button>
          {importStatus !== "idle" && (
            <p className={`text-xs font-medium text-center py-1.5 rounded-lg ${
              importStatus === "success"
                ? "text-emerald-600 bg-emerald-50"
                : "text-red-600 bg-red-50"
            }`}>
              {importStatus === "success" ? "Import successful" : "Import failed - invalid file"}
            </p>
          )}
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-red-500">Danger Zone</h2>
          <div className="flex-1 h-px bg-red-100" />
        </div>
        <button
          onClick={() => {
            if (confirmClear) {
              clearAll();
              setConfirmClear(false);
            } else {
              setConfirmClear(true);
            }
          }}
          onBlur={() => setConfirmClear(false)}
          className={`text-sm font-medium w-full px-4 py-2.5 rounded-lg border transition-all ${
            confirmClear
              ? "bg-red-50 border-red-300 text-red-600"
              : "border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200"
          }`}
        >
          {confirmClear ? "Click again to confirm" : "Clear All Data"}
        </button>
        {confirmClear && (
          <p className="text-xs text-red-400 mt-1.5 text-center">
            This will permanently erase all resume data
          </p>
        )}
      </section>
    </div>
  );
}
