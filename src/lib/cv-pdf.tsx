import { CVData, TemplateId } from "@/types";

function toFileName(title: string): string {
  const normalized = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return normalized ? `${normalized}.pdf` : "resume.pdf";
}

export async function downloadCVPdf(
  title: string,
  data: CVData,
  templateId: TemplateId
): Promise<void> {
  const [{ pdf }, { CVPdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/cv-pdf-document"),
  ]);
  const blob = await pdf(<CVPdfDocument title={title} data={data} templateId={templateId} />).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = toFileName(title);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
