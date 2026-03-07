"use client";

import type { LinkItem } from "@/components/templates/types";
import { SectionCollapsible } from "../shared/SectionCollapsible";
import { EmptyState } from "../shared/EmptyState";
import { RemoveButton } from "../shared/RemoveButton";

interface LinksSectionProps {
  links: LinkItem[];
  addLink: () => string;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  removeLink: (id: string) => void;
  open: boolean;
  onToggle: () => void;
}

export function LinksSection({
  links, addLink, updateLink, removeLink, open, onToggle,
}: LinksSectionProps) {
  return (
    <section>
      <SectionCollapsible
        title="Links"
        count={links.length}
        onAdd={addLink}
        open={open}
        onClick={onToggle}
      />
      {open && (
        <div className="space-y-3 animate-fade-in">
          {links.length === 0 && <EmptyState text="Add relevant links" onClick={addLink} />}
          {links.map((link) => (
            <div key={link.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input type="text" placeholder="Label (e.g. GitHub)" className="input-modern text-sm" value={link.label} onChange={(e) => updateLink(link.id, { label: e.target.value })} />
                <input type="text" placeholder="URL" className="input-modern text-sm" value={link.url} onChange={(e) => updateLink(link.id, { url: e.target.value })} />
              </div>
              <RemoveButton onClick={() => removeLink(link.id)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
