"use client";

import type { RefereeItem } from "@/components/templates/types";
import { SectionCollapsible } from "../shared/SectionCollapsible";
import { EmptyState } from "../shared/EmptyState";
import { RemoveButton } from "../shared/RemoveButton";

interface RefereesSectionProps {
  referees: RefereeItem[];
  addReferee: () => string;
  updateReferee: (id: string, updates: Partial<RefereeItem>) => void;
  removeReferee: (id: string) => void;
  open: boolean;
  onToggle: () => void;
}

export function RefereesSection({
  referees, addReferee, updateReferee, removeReferee, open, onToggle,
}: RefereesSectionProps) {
  return (
    <section>
      <SectionCollapsible
        title="References"
        count={referees.length}
        onAdd={addReferee}
        open={open}
        onClick={onToggle}
      />
      {open && (
        <div className="space-y-3 animate-fade-in">
          {referees.length === 0 && <EmptyState text="Add your references" onClick={addReferee} />}
          {referees.map((ref, idx) => (
            <div key={ref.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Reference {idx + 1}</span>
                <RemoveButton onClick={() => removeReferee(ref.id)} />
              </div>
              <input type="text" placeholder="Full Name" className="input-modern" value={ref.name} onChange={(e) => updateReferee(ref.id, { name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Position / Title" className="input-modern" value={ref.position || ""} onChange={(e) => updateReferee(ref.id, { position: e.target.value })} />
                <input type="text" placeholder="Organization" className="input-modern" value={ref.organization || ""} onChange={(e) => updateReferee(ref.id, { organization: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="email" placeholder="Email" className="input-modern" value={ref.email || ""} onChange={(e) => updateReferee(ref.id, { email: e.target.value })} />
                <input type="tel" placeholder="Phone" className="input-modern" value={ref.phone || ""} onChange={(e) => updateReferee(ref.id, { phone: e.target.value })} />
              </div>
              <input type="text" placeholder="Relationship (e.g. Former Manager)" className="input-modern" value={ref.relationship || ""} onChange={(e) => updateReferee(ref.id, { relationship: e.target.value })} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
