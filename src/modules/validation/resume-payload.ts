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

const sectionKeySchema = z.enum([
  "summary",
  "personalDetails",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "links",
  "hobbies",
  "referees",
  "custom",
]);

const basicsSchema = z.object({
  fullName: plainText(120).min(2),
  email: z.string().trim().email(),
  phone: plainText(30).optional(),
  location: plainText(120).optional(),
  jobTitle: plainText(120).optional(),
  website: z.string().trim().url().optional().or(z.literal("")),
});

const personalDetailRowSchema = z.object({
  id: z.string(),
  label: plainText(60),
  value: plainText(120),
});

const personalDetailsSchema = z.object({
  layout: z.enum(["one-column", "two-column"]).default("two-column"),
  dateOfBirth: plainText(60).optional(),
  stateOfOrigin: plainText(60).optional(),
  localGovernmentArea: plainText(60).optional(),
  sex: plainText(30).optional(),
  maritalStatus: plainText(40).optional(),
  nationality: plainText(60).optional(),
  religion: plainText(60).optional(),
  extraDetails: z.array(personalDetailRowSchema).max(8).default([]),
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
  description: plainText(300).optional(),
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

const hobbiesSchema = z.array(plainText(120)).max(20).default([]);

const refereeSchema = z.object({
  id: z.string(),
  name: plainText(120),
  position: plainText(120).optional(),
  organization: plainText(120).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: plainText(30).optional(),
  relationship: plainText(80).optional(),
});

const customSectionEntrySchema = z.object({
  id: z.string(),
  heading: plainText(120),
  subheading: plainText(120).optional(),
  dateRange: plainText(40).optional(),
  description: plainText(300).optional(),
  tags: z.array(plainText(40)).max(12).optional(),
  bullets: z.array(plainText(220)).max(8).default([]),
});

const customSectionSchema = z.object({
  id: z.string(),
  title: plainText(60),
  entryStyle: z.enum(["standard", "compact", "bullet-only", "two-column", "tag-list"]).default("standard"),
  entries: z.array(customSectionEntrySchema).default([]),
});

const styleConfigSchema = z.object({
  fontSize: z.number().min(8).max(16).default(13),
  nameFontSize: z.number().min(18).max(36).default(26),
  sectionTitleFontSize: z.number().min(10).max(18).default(14),
  accentTone: z.enum(["slate", "ocean", "forest", "charcoal", "violet", "rose"]),
  spacing: z.enum(["tight", "normal"]),
  showSectionDividers: z.boolean(),
});

const sectionOrderSchema = z.object({
  key: sectionKeySchema,
  visible: z.boolean(),
});

const sectionTitlesSchema = z.object({
  summary: plainText(60).optional(),
  personalDetails: plainText(60).optional(),
  experience: plainText(60).optional(),
  education: plainText(60).optional(),
  skills: plainText(60).optional(),
  projects: plainText(60).optional(),
  certifications: plainText(60).optional(),
  links: plainText(60).optional(),
  hobbies: plainText(60).optional(),
  referees: plainText(60).optional(),
});

export const resumeDraftPayloadSchema = z.object({
  schemaVersion: z.literal("1.0"),
  documentType: z.enum(["resume", "cv"]),
  templateKey: z.string().min(1),
  basics: basicsSchema,
  summary: plainText(1000).default(""),
  personalDetails: personalDetailsSchema.default({ layout: "two-column", extraDetails: [] }),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  skills: z.array(skillGroupSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  links: z.array(linkSchema).default([]),
  hobbies: hobbiesSchema,
  referees: z.array(refereeSchema).default([]),
  customSections: z.array(customSectionSchema).max(3).default([]),
  styleConfig: styleConfigSchema,
  sectionOrder: z.array(sectionOrderSchema).default([]),
  sectionTitles: sectionTitlesSchema.default({}),
});

export type ResumeDraftPayload = z.infer<typeof resumeDraftPayloadSchema>;

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
    payload.hobbies.length > 0 ||
    payload.referees.length > 0 ||
    payload.customSections.length > 0 ||
    payload.personalDetails.extraDetails.length > 0 ||
    Boolean(
      payload.personalDetails.dateOfBirth ||
        payload.personalDetails.stateOfOrigin ||
        payload.personalDetails.localGovernmentArea ||
        payload.personalDetails.sex ||
        payload.personalDetails.maritalStatus ||
        payload.personalDetails.nationality ||
        payload.personalDetails.religion
    );

  if (!hasContent) {
    errors.push("At least one populated section is required for export");
  }

  return errors;
}
