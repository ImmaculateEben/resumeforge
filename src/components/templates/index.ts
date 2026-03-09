import { createElement } from "react";

export { AtlasTemplate } from "./Atlas";
export { SummitTemplate } from "./Summit";
export { QuillTemplate } from "./Quill";
export { NorthstarTemplate } from "./Northstar";
export { RegistryTemplate } from "./Registry";
export type {
  ResumeData,
  PersonalDetails,
  PersonalDetailRow,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SkillGroup,
  CertificationItem,
  LinkItem,
  RefereeItem,
  CustomSection,
  CustomSectionEntry,
  CustomEntryStyle,
  SectionKey,
  SectionOrder,
  SectionTitles,
  StyleConfig,
  AccentColors,
  TemplateProps,
  PaperSize,
  PaperDimensions,
} from "./types";
export { accentColorMap, sampleResumeData, paperSizeMap } from "./types";

import type { TemplateProps } from "./types";
import { AtlasTemplate } from "./Atlas";
import { SummitTemplate } from "./Summit";
import { QuillTemplate } from "./Quill";
import { NorthstarTemplate } from "./Northstar";
import { RegistryTemplate } from "./Registry";

const templateRegistry: Record<string, React.ComponentType<TemplateProps>> = {
  atlas: AtlasTemplate,
  summit: SummitTemplate,
  quill: QuillTemplate,
  northstar: NorthstarTemplate,
  registry: RegistryTemplate,
};

export function getTemplateComponent(key: string): React.ComponentType<TemplateProps> {
  return templateRegistry[key] || AtlasTemplate;
}

export function renderTemplate(key: string, props: TemplateProps) {
  switch (key) {
    case "summit":
      return createElement(SummitTemplate, props);
    case "quill":
      return createElement(QuillTemplate, props);
    case "northstar":
      return createElement(NorthstarTemplate, props);
    case "registry":
      return createElement(RegistryTemplate, props);
    case "atlas":
    default:
      return createElement(AtlasTemplate, props);
  }
}
