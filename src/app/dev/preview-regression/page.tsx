import { ResumeLivePreview, TemplateThumbnail } from "@/components/resume-preview";
import {
  PREVIEW_TEMPLATE_IDS,
  SAMPLE_PREVIEW_DATA,
  SAMPLE_PREVIEW_TITLE,
} from "@/test-fixtures/resume-preview";
import { TEMPLATES } from "@/types";

export default function PreviewRegressionPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Visual Regression Gallery
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Template Preview Baselines</h1>
          <p className="mt-2 text-sm text-slate-600">
            Stable screenshot surface for Playwright snapshot diffs.
          </p>
        </header>

        <div className="space-y-10">
          {PREVIEW_TEMPLATE_IDS.map((templateId) => {
            const template = TEMPLATES.find((entry) => entry.id === templateId);

            return (
              <section
                key={templateId}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-slate-900">{template?.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{template?.description}</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
                  <div
                    data-testid={`${templateId}-thumbnail`}
                    className="mx-auto h-[320px] w-[220px] rounded-2xl bg-slate-100 p-3"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-200">
                      <TemplateThumbnail templateId={templateId} className="m-2" />
                    </div>
                  </div>

                  <div
                    data-testid={`${templateId}-preview`}
                    className="mx-auto w-full max-w-[760px] rounded-3xl bg-slate-100 p-5"
                  >
                    <ResumeLivePreview
                      templateId={templateId}
                      title={SAMPLE_PREVIEW_TITLE}
                      data={SAMPLE_PREVIEW_DATA}
                    />
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
