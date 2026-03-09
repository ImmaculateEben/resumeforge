import type { PaperSize } from "@/components/templates/types";
import { paperSizeMap } from "@/components/templates";

const PAGE_MARGIN_Y_MM = 12;
const PAGE_MARGIN_X_MM = 15;

export function printResumeDocument(paperSize: PaperSize = "a4") {
  const paper = paperSizeMap[paperSize] || paperSizeMap.a4;
  const styleEl = document.createElement("style");
  styleEl.id = "print-page-size";
  styleEl.textContent = `@media print { @page { size: ${paper.cssSize}; margin: ${PAGE_MARGIN_Y_MM}mm ${PAGE_MARGIN_X_MM}mm; } }`;

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