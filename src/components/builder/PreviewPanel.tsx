"use client";

import { useMemo, useEffect, useState, useCallback, type RefObject } from "react";
import type { useResume } from "@/hooks/use-resume";
import type { ResumeData } from "@/components/templates/types";
import { paperSizeMap } from "@/components/templates/types";
import { renderTemplate, resolveAccentColors, sampleResumeData } from "@/components/templates";
import { printResumeDocument } from "@/lib/print";

interface PreviewPanelProps {
  resume: ReturnType<typeof useResume>;
  previewRef: RefObject<HTMLDivElement | null>;
}

const PREVIEW_MARGIN_PX = 96;

export function PreviewPanel({ resume, previewRef }: PreviewPanelProps) {
  const [scale, setScale] = useState(1);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const paperSize = resume.styleConfig.paperSize || "a4";
  const paper = paperSizeMap[paperSize] || paperSizeMap.a4;
  const pageWidthPx = paper.widthPx;
  const pageHeightPx = paper.heightPx;
  const pageContentWidthPx = pageWidthPx - PREVIEW_MARGIN_PX * 2;

  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    setContainerRef(node);
  }, []);

  useEffect(() => {
    if (!containerRef) return;

    const updateScale = () => {
      const containerWidth = containerRef.clientWidth;
      const availableWidth = containerWidth - 32;
      if (availableWidth < pageWidthPx) {
        setScale(availableWidth / pageWidthPx);
      } else {
        setScale(1);
      }
    };

    updateScale();

    const ro = new ResizeObserver(updateScale);
    ro.observe(containerRef);
    return () => ro.disconnect();
  }, [containerRef, pageWidthPx]);

  const accentColors = useMemo(
    () => resolveAccentColors(resume.styleConfig.accentTone),
    [resume.styleConfig.accentTone]
  );

  const previewData: ResumeData = useMemo(() => {
    const d = resume.data;
    const s = sampleResumeData;
    return {
      basics: d.basics.fullName ? d.basics : s.basics,
      summary: d.summary && d.summary.length > 0 ? d.summary : s.summary,
      personalDetails:
        d.personalDetails &&
          (d.personalDetails.dateOfBirth ||
            d.personalDetails.stateOfOrigin ||
            d.personalDetails.localGovernmentArea ||
            d.personalDetails.sex ||
            d.personalDetails.maritalStatus ||
            d.personalDetails.nationality ||
            d.personalDetails.religion ||
            d.personalDetails.extraDetails.length > 0)
          ? d.personalDetails
          : s.personalDetails,
      experience: d.experience.length > 0 ? d.experience : s.experience,
      education: d.education.length > 0 ? d.education : s.education,
      projects: d.projects.length > 0 ? d.projects : s.projects,
      skills: d.skills.length > 0 ? d.skills : s.skills,
      certifications: d.certifications.length > 0 ? d.certifications : s.certifications,
      links: d.links.length > 0 ? d.links : s.links,
      hobbies: d.hobbies.length > 0 ? d.hobbies : s.hobbies,
      customSections: d.customSections.length > 0 ? d.customSections : s.customSections,
      referees: d.referees && d.referees.length > 0 ? d.referees : s.referees || [],
    };
  }, [resume.data]);

  const needsScale = scale < 1;
  const scaledPreviewHeightPx = pageHeightPx * scale;

  const templateProps = useMemo(
    () => ({
      data: previewData,
      styleConfig: resume.styleConfig,
      accentColors,
      documentType: resume.documentType,
      sectionOrder: resume.sectionOrder,
      sectionTitles: resume.sectionTitles,
    }),
    [
      accentColors,
      previewData,
      resume.documentType,
      resume.sectionOrder,
      resume.sectionTitles,
      resume.styleConfig,
    ]
  );

  const renderDocumentContent = useCallback(
    () => renderTemplate(resume.templateKey, templateProps),
    [resume.templateKey, templateProps]
  );

  const handlePrint = useCallback(() => {
    printResumeDocument(paperSize, previewRef.current);
  }, [paperSize, previewRef]);

  return (
    <div ref={measuredRef} className="relative p-4 sm:p-6 lg:p-8 min-h-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3 sm:mb-4 print:hidden" style={{ maxWidth: `${paper.widthMm}mm` }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
            Live Preview
          </span>
          <span className="text-xs text-gray-400 hidden sm:inline">&bull;</span>
          <span className="text-[10px] sm:text-xs text-gray-400 capitalize hidden sm:inline">{resume.templateKey}</span>
        </div>
        <div className="flex items-center gap-2">
          {needsScale && (
            <span className="text-[10px] text-gray-400">{Math.round(scale * 100)}%</span>
          )}
          <button
            onClick={handlePrint}
            className="btn-ghost text-xs px-2 sm:px-3 py-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008H15.75V12z" />
            </svg>
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="w-full flex justify-center print:hidden"
        style={needsScale ? { height: `${scaledPreviewHeightPx}px` } : undefined}
      >
        <div
          className="overflow-hidden rounded-sm bg-white shadow-xl ring-1 ring-black/5"
          style={{
            width: `${pageWidthPx}px`,
            height: `${pageHeightPx}px`,
            transform: needsScale ? `scale(${scale})` : undefined,
            transformOrigin: "top center",
          }}
        >
          <div
            className="preview-document-shell custom-scrollbar"
            style={{
              width: "100%",
              height: `${pageHeightPx}px`,
              padding: `${PREVIEW_MARGIN_PX}px`,
              boxSizing: "border-box",
              overflowX: "hidden",
              overflowY: "auto",
              overscrollBehavior: "contain",
            }}
          >
            <div
              className="print-document-content"
              style={{
                width: `${pageContentWidthPx}px`,
                maxWidth: "100%",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {renderDocumentContent()}
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{ position: "fixed", left: "-9999px", top: 0, pointerEvents: "none", visibility: "hidden" }}
      >
        <div
          ref={previewRef}
          className="print-area bg-white relative"
          data-paper-size={paperSize}
          style={{
            width: `${pageWidthPx}px`,
            minHeight: `${pageHeightPx}px`,
          }}
        >
          <div
            className="print-document-content"
            style={{
              width: "100%",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {renderDocumentContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
