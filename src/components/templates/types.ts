export interface ResumeData {
  basics: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    jobTitle?: string;
    website?: string;
  };
  summary: string;
  personalDetails: PersonalDetails;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  certifications: CertificationItem[];
  links: LinkItem[];
  hobbies: string[];
  referees: RefereeItem[];
  customSections: CustomSection[];
}

export interface PersonalDetailRow {
  id: string;
  label: string;
  value: string;
}

export interface PersonalDetails {
  dateOfBirth?: string;
  stateOfOrigin?: string;
  localGovernmentArea?: string;
  sex?: string;
  maritalStatus?: string;
  nationality?: string;
  religion?: string;
  extraDetails: PersonalDetailRow[];
}

export interface RefereeItem {
  id: string;
  name: string;
  position?: string;
  organization?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export type CustomEntryStyle = "standard" | "compact" | "bullet-only" | "two-column" | "tag-list";

/** Defines which sections are visible and in what order */
export type SectionKey =
  | "summary"
  | "personalDetails"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "links"
  | "hobbies"
  | "referees"
  | "custom";

export interface SectionOrder {
  key: SectionKey;
  visible: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
}

export interface SkillGroup {
  id: string;
  category?: string;
  items: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

export interface CustomSection {
  id: string;
  title: string;
  entryStyle: CustomEntryStyle;
  entries: CustomSectionEntry[];
}

export interface CustomSectionEntry {
  id: string;
  heading: string;
  subheading?: string;
  dateRange?: string;
  description?: string;
  tags?: string[];
  bullets: string[];
}

export type PaperSize = "a4" | "letter" | "legal";

export interface PaperDimensions {
  /** Width in mm */
  widthMm: number;
  /** Height in mm */
  heightMm: number;
  /** Width in px at 96dpi */
  widthPx: number;
  /** Height in px at 96dpi */
  heightPx: number;
  /** CSS @page size value */
  cssSize: string;
}

export const paperSizeMap: Record<PaperSize, PaperDimensions> = {
  a4: { widthMm: 210, heightMm: 297, widthPx: 794, heightPx: 1123, cssSize: "A4" },
  letter: { widthMm: 215.9, heightMm: 279.4, widthPx: 816, heightPx: 1056, cssSize: "letter" },
  legal: { widthMm: 215.9, heightMm: 355.6, widthPx: 816, heightPx: 1344, cssSize: "legal" },
};

export interface StyleConfig {
  fontSize: number;
  nameFontSize: number;
  sectionTitleFontSize: number;
  accentTone: string;
  spacing: "tight" | "normal";
  showSectionDividers: boolean;
  paperSize: PaperSize;
}

/** User-overridden section titles */
export interface SectionTitles {
  summary?: string;
  personalDetails?: string;
  experience?: string;
  education?: string;
  skills?: string;
  projects?: string;
  certifications?: string;
  links?: string;
  hobbies?: string;
  referees?: string;
}

export interface AccentColors {
  primary: string;
  light: string;
  text: string;
}

export const accentColorMap: Record<string, AccentColors> = {
  slate: { primary: "#475569", light: "#f1f5f9", text: "#334155" },
  ocean: { primary: "#0284c7", light: "#e0f2fe", text: "#0c4a6e" },
  forest: { primary: "#059669", light: "#d1fae5", text: "#064e3b" },
  charcoal: { primary: "#1f2937", light: "#f3f4f6", text: "#111827" },
  violet: { primary: "#7c3aed", light: "#ede9fe", text: "#4c1d95" },
  rose: { primary: "#e11d48", light: "#ffe4e6", text: "#9f1239" },
};

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function clampColorChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function parseHexColor(value: string): RgbColor | null {
  const normalized = value.trim();
  const match = normalized.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (!match) {
    return null;
  }

  const hex = match[1].length === 3
    ? match[1].split("").map((char) => char + char).join("")
    : match[1];

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function parseRgbColor(value: string): RgbColor | null {
  const match = value
    .trim()
    .match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);

  if (!match) {
    return null;
  }

  return {
    r: clampColorChannel(Number(match[1])),
    g: clampColorChannel(Number(match[2])),
    b: clampColorChannel(Number(match[3])),
  };
}

export function parseAccentToneColor(value?: string | null): RgbColor | null {
  if (!value) {
    return null;
  }

  return parseHexColor(value) || parseRgbColor(value);
}

function rgbToHex({ r, g, b }: RgbColor) {
  return `#${[r, g, b]
    .map((channel) => clampColorChannel(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixColors(base: RgbColor, target: RgbColor, ratio: number): RgbColor {
  return {
    r: clampColorChannel(base.r + (target.r - base.r) * ratio),
    g: clampColorChannel(base.g + (target.g - base.g) * ratio),
    b: clampColorChannel(base.b + (target.b - base.b) * ratio),
  };
}

export function isCustomAccentTone(value?: string | null) {
  return Boolean(value) && !(value! in accentColorMap) && parseAccentToneColor(value) !== null;
}

export function resolveAccentColors(accentTone?: string): AccentColors {
  if (accentTone && accentColorMap[accentTone]) {
    return accentColorMap[accentTone];
  }

  const rgb = parseAccentToneColor(accentTone);
  if (!rgb) {
    return accentColorMap.slate;
  }

  return {
    primary: rgbToHex(rgb),
    light: rgbToHex(mixColors(rgb, { r: 255, g: 255, b: 255 }, 0.88)),
    text: rgbToHex(mixColors(rgb, { r: 17, g: 24, b: 39 }, 0.5)),
  };
}

export interface TemplateProps {
  data: ResumeData;
  styleConfig: StyleConfig;
  accentColors: AccentColors;
  documentType?: "resume" | "cv";
  sectionOrder?: SectionOrder[];
  sectionTitles?: SectionTitles;
}

export const sampleResumeData: ResumeData = {
  basics: {
    fullName: "Jane Doe",
    email: "jane@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    jobTitle: "Senior Frontend Developer",
    website: "janedoe.dev",
  },
  summary:
    "Results-driven frontend developer with 6+ years of experience building performant, accessible web applications. Passionate about clean code, design systems, and delivering exceptional user experiences at scale.",
  personalDetails: {
    dateOfBirth: "May 12, 1995",
    stateOfOrigin: "Oyo State",
    localGovernmentArea: "Ibadan North",
    sex: "Female",
    maritalStatus: "Single",
    nationality: "Nigerian",
    religion: "Christian",
    extraDetails: [
      { id: "detail1", label: "Languages", value: "English, Yoruba" },
    ],
  },
  experience: [
    {
      id: "exp1",
      company: "TechCorp Inc.",
      position: "Senior Frontend Developer",
      location: "San Francisco, CA",
      startDate: "2023-01",
      current: true,
      bullets: [
        "Led migration of legacy jQuery codebase to React 18, reducing bundle size by 42%",
        "Architected a reusable component library used across 5 product teams",
        "Mentored 3 junior developers through code reviews and pair programming",
      ],
    },
    {
      id: "exp2",
      company: "StartupXYZ",
      position: "Frontend Developer",
      location: "Remote",
      startDate: "2020-06",
      endDate: "2022-12",
      bullets: [
        "Built customer-facing dashboard with React, TypeScript, and Tailwind CSS",
        "Implemented real-time data visualization reducing load times by 60%",
        "Collaborated with design team to create and maintain design system",
      ],
    },
  ],
  education: [
    {
      id: "edu1",
      institution: "University of California, Berkeley",
      degree: "B.S. Computer Science",
      fieldOfStudy: "Software Engineering",
      location: "Berkeley, CA",
      startDate: "2015-09",
      endDate: "2019-05",
      bullets: ["Dean's List, GPA: 3.8/4.0"],
    },
  ],
  projects: [
    {
      id: "proj1",
      name: "OpenSource Design System",
      role: "Creator & Maintainer",
      url: "github.com/janedoe/ds",
      bullets: [
        "Built an open-source React component library with 1.2k+ GitHub stars",
        "Implemented automated visual regression testing with Chromatic",
      ],
    },
  ],
  skills: [
    {
      id: "sk1",
      category: "Frontend",
      items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vue.js"],
    },
    {
      id: "sk2",
      category: "Tools & Infrastructure",
      items: ["Git", "Docker", "CI/CD", "Figma", "Jest"],
    },
  ],
  certifications: [
    {
      id: "cert1",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      issueDate: "2023-06",
    },
  ],
  links: [
    { id: "link1", label: "GitHub", url: "github.com/janedoe" },
    { id: "link2", label: "LinkedIn", url: "linkedin.com/in/janedoe" },
  ],
  hobbies: [
    "Reading and research",
    "Mentoring junior developers",
    "Attending product design meetups",
  ],
  referees: [
    {
      id: "ref1",
      name: "Dr. Sarah Chen",
      position: "Engineering Director",
      organization: "TechCorp Inc.",
      email: "sarah.chen@techcorp.com",
      phone: "+1 (555) 987-6543",
      relationship: "Direct Manager",
    },
  ],
  customSections: [],
};
