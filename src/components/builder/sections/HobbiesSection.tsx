"use client";

import { SectionCollapsible } from "../shared/SectionCollapsible";
import { EmptyState } from "../shared/EmptyState";
import { RemoveButton } from "../shared/RemoveButton";

interface HobbiesSectionProps {
  hobbies: string[];
  addHobby: () => void;
  updateHobby: (index: number, value: string) => void;
  removeHobby: (index: number) => void;
  open: boolean;
  onToggle: () => void;
}

export function HobbiesSection({
  hobbies,
  addHobby,
  updateHobby,
  removeHobby,
  open,
  onToggle,
}: HobbiesSectionProps) {
  const filledCount = hobbies.filter((hobby) => hobby.trim().length > 0).length;

  return (
    <section>
      <SectionCollapsible
        title="Hobbies"
        count={filledCount}
        addLabel="Add Hobby"
        onAdd={addHobby}
        open={open}
        onClick={onToggle}
      />
      {open && (
        <div className="space-y-3 animate-fade-in">
          {hobbies.length === 0 && <EmptyState text="Add your hobbies or interests" onClick={addHobby} />}
          {hobbies.map((hobby, index) => (
            <div key={index} className="flex items-start gap-2">
              <input
                type="text"
                placeholder="e.g. Reading and research"
                className="input-modern flex-1"
                value={hobby}
                onChange={(e) => updateHobby(index, e.target.value)}
              />
              <div className="pt-1">
                <RemoveButton onClick={() => removeHobby(index)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
