import { render } from "@testing-library/react";
import { ResumeLivePreview, TemplateThumbnail } from "@/components/resume-preview";
import {
  PREVIEW_TEMPLATE_IDS,
  SAMPLE_PREVIEW_DATA,
  SAMPLE_PREVIEW_TITLE,
} from "@/test-fixtures/resume-preview";

describe("TemplateThumbnail", () => {
  it.each(PREVIEW_TEMPLATE_IDS)("matches the %s snapshot", (templateId) => {
    const { asFragment } = render(
      <div className="relative h-64 w-48">
        <TemplateThumbnail templateId={templateId} />
      </div>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe("ResumeLivePreview", () => {
  it.each(PREVIEW_TEMPLATE_IDS)("matches the %s snapshot", (templateId) => {
    const { asFragment } = render(
      <ResumeLivePreview
        templateId={templateId}
        title={SAMPLE_PREVIEW_TITLE}
        data={SAMPLE_PREVIEW_DATA}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
