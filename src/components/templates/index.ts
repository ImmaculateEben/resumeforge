export { AtlasTemplate } from "./Atlas";
export { SummitTemplate } from "./Summit";
export { QuillTemplate } from "./Quill";
export { NorthstarTemplate } from "./Northstar";
export type {
  ResumeData,
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
} from "./types";
export { accentColorMap, sampleResumeData } from "./types";

import type { TemplateProps } from "./types";
import { AtlasTemplate } from "./Atlas";
import { SummitTemplate } from "./Summit";
import { QuillTemplate } from "./Quill";
import { NorthstarTemplate } from "./Northstar";

const templateRegistry: Record<string, React.ComponentType<TemplateProps>> = {
  atlas: AtlasTemplate,
  summit: SummitTemplate,
  quill: QuillTemplate,
  northstar: NorthstarTemplate,
};

export function getTemplateComponent(key: string): React.ComponentType<TemplateProps> {
  return templateRegistry[key] || AtlasTemplate;
}
