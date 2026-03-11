import type { PaperSize } from "@/components/templates/types";
import { paperSizeMap } from "@/components/templates";

const PAGE_MARGIN_Y_MM = 12;
const PAGE_MARGIN_X_MM = 15;

function buildPrintStyles(paperSize: PaperSize) {
  const paper = paperSizeMap[paperSize] || paperSizeMap.a4;
  return `
    @page {
      size: ${paper.cssSize};
      margin: ${PAGE_MARGIN_Y_MM}mm ${PAGE_MARGIN_X_MM}mm;
      margin-top: ${PAGE_MARGIN_Y_MM}mm !important;
      margin-bottom: ${PAGE_MARGIN_Y_MM}mm !important;
    }

    @page :first {
      margin-top: ${PAGE_MARGIN_Y_MM}mm;
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
      padding: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      position: static !important;
      background: white !important;
    }

    .print-root .print-document-content {
      width: auto !important;
      margin: 0 !important;
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
  styleEl.textContent = `@media print { @page { size: ${(paperSizeMap[paperSize] || paperSizeMap.a4).cssSize}; margin: ${PAGE_MARGIN_Y_MM}mm ${PAGE_MARGIN_X_MM}mm; } }`;

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
