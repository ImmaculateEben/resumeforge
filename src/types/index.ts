export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "basic" | "conversational" | "fluent" | "native";
}

export interface CustomSection {
  id: string;
  title: string;
  items: { id: string; title: string; subtitle: string; description: string; date: string }[];
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
}

export interface CV {
  id: string;
  userId: string;
  title: string;
  templateId: TemplateId;
  data: CVData;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: "modern" | "classic" | "creative";
  thumbnail: string;
}

export type TemplateId = "modern" | "classic" | "creative";

export const TEMPLATES: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design with a professional look",
    category: "modern",
    thumbnail: "/templates/modern.png",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layout perfect for corporate applications",
    category: "classic",
    thumbnail: "/templates/classic.png",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with unique colors and creative layout",
    category: "creative",
    thumbnail: "/templates/creative.png",
  },
];

export const DEFAULT_CV_DATA: CVData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
};
