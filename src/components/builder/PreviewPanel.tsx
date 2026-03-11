"use client";

import {
  useMemo,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
  type RefObject,
  type ReactNode,
} from "react";
import type { useResume } from "@/hooks/use-resume";
import type { ResumeData } from "@/components/templates/types";
import { paperSizeMap } from "@/components/templates/types";
import { renderTemplate, accentColorMap, sampleResumeData } from "@/components/templates";
import { printResumeDocument } from "@/lib/print";

/**
 * Walk all descendant leaf-level block elements inside `root` and push any that
 * straddle a page boundary entirely onto the next page by adding a top-padding
 * spacer. Works on the real DOM so React never interferes.
 */
function nudgePageBreaks(root: HTMLElement, pageHeight: number): void {
  // Reset every nudge applied by a previous call.
  root.querySelectorAll<HTMLElement>("[data-page-nudge]").forEach((el) => {
    el.style.paddingTop = el.getAttribute("data-page-nudge-original-pt") ?? "";
    el.removeAttribute("data-page-nudge");
    el.removeAttribute("data-page-nudge-original-pt");
  });

  const SELECTORS = ["p", "li", "h2", "h3", "h4", "tr", "blockquote"].join(",");
  const rootTop = root.getBoundingClientRect().top;

  root.querySelectorAll<HTMLElement>(SELECTORS).forEach((el) => {
    const rect = el.getBoundingClientRect();
    const elTop = rect.top - rootTop;
    const elBottom = rect.bottom - rootTop;

    const pageStart = Math.floor(elTop / pageHeight);
    const pageEnd = Math.floor((elBottom - 1) / pageHeight);

    if (pageStart !== pageEnd) {
      const nextPageTop = (pageStart + 1) * pageHeight;
      const gap = nextPageTop - elTop;

      let target: HTMLElement = el;
      const parent = el.parentElement;
      if (
        parent &&
        parent !== root &&
        window.getComputedStyle(parent).display !== "inline"
      ) {
        const blockChildren = Array.from(parent.children).filter(
          (c) => window.getComputedStyle(c as HTMLElement).display !== "none"
        );
        if (blockChildren.length === 1) target = parent;
      }

      const currentPt = parseFloat(window.getComputedStyle(target).paddingTop) || 0;
      if (!target.hasAttribute("data-page-nudge")) {
        target.setAttribute("data-page-nudge", "1");
        target.setAttribute("data-page-nudge-original-pt", target.style.paddingTop ?? "");
      }
      target.style.paddingTop = `${currentPt + gap}px`;
    }
  });
}

// ─── PageContent ─────────────────────────────────────────────────────────────
// Renders the template content for one page and applies nudgePageBreaks to its
// own DOM after every render. This is the key fix: each page copy gets nudged
// independently so nothing ever straddles a page boundary in the visible preview.

interface PageContentProps {
  renderContent: () => ReactNode;
  contentWidthPx: number;
  contentHeightPerPage: number;
}

function PageContent({ renderContent, contentWidthPx, contentHeightPerPage }: PageContentProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Run after every render so nudges are always current.
  useLayoutEffect(() => {
    if (ref.current) nudgePageBreaks(ref.current, contentHeightPerPage);
  });

  return (
    <div
      ref={ref}
      className="print-document-content"
      style={{ width: `${contentWidthPx}px`, margin: "0 auto" }}
    >
      {renderContent()}
    </div>
  );
}

// ─── PreviewPanel ─────────────────────────────────────────────────────────────

interface PreviewPanelProps {
  resume: ReturnType<typeof useResume>;
  previewRef: RefObject<HTMLDivElement | null>;
}

const PAD_X_PX = 96; // 1 inch at 96 dpi
const PAD_Y_PX = 96;

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
      const availableWidth = containerRef.clientWidth - 32;
      setScale(availableWidth < pageWidthPx ? availableWidth / pageWidthPx : 1);
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(containerRef);
    return () => ro.disconnect();
  }, [containerRef, pageWidthPx]);

  // Use the hidden measuring div to compute page count after nudging.
  useLayoutEffect(() => {
    const el = contentMeasureRef.current;
    if (!el) return;
    nudgePageBreaks(el, contentHeightPerPage);
    const pages = Math.max(1, Math.ceil(el.scrollHeight / contentHeightPerPage));
    setPageCount(pages);
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
    [accentColors, previewData, resume.documentType, resume.sectionOrder, resume.sectionTitles, resume.styleConfig]
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
      {/* Preview Header */}
      <div className="w-full flex items-center justify-between mb-3 sm:mb-4 print:hidden" style={{ maxWidth: `${paper.widthMm}mm` }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Live Preview</span>
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
          <button onClick={handlePrint} className="btn-ghost text-xs px-2 sm:px-3 py-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008H15.75V12z" />
            </svg>
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Hidden measuring layer — used only to compute page count */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-0 w-full overflow-hidden pointer-events-none opacity-0"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          ref={contentMeasureRef}
          className="print-document-content"
          style={{ width: `${contentWidthPx}px`, margin: "0 auto" }}
        >
          {renderDocumentContent()}
        </div>
      </div>

      {/*
        Screen preview — stacked page cards.

        Each page card:
          • Is a white box (pageWidthPx × pageHeightPx) with shadow + border
          • Has overflow:hidden so content outside its bounds is clipped
          • Contains a PageContent that applies nudgePageBreaks to itself, so
            elements are pushed off page boundaries before the clip applies
          • Uses translateY(-i * contentHeightPerPage) to offset the content
            so the right page-slice shows through the clip

        Because nudgePageBreaks runs inside each PageContent, sliced elements
        get extra top-padding and slide fully onto the next page — matching
        what the measuring div calculated for pageCount.
      */}
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
          style={{ width: `${pageWidthPx}px`, height: `${previewStackHeightPx}px` }}
        >
          {Array.from({ length: pageCount }, (_, i) => (
            <div
              key={i}
              className="absolute left-0 rounded-sm bg-white shadow-xl ring-1 ring-black/5 overflow-hidden"
              style={{
                top: `${i * (pageHeightPx + pageGapPx)}px`,
                width: `${pageWidthPx}px`,
                height: `${pageHeightPx}px`,
              }}
            >
              {/*
                Shift content upward so page i's slice aligns with the top
                of this card's clip rect.

                Layout inside the card:
                  [PAD_Y_PX top margin]
                  [clip rect: contentHeightPerPage tall, overflow:hidden]
                    → content translated up by i * contentHeightPerPage

                The content itself has been nudge-adjusted by PageContent so
                no element straddles the boundary at multiples of contentHeightPerPage.
              */}
              <div
                style={{
                  position: "absolute",
                  top: `${PAD_Y_PX}px`,
                  left: 0,
                  width: "100%",
                  height: `${contentHeightPerPage}px`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    transform: `translateY(-${i * contentHeightPerPage}px)`,
                    // Height must accommodate full nudged content, not just one page
                    minHeight: `${pageCount * contentHeightPerPage}px`,
                  }}
                >
                  <PageContent
                    renderContent={renderDocumentContent}
                    contentWidthPx={contentWidthPx}
                    contentHeightPerPage={contentHeightPerPage}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print-only document */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", left: "-9999px", top: 0, pointerEvents: "none", visibility: "hidden" }}
      >
        <div
          ref={previewRef}
          className="print-area bg-white relative"
          data-paper-size={paperSize}
          style={{ width: `${pageWidthPx}px`, minHeight: `${previewHeightPx}px` }}
        >
          <div
            className="print-document-content"
            style={{ width: `${contentWidthPx}px`, margin: `${PAD_Y_PX}px auto` }}
          >
            {renderDocumentContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
