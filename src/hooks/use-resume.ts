"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  ResumeData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SkillGroup,
  CertificationItem,
  LinkItem,
  RefereeItem,
  CustomSection,
  CustomSectionEntry,
  StyleConfig,
  SectionOrder,
  SectionTitles,
  SectionKey,
  PersonalDetails,
  PersonalDetailRow,
} from "@/components/templates/types";

const STORAGE_KEY = "resumeforge_draft";

const defaultStyleConfig: StyleConfig = {
  fontSize: 13,
  nameFontSize: 26,
  sectionTitleFontSize: 14,
  accentTone: "slate",
  spacing: "normal",
  showSectionDividers: true,
  paperSize: "a4",
};

export const defaultSectionOrder: SectionOrder[] = [
  { key: "summary", visible: true },
  { key: "personalDetails", visible: true },
  { key: "experience", visible: true },
  { key: "education", visible: true },
  { key: "skills", visible: true },
  { key: "projects", visible: true },
  { key: "certifications", visible: true },
  { key: "links", visible: true },
  { key: "hobbies", visible: true },
  { key: "referees", visible: true },
  { key: "custom", visible: true },
];

export const registrySectionOrder: SectionOrder[] = [
  { key: "summary", visible: true },
  { key: "personalDetails", visible: true },
  { key: "education", visible: true },
  { key: "experience", visible: true },
  { key: "skills", visible: true },
  { key: "hobbies", visible: true },
  { key: "referees", visible: true },
  { key: "projects", visible: true },
  { key: "certifications", visible: true },
  { key: "links", visible: true },
  { key: "custom", visible: true },
];

const defaultSectionTitles: SectionTitles = {};

export interface ResumeInitOptions {
  initialTemplateKey?: string;
  initialDocumentType?: "resume" | "cv";
  initialSectionOrder?: SectionOrder[];
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function createPersonalDetails(): PersonalDetails {
  return { extraDetails: [] };
}

function createDefaultData(): ResumeData {
  return {
    basics: { fullName: "", email: "" },
    summary: "",
    personalDetails: createPersonalDetails(),
    experience: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    links: [],
    hobbies: [],
    referees: [],
    customSections: [],
  };
}

function cloneSectionOrder(sectionOrder: SectionOrder[]): SectionOrder[] {
  return sectionOrder.map((section) => ({ ...section }));
}

function normalizePersonalDetails(personalDetails?: Partial<PersonalDetails>): PersonalDetails {
  return {
    dateOfBirth: personalDetails?.dateOfBirth || "",
    stateOfOrigin: personalDetails?.stateOfOrigin || "",
    localGovernmentArea: personalDetails?.localGovernmentArea || "",
    sex: personalDetails?.sex || "",
    maritalStatus: personalDetails?.maritalStatus || "",
    nationality: personalDetails?.nationality || "",
    religion: personalDetails?.religion || "",
    extraDetails: (personalDetails?.extraDetails || []).map((detail) => ({
      id: detail.id || genId(),
      label: detail.label || "",
      value: detail.value || "",
    })),
  };
}

function normalizeResumeData(data?: Partial<ResumeData>): ResumeData {
  return {
    basics: {
      fullName: data?.basics?.fullName || "",
      email: data?.basics?.email || "",
      phone: data?.basics?.phone || "",
      location: data?.basics?.location || "",
      jobTitle: data?.basics?.jobTitle || "",
      website: data?.basics?.website || "",
    },
    summary: data?.summary || "",
    personalDetails: normalizePersonalDetails(data?.personalDetails),
    experience: data?.experience || [],
    education: data?.education || [],
    projects: (data?.projects || []).map((project) => ({
      ...project,
      description: project.description || "",
      bullets: project.bullets || [],
    })),
    skills: data?.skills || [],
    certifications: data?.certifications || [],
    links: data?.links || [],
    hobbies: data?.hobbies || [],
    referees: data?.referees || [],
    customSections: (data?.customSections || []).map((section) => ({
      ...section,
      entryStyle: section.entryStyle || "standard",
      entries: (section.entries || []).map((entry) => ({
        ...entry,
        bullets: entry.bullets || [],
        tags: entry.tags || [],
      })),
    })),
  };
}

function normalizeStyleConfig(styleConfig?: Partial<StyleConfig> & { fontScale?: "compact" | "comfortable" }) {
  return {
    fontSize: styleConfig?.fontSize ?? (styleConfig?.fontScale === "compact" ? 11 : 13),
    nameFontSize: styleConfig?.nameFontSize ?? 26,
    sectionTitleFontSize: styleConfig?.sectionTitleFontSize ?? 14,
    accentTone: styleConfig?.accentTone || "slate",
    spacing: styleConfig?.spacing || "normal",
    showSectionDividers: styleConfig?.showSectionDividers ?? true,
    paperSize: styleConfig?.paperSize || "a4",
  } satisfies StyleConfig;
}

function normalizeSectionOrder(sectionOrder?: SectionOrder[], fallback = defaultSectionOrder): SectionOrder[] {
  const base = cloneSectionOrder(fallback);
  if (!sectionOrder || sectionOrder.length === 0) {
    return base;
  }

  const seen = new Set<SectionKey>();
  const normalized: SectionOrder[] = [];

  for (const section of sectionOrder) {
    if (!section?.key || seen.has(section.key)) {
      continue;
    }
    seen.add(section.key);
    normalized.push({ key: section.key, visible: section.visible ?? true });
  }

  for (const section of base) {
    if (!seen.has(section.key)) {
      normalized.push(section);
    }
  }

  return normalized;
}

function normalizeSectionTitles(sectionTitles?: SectionTitles): SectionTitles {
  return sectionTitles || defaultSectionTitles;
}

export function useResume(storageKey = STORAGE_KEY, initOptions: ResumeInitOptions = {}) {
  const initialOptionsRef = useRef(initOptions);
  const [data, setData] = useState<ResumeData>(createDefaultData);
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(defaultStyleConfig);
  const [templateKey, setTemplateKey] = useState("atlas");
  const [documentType, setDocumentType] = useState<"resume" | "cv">("resume");
  const [sectionOrder, setSectionOrder] = useState<SectionOrder[]>(cloneSectionOrder(defaultSectionOrder));
  const [sectionTitles, setSectionTitles] = useState<SectionTitles>(defaultSectionTitles);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const initialOptions = initialOptionsRef.current;
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);

          if (parsed.basics) {
            setData(normalizeResumeData(parsed));
          }
          if (parsed.styleConfig) {
            setStyleConfig(normalizeStyleConfig(parsed.styleConfig));
          }
          if (parsed.templateKey) {
            setTemplateKey(parsed.templateKey);
          }
          if (parsed.documentType) {
            setDocumentType(parsed.documentType);
          }
          if (parsed.sectionOrder) {
            setSectionOrder(normalizeSectionOrder(parsed.sectionOrder));
          }
          if (parsed.sectionTitles) {
            setSectionTitles(normalizeSectionTitles(parsed.sectionTitles));
          }
        } else {
          if (initialOptions.initialTemplateKey) {
            setTemplateKey(initialOptions.initialTemplateKey);
          }
          if (initialOptions.initialDocumentType) {
            setDocumentType(initialOptions.initialDocumentType);
          }
          if (initialOptions.initialSectionOrder) {
            setSectionOrder(normalizeSectionOrder(initialOptions.initialSectionOrder));
          }
        }
      } catch {
        // Ignore parse errors and fall back to defaults.
      }

      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const fullData = { ...data, styleConfig, templateKey, documentType, sectionOrder, sectionTitles };
      localStorage.setItem(storageKey, JSON.stringify(fullData));
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, styleConfig, templateKey, documentType, sectionOrder, sectionTitles, loaded, storageKey]);

  const updateBasics = useCallback((updates: Partial<ResumeData["basics"]>) => {
    setData((prev) => ({ ...prev, basics: { ...prev.basics, ...updates } }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setData((prev) => ({ ...prev, summary }));
  }, []);

  const updatePersonalDetails = useCallback((updates: Partial<PersonalDetails>) => {
    setData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        ...updates,
        extraDetails: updates.extraDetails ?? prev.personalDetails.extraDetails,
      },
    }));
  }, []);

  const addPersonalDetailRow = useCallback((): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        extraDetails: [...prev.personalDetails.extraDetails, { id, label: "", value: "" }],
      },
    }));
    return id;
  }, []);

  const updatePersonalDetailRow = useCallback((id: string, updates: Partial<PersonalDetailRow>) => {
    setData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        extraDetails: prev.personalDetails.extraDetails.map((detail) =>
          detail.id === id ? { ...detail, ...updates } : detail
        ),
      },
    }));
  }, []);

  const removePersonalDetailRow = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        extraDetails: prev.personalDetails.extraDetails.filter((detail) => detail.id !== id),
      },
    }));
  }, []);

  const addHobby = useCallback(() => {
    setData((prev) => ({ ...prev, hobbies: [...prev.hobbies, ""] }));
  }, []);

  const updateHobby = useCallback((index: number, value: string) => {
    setData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.map((hobby, hobbyIndex) => (hobbyIndex === index ? value : hobby)),
    }));
  }, []);

  const removeHobby = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, hobbyIndex) => hobbyIndex !== index),
    }));
  }, []);

  const addExperience = useCallback((): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      experience: [...prev.experience, { id, company: "", position: "", startDate: "", bullets: [] }],
    }));
    return id;
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<ExperienceItem>) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setData((prev) => ({ ...prev, experience: prev.experience.filter((item) => item.id !== id) }));
  }, []);

  const moveExperience = useCallback((id: string, direction: "up" | "down") => {
    setData((prev) => {
      const items = [...prev.experience];
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) return prev;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return prev;
      [items[index], items[target]] = [items[target], items[index]];
      return { ...prev, experience: items };
    });
  }, []);

  const addEducation = useCallback((): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      education: [...prev.education, { id, institution: "", degree: "", bullets: [] }],
    }));
    return id;
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<EducationItem>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setData((prev) => ({ ...prev, education: prev.education.filter((item) => item.id !== id) }));
  }, []);

  const moveEducation = useCallback((id: string, direction: "up" | "down") => {
    setData((prev) => {
      const items = [...prev.education];
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) return prev;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return prev;
      [items[index], items[target]] = [items[target], items[index]];
      return { ...prev, education: items };
    });
  }, []);

  const addProject = useCallback((): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, { id, name: "", description: "", bullets: [] }],
    }));
    return id;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((item) => item.id !== id) }));
  }, []);

  const addSkillGroup = useCallback((): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, { id, category: "", items: [] }],
    }));
    return id;
  }, []);

  const updateSkillGroup = useCallback((id: string, updates: Partial<SkillGroup>) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  }, []);

  const removeSkillGroup = useCallback((id: string) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((item) => item.id !== id) }));
  }, []);

  const addSkillItem = useCallback((groupId: string, item: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((group) =>
        group.id === groupId ? { ...group, items: [...group.items, item] } : group
      ),
    }));
  }, []);

  const removeSkillItem = useCallback((groupId: string, index: number) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((group) =>
        group.id === groupId
          ? { ...group, items: group.items.filter((_, itemIndex) => itemIndex !== index) }
          : group
      ),
    }));
  }, []);

  const addCertification = useCallback((): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { id, name: "" }],
    }));
    return id;
  }, []);

  const updateCertification = useCallback((id: string, updates: Partial<CertificationItem>) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
    }));
  }, []);

  const addLink = useCallback((): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      links: [...prev.links, { id, label: "", url: "" }],
    }));
    return id;
  }, []);

  const updateLink = useCallback((id: string, updates: Partial<LinkItem>) => {
    setData((prev) => ({
      ...prev,
      links: prev.links.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  }, []);

  const removeLink = useCallback((id: string) => {
    setData((prev) => ({ ...prev, links: prev.links.filter((item) => item.id !== id) }));
  }, []);

  const addReferee = useCallback((): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      referees: [...prev.referees, { id, name: "" }],
    }));
    return id;
  }, []);

  const updateReferee = useCallback((id: string, updates: Partial<RefereeItem>) => {
    setData((prev) => ({
      ...prev,
      referees: prev.referees.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  }, []);

  const removeReferee = useCallback((id: string) => {
    setData((prev) => ({ ...prev, referees: prev.referees.filter((item) => item.id !== id) }));
  }, []);

  const addCustomSection = useCallback((): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        { id, title: "", entryStyle: "standard" as const, entries: [] },
      ],
    }));
    return id;
  }, []);

  const updateCustomSection = useCallback((id: string, updates: Partial<CustomSection>) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      ),
    }));
  }, []);

  const removeCustomSection = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((section) => section.id !== id),
    }));
  }, []);

  const addCustomEntry = useCallback((sectionId: string): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === sectionId
          ? { ...section, entries: [...section.entries, { id, heading: "", bullets: [] }] }
          : section
      ),
    }));
    return id;
  }, []);

  const updateCustomEntry = useCallback(
    (sectionId: string, entryId: string, updates: Partial<CustomSectionEntry>) => {
      setData((prev) => ({
        ...prev,
        customSections: prev.customSections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                entries: section.entries.map((entry) =>
                  entry.id === entryId ? { ...entry, ...updates } : entry
                ),
              }
            : section
        ),
      }));
    },
    []
  );

  const removeCustomEntry = useCallback((sectionId: string, entryId: string) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === sectionId
          ? { ...section, entries: section.entries.filter((entry) => entry.id !== entryId) }
          : section
      ),
    }));
  }, []);

  const addBullet = useCallback((section: "experience" | "education" | "projects", itemId: string) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] as Array<{ id: string; bullets: string[] }>).map((item) =>
        item.id === itemId ? { ...item, bullets: [...item.bullets, ""] } : item
      ),
    }));
  }, []);

  const updateBullet = useCallback(
    (section: "experience" | "education" | "projects", itemId: string, bulletIndex: number, text: string) => {
      setData((prev) => ({
        ...prev,
        [section]: (prev[section] as Array<{ id: string; bullets: string[] }>).map((item) =>
          item.id === itemId
            ? {
                ...item,
                bullets: item.bullets.map((bullet, currentIndex) =>
                  currentIndex === bulletIndex ? text : bullet
                ),
              }
            : item
        ),
      }));
    },
    []
  );

  const removeBullet = useCallback(
    (section: "experience" | "education" | "projects", itemId: string, bulletIndex: number) => {
      setData((prev) => ({
        ...prev,
        [section]: (prev[section] as Array<{ id: string; bullets: string[] }>).map((item) =>
          item.id === itemId
            ? { ...item, bullets: item.bullets.filter((_, currentIndex) => currentIndex !== bulletIndex) }
            : item
        ),
      }));
    },
    []
  );

  const moveSection = useCallback((key: SectionKey, direction: "up" | "down") => {
    setSectionOrder((prev) => {
      const items = [...prev];
      const index = items.findIndex((item) => item.key === key);
      if (index < 0) return prev;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return prev;
      [items[index], items[target]] = [items[target], items[index]];
      return items;
    });
  }, []);

  const toggleSectionVisibility = useCallback((key: SectionKey) => {
    setSectionOrder((prev) =>
      prev.map((section) => (section.key === key ? { ...section, visible: !section.visible } : section))
    );
  }, []);

  const updateSectionTitle = useCallback((key: keyof SectionTitles, title: string) => {
    setSectionTitles((prev) => ({ ...prev, [key]: title || undefined }));
  }, []);

  const exportJSON = useCallback(() => {
    const payload = { schemaVersion: "1.0", documentType, templateKey, ...data, styleConfig, sectionOrder, sectionTitles };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `resume-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [data, styleConfig, templateKey, documentType, sectionOrder, sectionTitles]);

  const importJSON = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.basics) {
        return false;
      }

      setData(normalizeResumeData(parsed));
      if (parsed.styleConfig) {
        setStyleConfig(normalizeStyleConfig(parsed.styleConfig));
      }
      setTemplateKey(parsed.templateKey || "atlas");
      setDocumentType(parsed.documentType || "resume");
      setSectionOrder(normalizeSectionOrder(parsed.sectionOrder));
      setSectionTitles(normalizeSectionTitles(parsed.sectionTitles));

      return true;
    } catch {
      return false;
    }
  }, []);

  const clearAll = useCallback(() => {
    setData(createDefaultData());
    setStyleConfig(defaultStyleConfig);
    setTemplateKey("atlas");
    setDocumentType("resume");
    setSectionOrder(cloneSectionOrder(defaultSectionOrder));
    setSectionTitles(defaultSectionTitles);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const completionPercent = (() => {
    let filled = 0;
    const total = 5;
    if (data.basics.fullName && data.basics.email) filled++;
    if (data.summary.length > 10) filled++;
    if (data.experience.length > 0) filled++;
    if (data.education.length > 0) filled++;
    if (data.skills.length > 0) filled++;
    return Math.round((filled / total) * 100);
  })();

  return {
    data,
    styleConfig,
    templateKey,
    documentType,
    sectionOrder,
    sectionTitles,
    loaded,
    completionPercent,
    setStyleConfig,
    setTemplateKey,
    setDocumentType,
    updateBasics,
    updateSummary,
    updatePersonalDetails,
    addPersonalDetailRow,
    updatePersonalDetailRow,
    removePersonalDetailRow,
    addHobby,
    updateHobby,
    removeHobby,
    addExperience,
    updateExperience,
    removeExperience,
    moveExperience,
    addEducation,
    updateEducation,
    removeEducation,
    moveEducation,
    addProject,
    updateProject,
    removeProject,
    addSkillGroup,
    updateSkillGroup,
    removeSkillGroup,
    addSkillItem,
    removeSkillItem,
    addCertification,
    updateCertification,
    removeCertification,
    addLink,
    updateLink,
    removeLink,
    addReferee,
    updateReferee,
    removeReferee,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    addCustomEntry,
    updateCustomEntry,
    removeCustomEntry,
    addBullet,
    updateBullet,
    removeBullet,
    moveSection,
    toggleSectionVisibility,
    updateSectionTitle,
    exportJSON,
    importJSON,
    clearAll,
  };
}
