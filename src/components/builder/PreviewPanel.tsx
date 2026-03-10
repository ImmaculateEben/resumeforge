"use client";

import { useMemo, useEffect, useState, useCallback, useRef, type RefObject } from "react";
import type { useResume } from "@/hooks/use-resume";
import type { ResumeData } from "@/components/templates/types";
import { paperSizeMap } from "@/components/templates/types";
import { renderTemplate, accentColorMap, sampleResumeData } from "@/components/templates";
import { printResumeDocument } from "@/lib/print";

interface PreviewPanelProps {
  resume: ReturnType<typeof useResume>;
  previewRef: RefObject<HTMLDivElement | null>;
}

// Padding: 12mm top/bottom, 15mm left/right (converted to px at 96dpi)
const PAD_X_PX = 56.7; // 15mm
const PAD_Y_PX = 45.4; // 12mm

export function PreviewPanel({ resume, previewRef }: PreviewPanelProps) {
  const [scale, setScale] = useState(1);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const contentMeasureRef = useRef<HTMLDivElement | null>(null);

  const paperSize = resume.styleConfig.paperSize || "a4";
  const paper = paperSizeMap[paperSize] || paperSizeMap.a4;
  const pageWidthPx = paper.widthPx;
  const pageHeightPx = paper.heightPx;
  const contentWidthPx = pageWidthPx - PAD_X_PX * 2;
  const contentHeightPerPage = pageHeightPx - PAD_Y_PX * 2;
  const pageGapPx = 24;

  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    setContainerRef(node);
  }, []);

  // Scale to fit container width
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

  // Measure content height to determine page count
  useEffect(() => {
    if (!contentMeasureRef.current) return;

    const measure = () => {
      const el = contentMeasureRef.current;
      if (!el) return;
      const contentHeight = el.scrollHeight;
      const pages = Math.max(1, Math.ceil(contentHeight / contentHeightPerPage));
      setPageCount(pages);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(contentMeasureRef.current);
    return () => ro.disconnect();
  }, [contentHeightPerPage, resume.data, resume.styleConfig, resume.templateKey, resume.documentType, resume.sectionOrder, resume.sectionTitles]);

  const accentColors = useMemo(
    () => accentColorMap[resume.styleConfig.accentTone] || accentColorMap.slate,
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
      referees: d.referees && d.referees.length > 0 ? d.referees : (s.referees || []),
    };
  }, [resume.data]);

  const needsScale = scale < 1;
  const previewHeightPx = Math.max(pageHeightPx, pageCount * pageHeightPx);
  const previewStackHeightPx = previewHeightPx + Math.max(0, pageCount - 1) * pageGapPx;

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
    printResumeDocument(paperSize);
  }, [paperSize]);

  return (
    <div ref={measuredRef} className="relative p-4 sm:p-6 lg:p-8 min-h-full flex flex-col items-center">
      {/* Preview Header */}
      <div className="w-full flex items-center justify-between mb-3 sm:mb-4 print:hidden" style={{ maxWidth: `${paper.widthMm}mm` }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
            Live Preview
          </span>
          <span className="text-xs text-gray-400 hidden sm:inline">&bull;</span>
          <span className="text-[10px] sm:text-xs text-gray-400 capitalize hidden sm:inline">{resume.templateKey}</span>
          <span className="text-xs text-gray-400 hidden sm:inline">&bull;</span>
          <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">
            {pageCount} {pageCount === 1 ? "page" : "pages"}
          </span>
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

      {/* Hidden measuring layer for pagination */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-0 w-full overflow-hidden pointer-events-none opacity-0"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          ref={contentMeasureRef}
          className="print-document-content"
          style={{
            width: `${contentWidthPx}px`,
            margin: `${PAD_Y_PX}px auto`,
          }}
        >
          {renderDocumentContent()}
        </div>
      </div>

      {/* Screen preview as stacked pages */}
      <div
        aria-hidden="true"
        className="w-full flex justify-center print:hidden"
        style={needsScale ? {
          transformOrigin: "top center",
          transform: `scale(${scale})`,
          width: `${100 / scale}%`,
          marginBottom: `-${(1 - scale) * previewStackHeightPx}px`,
        } : undefined}
      >
        <div
          className="relative"
          style={{
            width: `${pageWidthPx}px`,
            height: `${previewStackHeightPx}px`,
          }}
        >
          {Array.from({ length: pageCount }, (_, i) => (
            <div
              key={i}
              className="absolute left-0 overflow-hidden rounded-sm bg-white shadow-xl ring-1 ring-black/5"
              style={{
                top: `${i * (pageHeightPx + pageGapPx)}px`,
                width: `${pageWidthPx}px`,
                height: `${pageHeightPx}px`,
              }}
            >
              <div
                className="absolute left-0 top-0"
                style={{
                  width: `${pageWidthPx}px`,
                  minHeight: `${previewHeightPx}px`,
                  transform: `translateY(-${i * pageHeightPx}px)`,
                }}
              >
                <div
                  className="print-document-content"
                  style={{
                    width: `${contentWidthPx}px`,
                    margin: `${PAD_Y_PX}px auto`,
                  }}
                >
                  {renderDocumentContent()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print-only document */}
      <div className="hidden print:block">
        <div
          ref={previewRef}
          className="print-area bg-white relative"
          data-paper-size={paperSize}
          style={{
            width: `${pageWidthPx}px`,
            minHeight: `${previewHeightPx}px`,
          }}
        >
          <div
            className="print-document-content"
            style={{
              width: `${contentWidthPx}px`,
              margin: `${PAD_Y_PX}px auto`,
            }}
          >
            {renderDocumentContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
