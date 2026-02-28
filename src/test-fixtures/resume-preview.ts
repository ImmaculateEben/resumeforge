import type { CVData, TemplateId } from "@/types";

export const PREVIEW_TEMPLATE_IDS: TemplateId[] = ["modern", "classic", "creative"];

export const SAMPLE_PREVIEW_TITLE = "Senior Engineer Resume";

export const SAMPLE_PREVIEW_DATA: CVData = {
  personalInfo: {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: "+1 (555) 010-1234",
    location: "London, UK",
    linkedin: "linkedin.com/in/ada",
    portfolio: "adalovelace.dev",
    summary: "Engineer focused on building polished product experiences with strong systems thinking.",
  },
  experience: [
    {
      id: "exp-1",
      company: "Analytical Engines Ltd",
      position: "Lead Product Engineer",
      startDate: "Jan 2023",
      endDate: "",
      current: true,
      description: "Led feature design, implementation, and delivery across core workflow surfaces.",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Royal Academy",
      degree: "Bachelor of Science",
      field: "Mathematics",
      startDate: "Sep 2017",
      endDate: "Jun 2021",
      current: false,
      description: "Focused on applied computing and formal reasoning.",
    },
  ],
  skills: [
    { id: "skill-1", name: "TypeScript", level: "expert" },
    { id: "skill-2", name: "Product Design", level: "advanced" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Resume Forge",
      description: "Built a multi-template resume workflow with PDF export.",
      url: "https://example.com/resume-forge",
      technologies: ["Next.js", "TypeScript", "Tailwind"],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Cloud Architect",
      issuer: "Example Cloud",
      date: "Jan 2025",
      url: "https://example.com/cert",
    },
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "native" },
    { id: "lang-2", name: "French", proficiency: "conversational" },
  ],
  customSections: [],
};
