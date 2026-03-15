import { z } from "zod";

const noHtmlRegex = /<[^>]*>/;

function plainText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .refine((value) => !noHtmlRegex.test(value), {
      message: "HTML content is not allowed",
    });
}

const basicString = (maxLength: number) => plainText(maxLength).default("");

const experienceItemSchema = z.object({
  id: z.string(),
  company: basicString(120),
  position: basicString(120),
  location: basicString(120).optional(),
  startDate: basicString(20),
  endDate: basicString(20).optional(),
  current: z.boolean().optional(),
  bullets: z.array(plainText(220)).max(8).default([]),
});

const educationItemSchema = z.object({
  id: z.string(),
  institution: basicString(120),
  degree: basicString(120),
  fieldOfStudy: basicString(120).optional(),
  location: basicString(120).optional(),
  startDate: basicString(20).optional(),
  endDate: basicString(20).optional(),
  bullets: z.array(plainText(220)).max(5).default([]),
});

const projectItemSchema = z.object({
  id: z.string(),
  name: basicString(120),
  role: basicString(120).optional(),
  description: basicString(300).optional(),
  url: basicString(240).optional(),
  startDate: basicString(20).optional(),
  endDate: basicString(20).optional(),
  bullets: z.array(plainText(220)).max(6).default([]),
});

const skillGroupSchema = z.object({
  id: z.string(),
  category: basicString(60).optional(),
  items: z.array(plainText(60)).max(20).default([]),
});

const certificationSchema = z.object({
  id: z.string(),
  name: basicString(120),
  issuer: basicString(120).optional(),
  issueDate: basicString(20).optional(),
});

const customSectionEntrySchema = z.object({
  id: z.string(),
  heading: basicString(120),
  subheading: basicString(120).optional(),
  dateRange: basicString(40).optional(),
  description: basicString(300).optional(),
  tags: z.array(plainText(40)).max(12).default([]),
  bullets: z.array(plainText(220)).max(8).default([]),
});

const customSectionSchema = z.object({
  id: z.string(),
  title: basicString(60),
  entryStyle: z.enum(["standard", "compact", "bullet-only", "two-column", "tag-list"]).default("standard"),
  entries: z.array(customSectionEntrySchema).max(12).default([]),
});

export const resumeAiContextSchema = z.object({
  documentType: z.enum(["resume", "cv"]).default("resume"),
  templateKey: basicString(40).optional(),
  basics: z.object({
    fullName: basicString(120),
    email: basicString(160),
    phone: basicString(30).optional(),
    location: basicString(120).optional(),
    jobTitle: basicString(120).optional(),
    website: basicString(240).optional(),
  }),
  summary: basicString(1000),
  personalDetails: z.object({
    layout: z.enum(["one-column", "two-column"]).default("two-column"),
    dateOfBirth: basicString(60).optional(),
    stateOfOrigin: basicString(60).optional(),
    localGovernmentArea: basicString(60).optional(),
    sex: basicString(30).optional(),
    maritalStatus: basicString(40).optional(),
    nationality: basicString(60).optional(),
    religion: basicString(60).optional(),
    extraDetails: z.array(z.object({
      id: z.string(),
      label: basicString(60),
      value: basicString(120),
    })).max(8).default([]),
  }),
  experience: z.array(experienceItemSchema).max(20).default([]),
  education: z.array(educationItemSchema).max(12).default([]),
  projects: z.array(projectItemSchema).max(12).default([]),
  skills: z.array(skillGroupSchema).max(12).default([]),
  certifications: z.array(certificationSchema).max(20).default([]),
  links: z.array(z.object({
    id: z.string(),
    label: basicString(60),
    url: basicString(240),
  })).max(20).default([]),
  hobbies: z.array(plainText(120)).max(20).default([]),
  referees: z.array(z.object({
    id: z.string(),
    name: basicString(120),
    position: basicString(120).optional(),
    organization: basicString(120).optional(),
    email: basicString(160).optional(),
    phone: basicString(30).optional(),
    relationship: basicString(80).optional(),
  })).max(12).default([]),
  customSections: z.array(customSectionSchema).max(3).default([]),
});

export const inlineAiTargetSchema = z.enum([
  "summary",
  "experience_bullets",
  "education_bullets",
  "project_name",
  "project_description",
  "project_bullets",
  "skills_group",
  "custom_entry_heading",
  "custom_entry_description",
  "custom_entry_bullets",
]);

export const inlineAiModeSchema = z.enum(["generate", "improve", "tailor"]);
export const inlineAiToneSchema = z.enum(["concise", "executive", "technical", "entry-level"]);

export const inlineAiRequestSchema = z.object({
  target: inlineAiTargetSchema,
  entityId: z.string().optional(),
  mode: inlineAiModeSchema.default("generate"),
  tone: inlineAiToneSchema.default("concise"),
  jobDescription: plainText(5000).optional(),
  contextSummary: plainText(1200).optional(),
  instruction: plainText(240).optional(),
  resume: resumeAiContextSchema,
});

export const inlineAiResultSchema = z.object({
  status: z.enum(["ready", "needs_context"]),
  kind: z.enum(["text", "list"]),
  message: z.string().trim().min(1).max(240),
  text: z.string().trim().max(1200),
  items: z.array(z.string().trim().min(1).max(220)).max(20),
  missingFields: z.array(z.string().trim().min(1).max(120)).max(8),
});

export type ResumeAiContext = z.infer<typeof resumeAiContextSchema>;
export type InlineAiTarget = z.infer<typeof inlineAiTargetSchema>;
export type InlineAiMode = z.infer<typeof inlineAiModeSchema>;
export type InlineAiTone = z.infer<typeof inlineAiToneSchema>;
export type InlineAiRequest = z.infer<typeof inlineAiRequestSchema>;
export type InlineAiResult = z.infer<typeof inlineAiResultSchema>;
