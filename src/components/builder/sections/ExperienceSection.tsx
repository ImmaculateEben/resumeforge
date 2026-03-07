"use client";

import type { ExperienceItem } from "@/components/templates/types";
import { SectionCollapsible } from "../shared/SectionCollapsible";
import { EmptyState } from "../shared/EmptyState";
import { MoveButton } from "../shared/MoveButton";
import { RemoveButton } from "../shared/RemoveButton";
import { BulletList } from "../shared/BulletList";

interface ExperienceSectionProps {
  experience: ExperienceItem[];
  addExperience: () => string;
  updateExperience: (id: string, updates: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, direction: "up" | "down") => void;
  addBullet: (section: "experience", itemId: string) => void;
  updateBullet: (section: "experience", itemId: string, idx: number, text: string) => void;
  removeBullet: (section: "experience", itemId: string, idx: number) => void;
  open: boolean;
  onToggle: () => void;
}

export function ExperienceSection({
  experience, addExperience, updateExperience, removeExperience, moveExperience,
  addBullet, updateBullet, removeBullet, open, onToggle,
}: ExperienceSectionProps) {
  return (
    <section>
      <SectionCollapsible
        title="Experience"
        count={experience.length}
        onAdd={addExperience}
        open={open}
        onClick={onToggle}
      />
      {open && (
        <div className="space-y-3 animate-fade-in">
          {experience.length === 0 && <EmptyState text="Add your work experience" onClick={addExperience} />}
          {experience.map((exp, idx) => (
            <div key={exp.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Experience {idx + 1}</span>
                <div className="flex gap-1">
                  <MoveButton onClick={() => moveExperience(exp.id, "up")} disabled={idx === 0} direction="up" />
                  <MoveButton onClick={() => moveExperience(exp.id, "down")} disabled={idx === experience.length - 1} direction="down" />
                  <RemoveButton onClick={() => removeExperience(exp.id)} />
                </div>
              </div>
              <input type="text" placeholder="Position / Job Title" className="input-modern" value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} />
              <input type="text" placeholder="Company" className="input-modern" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
              <input type="text" placeholder="Location" className="input-modern" value={exp.location || ""} onChange={(e) => updateExperience(exp.id, { location: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Start (e.g. 2023-01)" className="input-modern" value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} />
                <input type="text" placeholder={exp.current ? "Present" : "End Date"} className="input-modern" value={exp.current ? "" : exp.endDate || ""} disabled={exp.current} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.current || false}
                  onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: "" })}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary/30"
                />
                <span className="text-xs text-gray-600">I currently work here</span>
              </label>
              <BulletList
                bullets={exp.bullets}
                onAdd={() => addBullet("experience", exp.id)}
                onUpdate={(i, t) => updateBullet("experience", exp.id, i, t)}
                onRemove={(i) => removeBullet("experience", exp.id, i)}
                max={8}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
