"use client";

import type { CustomSection, CustomSectionEntry, CustomEntryStyle } from "@/components/templates/types";
import { SectionCollapsible } from "../shared/SectionCollapsible";
import { EmptyState } from "../shared/EmptyState";
import { RemoveButton } from "../shared/RemoveButton";
import { entryStyleOptions } from "../constants";

interface CustomSectionsSectionProps {
  customSections: CustomSection[];
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
  customSections, addCustomSection, updateCustomSection, removeCustomSection,
  addCustomEntry, updateCustomEntry, removeCustomEntry, open, onToggle,
}: CustomSectionsSectionProps) {
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
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Subheading" className="input-modern text-sm" value={entry.subheading || ""} onChange={(e) => updateCustomEntry(section.id, entry.id, { subheading: e.target.value })} />
                    <input type="text" placeholder="Date Range" className="input-modern text-sm" value={entry.dateRange || ""} onChange={(e) => updateCustomEntry(section.id, entry.id, { dateRange: e.target.value })} />
                  </div>
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
