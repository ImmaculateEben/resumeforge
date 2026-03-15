"use client";

import type { PersonalDetails, PersonalDetailRow, PersonalDetailsLayout } from "@/components/templates/types";
import { SectionCollapsible } from "../shared/SectionCollapsible";
import { RemoveButton } from "../shared/RemoveButton";

interface PersonalDetailsSectionProps {
  personalDetails: PersonalDetails;
  updatePersonalDetails: (updates: Partial<PersonalDetails>) => void;
  addPersonalDetailRow: () => string;
  updatePersonalDetailRow: (id: string, updates: Partial<PersonalDetailRow>) => void;
  removePersonalDetailRow: (id: string) => void;
  open: boolean;
  onToggle: () => void;
}

const fixedFields: Array<{ key: keyof Omit<PersonalDetails, "extraDetails" | "layout">; label: string; placeholder: string }> = [
  { key: "dateOfBirth", label: "Date of Birth", placeholder: "e.g. 18th December, 1998" },
  { key: "stateOfOrigin", label: "State of Origin", placeholder: "e.g. Oyo" },
  { key: "localGovernmentArea", label: "Local Government Area", placeholder: "e.g. Akinyele" },
  { key: "sex", label: "Sex", placeholder: "e.g. Male" },
  { key: "maritalStatus", label: "Marital Status", placeholder: "e.g. Single" },
  { key: "nationality", label: "Nationality", placeholder: "e.g. Nigerian" },
  { key: "religion", label: "Religion", placeholder: "e.g. Christian" },
];

const layoutOptions: Array<{ value: PersonalDetailsLayout; label: string; description: string }> = [
  { value: "one-column", label: "1 Column", description: "Stacks details in a single vertical list." },
  { value: "two-column", label: "2 Columns", description: "Splits details across two columns to save space." },
];

export function PersonalDetailsSection({
  personalDetails,
  updatePersonalDetails,
  addPersonalDetailRow,
  updatePersonalDetailRow,
  removePersonalDetailRow,
  open,
  onToggle,
}: PersonalDetailsSectionProps) {
  const filledCount =
    fixedFields.filter(({ key }) => (personalDetails[key] || "").trim().length > 0).length +
    personalDetails.extraDetails.filter((detail) => detail.label.trim() || detail.value.trim()).length;

  return (
    <section>
      <SectionCollapsible
        title="Personal Details"
        count={filledCount}
        addLabel="Add Row"
        onAdd={addPersonalDetailRow}
        open={open}
        onClick={onToggle}
      />
      {open && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">CV layout</p>
                <p className="text-xs text-gray-500">Choose how personal details should appear in the preview and export.</p>
              </div>
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                {layoutOptions.map((option) => {
                  const active = personalDetails.layout === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={active}
                      title={option.description}
                      onClick={() => updatePersonalDetails({ layout: option.value })}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fixedFields.map((field) => (
              <label key={field.key} className="space-y-1.5">
                <span className="text-xs font-medium text-gray-500">{field.label}</span>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="input-modern"
                  value={personalDetails[field.key] || ""}
                  onChange={(e) =>
                    updatePersonalDetails({ [field.key]: e.target.value } as Partial<PersonalDetails>)
                  }
                />
              </label>
            ))}
          </div>

          <div className="space-y-2">
            {personalDetails.extraDetails.length > 0 && (
              <p className="text-xs font-medium text-gray-500">Additional Rows</p>
            )}
            {personalDetails.extraDetails.map((detail, index) => (
              <div key={detail.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Custom Detail {index + 1}</span>
                  <RemoveButton onClick={() => removePersonalDetailRow(detail.id)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[0.9fr,1.1fr] gap-3">
                  <input
                    type="text"
                    placeholder="Label"
                    className="input-modern"
                    value={detail.label}
                    onChange={(e) => updatePersonalDetailRow(detail.id, { label: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    className="input-modern"
                    value={detail.value}
                    onChange={(e) => updatePersonalDetailRow(detail.id, { value: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
