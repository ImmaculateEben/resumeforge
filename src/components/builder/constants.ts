import type { SectionKey, CustomEntryStyle } from "@/components/templates/types";

export type EditorTab = "content" | "design" | "settings";

export const templateOptions = [
  { key: "atlas", name: "Atlas", desc: "Clean & Professional", color: "from-slate-500 to-slate-700" },
  { key: "summit", name: "Summit", desc: "Modern Two-Column", color: "from-blue-500 to-indigo-600" },
  { key: "quill", name: "Quill", desc: "Elegant & Minimalist", color: "from-emerald-500 to-teal-600" },
  { key: "northstar", name: "Northstar", desc: "Bold & Contemporary", color: "from-violet-500 to-purple-600" },
  { key: "registry", name: "Registry", desc: "Formal CV Layout", color: "from-stone-500 to-zinc-700" },
];

export const accentOptions = [
  { key: "slate", label: "Slate", className: "bg-slate-600" },
  { key: "ocean", label: "Ocean", className: "bg-blue-600" },
  { key: "forest", label: "Forest", className: "bg-emerald-600" },
  { key: "charcoal", label: "Charcoal", className: "bg-gray-800" },
  { key: "violet", label: "Violet", className: "bg-violet-600" },
  { key: "rose", label: "Rose", className: "bg-rose-600" },
];

export const sectionLabels: Record<SectionKey, string> = {
  summary: "Summary",
  personalDetails: "Personal Details",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  links: "Links",
  hobbies: "Hobbies",
  referees: "References",
  custom: "Custom Sections",
};

export const cvOnlySections: SectionKey[] = ["personalDetails", "hobbies", "referees"];

export const entryStyleOptions: { value: CustomEntryStyle; label: string; desc: string }[] = [
  { value: "standard", label: "Standard", desc: "Heading, subheading, date, bullets" },
  { value: "compact", label: "Compact", desc: "Single line - heading + date" },
  { value: "bullet-only", label: "Bullet List", desc: "Simple bullet points" },
  { value: "two-column", label: "Two Column", desc: "Heading left, details right" },
  { value: "tag-list", label: "Tag List", desc: "Comma-separated tags" },
];
