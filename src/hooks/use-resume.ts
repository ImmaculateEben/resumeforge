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
} from "@/components/templates/types";

const STORAGE_KEY = "resumeforge_draft";

const defaultData: ResumeData = {
  basics: { fullName: "", email: "" },
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  links: [],
  referees: [],
  customSections: [],
};

const defaultStyleConfig: StyleConfig = {
  fontSize: 13,
  nameFontSize: 26,
  sectionTitleFontSize: 14,
  accentTone: "slate",
  spacing: "normal",
  showSectionDividers: true,
};

export const defaultSectionOrder: SectionOrder[] = [
  { key: "summary", visible: true },
  { key: "experience", visible: true },
  { key: "education", visible: true },
  { key: "skills", visible: true },
  { key: "projects", visible: true },
  { key: "certifications", visible: true },
  { key: "links", visible: true },
  { key: "referees", visible: true },
  { key: "custom", visible: true },
];

const defaultSectionTitles: SectionTitles = {};

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function useResume(storageKey = STORAGE_KEY) {
  const [data, setData] = useState<ResumeData>(defaultData);
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(defaultStyleConfig);
  const [templateKey, setTemplateKey] = useState("atlas");
  const [documentType, setDocumentType] = useState<"resume" | "cv">("resume");
  const [sectionOrder, setSectionOrder] = useState<SectionOrder[]>(defaultSectionOrder);
  const [sectionTitles, setSectionTitles] = useState<SectionTitles>(defaultSectionTitles);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.basics) {
          setData({
            basics: parsed.basics || defaultData.basics,
            summary: parsed.summary || "",
            experience: parsed.experience || [],
            education: parsed.education || [],
            projects: parsed.projects || [],
            skills: parsed.skills || [],
            certifications: parsed.certifications || [],
            links: parsed.links || [],
            referees: parsed.referees || [],
            customSections: (parsed.customSections || []).map((s: CustomSection) => ({
              ...s,
              entryStyle: s.entryStyle || "standard",
            })),
          });
        }
        if (parsed.styleConfig) {
          // Migrate old fontScale-based configs
          const sc = parsed.styleConfig;
          setStyleConfig({
            fontSize: sc.fontSize ?? (sc.fontScale === "compact" ? 11 : 13),
            nameFontSize: sc.nameFontSize ?? 26,
            sectionTitleFontSize: sc.sectionTitleFontSize ?? 14,
            accentTone: sc.accentTone || "slate",
            spacing: sc.spacing || "normal",
            showSectionDividers: sc.showSectionDividers ?? true,
          });
        }
        if (parsed.templateKey) setTemplateKey(parsed.templateKey);
        if (parsed.documentType) setDocumentType(parsed.documentType);
        if (parsed.sectionOrder) setSectionOrder(parsed.sectionOrder);
        if (parsed.sectionTitles) setSectionTitles(parsed.sectionTitles);
      }
    } catch {
      // Ignore parse errors
    }
    setLoaded(true);
  }, [storageKey]);

  // Debounced auto-save
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const fullData = { ...data, styleConfig, templateKey, documentType, sectionOrder, sectionTitles };
      localStorage.setItem(storageKey, JSON.stringify(fullData));
    }, 400);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [data, styleConfig, templateKey, documentType, sectionOrder, sectionTitles, loaded, storageKey]);

  // Basics
  const updateBasics = useCallback((updates: Partial<ResumeData["basics"]>) => {
    setData((prev) => ({ ...prev, basics: { ...prev.basics, ...updates } }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setData((prev) => ({ ...prev, summary }));
  }, []);

  // Experience
  const addExperience = useCallback((): string => {
    const id = genId();
    setData((prev) => ({ ...prev, experience: [...prev.experience, { id, company: "", position: "", startDate: "", bullets: [] }] }));
    return id;
  }, []);
  const updateExperience = useCallback((id: string, updates: Partial<ExperienceItem>) => {
    setData((prev) => ({ ...prev, experience: prev.experience.map((e) => (e.id === id ? { ...e, ...updates } : e)) }));
  }, []);
  const removeExperience = useCallback((id: string) => {
    setData((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }));
  }, []);
  const moveExperience = useCallback((id: string, direction: "up" | "down") => {
    setData((prev) => {
      const arr = [...prev.experience];
      const idx = arr.findIndex((e) => e.id === id);
      if (idx < 0) return prev;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...prev, experience: arr };
    });
  }, []);

  // Education
  const addEducation = useCallback((): string => {
    const id = genId();
    setData((prev) => ({ ...prev, education: [...prev.education, { id, institution: "", degree: "", bullets: [] }] }));
    return id;
  }, []);
  const updateEducation = useCallback((id: string, updates: Partial<EducationItem>) => {
    setData((prev) => ({ ...prev, education: prev.education.map((e) => (e.id === id ? { ...e, ...updates } : e)) }));
  }, []);
  const removeEducation = useCallback((id: string) => {
    setData((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  }, []);
  const moveEducation = useCallback((id: string, direction: "up" | "down") => {
    setData((prev) => {
      const arr = [...prev.education];
      const idx = arr.findIndex((e) => e.id === id);
      if (idx < 0) return prev;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...prev, education: arr };
    });
  }, []);

  // Projects
  const addProject = useCallback((): string => {
    const id = genId();
    setData((prev) => ({ ...prev, projects: [...prev.projects, { id, name: "", bullets: [] }] }));
    return id;
  }, []);
  const updateProject = useCallback((id: string, updates: Partial<ProjectItem>) => {
    setData((prev) => ({ ...prev, projects: prev.projects.map((e) => (e.id === id ? { ...e, ...updates } : e)) }));
  }, []);
  const removeProject = useCallback((id: string) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((e) => e.id !== id) }));
  }, []);

  // Skills
  const addSkillGroup = useCallback((): string => {
    const id = genId();
    setData((prev) => ({ ...prev, skills: [...prev.skills, { id, category: "", items: [] }] }));
    return id;
  }, []);
  const updateSkillGroup = useCallback((id: string, updates: Partial<SkillGroup>) => {
    setData((prev) => ({ ...prev, skills: prev.skills.map((e) => (e.id === id ? { ...e, ...updates } : e)) }));
  }, []);
  const removeSkillGroup = useCallback((id: string) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((e) => e.id !== id) }));
  }, []);
  const addSkillItem = useCallback((groupId: string, item: string) => {
    setData((prev) => ({ ...prev, skills: prev.skills.map((g) => g.id === groupId ? { ...g, items: [...g.items, item] } : g) }));
  }, []);
  const removeSkillItem = useCallback((groupId: string, index: number) => {
    setData((prev) => ({ ...prev, skills: prev.skills.map((g) => g.id === groupId ? { ...g, items: g.items.filter((_, i) => i !== index) } : g) }));
  }, []);

  // Certifications
  const addCertification = useCallback((): string => {
    const id = genId();
    setData((prev) => ({ ...prev, certifications: [...prev.certifications, { id, name: "" }] }));
    return id;
  }, []);
  const updateCertification = useCallback((id: string, updates: Partial<CertificationItem>) => {
    setData((prev) => ({ ...prev, certifications: prev.certifications.map((e) => (e.id === id ? { ...e, ...updates } : e)) }));
  }, []);
  const removeCertification = useCallback((id: string) => {
    setData((prev) => ({ ...prev, certifications: prev.certifications.filter((e) => e.id !== id) }));
  }, []);

  // Links
  const addLink = useCallback((): string => {
    const id = genId();
    setData((prev) => ({ ...prev, links: [...prev.links, { id, label: "", url: "" }] }));
    return id;
  }, []);
  const updateLink = useCallback((id: string, updates: Partial<LinkItem>) => {
    setData((prev) => ({ ...prev, links: prev.links.map((e) => (e.id === id ? { ...e, ...updates } : e)) }));
  }, []);
  const removeLink = useCallback((id: string) => {
    setData((prev) => ({ ...prev, links: prev.links.filter((e) => e.id !== id) }));
  }, []);

  // Referees
  const addReferee = useCallback((): string => {
    const id = genId();
    setData((prev) => ({ ...prev, referees: [...prev.referees, { id, name: "" }] }));
    return id;
  }, []);
  const updateReferee = useCallback((id: string, updates: Partial<RefereeItem>) => {
    setData((prev) => ({ ...prev, referees: prev.referees.map((e) => (e.id === id ? { ...e, ...updates } : e)) }));
  }, []);
  const removeReferee = useCallback((id: string) => {
    setData((prev) => ({ ...prev, referees: prev.referees.filter((e) => e.id !== id) }));
  }, []);

  // Custom Sections
  const addCustomSection = useCallback((): string => {
    const id = genId();
    setData((prev) => ({ ...prev, customSections: [...prev.customSections, { id, title: "", entryStyle: "standard" as const, entries: [] }] }));
    return id;
  }, []);
  const updateCustomSection = useCallback((id: string, updates: Partial<CustomSection>) => {
    setData((prev) => ({ ...prev, customSections: prev.customSections.map((s) => (s.id === id ? { ...s, ...updates } : s)) }));
  }, []);
  const removeCustomSection = useCallback((id: string) => {
    setData((prev) => ({ ...prev, customSections: prev.customSections.filter((s) => s.id !== id) }));
  }, []);
  const addCustomEntry = useCallback((sectionId: string): string => {
    const id = genId();
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) =>
        s.id === sectionId ? { ...s, entries: [...s.entries, { id, heading: "", bullets: [] }] } : s
      ),
    }));
    return id;
  }, []);
  const updateCustomEntry = useCallback((sectionId: string, entryId: string, updates: Partial<CustomSectionEntry>) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) =>
        s.id === sectionId ? { ...s, entries: s.entries.map((e) => (e.id === entryId ? { ...e, ...updates } : e)) } : s
      ),
    }));
  }, []);
  const removeCustomEntry = useCallback((sectionId: string, entryId: string) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s) =>
        s.id === sectionId ? { ...s, entries: s.entries.filter((e) => e.id !== entryId) } : s
      ),
    }));
  }, []);

  // Bullet helpers
  const addBullet = useCallback((section: "experience" | "education" | "projects", itemId: string) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] as Array<{ id: string; bullets: string[] }>).map((item) =>
        item.id === itemId ? { ...item, bullets: [...item.bullets, ""] } : item
      ),
    }));
  }, []);
  const updateBullet = useCallback((section: "experience" | "education" | "projects", itemId: string, bulletIdx: number, text: string) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] as Array<{ id: string; bullets: string[] }>).map((item) =>
        item.id === itemId ? { ...item, bullets: item.bullets.map((b, i) => (i === bulletIdx ? text : b)) } : item
      ),
    }));
  }, []);
  const removeBullet = useCallback((section: "experience" | "education" | "projects", itemId: string, bulletIdx: number) => {
    setData((prev) => ({
      ...prev,
      [section]: (prev[section] as Array<{ id: string; bullets: string[] }>).map((item) =>
        item.id === itemId ? { ...item, bullets: item.bullets.filter((_, i) => i !== bulletIdx) } : item
      ),
    }));
  }, []);

  // Section order helpers
  const moveSection = useCallback((key: SectionKey, direction: "up" | "down") => {
    setSectionOrder((prev) => {
      const arr = [...prev];
      const idx = arr.findIndex((s) => s.key === key);
      if (idx < 0) return prev;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  }, []);
  const toggleSectionVisibility = useCallback((key: SectionKey) => {
    setSectionOrder((prev) => prev.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)));
  }, []);

  // Section title helpers
  const updateSectionTitle = useCallback((key: keyof SectionTitles, title: string) => {
    setSectionTitles((prev) => ({ ...prev, [key]: title || undefined }));
  }, []);

  // Export (still useful for JSON download)
  const exportJSON = useCallback(() => {
    const payload = { schemaVersion: "1.0", documentType, templateKey, ...data, styleConfig, sectionOrder, sectionTitles };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data, styleConfig, templateKey, documentType, sectionOrder, sectionTitles]);

  const importJSON = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.basics) {
        setData({
          basics: parsed.basics || defaultData.basics,
          summary: parsed.summary || "",
          experience: parsed.experience || [],
          education: parsed.education || [],
          projects: parsed.projects || [],
          skills: parsed.skills || [],
          certifications: parsed.certifications || [],
          links: parsed.links || [],
          referees: parsed.referees || [],
          customSections: (parsed.customSections || []).map((s: CustomSection) => ({ ...s, entryStyle: s.entryStyle || "standard" })),
        });
        if (parsed.styleConfig) {
          const sc = parsed.styleConfig;
          setStyleConfig({
            fontSize: sc.fontSize ?? (sc.fontScale === "compact" ? 11 : 13),
            nameFontSize: sc.nameFontSize ?? 26,
            sectionTitleFontSize: sc.sectionTitleFontSize ?? 14,
            accentTone: sc.accentTone || "slate",
            spacing: sc.spacing || "normal",
            showSectionDividers: sc.showSectionDividers ?? true,
          });
        }
        if (parsed.templateKey) setTemplateKey(parsed.templateKey);
        if (parsed.documentType) setDocumentType(parsed.documentType);
        if (parsed.sectionOrder) setSectionOrder(parsed.sectionOrder);
        if (parsed.sectionTitles) setSectionTitles(parsed.sectionTitles);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const clearAll = useCallback(() => {
    setData(defaultData);
    setStyleConfig(defaultStyleConfig);
    setTemplateKey("atlas");
    setDocumentType("resume");
    setSectionOrder(defaultSectionOrder);
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
    data, styleConfig, templateKey, documentType, sectionOrder, sectionTitles, loaded, completionPercent,
    setStyleConfig, setTemplateKey, setDocumentType,
    updateBasics, updateSummary,
    addExperience, updateExperience, removeExperience, moveExperience,
    addEducation, updateEducation, removeEducation, moveEducation,
    addProject, updateProject, removeProject,
    addSkillGroup, updateSkillGroup, removeSkillGroup, addSkillItem, removeSkillItem,
    addCertification, updateCertification, removeCertification,
    addLink, updateLink, removeLink,
    addReferee, updateReferee, removeReferee,
    addCustomSection, updateCustomSection, removeCustomSection,
    addCustomEntry, updateCustomEntry, removeCustomEntry,
    addBullet, updateBullet, removeBullet,
    moveSection, toggleSectionVisibility, updateSectionTitle,
    exportJSON, importJSON, clearAll,
  };
}