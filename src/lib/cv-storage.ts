import { CV, CVData, DEFAULT_CV_DATA, TemplateId } from "@/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "resumeforge_cvs";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function getTemplateId(value: unknown, fallback: TemplateId = "modern"): TemplateId {
  return value === "modern" || value === "classic" || value === "creative" ? value : fallback;
}

function cloneDefaultCVData(): CVData {
  return {
    personalInfo: { ...DEFAULT_CV_DATA.personalInfo },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
  };
}

export function normalizeCVData(value: unknown): CVData {
  const base = cloneDefaultCVData();

  if (!isRecord(value)) {
    return base;
  }

  const personalInfo = isRecord(value.personalInfo) ? value.personalInfo : {};

  return {
    personalInfo: {
      firstName: getString(personalInfo.firstName),
      lastName: getString(personalInfo.lastName),
      email: getString(personalInfo.email),
      phone: getString(personalInfo.phone),
      location: getString(personalInfo.location),
      linkedin: getString(personalInfo.linkedin),
      portfolio: getString(personalInfo.portfolio),
      summary: getString(personalInfo.summary),
    },
    experience: Array.isArray(value.experience)
      ? value.experience
          .filter(isRecord)
          .map((experience) => ({
            id: getString(experience.id, generateId()),
            company: getString(experience.company),
            position: getString(experience.position),
            startDate: getString(experience.startDate),
            endDate: getString(experience.endDate),
            current: getBoolean(experience.current),
            description: getString(experience.description),
          }))
      : [],
    education: Array.isArray(value.education)
      ? value.education
          .filter(isRecord)
          .map((education) => ({
            id: getString(education.id, generateId()),
            institution: getString(education.institution),
            degree: getString(education.degree),
            field: getString(education.field),
            startDate: getString(education.startDate),
            endDate: getString(education.endDate),
            current: getBoolean(education.current),
            description: getString(education.description),
          }))
      : [],
    skills: Array.isArray(value.skills)
      ? value.skills
          .filter(isRecord)
          .map((skill) => ({
            id: getString(skill.id, generateId()),
            name: getString(skill.name),
            level:
              skill.level === "beginner" ||
              skill.level === "intermediate" ||
              skill.level === "advanced" ||
              skill.level === "expert"
                ? skill.level
                : "intermediate",
          }))
      : [],
    projects: Array.isArray(value.projects)
      ? value.projects
          .filter(isRecord)
          .map((project) => ({
            id: getString(project.id, generateId()),
            name: getString(project.name),
            description: getString(project.description),
            url: getString(project.url),
            technologies: Array.isArray(project.technologies)
              ? project.technologies.filter((technology): technology is string => typeof technology === "string")
              : [],
          }))
      : [],
    certifications: Array.isArray(value.certifications)
      ? value.certifications
          .filter(isRecord)
          .map((certification) => ({
            id: getString(certification.id, generateId()),
            name: getString(certification.name),
            issuer: getString(certification.issuer),
            date: getString(certification.date),
            url: getString(certification.url),
          }))
      : [],
    languages: Array.isArray(value.languages)
      ? value.languages
          .filter(isRecord)
          .map((language) => ({
            id: getString(language.id, generateId()),
            name: getString(language.name),
            proficiency:
              language.proficiency === "basic" ||
              language.proficiency === "conversational" ||
              language.proficiency === "fluent" ||
              language.proficiency === "native"
                ? language.proficiency
                : "fluent",
          }))
      : [],
    customSections: Array.isArray(value.customSections)
      ? value.customSections
          .filter(isRecord)
          .map((section) => ({
            id: getString(section.id, generateId()),
            title: getString(section.title),
            items: Array.isArray(section.items)
              ? section.items
                  .filter(isRecord)
                  .map((item) => ({
                    id: getString(item.id, generateId()),
                    title: getString(item.title),
                    subtitle: getString(item.subtitle),
                    description: getString(item.description),
                    date: getString(item.date),
                  }))
              : [],
          }))
      : [],
  };
}

function normalizeCV(value: unknown): CV | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = getString(value.id);

  if (!id) {
    return null;
  }

  const now = new Date().toISOString();

  return {
    id,
    userId: getString(value.userId, "local"),
    title: getString(value.title, "Untitled Resume"),
    templateId: getTemplateId(value.templateId),
    data: normalizeCVData(value.data),
    createdAt: getString(value.createdAt, now),
    updatedAt: getString(value.updatedAt, now),
  };
}

export function loadCVsFromStorage(): CV[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeCV).filter((cv): cv is CV => cv !== null);
  } catch {
    return [];
  }
}

export function saveCVsToStorage(cvs: CV[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
}

export function createCVRecord(
  title = "Untitled Resume",
  templateId: TemplateId = "modern"
): CV {
  const now = new Date().toISOString();
  const safeTitle = title.trim() || "Untitled Resume";

  return {
    id: generateId(),
    userId: "local",
    title: safeTitle,
    templateId,
    data: cloneDefaultCVData(),
    createdAt: now,
    updatedAt: now,
  };
}

export function upsertCVRecord(nextCV: CV): CV[] {
  const cvs = loadCVsFromStorage();
  const existingIndex = cvs.findIndex((cv) => cv.id === nextCV.id);

  if (existingIndex >= 0) {
    cvs[existingIndex] = nextCV;
    saveCVsToStorage(cvs);
    return cvs;
  }

  const updatedCVs = [nextCV, ...cvs];
  saveCVsToStorage(updatedCVs);
  return updatedCVs;
}

export function updateCVRecord(
  cvId: string,
  updater: (currentCV: CV) => CV
): CV | null {
  const cvs = loadCVsFromStorage();
  const existingIndex = cvs.findIndex((cv) => cv.id === cvId);

  if (existingIndex < 0) {
    return null;
  }

  const nextCV = updater(cvs[existingIndex]);
  cvs[existingIndex] = {
    ...nextCV,
    id: cvs[existingIndex].id,
  };

  saveCVsToStorage(cvs);
  return cvs[existingIndex];
}

export function duplicateCVRecord(cv: CV): CV {
  const now = new Date().toISOString();

  return {
    ...cv,
    id: generateId(),
    title: `${cv.title} (Copy)`,
    data: normalizeCVData(cv.data),
    createdAt: now,
    updatedAt: now,
  };
}
