import type { PaperSize } from "@/components/templates/types";
import { paperSizeMap } from "@/components/templates";

const PAGE_MARGIN_Y_MM = 25.4; // 1 inch
const PAGE_MARGIN_X_MM = 25.4; // 1 inch

function buildPrintStyles(paperSize: PaperSize) {
  const paper = paperSizeMap[paperSize] || paperSizeMap.a4;
  return `
    @page {
      size: ${paper.cssSize};
      margin: 0;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: white;
    }

    * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      box-sizing: border-box;
    }

    .print-root {
      width: 100%;
      margin: 0 !important;
      padding: 0 !important;
    }

    .print-root .print-area {
      width: 100% !important;
      min-height: auto !important;
      margin: 0 !important;
      /* Padding gives visible margin at top of page 1 and bottom of last page only.
         With @page margin: 0, there is zero gap at page breaks (like MS Word). */
      padding: ${PAGE_MARGIN_Y_MM}mm ${PAGE_MARGIN_X_MM}mm !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      position: static !important;
      background: white !important;
    }

    .print-root .print-document-content {
      width: auto !important;
      margin: 0 !important;
    }

    /* ── Page-break rules ── */
    /* Keep section headings glued to their first block of content.
       If fewer than ~3 lines fit before a heading, the heading + its
       first child will move to the next page together. */
    .print-document-content h2 {
      break-after: avoid;
      page-break-after: avoid;
    }

    /* Within each section the content can break freely between items */
    .print-document-content h2 + * {
      break-before: avoid;
      page-break-before: avoid;
    }

    /* Minimum 3 lines at the bottom/top of a page for text blocks */
    .print-document-content p,
    .print-document-content ul,
    .print-document-content ol {
      orphans: 3;
      widows: 3;
    }

    /* Individual list items should not break mid-item */
    .print-document-content li {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `;
}

function printFromElement(sourceEl: HTMLElement, paperSize: PaperSize) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDocument = iframe.contentDocument || frameWindow?.document;
  if (!frameWindow || !frameDocument) {
    iframe.remove();
    window.print();
    return;
  }

  frameDocument.open();
  frameDocument.write("<!DOCTYPE html><html><head><title>ResumeForge Print</title></head><body></body></html>");
  frameDocument.close();

  for (const node of document.querySelectorAll('style, link[rel="stylesheet"]')) {
    frameDocument.head.appendChild(node.cloneNode(true));
  }

  const printStyle = frameDocument.createElement("style");
  printStyle.textContent = buildPrintStyles(paperSize);
  frameDocument.head.appendChild(printStyle);

  const root = frameDocument.createElement("div");
  root.className = "print-root";
  root.appendChild(sourceEl.cloneNode(true));
  frameDocument.body.appendChild(root);

  const cleanup = () => {
    iframe.remove();
  };

  frameWindow.addEventListener("afterprint", cleanup, { once: true });
  window.setTimeout(cleanup, 3000);
  window.setTimeout(() => {
    frameWindow.focus();
    frameWindow.print();
  }, 250);
}

export function printResumeDocument(
  paperSize: PaperSize = "a4",
  sourceEl?: HTMLElement | null
) {
  if (sourceEl) {
    printFromElement(sourceEl, paperSize);
    return;
  }

  const styleEl = document.createElement("style");
  styleEl.id = "print-page-size";
  styleEl.textContent = `@media print { @page { size: ${(paperSizeMap[paperSize] || paperSizeMap.a4).cssSize}; margin: 0; } }`;

  const existing = document.getElementById(styleEl.id);
  existing?.remove();
  document.head.appendChild(styleEl);

  const cleanup = () => {
    document.getElementById(styleEl.id)?.remove();
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();

  window.setTimeout(cleanup, 1500);
}
