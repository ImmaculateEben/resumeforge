"use client";

import type { ResumeData } from "@/components/templates/types";
import { SectionToggle } from "../shared/SectionToggle";

interface PersonalInfoSectionProps {
  basics: ResumeData["basics"];
  updateBasics: (updates: Partial<ResumeData["basics"]>) => void;
  open: boolean;
  onToggle: () => void;
}

export function PersonalInfoSection({ basics, updateBasics, open, onToggle }: PersonalInfoSectionProps) {
  return (
    <section>
      <SectionToggle title="Personal Information" open={open} onClick={onToggle} />
      {open && (
        <div className="space-y-3 animate-fade-in">
          <input
            type="text"
            placeholder="Full Name *"
            className="input-modern"
            value={basics.fullName}
            onChange={(e) => updateBasics({ fullName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email Address *"
            className="input-modern"
            value={basics.email}
            onChange={(e) => updateBasics({ email: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="tel"
              placeholder="Phone"
              className="input-modern"
              value={basics.phone || ""}
              onChange={(e) => updateBasics({ phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              className="input-modern"
              value={basics.location || ""}
              onChange={(e) => updateBasics({ location: e.target.value })}
            />
          </div>
          <input
            type="text"
            placeholder="Job Title"
            className="input-modern"
            value={basics.jobTitle || ""}
            onChange={(e) => updateBasics({ jobTitle: e.target.value })}
          />
          <input
            type="text"
            placeholder="Website / LinkedIn"
            className="input-modern"
            value={basics.website || ""}
            onChange={(e) => updateBasics({ website: e.target.value })}
          />
        </div>
      )}
    </section>
  );
}
