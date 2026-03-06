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
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  certifications: CertificationItem[];
  links: LinkItem[];
  customSections: CustomSection[];
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
  entries: CustomSectionEntry[];
}

export interface CustomSectionEntry {
  id: string;
  heading: string;
  subheading?: string;
  dateRange?: string;
  bullets: string[];
}

export interface StyleConfig {
  fontScale: "compact" | "comfortable";
  accentTone: string;
  spacing: "tight" | "normal";
  showSectionDividers: boolean;
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

export interface TemplateProps {
  data: ResumeData;
  styleConfig: StyleConfig;
  accentColors: AccentColors;
  documentType?: "resume" | "cv";
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
  customSections: [],
};
