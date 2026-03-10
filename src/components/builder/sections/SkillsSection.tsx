"use client";

import { useState } from "react";
import type { SkillGroup } from "@/components/templates/types";
import type { ResumeAiContext } from "@/modules/validation";
import { SectionCollapsible } from "../shared/SectionCollapsible";
import { EmptyState } from "../shared/EmptyState";
import { RemoveButton } from "../shared/RemoveButton";
import { InlineAiAssist } from "../shared/InlineAiAssist";

interface SkillsSectionProps {
  skills: SkillGroup[];
  resume: ResumeAiContext;
  addSkillGroup: () => string;
  updateSkillGroup: (id: string, updates: Partial<SkillGroup>) => void;
  removeSkillGroup: (id: string) => void;
  addSkillItem: (groupId: string, item: string) => void;
  removeSkillItem: (groupId: string, index: number) => void;
  open: boolean;
  onToggle: () => void;
}

export function SkillsSection({
  skills, resume, addSkillGroup, updateSkillGroup, removeSkillGroup,
  addSkillItem, removeSkillItem, open, onToggle,
}: SkillsSectionProps) {
  const [skillInput, setSkillInput] = useState<Record<string, string>>({});

  const handleAddSkill = (groupId: string) => {
    const value = skillInput[groupId]?.trim();
    if (value) {
      addSkillItem(groupId, value);
      setSkillInput((prev) => ({ ...prev, [groupId]: "" }));
    }
  };

  return (
    <section>
      <SectionCollapsible
        title="Skills"
        count={skills.length}
        addLabel="Add Group"
        onAdd={addSkillGroup}
        open={open}
        onClick={onToggle}
      />
      {open && (
        <div className="space-y-3 animate-fade-in">
          {skills.length === 0 && <EmptyState text="Add your skill groups" onClick={addSkillGroup} />}
          {skills.map((group, idx) => (
            <div key={group.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Skill Group {idx + 1}</span>
                <RemoveButton onClick={() => removeSkillGroup(group.id)} />
              </div>
              <input
                type="text"
                placeholder="Category (e.g. Frontend)"
                className="input-modern"
                value={group.category || ""}
                onChange={(e) => updateSkillGroup(group.id, { category: e.target.value })}
              />
              <InlineAiAssist
                target="skills_group"
                resume={resume}
                entityId={group.id}
                labels={{
                  generate: "AI suggest skills",
                  improve: "AI improve skills",
                  tailor: "Tailor skills",
                  apply: group.items.length > 0 ? "Replace skills" : "Use skills",
                }}
                helpText="Suggests relevant skills from this category plus your broader resume context."
                onApply={(result) => {
                  if (result.kind === "list") {
                    updateSkillGroup(group.id, { items: result.items.slice(0, 20) });
                  }
                }}
              />
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {item}
                    <button
                      onClick={() => removeSkillItem(group.id, i)}
                      className="hover:text-red-500 ml-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a skill and press Enter"
                  className="input-modern flex-1"
                  value={skillInput[group.id] || ""}
                  onChange={(e) => setSkillInput((p) => ({ ...p, [group.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === ",") && skillInput[group.id]?.trim()) {
                      e.preventDefault();
                      handleAddSkill(group.id);
                    }
                  }}
                />
                <button onClick={() => handleAddSkill(group.id)} className="btn-ghost text-xs px-3">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
