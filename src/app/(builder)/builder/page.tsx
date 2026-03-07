"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { useResume, defaultSectionOrder } from "@/hooks/use-resume";
import { getTemplateComponent, accentColorMap, sampleResumeData } from "@/components/templates";
import type { ResumeData, SectionKey, CustomEntryStyle } from "@/components/templates/types";

type MobileTab = "edit" | "preview";

const templateOptions = [
  { key: "atlas", name: "Atlas", desc: "Clean & Professional", color: "from-slate-500 to-slate-700" },
  { key: "summit", name: "Summit", desc: "Modern Two-Column", color: "from-blue-500 to-indigo-600" },
  { key: "quill", name: "Quill", desc: "Elegant & Minimalist", color: "from-emerald-500 to-teal-600" },
  { key: "northstar", name: "Northstar", desc: "Bold & Contemporary", color: "from-violet-500 to-purple-600" },
];

const accentOptions = [
  { key: "slate", label: "Slate", class: "bg-slate-600" },
  { key: "ocean", label: "Ocean", class: "bg-blue-600" },
  { key: "forest", label: "Forest", class: "bg-emerald-600" },
  { key: "charcoal", label: "Charcoal", class: "bg-gray-800" },
  { key: "violet", label: "Violet", class: "bg-violet-600" },
  { key: "rose", label: "Rose", class: "bg-rose-600" },
];

const fontSizeOptions = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const nameFontSizeOptions = [18, 20, 22, 24, 26, 28, 30, 32, 36];
const sectionTitleFontSizeOptions = [10, 11, 12, 13, 14, 15, 16, 18];

const sectionLabels: Record<SectionKey, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  links: "Links",
  referees: "References",
  custom: "Custom Sections",
};

// Sections only for CV (not shown on resume)
const cvOnlySections: SectionKey[] = ["referees"];
// Sections only for resume (hidden on CV) - none currently, but extensible
const resumeOnlySections: SectionKey[] = [];

const entryStyleOptions: { value: CustomEntryStyle; label: string; desc: string }[] = [
  { value: "standard", label: "Standard", desc: "Heading, subheading, date, bullets" },
  { value: "compact", label: "Compact", desc: "Single line with heading and date" },
  { value: "bullet-only", label: "Bullet List", desc: "Simple bullet point list" },
  { value: "two-column", label: "Two Column", desc: "Heading left, details right" },
  { value: "tag-list", label: "Tag List", desc: "Comma-separated tags/skills" },
];

export default function BuilderPage() {
  const resume = useResume();
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["personal", "summary"]));
  const [skillInput, setSkillInput] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState<Record<string, string>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [showWritingAssistant, setShowWritingAssistant] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const [assistantResult, setAssistantResult] = useState("");
  const [assistantAction, setAssistantAction] = useState<"improve" | "shorten" | "expand" | "professional" | "proofread">("improve");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [editingSectionTitle, setEditingSectionTitle] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section); else next.add(section);
      return next;
    });
  };
  const isSectionOpen = (section: string) => expandedSections.has(section);

  const accentColors = useMemo(
    () => accentColorMap[resume.styleConfig.accentTone] || accentColorMap.slate,
    [resume.styleConfig.accentTone]
  );

  const TemplateComponent = useMemo(
    () => getTemplateComponent(resume.templateKey),
    [resume.templateKey]
  );

  const previewData = useMemo<ResumeData>(() => {
    const d = resume.data;
    const s = sampleResumeData;
    return {
      basics: d.basics.fullName ? d.basics : s.basics,
      summary: d.summary.length > 0 ? d.summary : s.summary,
      experience: d.experience.length > 0 ? d.experience : s.experience,
      education: d.education.length > 0 ? d.education : s.education,
      projects: d.projects.length > 0 ? d.projects : s.projects,
      skills: d.skills.length > 0 ? d.skills : s.skills,
      certifications: d.certifications.length > 0 ? d.certifications : s.certifications,
      links: d.links.length > 0 ? d.links : s.links,
      referees: d.referees.length > 0 ? d.referees : s.referees,
      customSections: d.customSections.length > 0 ? d.customSections : s.customSections,
    };
  }, [resume.data]);

  // Filter sections based on document type
  const visibleSections = useMemo(() => {
    return resume.sectionOrder.filter((s) => {
      if (!s.visible) return false;
      if (resume.documentType === "resume" && cvOnlySections.includes(s.key)) return false;
      if (resume.documentType === "cv" && resumeOnlySections.includes(s.key)) return false;
      return true;
    });
  }, [resume.sectionOrder, resume.documentType]);

  const handleSave = useCallback(() => {
    // For non-authenticated users, prompt sign-in
    setShowSignInPrompt(true);
  }, []);

  const handleWritingAssist = useCallback(async () => {
    if (!assistantText.trim()) return;
    setAssistantLoading(true);
    // Simulate AI writing assistance with local text transformations
    await new Promise((r) => setTimeout(r, 800));
    let result = assistantText;
    switch (assistantAction) {
      case "improve":
        result = assistantText.charAt(0).toUpperCase() + assistantText.slice(1);
        if (!result.endsWith(".")) result += ".";
        result = result.replace(/\bi\b/g, "I").replace(/\s+/g, " ").trim();
        break;
      case "shorten":
        const sentences = assistantText.split(/[.!?]+/).filter(Boolean);
        result = sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 2))).join(". ").trim();
        if (result && !result.endsWith(".")) result += ".";
        break;
      case "expand":
        result = assistantText.trim();
        if (!result.endsWith(".")) result += ".";
        result += " This demonstrates strong capabilities and a proven track record of delivering results.";
        break;
      case "professional":
        result = assistantText
          .replace(/\bgot\b/gi, "achieved")
          .replace(/\bdid\b/gi, "executed")
          .replace(/\bmade\b/gi, "developed")
          .replace(/\bhelped\b/gi, "facilitated")
          .replace(/\bused\b/gi, "utilized")
          .replace(/\bworked on\b/gi, "contributed to")
          .replace(/\bwas responsible for\b/gi, "managed")
          .replace(/\bin charge of\b/gi, "oversaw")
          .trim();
        break;
      case "proofread":
        result = assistantText
          .replace(/\s+/g, " ")
          .replace(/\s+([.,!?;:])/g, "$1")
          .replace(/([.,!?;:])\s*/g, "$1 ")
          .trim();
        result = result.charAt(0).toUpperCase() + result.slice(1);
        break;
    }
    setAssistantResult(result);
    setAssistantLoading(false);
  }, [assistantText, assistantAction]);

  if (!resume.loaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="w-8 h-8 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex border-b border-gray-200 bg-white print:hidden">
        <button className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${mobileTab === "edit" ? "text-primary" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setMobileTab("edit")}>
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
            Edit
          </span>
          {mobileTab === "edit" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${mobileTab === "preview" ? "text-primary" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setMobileTab("preview")}>
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Preview
          </span>
          {mobileTab === "preview" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ─── EDITOR PANEL ─── */}
        <div className={`w-full lg:w-[480px] xl:w-[520px] overflow-y-auto border-r border-gray-200 bg-white custom-scrollbar print:hidden ${mobileTab !== "edit" ? "hidden lg:block" : ""}`}>
          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-lg font-bold text-gray-900">Resume Builder</h1>
                <p className="text-xs text-gray-400 mt-0.5">Auto-saved to browser</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setShowWritingAssistant(true)} className="btn-ghost text-xs px-2 py-1.5" title="Writing Assistant">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                </button>
                <button onClick={() => setShowTips(!showTips)} className="btn-ghost text-xs px-2 py-1.5" title="ATS Tips">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
                </button>
                <button onClick={() => window.print()} className="btn-secondary text-xs px-2.5 py-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008H15.75V12z" /></svg>
                  Print
                </button>
              </div>
            </div>

            {/* Completion */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">Completion</span>
                <span className="text-xs font-semibold text-primary">{resume.completionPercent}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500" style={{ width: `${resume.completionPercent}%` }} />
              </div>
            </div>

            {/* ATS Tips */}
            {showTips && (
              <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.499-2.599 4.499H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.004zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
                  <span className="text-sm font-semibold text-amber-800">ATS Tips</span>
                </div>
                <ul className="text-xs text-amber-700 space-y-1.5 ml-1">
                  <li>• Use standard section headings (Experience, Education, Skills)</li>
                  <li>• Include relevant keywords from the job description</li>
                  <li>• Start bullet points with strong action verbs</li>
                  <li>• Quantify achievements with numbers where possible</li>
                  <li>• Keep formatting simple and readable</li>
                </ul>
              </div>
            )}

            {/* Action Row */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200">
                <button onClick={() => resume.setDocumentType("resume")} className={`text-xs px-2 py-1 rounded-md transition-all ${resume.documentType === "resume" ? "bg-primary text-white font-medium" : "text-gray-500 hover:text-gray-700"}`}>Resume</button>
                <button onClick={() => resume.setDocumentType("cv")} className={`text-xs px-2 py-1 rounded-md transition-all ${resume.documentType === "cv" ? "bg-primary text-white font-medium" : "text-gray-500 hover:text-gray-700"}`}>CV</button>
              </div>
              <button onClick={handleSave} className="btn-primary text-xs px-3 py-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                Save
              </button>
              <button onClick={() => setShowClearConfirm(true)} className="btn-ghost text-xs px-2.5 py-1.5 text-red-500 hover:text-red-700 hover:bg-red-50" title="Clear all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                Clear
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mb-5">
              {resume.documentType === "cv" ? "CV — Comprehensive academic document. References section is included." : "Resume — Concise 1–2 page summary tailored for a specific role."}
            </p>

            <div className="space-y-5">
              {/* ─── Template ─── */}
              <section>
                <SectionHeader title="Template" />
                <div className="grid grid-cols-2 gap-2">
                  {templateOptions.map((t) => (
                    <button key={t.key} onClick={() => resume.setTemplateKey(t.key)} className={`relative rounded-xl p-3 text-left transition-all ${resume.templateKey === t.key ? "bg-primary-50 border-2 border-primary ring-2 ring-primary/10" : "border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}>
                      <div className={`h-2 w-8 rounded-full bg-gradient-to-r ${t.color} mb-2`} />
                      <div className="text-xs font-semibold text-gray-900">{t.name}</div>
                      <div className="text-[10px] text-gray-400">{t.desc}</div>
                      {resume.templateKey === t.key && (
                        <div className="absolute top-2 right-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg></div>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* ─── Personal Information ─── */}
              <section>
                <SectionToggle title="Personal Information" onClick={() => toggleSection("personal")} open={isSectionOpen("personal")} />
                {isSectionOpen("personal") && (
                  <div className="space-y-3 animate-fade-in">
                    <input type="text" placeholder="Full Name *" className="input-modern" value={resume.data.basics.fullName} onChange={(e) => resume.updateBasics({ fullName: e.target.value })} />
                    <input type="email" placeholder="Email Address *" className="input-modern" value={resume.data.basics.email} onChange={(e) => resume.updateBasics({ email: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="tel" placeholder="Phone" className="input-modern" value={resume.data.basics.phone || ""} onChange={(e) => resume.updateBasics({ phone: e.target.value })} />
                      <input type="text" placeholder="Location" className="input-modern" value={resume.data.basics.location || ""} onChange={(e) => resume.updateBasics({ location: e.target.value })} />
                    </div>
                    <input type="text" placeholder="Job Title" className="input-modern" value={resume.data.basics.jobTitle || ""} onChange={(e) => resume.updateBasics({ jobTitle: e.target.value })} />
                    <input type="text" placeholder="Website or LinkedIn" className="input-modern" value={resume.data.basics.website || ""} onChange={(e) => resume.updateBasics({ website: e.target.value })} />
                  </div>
                )}
              </section>

              {/* ─── Section Order & Visibility ─── */}
              <section>
                <SectionToggle title="Section Order & Visibility" onClick={() => toggleSection("ordering")} open={isSectionOpen("ordering")} />
                {isSectionOpen("ordering") && (
                  <div className="space-y-1 animate-fade-in">
                    <p className="text-[10px] text-gray-400 mb-2">Drag sections up/down to reorder. Toggle visibility. Click titles to rename.</p>
                    {resume.sectionOrder.map((s, idx) => {
                      const hidden = (resume.documentType === "resume" && cvOnlySections.includes(s.key)) ||
                                     (resume.documentType === "cv" && resumeOnlySections.includes(s.key));
                      if (hidden) return null;
                      return (
                        <div key={s.key} className={`flex items-center gap-2 p-2 rounded-lg border ${s.visible ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                          <div className="flex flex-col">
                            <button onClick={() => resume.moveSection(s.key, "up")} disabled={idx === 0} className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                            </button>
                            <button onClick={() => resume.moveSection(s.key, "down")} disabled={idx === resume.sectionOrder.length - 1} className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                            </button>
                          </div>
                          <div className="flex-1">
                            {editingSectionTitle === s.key ? (
                              <input
                                type="text"
                                className="input-modern text-sm py-1"
                                autoFocus
                                value={resume.sectionTitles[s.key as keyof typeof resume.sectionTitles] || ""}
                                placeholder={sectionLabels[s.key]}
                                onChange={(e) => resume.updateSectionTitle(s.key as keyof typeof resume.sectionTitles, e.target.value)}
                                onBlur={() => setEditingSectionTitle(null)}
                                onKeyDown={(e) => { if (e.key === "Enter") setEditingSectionTitle(null); }}
                              />
                            ) : (
                              <button onClick={() => setEditingSectionTitle(s.key)} className="text-sm font-medium text-gray-700 hover:text-primary cursor-pointer text-left" title="Click to rename">
                                {resume.sectionTitles[s.key as keyof typeof resume.sectionTitles] || sectionLabels[s.key]}
                              </button>
                            )}
                          </div>
                          <button onClick={() => resume.toggleSectionVisibility(s.key)} className={`p-1 rounded ${s.visible ? "text-primary" : "text-gray-300"}`} title={s.visible ? "Hide section" : "Show section"}>
                            {s.visible ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* ─── Dynamic Sections ─── */}
              {visibleSections.map((s) => {
                switch (s.key) {
                  case "summary":
                    return (
                      <section key="summary">
                        <SectionToggle title={resume.sectionTitles.summary || "Professional Summary"} onClick={() => toggleSection("summary")} open={isSectionOpen("summary")} />
                        {isSectionOpen("summary") && (
                          <div className="animate-fade-in">
                            <textarea placeholder="Write a brief professional summary..." rows={4} className="input-modern resize-none" maxLength={1000} value={resume.data.summary} onChange={(e) => resume.updateSummary(e.target.value)} />
                            <div className="flex justify-between mt-1.5">
                              <p className="text-xs text-gray-400">2-4 sentences recommended</p>
                              <p className={`text-xs ${resume.data.summary.length > 900 ? "text-amber-500" : "text-gray-400"}`}>{resume.data.summary.length}/1000</p>
                            </div>
                          </div>
                        )}
                      </section>
                    );
                  case "experience":
                    return (
                      <section key="experience">
                        <CollapsibleHeader title={resume.sectionTitles.experience || "Experience"} count={resume.data.experience.length} onAdd={resume.addExperience} onClick={() => toggleSection("experience")} open={isSectionOpen("experience")} />
                        {isSectionOpen("experience") && (
                          <div className="space-y-3 animate-fade-in">
                            {resume.data.experience.length === 0 && <EmptySection text="Add your work experience" onClick={resume.addExperience} />}
                            {resume.data.experience.map((exp, idx) => (
                              <div key={exp.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-500">Experience {idx + 1}</span>
                                  <div className="flex gap-1">
                                    <MoveBtn onClick={() => resume.moveExperience(exp.id, "up")} disabled={idx === 0} direction="up" />
                                    <MoveBtn onClick={() => resume.moveExperience(exp.id, "down")} disabled={idx === resume.data.experience.length - 1} direction="down" />
                                    <RemoveBtn onClick={() => resume.removeExperience(exp.id)} />
                                  </div>
                                </div>
                                <input type="text" placeholder="Position / Job Title" className="input-modern" value={exp.position} onChange={(e) => resume.updateExperience(exp.id, { position: e.target.value })} />
                                <input type="text" placeholder="Company" className="input-modern" value={exp.company} onChange={(e) => resume.updateExperience(exp.id, { company: e.target.value })} />
                                <input type="text" placeholder="Location" className="input-modern" value={exp.location || ""} onChange={(e) => resume.updateExperience(exp.id, { location: e.target.value })} />
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="text" placeholder="Start (e.g. 2023-01)" className="input-modern" value={exp.startDate} onChange={(e) => resume.updateExperience(exp.id, { startDate: e.target.value })} />
                                  <input type="text" placeholder={exp.current ? "Present" : "End Date"} className="input-modern" value={exp.current ? "" : exp.endDate || ""} disabled={exp.current} onChange={(e) => resume.updateExperience(exp.id, { endDate: e.target.value })} />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={exp.current || false} onChange={(e) => resume.updateExperience(exp.id, { current: e.target.checked, endDate: "" })} className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary/30" />
                                  <span className="text-xs text-gray-600">I currently work here</span>
                                </label>
                                <BulletList bullets={exp.bullets} onAdd={() => resume.addBullet("experience", exp.id)} onUpdate={(i, t) => resume.updateBullet("experience", exp.id, i, t)} onRemove={(i) => resume.removeBullet("experience", exp.id, i)} max={8} />
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  case "education":
                    return (
                      <section key="education">
                        <CollapsibleHeader title={resume.sectionTitles.education || "Education"} count={resume.data.education.length} onAdd={resume.addEducation} onClick={() => toggleSection("education")} open={isSectionOpen("education")} />
                        {isSectionOpen("education") && (
                          <div className="space-y-3 animate-fade-in">
                            {resume.data.education.length === 0 && <EmptySection text="Add your education" onClick={resume.addEducation} />}
                            {resume.data.education.map((edu, idx) => (
                              <div key={edu.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-500">Education {idx + 1}</span>
                                  <div className="flex gap-1">
                                    <MoveBtn onClick={() => resume.moveEducation(edu.id, "up")} disabled={idx === 0} direction="up" />
                                    <MoveBtn onClick={() => resume.moveEducation(edu.id, "down")} disabled={idx === resume.data.education.length - 1} direction="down" />
                                    <RemoveBtn onClick={() => resume.removeEducation(edu.id)} />
                                  </div>
                                </div>
                                <input type="text" placeholder="Degree" className="input-modern" value={edu.degree} onChange={(e) => resume.updateEducation(edu.id, { degree: e.target.value })} />
                                <input type="text" placeholder="Institution" className="input-modern" value={edu.institution} onChange={(e) => resume.updateEducation(edu.id, { institution: e.target.value })} />
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="text" placeholder="Field of Study" className="input-modern" value={edu.fieldOfStudy || ""} onChange={(e) => resume.updateEducation(edu.id, { fieldOfStudy: e.target.value })} />
                                  <input type="text" placeholder="Location" className="input-modern" value={edu.location || ""} onChange={(e) => resume.updateEducation(edu.id, { location: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="text" placeholder="Start Date" className="input-modern" value={edu.startDate || ""} onChange={(e) => resume.updateEducation(edu.id, { startDate: e.target.value })} />
                                  <input type="text" placeholder="End Date" className="input-modern" value={edu.endDate || ""} onChange={(e) => resume.updateEducation(edu.id, { endDate: e.target.value })} />
                                </div>
                                <BulletList bullets={edu.bullets} onAdd={() => resume.addBullet("education", edu.id)} onUpdate={(i, t) => resume.updateBullet("education", edu.id, i, t)} onRemove={(i) => resume.removeBullet("education", edu.id, i)} max={5} />
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  case "skills":
                    return (
                      <section key="skills">
                        <CollapsibleHeader title={resume.sectionTitles.skills || "Skills"} count={resume.data.skills.length} addLabel="Add Group" onAdd={resume.addSkillGroup} onClick={() => toggleSection("skills")} open={isSectionOpen("skills")} />
                        {isSectionOpen("skills") && (
                          <div className="space-y-3 animate-fade-in">
                            {resume.data.skills.length === 0 && <EmptySection text="Add your skill groups" onClick={resume.addSkillGroup} />}
                            {resume.data.skills.map((group, idx) => (
                              <div key={group.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-500">Skill Group {idx + 1}</span>
                                  <RemoveBtn onClick={() => resume.removeSkillGroup(group.id)} />
                                </div>
                                <input type="text" placeholder="Category (e.g. Frontend, Languages)" className="input-modern" value={group.category || ""} onChange={(e) => resume.updateSkillGroup(group.id, { category: e.target.value })} />
                                <div className="flex flex-wrap gap-1.5">
                                  {group.items.map((item, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                      {item}
                                      <button onClick={() => resume.removeSkillItem(group.id, i)} className="hover:text-red-500 ml-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                    </span>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <input type="text" placeholder="Type a skill and press Enter" className="input-modern flex-1" value={skillInput[group.id] || ""} onChange={(e) => setSkillInput((p) => ({ ...p, [group.id]: e.target.value }))} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === ",") && skillInput[group.id]?.trim()) { e.preventDefault(); resume.addSkillItem(group.id, skillInput[group.id].trim()); setSkillInput((p) => ({ ...p, [group.id]: "" })); } }} />
                                  <button onClick={() => { if (skillInput[group.id]?.trim()) { resume.addSkillItem(group.id, skillInput[group.id].trim()); setSkillInput((p) => ({ ...p, [group.id]: "" })); } }} className="btn-ghost text-xs px-3">Add</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  case "projects":
                    return (
                      <section key="projects">
                        <CollapsibleHeader title={resume.sectionTitles.projects || "Projects"} count={resume.data.projects.length} onAdd={resume.addProject} onClick={() => toggleSection("projects")} open={isSectionOpen("projects")} />
                        {isSectionOpen("projects") && (
                          <div className="space-y-3 animate-fade-in">
                            {resume.data.projects.length === 0 && <EmptySection text="Add your projects" onClick={resume.addProject} />}
                            {resume.data.projects.map((proj, idx) => (
                              <div key={proj.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-500">Project {idx + 1}</span>
                                  <RemoveBtn onClick={() => resume.removeProject(proj.id)} />
                                </div>
                                <input type="text" placeholder="Project Name" className="input-modern" value={proj.name} onChange={(e) => resume.updateProject(proj.id, { name: e.target.value })} />
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="text" placeholder="Your Role" className="input-modern" value={proj.role || ""} onChange={(e) => resume.updateProject(proj.id, { role: e.target.value })} />
                                  <input type="text" placeholder="Project URL" className="input-modern" value={proj.url || ""} onChange={(e) => resume.updateProject(proj.id, { url: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="text" placeholder="Start Date" className="input-modern" value={proj.startDate || ""} onChange={(e) => resume.updateProject(proj.id, { startDate: e.target.value })} />
                                  <input type="text" placeholder="End Date" className="input-modern" value={proj.endDate || ""} onChange={(e) => resume.updateProject(proj.id, { endDate: e.target.value })} />
                                </div>
                                <BulletList bullets={proj.bullets} onAdd={() => resume.addBullet("projects", proj.id)} onUpdate={(i, t) => resume.updateBullet("projects", proj.id, i, t)} onRemove={(i) => resume.removeBullet("projects", proj.id, i)} max={6} />
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  case "certifications":
                    return (
                      <section key="certifications">
                        <CollapsibleHeader title={resume.sectionTitles.certifications || "Certifications"} count={resume.data.certifications.length} onAdd={resume.addCertification} onClick={() => toggleSection("certifications")} open={isSectionOpen("certifications")} />
                        {isSectionOpen("certifications") && (
                          <div className="space-y-3 animate-fade-in">
                            {resume.data.certifications.length === 0 && <EmptySection text="Add your certifications" onClick={resume.addCertification} />}
                            {resume.data.certifications.map((cert, idx) => (
                              <div key={cert.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-500">Certification {idx + 1}</span>
                                  <RemoveBtn onClick={() => resume.removeCertification(cert.id)} />
                                </div>
                                <input type="text" placeholder="Certification Name" className="input-modern" value={cert.name} onChange={(e) => resume.updateCertification(cert.id, { name: e.target.value })} />
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="text" placeholder="Issuer" className="input-modern" value={cert.issuer || ""} onChange={(e) => resume.updateCertification(cert.id, { issuer: e.target.value })} />
                                  <input type="text" placeholder="Issue Date" className="input-modern" value={cert.issueDate || ""} onChange={(e) => resume.updateCertification(cert.id, { issueDate: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="text" placeholder="Credential ID" className="input-modern" value={cert.credentialId || ""} onChange={(e) => resume.updateCertification(cert.id, { credentialId: e.target.value })} />
                                  <input type="text" placeholder="Credential URL" className="input-modern" value={cert.url || ""} onChange={(e) => resume.updateCertification(cert.id, { url: e.target.value })} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  case "links":
                    return (
                      <section key="links">
                        <CollapsibleHeader title={resume.sectionTitles.links || "Links"} count={resume.data.links.length} onAdd={resume.addLink} onClick={() => toggleSection("links")} open={isSectionOpen("links")} />
                        {isSectionOpen("links") && (
                          <div className="space-y-3 animate-fade-in">
                            {resume.data.links.length === 0 && <EmptySection text="Add relevant links" onClick={resume.addLink} />}
                            {resume.data.links.map((link) => (
                              <div key={link.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex gap-3 items-start">
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                  <input type="text" placeholder="Label (e.g. GitHub)" className="input-modern text-sm" value={link.label} onChange={(e) => resume.updateLink(link.id, { label: e.target.value })} />
                                  <input type="text" placeholder="URL" className="input-modern text-sm" value={link.url} onChange={(e) => resume.updateLink(link.id, { url: e.target.value })} />
                                </div>
                                <RemoveBtn onClick={() => resume.removeLink(link.id)} />
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  case "referees":
                    return (
                      <section key="referees">
                        <CollapsibleHeader title={resume.sectionTitles.referees || "References"} count={resume.data.referees.length} onAdd={resume.addReferee} onClick={() => toggleSection("referees")} open={isSectionOpen("referees")} />
                        {isSectionOpen("referees") && (
                          <div className="space-y-3 animate-fade-in">
                            {resume.data.referees.length === 0 && <EmptySection text="Add your references" onClick={resume.addReferee} />}
                            {resume.data.referees.map((ref, idx) => (
                              <div key={ref.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-500">Reference {idx + 1}</span>
                                  <RemoveBtn onClick={() => resume.removeReferee(ref.id)} />
                                </div>
                                <input type="text" placeholder="Full Name" className="input-modern" value={ref.name} onChange={(e) => resume.updateReferee(ref.id, { name: e.target.value })} />
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="text" placeholder="Position / Title" className="input-modern" value={ref.position || ""} onChange={(e) => resume.updateReferee(ref.id, { position: e.target.value })} />
                                  <input type="text" placeholder="Organization" className="input-modern" value={ref.organization || ""} onChange={(e) => resume.updateReferee(ref.id, { organization: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="email" placeholder="Email" className="input-modern" value={ref.email || ""} onChange={(e) => resume.updateReferee(ref.id, { email: e.target.value })} />
                                  <input type="tel" placeholder="Phone" className="input-modern" value={ref.phone || ""} onChange={(e) => resume.updateReferee(ref.id, { phone: e.target.value })} />
                                </div>
                                <input type="text" placeholder="Relationship (e.g. Direct Manager)" className="input-modern" value={ref.relationship || ""} onChange={(e) => resume.updateReferee(ref.id, { relationship: e.target.value })} />
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  case "custom":
                    return (
                      <section key="custom">
                        <CollapsibleHeader title="Custom Sections" count={resume.data.customSections.length} addLabel="Add Section" onAdd={resume.data.customSections.length < 5 ? resume.addCustomSection : undefined} onClick={() => toggleSection("custom")} open={isSectionOpen("custom")} />
                        {isSectionOpen("custom") && (
                          <div className="space-y-3 animate-fade-in">
                            {resume.data.customSections.length === 0 && <EmptySection text="Add a custom section (e.g. Awards, Languages, Publications)" onClick={resume.addCustomSection} />}
                            {resume.data.customSections.map((section, sIdx) => (
                              <div key={section.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-500">Custom Section {sIdx + 1}</span>
                                  <RemoveBtn onClick={() => resume.removeCustomSection(section.id)} />
                                </div>
                                <input type="text" placeholder="Section Title (e.g. Awards, Languages)" className="input-modern font-medium" value={section.title} onChange={(e) => resume.updateCustomSection(section.id, { title: e.target.value })} />
                                {/* Entry Style Selector */}
                                <div>
                                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Entry Style</label>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                    {entryStyleOptions.map((opt) => (
                                      <button key={opt.value} onClick={() => resume.updateCustomSection(section.id, { entryStyle: opt.value })} className={`text-left p-2 rounded-lg border text-xs transition-all ${section.entryStyle === opt.value ? "border-primary bg-primary-50 text-primary" : "border-gray-200 hover:border-gray-300"}`}>
                                        <div className="font-medium">{opt.label}</div>
                                        <div className="text-[9px] text-gray-400 mt-0.5">{opt.desc}</div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                {/* Entries based on style */}
                                {section.entries.map((entry, eIdx) => (
                                  <div key={entry.id} className="p-3 rounded-lg border border-gray-200 bg-white space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-medium text-gray-400">Entry {eIdx + 1}</span>
                                      <RemoveBtn onClick={() => resume.removeCustomEntry(section.id, entry.id)} small />
                                    </div>
                                    {(section.entryStyle === "standard" || section.entryStyle === "two-column") && (
                                      <>
                                        <input type="text" placeholder="Heading" className="input-modern text-sm" value={entry.heading} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { heading: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-2">
                                          <input type="text" placeholder="Subheading" className="input-modern text-sm" value={entry.subheading || ""} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { subheading: e.target.value })} />
                                          <input type="text" placeholder="Date Range" className="input-modern text-sm" value={entry.dateRange || ""} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { dateRange: e.target.value })} />
                                        </div>
                                        {section.entryStyle === "standard" && (
                                          <textarea placeholder="Description" rows={2} className="input-modern text-sm resize-none" value={entry.description || ""} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { description: e.target.value })} />
                                        )}
                                      </>
                                    )}
                                    {section.entryStyle === "compact" && (
                                      <div className="grid grid-cols-2 gap-2">
                                        <input type="text" placeholder="Item" className="input-modern text-sm" value={entry.heading} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { heading: e.target.value })} />
                                        <input type="text" placeholder="Date / Details" className="input-modern text-sm" value={entry.dateRange || ""} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { dateRange: e.target.value })} />
                                      </div>
                                    )}
                                    {section.entryStyle === "bullet-only" && (
                                      <input type="text" placeholder="Bullet point text" className="input-modern text-sm" value={entry.heading} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { heading: e.target.value })} />
                                    )}
                                    {section.entryStyle === "tag-list" && (
                                      <>
                                        <input type="text" placeholder="Category (optional)" className="input-modern text-sm" value={entry.heading} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { heading: e.target.value })} />
                                        <div className="flex flex-wrap gap-1.5">
                                          {(entry.tags || []).map((tag, ti) => (
                                            <span key={ti} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                              {tag}
                                              <button onClick={() => { const newTags = [...(entry.tags || [])]; newTags.splice(ti, 1); resume.updateCustomEntry(section.id, entry.id, { tags: newTags }); }} className="hover:text-red-500 ml-0.5">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                              </button>
                                            </span>
                                          ))}
                                        </div>
                                        <div className="flex gap-2">
                                          <input type="text" placeholder="Add tag..." className="input-modern flex-1 text-sm" value={tagInput[entry.id] || ""} onChange={(e) => setTagInput((p) => ({ ...p, [entry.id]: e.target.value }))} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === ",") && tagInput[entry.id]?.trim()) { e.preventDefault(); resume.updateCustomEntry(section.id, entry.id, { tags: [...(entry.tags || []), tagInput[entry.id].trim()] }); setTagInput((p) => ({ ...p, [entry.id]: "" })); } }} />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                                <button onClick={() => resume.addCustomEntry(section.id)} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark px-2 py-1 rounded-md hover:bg-primary-50">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                  Add Entry
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  default:
                    return null;
                }
              })}

              {/* ─── Style Options ─── */}
              <section>
                <SectionHeader title="Style Options" />
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Body Font</label>
                      <select className="input-modern text-sm" value={resume.styleConfig.fontSize} onChange={(e) => resume.setStyleConfig({ ...resume.styleConfig, fontSize: Number(e.target.value) })}>
                        {fontSizeOptions.map((s) => <option key={s} value={s}>{s}pt</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Name Font</label>
                      <select className="input-modern text-sm" value={resume.styleConfig.nameFontSize} onChange={(e) => resume.setStyleConfig({ ...resume.styleConfig, nameFontSize: Number(e.target.value) })}>
                        {nameFontSizeOptions.map((s) => <option key={s} value={s}>{s}pt</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Title Font</label>
                      <select className="input-modern text-sm" value={resume.styleConfig.sectionTitleFontSize} onChange={(e) => resume.setStyleConfig({ ...resume.styleConfig, sectionTitleFontSize: Number(e.target.value) })}>
                        {sectionTitleFontSizeOptions.map((s) => <option key={s} value={s}>{s}pt</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Spacing</label>
                    <select className="input-modern text-sm" value={resume.styleConfig.spacing} onChange={(e) => resume.setStyleConfig({ ...resume.styleConfig, spacing: e.target.value as "tight" | "normal" })}>
                      <option value="normal">Normal</option>
                      <option value="tight">Tight</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Accent Color</label>
                    <div className="flex gap-2">
                      {accentOptions.map((c) => (
                        <button key={c.key} onClick={() => resume.setStyleConfig({ ...resume.styleConfig, accentTone: c.key })} className={`w-7 h-7 rounded-full ${c.class} transition-all ${resume.styleConfig.accentTone === c.key ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-110"}`} title={c.label} />
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={resume.styleConfig.showSectionDividers} onChange={(e) => resume.setStyleConfig({ ...resume.styleConfig, showSectionDividers: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Section dividers</span>
                  </label>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* ─── PREVIEW PANEL ─── */}
        <div className={`flex-1 overflow-y-auto bg-gray-100/80 custom-scrollbar ${mobileTab !== "preview" ? "hidden lg:block" : ""}`}>
          <div className="p-4 sm:p-6 lg:p-8 min-h-full flex flex-col items-center">
            <div className="w-full max-w-[210mm] flex items-center justify-between mb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Live Preview</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400 capitalize">{resume.templateKey}</span>
              </div>
              <button onClick={() => window.print()} className="btn-ghost text-xs px-3 py-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008H15.75V12z" /></svg>
                Print / PDF
              </button>
            </div>
            {/* Desktop: full A4 */}
            <div className="hidden sm:block w-full max-w-[210mm]">
              <div ref={previewRef} className="print-area bg-white shadow-xl rounded-sm w-full min-h-[297mm] p-10 sm:p-12 relative">
                <TemplateComponent data={previewData} styleConfig={resume.styleConfig} accentColors={accentColors} documentType={resume.documentType} sectionOrder={visibleSections} sectionTitles={resume.sectionTitles} />
              </div>
            </div>
            {/* Mobile: scaled-down A4 */}
            <div className="sm:hidden w-full overflow-hidden">
              <div className="origin-top-left" style={{ width: 794, transform: `scale(${(typeof window !== "undefined" ? Math.min(window.innerWidth - 32, 500) : 360) / 794})`, transformOrigin: "top left" }}>
                <div className="print-area bg-white shadow-xl rounded-sm w-full min-h-[1123px] p-10 relative">
                  <TemplateComponent data={previewData} styleConfig={resume.styleConfig} accentColors={accentColors} documentType={resume.documentType} sectionOrder={visibleSections} sectionTitles={resume.sectionTitles} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 flex gap-2 print:hidden">
        <button onClick={() => window.print()} className="btn-secondary flex-1 text-xs py-2.5 justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008H15.75V12z" /></svg>
          Print / PDF
        </button>
        <button onClick={handleSave} className="btn-primary flex-1 text-xs py-2.5 justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
          Save
        </button>
      </div>

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:hidden">
          <div className="card p-6 max-w-sm mx-4 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear all data?</h3>
            <p className="text-sm text-gray-500 mb-5">This will remove all your resume content and reset to a blank state. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearConfirm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => { resume.clearAll(); setShowClearConfirm(false); }} className="flex-1 btn-primary !bg-red-600 hover:!bg-red-700 !shadow-none">Clear All</button>
            </div>
          </div>
        </div>
      )}

      {/* Sign-In Prompt */}
      {showSignInPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:hidden">
          <div className="card p-6 max-w-sm mx-4 animate-fade-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Sign in to Save</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">Create an account or sign in to save your resume to the cloud, access it from anywhere, and manage multiple resumes.</p>
            <div className="flex flex-col gap-2">
              <a href="/login" className="btn-primary text-sm text-center">Sign In</a>
              <a href="/signup" className="btn-secondary text-sm text-center">Create Account</a>
              <button onClick={() => setShowSignInPrompt(false)} className="text-sm text-gray-400 hover:text-gray-600 mt-1">Continue as Guest</button>
            </div>
          </div>
        </div>
      )}

      {/* Writing Assistant Modal */}
      {showWritingAssistant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:hidden">
          <div className="card p-6 max-w-lg mx-4 w-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                <h3 className="text-lg font-bold text-gray-900">Writing Assistant</h3>
              </div>
              <button onClick={() => setShowWritingAssistant(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Paste any text from your resume and let the assistant help you improve it.</p>
            <textarea className="input-modern resize-none mb-3" rows={4} placeholder="Paste your text here (e.g. a bullet point, summary, or description)..." value={assistantText} onChange={(e) => setAssistantText(e.target.value)} />
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(["improve", "shorten", "expand", "professional", "proofread"] as const).map((action) => (
                <button key={action} onClick={() => setAssistantAction(action)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${assistantAction === action ? "border-primary bg-primary-50 text-primary font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {action === "professional" ? "Make Professional" : action.charAt(0).toUpperCase() + action.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={handleWritingAssist} disabled={!assistantText.trim() || assistantLoading} className="btn-primary text-sm w-full mb-3">
              {assistantLoading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Processing...</span>
              ) : "Transform Text"}
            </button>
            {assistantResult && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-green-800">Result</span>
                  <button onClick={() => { navigator.clipboard.writeText(assistantResult); }} className="text-xs text-green-600 hover:text-green-800 font-medium">Copy</button>
                </div>
                <p className="text-sm text-green-900">{assistantResult}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function SectionToggle({ title, onClick, open }: { title: string; onClick: () => void; open: boolean }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 mb-3 w-full text-left cursor-pointer group">
      <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      <div className="flex-1 h-px bg-gray-100" />
    </button>
  );
}

function CollapsibleHeader({ title, count, addLabel = "Add", onAdd, onClick, open }: { title: string; count: number; addLabel?: string; onAdd?: () => void; onClick: () => void; open: boolean }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <button type="button" onClick={onClick} className="flex items-center gap-2 cursor-pointer group">
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {count > 0 && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">{count}</span>}
      </button>
      {onAdd && (
        <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors px-2 py-1 rounded-md hover:bg-primary-50">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}

function EmptySection({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary/30 hover:text-primary/60 hover:bg-primary-50/30 transition-all cursor-pointer group text-left">
      <svg className="w-5 h-5 text-gray-300 group-hover:text-primary/40 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
      <span className="text-sm">{text}</span>
    </button>
  );
}

function MoveBtn({ onClick, disabled, direction }: { onClick: () => void; disabled: boolean; direction: "up" | "down" }) {
  return (
    <button onClick={onClick} disabled={disabled} className="p-1 rounded hover:bg-gray-200 text-gray-400 disabled:opacity-30" title={`Move ${direction}`}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={direction === "up" ? "M4.5 15.75l7.5-7.5 7.5 7.5" : "M19.5 8.25l-7.5 7.5-7.5-7.5"} /></svg>
    </button>
  );
}

function RemoveBtn({ onClick, small }: { onClick: () => void; small?: boolean }) {
  return (
    <button onClick={onClick} className={`${small ? "p-0.5" : "p-1"} rounded hover:bg-red-100 text-gray-400 hover:text-red-500`} title="Remove">
      <svg className={small ? "w-3 h-3" : "w-3.5 h-3.5"} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  );
}

function BulletList({ bullets, onAdd, onUpdate, onRemove, max }: { bullets: string[]; onAdd: () => void; onUpdate: (i: number, text: string) => void; onRemove: (i: number) => void; max: number }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500">Key Achievements / Details</label>
      {bullets.map((bullet, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-gray-300 mt-2.5 text-xs select-none">•</span>
          <input type="text" placeholder="Describe an achievement or responsibility..." className="input-modern flex-1 text-sm" value={bullet} maxLength={220} onChange={(e) => onUpdate(i, e.target.value)} />
          <button onClick={() => onRemove(i)} className="p-1.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 mt-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
      ))}
      {bullets.length < max && (
        <button onClick={onAdd} className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark px-1 py-0.5">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add bullet ({bullets.length}/{max})
        </button>
      )}
    </div>
  );
}