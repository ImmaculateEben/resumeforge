"use client";

import type { CustomSection, CustomSectionEntry, CustomEntryStyle } from "@/components/templates/types";
import type { ResumeAiContext } from "@/modules/validation";
import { SectionCollapsible } from "../shared/SectionCollapsible";
import { EmptyState } from "../shared/EmptyState";
import { RemoveButton } from "../shared/RemoveButton";
import { entryStyleOptions } from "../constants";
import { InlineAiAssist } from "../shared/InlineAiAssist";
import { BulletList } from "../shared/BulletList";

interface CustomSectionsSectionProps {
  customSections: CustomSection[];
  resume: ResumeAiContext;
  addCustomSection: () => string;
  updateCustomSection: (id: string, updates: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  addCustomEntry: (sectionId: string) => string;
  updateCustomEntry: (sectionId: string, entryId: string, updates: Partial<CustomSectionEntry>) => void;
  removeCustomEntry: (sectionId: string, entryId: string) => void;
  open: boolean;
  onToggle: () => void;
}

export function CustomSectionsSection({
  customSections, resume, addCustomSection, updateCustomSection, removeCustomSection,
  addCustomEntry, updateCustomEntry, removeCustomEntry, open, onToggle,
}: CustomSectionsSectionProps) {
  const addCustomBullet = (sectionId: string, entry: CustomSectionEntry) => {
    updateCustomEntry(sectionId, entry.id, {
      bullets: [...(entry.bullets || []), ""],
    });
  };

  const updateCustomBullet = (sectionId: string, entry: CustomSectionEntry, index: number, value: string) => {
    updateCustomEntry(sectionId, entry.id, {
      bullets: (entry.bullets || []).map((bullet, bulletIndex) => (bulletIndex === index ? value : bullet)),
    });
  };

  const removeCustomBullet = (sectionId: string, entry: CustomSectionEntry, index: number) => {
    updateCustomEntry(sectionId, entry.id, {
      bullets: (entry.bullets || []).filter((_, bulletIndex) => bulletIndex !== index),
    });
  };

  return (
    <section>
      <SectionCollapsible
        title="Custom Sections"
        count={customSections.length}
        addLabel="Add Section"
        onAdd={customSections.length < 3 ? addCustomSection : undefined}
        open={open}
        onClick={onToggle}
      />
      {open && (
        <div className="space-y-3 animate-fade-in">
          {customSections.length === 0 && (
            <EmptyState text="Add a custom section (e.g. Awards, Languages)" onClick={addCustomSection} />
          )}
          {customSections.map((section, sIdx) => (
            <div key={section.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Custom Section {sIdx + 1}</span>
                <RemoveButton onClick={() => removeCustomSection(section.id)} />
              </div>
              <input
                type="text"
                placeholder="Section Title (e.g. Awards)"
                className="input-modern font-medium"
                value={section.title}
                onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Display Style</label>
                <select
                  className="input-modern text-sm"
                  value={section.entryStyle}
                  onChange={(e) => updateCustomSection(section.id, { entryStyle: e.target.value as CustomEntryStyle })}
                >
                  {entryStyleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} - {opt.desc}
                    </option>
                  ))}
                </select>
              </div>
              {section.entries.map((entry, eIdx) => (
                <div key={entry.id} className="p-3 rounded-lg border border-gray-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-gray-400">Entry {eIdx + 1}</span>
                    <RemoveButton onClick={() => removeCustomEntry(section.id, entry.id)} small />
                  </div>
                  <input type="text" placeholder="Heading" className="input-modern text-sm" value={entry.heading} onChange={(e) => updateCustomEntry(section.id, entry.id, { heading: e.target.value })} />
                  <InlineAiAssist
                    target="custom_entry_heading"
                    resume={resume}
                    entityId={entry.id}
                    labels={{
                      generate: "AI draft heading",
                      improve: "AI improve heading",
                      tailor: "Tailor heading",
                      apply: entry.heading.trim() ? "Replace heading" : "Use heading",
                    }}
                    helpText="Writes a heading that fits this custom section and the rest of your resume."
                    onApply={(result) => {
                      if (result.kind === "text") {
                        updateCustomEntry(section.id, entry.id, { heading: result.text });
                      }
                    }}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Subheading" className="input-modern text-sm" value={entry.subheading || ""} onChange={(e) => updateCustomEntry(section.id, entry.id, { subheading: e.target.value })} />
                    <input type="text" placeholder="Date Range" className="input-modern text-sm" value={entry.dateRange || ""} onChange={(e) => updateCustomEntry(section.id, entry.id, { dateRange: e.target.value })} />
                  </div>
                  {section.entryStyle === "standard" && (
                    <>
                      <textarea
                        rows={3}
                        placeholder="Description"
                        className="input-modern resize-none text-sm"
                        value={entry.description || ""}
                        maxLength={300}
                        onChange={(e) => updateCustomEntry(section.id, entry.id, { description: e.target.value })}
                      />
                      <InlineAiAssist
                        target="custom_entry_description"
                        resume={resume}
                        entityId={entry.id}
                        labels={{
                          generate: "AI draft description",
                          improve: "AI improve description",
                          tailor: "Tailor description",
                          apply: entry.description?.trim() ? "Replace description" : "Use description",
                        }}
                        helpText="Writes a short description for this custom entry from the section context and your resume."
                        onApply={(result) => {
                          if (result.kind === "text") {
                            updateCustomEntry(section.id, entry.id, { description: result.text });
                          }
                        }}
                      />
                      <BulletList
                        bullets={entry.bullets || []}
                        onAdd={() => addCustomBullet(section.id, entry)}
                        onUpdate={(index, value) => updateCustomBullet(section.id, entry, index, value)}
                        onRemove={(index) => removeCustomBullet(section.id, entry, index)}
                        max={8}
                        aiAssist={{
                          target: "custom_entry_bullets",
                          resume,
                          entityId: entry.id,
                          onApply: (bullets) => updateCustomEntry(section.id, entry.id, { bullets }),
                        }}
                      />
                    </>
                  )}
                </div>
              ))}
              <button
                onClick={() => addCustomEntry(section.id)}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark px-2 py-1 rounded-md hover:bg-primary-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Entry
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
