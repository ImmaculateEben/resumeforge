import { z } from "zod";

const noHtmlRegex = /<[^>]*>/;

function plainText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .refine((val) => !noHtmlRegex.test(val), {
      message: "HTML content is not allowed",
    });
}

const basicsSchema = z.object({
  fullName: plainText(120).min(2),
  email: z.string().trim().email(),
  phone: plainText(30).optional(),
  location: plainText(120).optional(),
  jobTitle: plainText(120).optional(),
  website: z.string().trim().url().optional().or(z.literal("")),
});

const experienceItemSchema = z.object({
  id: z.string(),
  company: plainText(120),
  position: plainText(120),
  location: plainText(120).optional(),
  startDate: plainText(20),
  endDate: plainText(20).optional(),
  current: z.boolean().optional(),
  bullets: z.array(plainText(220)).max(8).default([]),
});

const educationItemSchema = z.object({
  id: z.string(),
  institution: plainText(120),
  degree: plainText(120),
  fieldOfStudy: plainText(120).optional(),
  location: plainText(120).optional(),
  startDate: plainText(20).optional(),
  endDate: plainText(20).optional(),
  bullets: z.array(plainText(220)).max(5).default([]),
});

const projectItemSchema = z.object({
  id: z.string(),
  name: plainText(120),
  role: plainText(120).optional(),
  url: z.string().trim().url().optional().or(z.literal("")),
  startDate: plainText(20).optional(),
  endDate: plainText(20).optional(),
  bullets: z.array(plainText(220)).max(6).default([]),
});

const skillGroupSchema = z.object({
  id: z.string(),
  category: plainText(60).optional(),
  items: z.array(plainText(60)).max(20).default([]),
});

const certificationSchema = z.object({
  id: z.string(),
  name: plainText(120),
  issuer: plainText(120).optional(),
  issueDate: plainText(20).optional(),
  expiryDate: plainText(20).optional(),
  credentialId: plainText(60).optional(),
  url: z.string().trim().url().optional().or(z.literal("")),
});

const linkSchema = z.object({
  id: z.string(),
  label: plainText(60),
  url: z.string().trim().url(),
});

const customSectionEntrySchema = z.object({
  id: z.string(),
  heading: plainText(120),
  subheading: plainText(120).optional(),
  dateRange: plainText(40).optional(),
  bullets: z.array(plainText(220)).max(8).default([]),
});

const customSectionSchema = z.object({
  id: z.string(),
  title: plainText(60),
  entries: z.array(customSectionEntrySchema).default([]),
});

const styleConfigSchema = z.object({
  fontScale: z.enum(["compact", "comfortable"]),
  accentTone: z.enum(["slate", "ocean", "forest", "charcoal", "violet", "rose"]),
  spacing: z.enum(["tight", "normal"]),
  showSectionDividers: z.boolean(),
});

export const resumeDraftPayloadSchema = z.object({
  schemaVersion: z.literal("1.0"),
  documentType: z.enum(["resume", "cv"]),
  templateKey: z.string().min(1),
  basics: basicsSchema,
  summary: plainText(1000).default(""),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  skills: z.array(skillGroupSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  links: z.array(linkSchema).default([]),
  customSections: z.array(customSectionSchema).max(3).default([]),
  styleConfig: styleConfigSchema,
});

export type ResumeDraftPayload = z.infer<typeof resumeDraftPayloadSchema>;

/**
 * Validates that the payload meets the minimum requirements for PDF export:
 * - fullName and email are present
 * - At least one populated section exists
 */
export function validateExportReady(payload: ResumeDraftPayload): string[] {
  const errors: string[] = [];

  if (!payload.basics.fullName || payload.basics.fullName.length < 2) {
    errors.push("Full name is required for export");
  }

  if (!payload.basics.email) {
    errors.push("Email is required for export");
  }

  const hasContent =
    payload.summary.length > 0 ||
    payload.experience.length > 0 ||
    payload.education.length > 0 ||
    payload.projects.length > 0 ||
    payload.skills.length > 0 ||
    payload.certifications.length > 0 ||
    payload.links.length > 0 ||
    payload.customSections.length > 0;

  if (!hasContent) {
    errors.push("At least one populated section is required for export");
  }

  return errors;
}
