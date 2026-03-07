"use client";

import type { CertificationItem } from "@/components/templates/types";
import { SectionCollapsible } from "../shared/SectionCollapsible";
import { EmptyState } from "../shared/EmptyState";
import { RemoveButton } from "../shared/RemoveButton";

interface CertificationsSectionProps {
  certifications: CertificationItem[];
  addCertification: () => string;
  updateCertification: (id: string, updates: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;
  open: boolean;
  onToggle: () => void;
}

export function CertificationsSection({
  certifications, addCertification, updateCertification, removeCertification,
  open, onToggle,
}: CertificationsSectionProps) {
  return (
    <section>
      <SectionCollapsible
        title="Certifications"
        count={certifications.length}
        onAdd={addCertification}
        open={open}
        onClick={onToggle}
      />
      {open && (
        <div className="space-y-3 animate-fade-in">
          {certifications.length === 0 && <EmptyState text="Add your certifications" onClick={addCertification} />}
          {certifications.map((cert, idx) => (
            <div key={cert.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Certification {idx + 1}</span>
                <RemoveButton onClick={() => removeCertification(cert.id)} />
              </div>
              <input type="text" placeholder="Certification Name" className="input-modern" value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Issuer" className="input-modern" value={cert.issuer || ""} onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} />
                <input type="text" placeholder="Issue Date" className="input-modern" value={cert.issueDate || ""} onChange={(e) => updateCertification(cert.id, { issueDate: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Credential ID" className="input-modern" value={cert.credentialId || ""} onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })} />
                <input type="text" placeholder="Credential URL" className="input-modern" value={cert.url || ""} onChange={(e) => updateCertification(cert.id, { url: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
