"use client";

import { useMemo, type RefObject } from "react";
import type { useResume } from "@/hooks/use-resume";
import type { ResumeData } from "@/components/templates/types";
import { getTemplateComponent, accentColorMap, sampleResumeData } from "@/components/templates";

interface PreviewPanelProps {
  resume: ReturnType<typeof useResume>;
  previewRef: RefObject<HTMLDivElement | null>;
}

export function PreviewPanel({ resume, previewRef }: PreviewPanelProps) {
  const accentColors = useMemo(
    () => accentColorMap[resume.styleConfig.accentTone] || accentColorMap.slate,
    [resume.styleConfig.accentTone]
  );

  const TemplateComponent = useMemo(
    () => getTemplateComponent(resume.templateKey),
    [resume.templateKey]
  );

  const previewData: ResumeData = useMemo(() => {
    const d = resume.data;
    const s = sampleResumeData;
    return {
      basics: d.basics.fullName ? d.basics : s.basics,
      summary: d.summary && d.summary.length > 0 ? d.summary : s.summary,
      experience: d.experience.length > 0 ? d.experience : s.experience,
      education: d.education.length > 0 ? d.education : s.education,
      projects: d.projects.length > 0 ? d.projects : s.projects,
      skills: d.skills.length > 0 ? d.skills : s.skills,
      certifications: d.certifications.length > 0 ? d.certifications : s.certifications,
      links: d.links.length > 0 ? d.links : s.links,
      customSections: d.customSections.length > 0 ? d.customSections : s.customSections,
      referees: d.referees && d.referees.length > 0 ? d.referees : (s.referees || []),
    };
  }, [resume.data]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full flex flex-col items-center">
      {/* Preview Header */}
      <div className="w-full max-w-[210mm] flex items-center justify-between mb-4 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Live Preview
          </span>
          <span className="text-xs text-gray-400">&bull;</span>
          <span className="text-xs text-gray-400 capitalize">{resume.templateKey}</span>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-ghost text-xs px-3 py-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008H15.75V12z" />
          </svg>
          Print / PDF
        </button>
      </div>

      {/* A4 Preview */}
      <div
        ref={previewRef}
        className="print-area bg-white shadow-xl rounded-sm w-full max-w-[210mm] min-h-[297mm] p-10 sm:p-12 relative"
      >
        <TemplateComponent
          data={previewData}
          styleConfig={resume.styleConfig}
          accentColors={accentColors}
          documentType={resume.documentType}
          sectionOrder={resume.sectionOrder}
          sectionTitles={resume.sectionTitles}
        />
      </div>
    </div>
  );
}
