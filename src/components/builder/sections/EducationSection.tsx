"use client";

import type { EducationItem } from "@/components/templates/types";
import { SectionCollapsible } from "../shared/SectionCollapsible";
import { EmptyState } from "../shared/EmptyState";
import { MoveButton } from "../shared/MoveButton";
import { RemoveButton } from "../shared/RemoveButton";
import { BulletList } from "../shared/BulletList";

interface EducationSectionProps {
  education: EducationItem[];
  addEducation: () => string;
  updateEducation: (id: string, updates: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  moveEducation: (id: string, direction: "up" | "down") => void;
  addBullet: (section: "education", itemId: string) => void;
  updateBullet: (section: "education", itemId: string, idx: number, text: string) => void;
  removeBullet: (section: "education", itemId: string, idx: number) => void;
  open: boolean;
  onToggle: () => void;
}

export function EducationSection({
  education, addEducation, updateEducation, removeEducation, moveEducation,
  addBullet, updateBullet, removeBullet, open, onToggle,
}: EducationSectionProps) {
  return (
    <section>
      <SectionCollapsible
        title="Education"
        count={education.length}
        onAdd={addEducation}
        open={open}
        onClick={onToggle}
      />
      {open && (
        <div className="space-y-3 animate-fade-in">
          {education.length === 0 && <EmptyState text="Add your education" onClick={addEducation} />}
          {education.map((edu, idx) => (
            <div key={edu.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Education {idx + 1}</span>
                <div className="flex gap-1">
                  <MoveButton onClick={() => moveEducation(edu.id, "up")} disabled={idx === 0} direction="up" />
                  <MoveButton onClick={() => moveEducation(edu.id, "down")} disabled={idx === education.length - 1} direction="down" />
                  <RemoveButton onClick={() => removeEducation(edu.id)} />
                </div>
              </div>
              <input type="text" placeholder="Degree" className="input-modern" value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} />
              <input type="text" placeholder="Institution" className="input-modern" value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Field of Study" className="input-modern" value={edu.fieldOfStudy || ""} onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })} />
                <input type="text" placeholder="Location" className="input-modern" value={edu.location || ""} onChange={(e) => updateEducation(edu.id, { location: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Start Date" className="input-modern" value={edu.startDate || ""} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} />
                <input type="text" placeholder="End Date" className="input-modern" value={edu.endDate || ""} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} />
              </div>
              <BulletList
                bullets={edu.bullets}
                onAdd={() => addBullet("education", edu.id)}
                onUpdate={(i, t) => updateBullet("education", edu.id, i, t)}
                onRemove={(i) => removeBullet("education", edu.id, i)}
                max={5}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
