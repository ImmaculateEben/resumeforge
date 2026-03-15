import "server-only";

import { z } from "zod";
import type {
  InlineAiMode,
  InlineAiRequest,
  InlineAiResult,
  InlineAiTone,
  ResumeAiContext,
} from "@/modules/validation";

const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const textResultKeys = ["text", "message", "content", "summary", "description", "name", "heading", "title", "value"];
const listResultKeys = ["items", "bullets", "skills", "points", "list", "suggestions", "entries", "keywords"];
const envelopeKeys = ["data", "result", "response", "output", "payload"];
const ignoredScalarKeys = new Set(["status", "kind", "mode", "tone", "target", "targetLabel"]);

const groqCompletionSchema = z.object({
  text: z.string().trim().max(1200).default(""),
  items: z.array(z.string().trim().max(220)).max(20).default([]),
});

const groqCompletionJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string" },
    items: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["text", "items"],
} as const;

class InlineAiRequestError extends Error { }

type TargetKind = "text" | "list";

interface GenerationPlan {
  kind: TargetKind;
  successMessage: string;
  targetLabel: string;
  textMaxLength: number;
  itemMaxLength: number;
  desiredItemCount: number;
  maxItems: number;
  currentValue: string | string[];
  targetContext: Record<string, unknown>;
  sharedContext: Record<string, unknown>;
  instructions: string[];
}

const toneInstructions: Record<InlineAiTone, string> = {
  concise: "Prefer tight, direct wording and keep the output focused.",
  executive: "Use a polished senior tone that emphasizes leadership, scope, and business value when supported.",
  technical: "Use technically precise wording and highlight systems, tools, and implementation depth when supported.",
  "entry-level":
    "Use accessible, grounded language that emphasizes potential, collaboration, and transferable strengths without overstating seniority.",
};

function clean(value?: string | null) {
  return value?.trim() || "";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compactList(values: Array<string | undefined>, max = values.length) {
  return values.map((value) => clean(value)).filter(Boolean).slice(0, max);
}

function compactObject<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (typeof entry === "string") return entry.trim().length > 0;
      if (Array.isArray(entry)) return entry.length > 0;
      if (entry && typeof entry === "object") return Object.keys(entry).length > 0;
      return entry !== undefined && entry !== null;
    })
  ) as T;
}

function hasCurrentContent(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.some((entry) => entry.trim().length > 0);
  }

  return value.trim().length > 0;
}

function splitTextIntoItems(value: string) {
  return value
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\s*(?:[-*•]+|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

function toCleanString(value: unknown) {
  if (typeof value === "string") {
    return clean(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function coerceListEntries(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (isPlainObject(entry)) {
          for (const key of [...textResultKeys, "item", "label"]) {
            const candidate = toCleanString(entry[key]);
            if (candidate) {
              return candidate;
            }
          }
        }

        return toCleanString(entry);
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return splitTextIntoItems(value);
  }

  return [];
}

function collectCandidateObjects(value: Record<string, unknown>) {
  const queue: Record<string, unknown>[] = [value];
  const seen = new Set<Record<string, unknown>>();
  const candidates: Record<string, unknown>[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current)) {
      continue;
    }

    seen.add(current);
    candidates.push(current);

    for (const key of envelopeKeys) {
      const nested = current[key];
      if (isPlainObject(nested)) {
        queue.push(nested);
      }
    }
  }

  return candidates;
}

function extractTextCandidate(candidates: Record<string, unknown>[]) {
  for (const key of textResultKeys) {
    for (const candidate of candidates) {
      const value = toCleanString(candidate[key]);
      if (value) {
        return value;
      }
    }
  }

  for (const candidate of candidates) {
    for (const [key, value] of Object.entries(candidate)) {
      if (ignoredScalarKeys.has(key)) {
        continue;
      }

      const normalized = toCleanString(value);
      if (normalized) {
        return normalized;
      }
    }
  }

  return "";
}

function extractListCandidate(candidates: Record<string, unknown>[]) {
  for (const key of listResultKeys) {
    for (const candidate of candidates) {
      const value = coerceListEntries(candidate[key]);
      if (value.length > 0) {
        return value;
      }
    }
  }

  for (const candidate of candidates) {
    for (const value of Object.values(candidate)) {
      const normalized = coerceListEntries(value);
      if (normalized.length > 0) {
        return normalized;
      }
    }
  }

  return [];
}

function coerceGroqCompletion(raw: unknown, plan: GenerationPlan) {
  if (!isPlainObject(raw)) {
    throw new Error("Groq response JSON was not an object.");
  }

  const candidates = collectCandidateObjects(raw);
  const text = extractTextCandidate(candidates);
  const items = extractListCandidate(candidates);

  return {
    text: plan.kind === "text" ? text || items.join(" ") : text,
    items: plan.kind === "list" ? (items.length > 0 ? items : splitTextIntoItems(text)) : items,
  };
}

function parseGroqContent(content: string, plan: GenerationPlan) {
  const normalizedContent = clean(
    content
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
  );

  let parsedContent: unknown;

  try {
    parsedContent = JSON.parse(normalizedContent);
  } catch {
    const objectMatch = normalizedContent.match(/\{[\s\S]*\}/);
    if (!objectMatch) {
      throw new Error("Groq response was not valid JSON.");
    }

    parsedContent = JSON.parse(objectMatch[0]);
  }

  const strictParse = groqCompletionSchema.safeParse(parsedContent);
  if (strictParse.success) {
    return strictParse.data;
  }

  return groqCompletionSchema.parse(coerceGroqCompletion(parsedContent, plan));
}

function supportsGroqJsonSchema(model: string) {
  return model.startsWith("openai/gpt-oss-");
}

function getGroqResponseFormat(model: string) {
  if (supportsGroqJsonSchema(model)) {
    return {
      type: "json_schema",
      json_schema: {
        name: "resume_inline_ai_output",
        strict: true,
        schema: groqCompletionJsonSchema,
      },
    } as const;
  }

  return {
    type: "json_object",
  } as const;
}

function formatTargetLabelForMessage(label: string) {
  return label.charAt(0).toLowerCase() + label.slice(1);
}

function getSuccessMessage(label: string, mode: InlineAiMode, fallback: string) {
  const normalizedLabel = formatTargetLabelForMessage(label);

  switch (mode) {
    case "improve":
      return `Improved ${normalizedLabel} using your existing content and the rest of your resume.`;
    case "tailor":
      return `Tailored ${normalizedLabel} to the provided job description using your resume context.`;
    case "generate":
    default:
      return fallback;
  }
}

function buildSharedContext(resume: ResumeAiContext) {
  return compactObject({
    documentType: resume.documentType,
    basics: compactObject({
      fullName: clean(resume.basics.fullName),
      jobTitle: clean(resume.basics.jobTitle),
      location: clean(resume.basics.location),
      website: clean(resume.basics.website),
    }),
    summary: clean(resume.summary),
    experience: resume.experience
      .map((item) =>
        compactObject({
          position: clean(item.position),
          company: clean(item.company),
          location: clean(item.location),
          dates: compactList([item.startDate, item.current ? "Present" : item.endDate]).join(" - "),
          bullets: compactList(item.bullets, 5),
        })
      )
      .filter((item) => Object.keys(item).length > 0)
      .slice(0, 6),
    education: resume.education
      .map((item) =>
        compactObject({
          degree: clean(item.degree),
          institution: clean(item.institution),
          fieldOfStudy: clean(item.fieldOfStudy),
          location: clean(item.location),
          dates: compactList([item.startDate, item.endDate]).join(" - "),
          bullets: compactList(item.bullets, 4),
        })
      )
      .filter((item) => Object.keys(item).length > 0)
      .slice(0, 4),
    projects: resume.projects
      .map((item) =>
        compactObject({
          name: clean(item.name),
          role: clean(item.role),
          description: clean(item.description),
          url: clean(item.url),
          dates: compactList([item.startDate, item.endDate]).join(" - "),
          bullets: compactList(item.bullets, 4),
        })
      )
      .filter((item) => Object.keys(item).length > 0)
      .slice(0, 4),
    skills: resume.skills
      .map((group) =>
        compactObject({
          category: clean(group.category),
          items: compactList(group.items, 12),
        })
      )
      .filter((item) => Object.keys(item).length > 0)
      .slice(0, 6),
    certifications: resume.certifications
      .map((item) =>
        compactObject({
          name: clean(item.name),
          issuer: clean(item.issuer),
          issueDate: clean(item.issueDate),
        })
      )
      .filter((item) => Object.keys(item).length > 0)
      .slice(0, 8),
    customSections: resume.customSections
      .map((section) =>
        compactObject({
          title: clean(section.title),
          entryStyle: section.entryStyle,
          entries: section.entries
            .map((entry) =>
              compactObject({
                heading: clean(entry.heading),
                subheading: clean(entry.subheading),
                dateRange: clean(entry.dateRange),
                description: clean(entry.description),
                tags: compactList(entry.tags || [], 8),
                bullets: compactList(entry.bullets, 4),
              })
            )
            .filter((entry) => Object.keys(entry).length > 0)
            .slice(0, 6),
        })
      )
      .filter((item) => Object.keys(item).length > 0),
  });
}

function needsContext(message: string, kind: TargetKind, missingFields: string[]): InlineAiResult {
  return {
    status: "needs_context",
    kind,
    message,
    text: "",
    items: [],
    missingFields,
  };
}

function findCustomEntry(resume: ResumeAiContext, entityId?: string) {
  if (!entityId) {
    throw new InlineAiRequestError("Custom entry target is missing an entry identifier.");
  }

  for (const section of resume.customSections) {
    const entry = section.entries.find((item) => item.id === entityId);
    if (entry) {
      return { section, entry };
    }
  }

  throw new InlineAiRequestError("The selected custom section entry could not be found.");
}

function buildSummaryPlan(resume: ResumeAiContext): GenerationPlan | InlineAiResult {
  const missingFields: string[] = [];
  const hasExistingSummary = clean(resume.summary).length > 0;

  if (!clean(resume.basics.jobTitle) && !hasExistingSummary) {
    missingFields.push("Job title");
  }

  const hasCareerContext =
    resume.experience.some((item) => clean(item.position) || clean(item.company) || compactList(item.bullets).length > 0) ||
    resume.education.some((item) => clean(item.degree) || clean(item.institution)) ||
    resume.projects.some((item) => clean(item.name) || clean(item.role) || compactList(item.bullets).length > 0) ||
    resume.skills.some((group) => compactList(group.items).length > 0);

  if (!hasCareerContext && !hasExistingSummary) {
    missingFields.push("At least one experience, education, project, or skills entry");
  }

  if (missingFields.length > 0) {
    return needsContext(
      "Fill in your job title and at least one core resume section first so AI has enough context for a credible summary.",
      "text",
      missingFields
    );
  }

  return {
    kind: "text",
    successMessage: clean(resume.summary)
      ? "Refined your summary using the rest of your resume for context."
      : "Drafted a summary from your role, experience, education, projects, and skills.",
    targetLabel: "Professional Summary",
    textMaxLength: 1000,
    itemMaxLength: 220,
    desiredItemCount: 0,
    maxItems: 0,
    currentValue: clean(resume.summary),
    targetContext: compactObject({
      currentSummary: clean(resume.summary),
      preferredRole: clean(resume.basics.jobTitle),
    }),
    sharedContext: buildSharedContext(resume),
    instructions: [
      "Write 2 to 4 concise sentences for a resume summary.",
      "Use a professional tone with no first-person pronouns.",
      "Focus on strengths, scope, and relevance to the user's background.",
      "Do not invent metrics, technologies, employers, dates, or claims that are not supported by the context.",
    ],
  };
}

function buildExperiencePlan(resume: ResumeAiContext, entityId?: string): GenerationPlan | InlineAiResult {
  if (!entityId) {
    throw new InlineAiRequestError("Experience target is missing an item identifier.");
  }

  const item = resume.experience.find((entry) => entry.id === entityId);
  if (!item) {
    throw new InlineAiRequestError("The selected experience entry could not be found.");
  }

  const missingFields = compactList([
    clean(item.position) ? undefined : "Position / Job Title",
    clean(item.company) ? undefined : "Company",
  ]);

  if (missingFields.length > 0) {
    return needsContext(
      "Fill in the role and company for this experience entry first so the bullet points match the actual context.",
      "list",
      missingFields
    );
  }

  return {
    kind: "list",
    successMessage: compactList(item.bullets).length > 0
      ? "Generated stronger experience bullets using this role and your resume context."
      : "Drafted experience bullets for this role from the details already in your resume.",
    targetLabel: "Experience Bullet Points",
    textMaxLength: 1000,
    itemMaxLength: 220,
    desiredItemCount: Math.min(Math.max(compactList(item.bullets).length || 4, 3), 6),
    maxItems: 8,
    currentValue: compactList(item.bullets),
    targetContext: compactObject({
      position: clean(item.position),
      company: clean(item.company),
      location: clean(item.location),
      startDate: clean(item.startDate),
      endDate: item.current ? "Present" : clean(item.endDate),
      currentBullets: compactList(item.bullets, 8),
    }),
    sharedContext: buildSharedContext(resume),
    instructions: [
      "Write 3 to 6 resume bullet points.",
      "Each bullet should start with a strong action verb and stay concise.",
      "Prefer achievements, impact, ownership, and tools only when supported by the context.",
      "Do not repeat the job title or company in every bullet.",
      "Do not invent metrics or responsibilities that are not supported by the provided resume context.",
    ],
  };
}

function buildEducationPlan(resume: ResumeAiContext, entityId?: string): GenerationPlan | InlineAiResult {
  if (!entityId) {
    throw new InlineAiRequestError("Education target is missing an item identifier.");
  }

  const item = resume.education.find((entry) => entry.id === entityId);
  if (!item) {
    throw new InlineAiRequestError("The selected education entry could not be found.");
  }

  const missingFields = compactList([
    clean(item.degree) ? undefined : "Degree",
    clean(item.institution) ? undefined : "Institution",
  ]);

  if (missingFields.length > 0) {
    return needsContext(
      "Fill in the degree and institution for this education entry first so the AI can draft relevant details.",
      "list",
      missingFields
    );
  }

  return {
    kind: "list",
    successMessage: compactList(item.bullets).length > 0
      ? "Regenerated education bullets with cleaner, resume-ready phrasing."
      : "Drafted education bullets from your degree, institution, and related resume context.",
    targetLabel: "Education Bullet Points",
    textMaxLength: 1000,
    itemMaxLength: 220,
    desiredItemCount: Math.min(Math.max(compactList(item.bullets).length || 3, 2), 4),
    maxItems: 5,
    currentValue: compactList(item.bullets),
    targetContext: compactObject({
      degree: clean(item.degree),
      institution: clean(item.institution),
      fieldOfStudy: clean(item.fieldOfStudy),
      location: clean(item.location),
      startDate: clean(item.startDate),
      endDate: clean(item.endDate),
      currentBullets: compactList(item.bullets, 5),
    }),
    sharedContext: buildSharedContext(resume),
    instructions: [
      "Write 2 to 4 concise education bullet points.",
      "Focus on achievements, academic strengths, relevant coursework, leadership, or distinction only when supported by the context.",
      "Keep the bullets resume-ready and avoid filler language.",
      "Do not invent awards, grades, societies, or coursework that are not supported by the provided context.",
    ],
  };
}

function buildProjectNamePlan(resume: ResumeAiContext, entityId?: string): GenerationPlan | InlineAiResult {
  if (!entityId) {
    throw new InlineAiRequestError("Project target is missing an item identifier.");
  }

  const item = resume.projects.find((entry) => entry.id === entityId);
  if (!item) {
    throw new InlineAiRequestError("The selected project entry could not be found.");
  }

  const hasContext =
    clean(item.name) ||
    clean(item.role) ||
    clean(item.description) ||
    compactList(item.bullets).length > 0 ||
    clean(resume.basics.jobTitle) ||
    resume.skills.some((group) => compactList(group.items).length > 0) ||
    resume.experience.some((entry) => clean(entry.position) || clean(entry.company));

  if (!hasContext) {
    return needsContext(
      "Add a role, description, bullet, or broader resume context first so the AI can name this project appropriately.",
      "text",
      ["Project role, project details, or broader resume context"]
    );
  }

  return {
    kind: "text",
    successMessage: clean(item.name)
      ? "Improved the project name using the details already in your resume."
      : "Drafted a project name from the project details and the rest of your resume.",
    targetLabel: "Project Name",
    textMaxLength: 120,
    itemMaxLength: 220,
    desiredItemCount: 0,
    maxItems: 0,
    currentValue: clean(item.name),
    targetContext: compactObject({
      currentName: clean(item.name),
      role: clean(item.role),
      description: clean(item.description),
      bullets: compactList(item.bullets, 4),
      url: clean(item.url),
      startDate: clean(item.startDate),
      endDate: clean(item.endDate),
    }),
    sharedContext: buildSharedContext(resume),
    instructions: [
      "Return a single clear project name.",
      "Keep it concise, specific, and resume-friendly.",
      "Do not add quotation marks, labels, or explanatory text.",
      "Do not invent a product, company, or technology name that is not supported by the context.",
    ],
  };
}

function buildProjectDescriptionPlan(resume: ResumeAiContext, entityId?: string): GenerationPlan | InlineAiResult {
  if (!entityId) {
    throw new InlineAiRequestError("Project target is missing an item identifier.");
  }

  const item = resume.projects.find((entry) => entry.id === entityId);
  if (!item) {
    throw new InlineAiRequestError("The selected project entry could not be found.");
  }

  const hasContext =
    clean(item.description) ||
    clean(item.name) ||
    clean(item.role) ||
    compactList(item.bullets).length > 0 ||
    clean(resume.basics.jobTitle) ||
    resume.skills.some((group) => compactList(group.items).length > 0);

  if (!hasContext) {
    return needsContext(
      "Add a project name, role, bullet, or broader role context first so the AI can describe the project accurately.",
      "text",
      ["Project name, project role, or related resume context"]
    );
  }

  return {
    kind: "text",
    successMessage: clean(item.description)
      ? "Improved the project description using the rest of your resume for context."
      : "Drafted a project description from the project details and related resume context.",
    targetLabel: "Project Description",
    textMaxLength: 300,
    itemMaxLength: 220,
    desiredItemCount: 0,
    maxItems: 0,
    currentValue: clean(item.description),
    targetContext: compactObject({
      name: clean(item.name),
      role: clean(item.role),
      currentDescription: clean(item.description),
      bullets: compactList(item.bullets, 4),
      url: clean(item.url),
      startDate: clean(item.startDate),
      endDate: clean(item.endDate),
    }),
    sharedContext: buildSharedContext(resume),
    instructions: [
      "Write 1 to 2 concise sentences describing the project.",
      "Focus on what the project is, the user's role, and relevant scope or technical emphasis when supported.",
      "Keep it resume-ready and avoid fluff.",
      "Do not invent users, outcomes, metrics, or technologies that are not supported by the context.",
    ],
  };
}

function buildProjectPlan(resume: ResumeAiContext, entityId?: string): GenerationPlan | InlineAiResult {
  if (!entityId) {
    throw new InlineAiRequestError("Project target is missing an item identifier.");
  }

  const item = resume.projects.find((entry) => entry.id === entityId);
  if (!item) {
    throw new InlineAiRequestError("The selected project entry could not be found.");
  }

  const hasContext =
    clean(item.name) ||
    clean(item.role) ||
    clean(item.description) ||
    clean(item.url);

  if (!hasContext) {
    return needsContext(
      "Fill in the project name or some project details first so the AI can draft bullets that are tied to a specific project.",
      "list",
      ["Project name or project details"]
    );
  }

  return {
    kind: "list",
    successMessage: compactList(item.bullets).length > 0
      ? "Regenerated project bullets using the project details and the rest of your resume."
      : "Drafted project bullets from the project details and related resume context.",
    targetLabel: "Project Bullet Points",
    textMaxLength: 1000,
    itemMaxLength: 220,
    desiredItemCount: Math.min(Math.max(compactList(item.bullets).length || 4, 3), 5),
    maxItems: 6,
    currentValue: compactList(item.bullets),
    targetContext: compactObject({
      name: clean(item.name),
      role: clean(item.role),
      description: clean(item.description),
      url: clean(item.url),
      startDate: clean(item.startDate),
      endDate: clean(item.endDate),
      currentBullets: compactList(item.bullets, 6),
    }),
    sharedContext: buildSharedContext(resume),
    instructions: [
      "Write 3 to 5 concise project bullet points.",
      "Focus on what was built, the user's role, technical depth, outcomes, and ownership only when supported by context.",
      "Use strong action verbs and resume-ready phrasing.",
      "Do not invent tools, metrics, users, or outcomes that are not grounded in the provided context.",
    ],
  };
}

function buildSkillsPlan(resume: ResumeAiContext, entityId?: string): GenerationPlan | InlineAiResult {
  if (!entityId) {
    throw new InlineAiRequestError("Skills target is missing a group identifier.");
  }

  const item = resume.skills.find((entry) => entry.id === entityId);
  if (!item) {
    throw new InlineAiRequestError("The selected skill group could not be found.");
  }

  const hasContext =
    clean(item.category) ||
    clean(resume.basics.jobTitle) ||
    resume.experience.some((entry) => clean(entry.position) || clean(entry.company)) ||
    resume.projects.some((entry) => clean(entry.name) || clean(entry.role) || clean(entry.description));

  if (!hasContext) {
    return needsContext(
      "Fill in the skill group category or add your job title, experience, or project details first so the AI can suggest relevant skills.",
      "list",
      ["Skill group category or broader role context"]
    );
  }

  return {
    kind: "list",
    successMessage: compactList(item.items).length > 0
      ? "Suggested a cleaner, more relevant skills list for this group."
      : "Drafted a skills list based on this group and the rest of your resume.",
    targetLabel: "Skill Group",
    textMaxLength: 1000,
    itemMaxLength: 60,
    desiredItemCount: Math.min(Math.max(compactList(item.items).length || 8, 6), 12),
    maxItems: 20,
    currentValue: compactList(item.items, 20),
    targetContext: compactObject({
      category: clean(item.category),
      currentItems: compactList(item.items, 20),
    }),
    sharedContext: buildSharedContext(resume),
    instructions: [
      "Return 6 to 12 skill names that fit the group and the user's background.",
      "Return only plain skill or tool names with no numbering and no sentences.",
      "Avoid duplicates, overly generic filler, and skills that are not supported by the context.",
    ],
  };
}

function buildCustomEntryHeadingPlan(resume: ResumeAiContext, entityId?: string): GenerationPlan | InlineAiResult {
  const { section, entry } = findCustomEntry(resume, entityId);

  if (!clean(section.title)) {
    return needsContext(
      "Fill in the custom section title first so the AI knows what kind of entry heading to generate.",
      "text",
      ["Custom section title"]
    );
  }

  const hasContext =
    clean(entry.heading) ||
    clean(entry.subheading) ||
    clean(entry.dateRange) ||
    clean(entry.description) ||
    compactList(entry.bullets).length > 0 ||
    clean(resume.basics.jobTitle) ||
    resume.experience.some((item) => clean(item.position) || clean(item.company));

  if (!hasContext) {
    return needsContext(
      "Add some details to this entry or fill more of your resume first so the AI can generate a relevant heading.",
      "text",
      ["Custom entry details or broader resume context"]
    );
  }

  return {
    kind: "text",
    successMessage: clean(entry.heading)
      ? "Improved the custom entry heading using the section context and the rest of your resume."
      : "Drafted a custom entry heading from the section context and the rest of your resume.",
    targetLabel: "Custom Entry Heading",
    textMaxLength: 120,
    itemMaxLength: 220,
    desiredItemCount: 0,
    maxItems: 0,
    currentValue: clean(entry.heading),
    targetContext: compactObject({
      sectionTitle: clean(section.title),
      entryStyle: section.entryStyle,
      currentHeading: clean(entry.heading),
      subheading: clean(entry.subheading),
      dateRange: clean(entry.dateRange),
      description: clean(entry.description),
      bullets: compactList(entry.bullets, 4),
    }),
    sharedContext: buildSharedContext(resume),
    instructions: [
      "Return a single concise heading for this custom entry.",
      "Keep it specific to the section title and supplied context.",
      "Do not add numbering, quotation marks, or explanation.",
      "Do not invent an award, role, qualification, or activity that is not supported by the context.",
    ],
  };
}

function buildCustomEntryDescriptionPlan(resume: ResumeAiContext, entityId?: string): GenerationPlan | InlineAiResult {
  const { section, entry } = findCustomEntry(resume, entityId);

  if (!clean(section.title)) {
    return needsContext(
      "Fill in the custom section title first so the AI can describe this entry in the right context.",
      "text",
      ["Custom section title"]
    );
  }

  const hasContext =
    clean(entry.description) ||
    clean(entry.heading) ||
    clean(entry.subheading) ||
    clean(entry.dateRange) ||
    compactList(entry.bullets).length > 0;

  if (!hasContext) {
    return needsContext(
      "Add a heading or a few details to this custom entry first so the AI can draft a useful description.",
      "text",
      ["Custom entry heading or details"]
    );
  }

  return {
    kind: "text",
    successMessage: clean(entry.description)
      ? "Improved the custom entry description using the section and resume context."
      : "Drafted a custom entry description from the section and resume context.",
    targetLabel: "Custom Entry Description",
    textMaxLength: 300,
    itemMaxLength: 220,
    desiredItemCount: 0,
    maxItems: 0,
    currentValue: clean(entry.description),
    targetContext: compactObject({
      sectionTitle: clean(section.title),
      entryStyle: section.entryStyle,
      heading: clean(entry.heading),
      subheading: clean(entry.subheading),
      dateRange: clean(entry.dateRange),
      currentDescription: clean(entry.description),
      bullets: compactList(entry.bullets, 4),
    }),
    sharedContext: buildSharedContext(resume),
    instructions: [
      "Write 1 to 2 concise sentences for this custom entry description.",
      "Keep it resume-ready and specific to the section title and entry details.",
      "Do not invent facts, outcomes, or credentials that are not grounded in the context.",
    ],
  };
}

function buildCustomEntryBulletsPlan(resume: ResumeAiContext, entityId?: string): GenerationPlan | InlineAiResult {
  const { section, entry } = findCustomEntry(resume, entityId);

  if (!clean(section.title)) {
    return needsContext(
      "Fill in the custom section title first so the AI can draft bullets in the right context.",
      "list",
      ["Custom section title"]
    );
  }

  const hasContext =
    compactList(entry.bullets).length > 0 ||
    clean(entry.heading) ||
    clean(entry.subheading) ||
    clean(entry.description) ||
    clean(entry.dateRange);

  if (!hasContext) {
    return needsContext(
      "Add a heading, description, or other details to this custom entry first so the AI can draft useful bullets.",
      "list",
      ["Custom entry details"]
    );
  }

  return {
    kind: "list",
    successMessage: compactList(entry.bullets).length > 0
      ? "Improved the custom entry bullets using the section and resume context."
      : "Drafted custom entry bullets from the section and resume context.",
    targetLabel: "Custom Entry Bullets",
    textMaxLength: 1000,
    itemMaxLength: 220,
    desiredItemCount: Math.min(Math.max(compactList(entry.bullets).length || 4, 3), 5),
    maxItems: 8,
    currentValue: compactList(entry.bullets, 8),
    targetContext: compactObject({
      sectionTitle: clean(section.title),
      entryStyle: section.entryStyle,
      heading: clean(entry.heading),
      subheading: clean(entry.subheading),
      dateRange: clean(entry.dateRange),
      description: clean(entry.description),
      currentBullets: compactList(entry.bullets, 8),
    }),
    sharedContext: buildSharedContext(resume),
    instructions: [
      "Write 3 to 5 concise bullet points for this custom entry.",
      "Keep the bullets specific to the entry and section title.",
      "Use action-oriented, resume-ready phrasing where appropriate.",
      "Do not invent facts, metrics, or achievements that are not grounded in the context.",
    ],
  };
}

function buildPlan(input: InlineAiRequest): GenerationPlan | InlineAiResult {
  switch (input.target) {
    case "summary":
      return buildSummaryPlan(input.resume);
    case "experience_bullets":
      return buildExperiencePlan(input.resume, input.entityId);
    case "education_bullets":
      return buildEducationPlan(input.resume, input.entityId);
    case "project_name":
      return buildProjectNamePlan(input.resume, input.entityId);
    case "project_description":
      return buildProjectDescriptionPlan(input.resume, input.entityId);
    case "project_bullets":
      return buildProjectPlan(input.resume, input.entityId);
    case "skills_group":
      return buildSkillsPlan(input.resume, input.entityId);
    case "custom_entry_heading":
      return buildCustomEntryHeadingPlan(input.resume, input.entityId);
    case "custom_entry_description":
      return buildCustomEntryDescriptionPlan(input.resume, input.entityId);
    case "custom_entry_bullets":
      return buildCustomEntryBulletsPlan(input.resume, input.entityId);
    default: {
      const exhaustiveCheck: never = input.target;
      throw new InlineAiRequestError(`Unsupported AI target: ${exhaustiveCheck}`);
    }
  }
}

function validateModeRequirements(input: InlineAiRequest, plan: GenerationPlan): InlineAiResult | null {
  if (input.mode === "improve" && !hasCurrentContent(plan.currentValue)) {
    return needsContext(
      `There is no existing ${formatTargetLabelForMessage(plan.targetLabel)} to improve yet. Fill it first or switch to Generate fresh.`,
      plan.kind,
      [plan.targetLabel]
    );
  }

  if (input.mode === "tailor" && !clean(input.jobDescription)) {
    return needsContext(
      "Paste the job description first so the AI can tailor this field to the role.",
      plan.kind,
      ["Job description"]
    );
  }

  return null;
}

function buildPrompt(input: InlineAiRequest, plan: GenerationPlan) {
  const modeInstruction =
    input.mode === "improve"
      ? "Improve the current field content while preserving supported facts and making it stronger."
      : input.mode === "tailor"
        ? "Tailor the field content to the supplied job description while staying truthful to the resume context."
        : "Generate a fresh field draft from the provided resume context.";

  return JSON.stringify(
    {
      target: input.target,
      targetLabel: plan.targetLabel,
      outputKind: plan.kind,
      mode: input.mode,
      tone: input.tone,
      desiredItemCount: plan.desiredItemCount,
      maxItems: plan.maxItems,
      instructions: [
        modeInstruction,
        toneInstructions[input.tone],
        ...plan.instructions,
        clean(input.instruction) ? `Additional user instruction: ${clean(input.instruction)}` : undefined,
      ].filter(Boolean),
      currentFieldValue: plan.currentValue,
      targetContext: plan.targetContext,
      broaderResumeContext: plan.sharedContext,
      jobDescription: clean(input.jobDescription),
    },
    null,
    2
  );
}

function normalizeGroqOutput(
  output: z.infer<typeof groqCompletionSchema>,
  plan: GenerationPlan,
  mode: InlineAiMode
): InlineAiResult {
  const text = clean(output.text).slice(0, plan.textMaxLength).trim();
  const items = output.items
    .map((item) => clean(item).slice(0, plan.itemMaxLength).trim())
    .filter(Boolean)
    .slice(0, plan.maxItems);
  const successMessage = getSuccessMessage(plan.targetLabel, mode, plan.successMessage);

  if (plan.kind === "text") {
    if (!text) {
      throw new Error("AI returned an empty text draft.");
    }
    return {
      status: "ready",
      kind: "text",
      message: successMessage,
      text,
      items: [],
      missingFields: [],
    };
  }

  if (items.length === 0) {
    throw new Error("AI returned an empty list draft.");
  }

  return {
    status: "ready",
    kind: "list",
    message: successMessage,
    text: "",
    items,
    missingFields: [],
  };
}

async function callGroq(input: InlineAiRequest, plan: GenerationPlan): Promise<InlineAiResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const model = DEFAULT_GROQ_MODEL;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            'You generate resume-ready inline field content. Use only facts grounded in the supplied resume context. Do not invent employers, degrees, dates, metrics, skills, tools, URLs, certifications, or outcomes. Return valid JSON only. Put single-field text output in "text" and leave "items" empty. Put list output in "items" and leave "text" empty. Do not return markdown, labels, or explanation.',
        },
        {
          role: "user",
          content: buildPrompt(input, plan),
        },
      ],
      response_format: getGroqResponseFormat(model),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Groq response did not include structured content.");
  }

  const parsed = parseGroqContent(content, plan);
  return normalizeGroqOutput(parsed, plan, input.mode);
}

export async function generateInlineAiSuggestion(input: InlineAiRequest): Promise<InlineAiResult> {
  const plan = buildPlan(input);
  if ("status" in plan) {
    return plan;
  }

  const modeError = validateModeRequirements(input, plan);
  if (modeError) {
    return modeError;
  }

  return callGroq(input, plan);
}

export { InlineAiRequestError };
