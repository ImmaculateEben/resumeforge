"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormChromeProvider, Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ResumeLivePreview } from "@/components/resume-preview";
import { createLoginRedirectPath, REQUIRE_SIGN_IN_FOR_APP } from "@/lib/auth-redirect";
import { 
  User, Briefcase, GraduationCap, Code, Folder, Award, Languages,
  ChevronLeft, Plus, Trash2, Eye, Download, Save, LogOut, Menu, X
} from "lucide-react";
import { CVData, DEFAULT_CV_DATA, TEMPLATES, TemplateId } from "@/types";
import { downloadCVPdf } from "@/lib/cv-pdf";
import { signOutAppSession, useAppSession } from "@/hooks/use-app-session";
import {
  createCVRecord,
  loadCVsFromStorage,
  normalizeCVData,
  upsertCVRecord,
  updateCVRecord,
} from "@/lib/cv-storage";
import { cn, generateId } from "@/lib/utils";

type Section = "personal" | "experience" | "education" | "skills" | "projects" | "certifications" | "languages";

const sections: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code },
  { id: "projects", label: "Projects", icon: Folder },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: Languages },
];

function getTemplateId(value: string | null): TemplateId {
  return value === "classic" || value === "creative" || value === "modern" ? value : "modern";
}

const TEMPLATE_CHROME: Record<
  TemplateId,
  {
    page: string;
    sidebar: string;
    sidebarHeader: string;
    backLink: string;
    navActive: string;
    navInactive: string;
    header: string;
    title: string;
    mutedText: string;
    pill: string;
    select: string;
    outlineButton: string;
    primaryButton: string;
    formArea: string;
    formCanvas: string;
    sectionTitle: string;
    formCard: string;
    inlineRow: string;
    skillChip: string;
    previewPanel: string;
  }
> = {
  modern: {
    page: "bg-slate-50",
    sidebar: "bg-white border-indigo-100",
    sidebarHeader: "border-indigo-100",
    backLink: "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700",
    navActive: "bg-indigo-600 text-white shadow-sm",
    navInactive: "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700",
    header: "bg-white border-indigo-100",
    title: "text-slate-900",
    mutedText: "text-slate-500",
    pill: "bg-indigo-50 text-indigo-700",
    select: "border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100",
    outlineButton: "border-indigo-300 text-indigo-700 hover:bg-indigo-600 hover:text-white",
    primaryButton: "bg-indigo-600 hover:bg-indigo-700",
    formArea: "bg-slate-50/80",
    formCanvas: "bg-white border-indigo-100 shadow-sm",
    sectionTitle: "text-indigo-700",
    formCard: "border-indigo-100 shadow-sm",
    inlineRow: "bg-white border border-indigo-100",
    skillChip: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    previewPanel: "bg-indigo-50/40 border-indigo-100",
  },
  classic: {
    page: "bg-[#f6f1e8]",
    sidebar: "bg-[#fbf8f2] border-stone-300",
    sidebarHeader: "border-stone-300",
    backLink: "text-stone-700 hover:bg-stone-200/70 hover:text-stone-900",
    navActive: "bg-stone-700 text-white shadow-sm",
    navInactive: "text-stone-600 hover:bg-stone-200/70 hover:text-stone-900",
    header: "bg-[#fbf8f2] border-stone-300",
    title: "text-stone-900 font-serif",
    mutedText: "text-stone-600",
    pill: "bg-stone-200/70 text-stone-700",
    select: "border-stone-300 focus:border-stone-500 focus:ring-2 focus:ring-stone-200",
    outlineButton: "border-stone-400 text-stone-700 hover:bg-stone-700 hover:text-white",
    primaryButton: "bg-stone-700 hover:bg-stone-800",
    formArea: "bg-[#f6f1e8]/80",
    formCanvas: "bg-[#fffdf8] border-stone-300 shadow-sm",
    sectionTitle: "text-stone-700 font-serif",
    formCard: "border-stone-300 bg-[#fffdf8] shadow-sm",
    inlineRow: "bg-[#fffdf8] border border-stone-300",
    skillChip: "bg-stone-200/50 text-stone-800 border border-stone-300",
    previewPanel: "bg-stone-100/60 border-stone-300",
  },
  creative: {
    page: "bg-cyan-50",
    sidebar: "bg-slate-900 border-teal-700/30",
    sidebarHeader: "border-teal-700/30",
    backLink: "text-teal-100 hover:bg-teal-600/20 hover:text-white",
    navActive: "bg-teal-400 text-slate-950 shadow-sm",
    navInactive: "text-slate-300 hover:bg-teal-600/20 hover:text-white",
    header: "bg-white border-teal-100",
    title: "text-teal-700",
    mutedText: "text-slate-500",
    pill: "bg-teal-50 text-teal-700",
    select: "border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100",
    outlineButton: "border-teal-300 text-teal-700 hover:bg-teal-600 hover:text-white",
    primaryButton: "bg-teal-600 hover:bg-teal-700",
    formArea: "bg-cyan-50/80",
    formCanvas: "bg-white border-teal-100 shadow-sm",
    sectionTitle: "text-teal-700",
    formCard: "border-teal-100 shadow-sm",
    inlineRow: "bg-white border border-teal-100",
    skillChip: "bg-teal-50 text-teal-700 border border-teal-100",
    previewPanel: "bg-teal-50/40 border-teal-100",
  },
};

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCvId = searchParams.get("id");
  const requestedTemplateId = getTemplateId(searchParams.get("template"));
  const { session, isLoading: isSessionLoading } = useAppSession();
  
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
  const [cvTitle, setCvTitle] = useState("Untitled Resume");
  const [templateId, setTemplateId] = useState<TemplateId>(requestedTemplateId);
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [showPreview, setShowPreview] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCvId, setActiveCvId] = useState<string | null>(requestedCvId);
  const [missingCvId, setMissingCvId] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const chromeTheme = TEMPLATE_CHROME[templateId];

  useEffect(() => {
    if (isSessionLoading) {
      return;
    }

    if (REQUIRE_SIGN_IN_FOR_APP && session.kind === "guest") {
      const nextPath = requestedCvId
        ? `/editor?id=${requestedCvId}`
        : requestedTemplateId === "modern"
        ? "/editor"
        : `/editor?template=${requestedTemplateId}`;
      router.replace(createLoginRedirectPath(nextPath));
      return;
    }

    if (!requestedCvId) {
      const newCV = createCVRecord("Untitled Resume", requestedTemplateId);
      upsertCVRecord(newCV);
      setActiveCvId(newCV.id);
      setMissingCvId(null);
      setCvData(newCV.data);
      setCvTitle(newCV.title);
      setTemplateId(newCV.templateId);
      setLastSavedAt(newCV.updatedAt);
      setIsLoading(false);
      router.replace(`/editor?id=${newCV.id}`);
      return;
    }

    const cv = loadCVsFromStorage().find((entry) => entry.id === requestedCvId);

    if (!cv) {
      setActiveCvId(null);
      setMissingCvId(requestedCvId);
      setIsLoading(false);
      return;
    }

    setActiveCvId(cv.id);
    setMissingCvId(null);
    setCvData(normalizeCVData(cv.data));
    setCvTitle(cv.title);
    setTemplateId(cv.templateId);
    setLastSavedAt(cv.updatedAt);
    setIsLoading(false);
  }, [isSessionLoading, requestedCvId, requestedTemplateId, router, session.kind]);

  const persistCV = (nextData: CVData = cvData, nextTitle = cvTitle) => {
    if (!activeCvId) {
      return null;
    }

    const savedCV = updateCVRecord(activeCvId, (currentCV) => ({
      ...currentCV,
      title: nextTitle.trim() || "Untitled Resume",
      templateId,
      data: nextData,
      updatedAt: new Date().toISOString(),
    }));

    if (savedCV) {
      setLastSavedAt(savedCV.updatedAt);
    }

    return savedCV;
  };

  useEffect(() => {
    if (isLoading || !activeCvId || missingCvId) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsSaving(true);
      const savedCV = updateCVRecord(activeCvId, (currentCV) => ({
        ...currentCV,
        title: cvTitle.trim() || "Untitled Resume",
        templateId,
        data: cvData,
        updatedAt: new Date().toISOString(),
      }));

      if (savedCV) {
        setLastSavedAt(savedCV.updatedAt);
      }

      setIsSaving(false);
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeCvId, cvData, cvTitle, isLoading, missingCvId, templateId]);

  // Show loading state
  if (isLoading || isSessionLoading || (REQUIRE_SIGN_IN_FOR_APP && session.kind === "guest")) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          {REQUIRE_SIGN_IN_FOR_APP && session.kind === "guest"
            ? "Redirecting to sign in..."
            : "Loading editor..."}
        </div>
      </div>
    );
  }

  const handleCreateFreshResume = () => {
    const newCV = createCVRecord("Untitled Resume", templateId);
    upsertCVRecord(newCV);
    setActiveCvId(newCV.id);
    setMissingCvId(null);
    setCvData(newCV.data);
    setCvTitle(newCV.title);
    setTemplateId(newCV.templateId);
    setLastSavedAt(newCV.updatedAt);
    router.replace(`/editor?id=${newCV.id}`);
  };

  const handleSave = () => {
    if (session.kind === "guest") {
      const nextPath = activeCvId
        ? `/editor?id=${activeCvId}`
        : templateId === "modern"
        ? "/editor"
        : `/editor?template=${templateId}`;

      router.push(createLoginRedirectPath(nextPath));
      return;
    }

    setIsSaving(true);
    persistCV();
    setIsSaving(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      await downloadCVPdf(cvTitle, cvData, templateId);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOutAppSession();
      router.push("/login");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (missingCvId) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center p-6", chromeTheme.page)}>
        <Card className={cn("w-full max-w-lg p-8 text-center", chromeTheme.formCard)}>
          <h1 className="text-2xl font-semibold text-gray-900">Resume not found</h1>
          <p className="text-gray-600 mt-3">
            We could not find a saved resume for ID <span className="font-medium">{missingCvId}</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/dashboard">
              <Button variant="outline" className={chromeTheme.outlineButton}>
                Back to Dashboard
              </Button>
            </Link>
            <Button onClick={handleCreateFreshResume} className={chromeTheme.primaryButton}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Resume
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const updatePersonalInfo = (field: string, value: string) => {
    setCvData({
      ...cvData,
      personalInfo: { ...cvData.personalInfo, [field]: value },
    });
  };

  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          id: generateId(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    });
  };

  const updateExperience = <K extends keyof CVData["experience"][number]>(
    id: string,
    field: K,
    value: CVData["experience"][number][K]
  ) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: generateId(),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    });
  };

  const updateEducation = <K extends keyof CVData["education"][number]>(
    id: string,
    field: K,
    value: CVData["education"][number][K]
  ) => {
    setCvData({
      ...cvData,
      education: cvData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    setCvData({
      ...cvData,
      education: cvData.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkill = () => {
    setCvData({
      ...cvData,
      skills: [...cvData.skills, { id: generateId(), name: "", level: "intermediate" }],
    });
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setCvData({
      ...cvData,
      skills: cvData.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    setCvData({
      ...cvData,
      skills: cvData.skills.filter((skill) => skill.id !== id),
    });
  };

  // Project handlers
  const addProject = () => {
    setCvData({
      ...cvData,
      projects: [
        ...cvData.projects,
        { id: generateId(), name: "", description: "", url: "", technologies: [] },
      ],
    });
  };

  const updateProject = (id: string, field: string, value: string) => {
    setCvData({
      ...cvData,
      projects: cvData.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const removeProject = (id: string) => {
    setCvData({
      ...cvData,
      projects: cvData.projects.filter((proj) => proj.id !== id),
    });
  };

  // Certification handlers
  const addCertification = () => {
    setCvData({
      ...cvData,
      certifications: [
        ...cvData.certifications,
        { id: generateId(), name: "", issuer: "", date: "", url: "" },
      ],
    });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setCvData({
      ...cvData,
      certifications: cvData.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const removeCertification = (id: string) => {
    setCvData({
      ...cvData,
      certifications: cvData.certifications.filter((cert) => cert.id !== id),
    });
  };

  // Language handlers
  const addLanguage = () => {
    setCvData({
      ...cvData,
      languages: [
        ...cvData.languages,
        { id: generateId(), name: "", proficiency: "fluent" as const },
      ],
    });
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setCvData({
      ...cvData,
      languages: cvData.languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    });
  };

  const removeLanguage = (id: string) => {
    setCvData({
      ...cvData,
      languages: cvData.languages.filter((lang) => lang.id !== id),
    });
  };

  const sectionAddButtonClassName = cn("w-full", chromeTheme.outlineButton);
  const formCardClassName = cn("p-4", chromeTheme.formCard);
  const inlineRowClassName = cn("flex items-center gap-4 rounded-lg p-4", chromeTheme.inlineRow);
  const skillChipClassName = cn("flex items-center gap-2 rounded-full px-4 py-2", chromeTheme.skillChip);

  const renderSectionContent = () => {
    switch (activeSection) {
      case "personal":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={cvData.personalInfo.firstName}
                onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                placeholder="John"
              />
              <Input
                label="Last Name"
                value={cvData.personalInfo.lastName}
                onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                placeholder="Doe"
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={cvData.personalInfo.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
              placeholder="john.doe@email.com"
            />
            <Input
              label="Phone"
              value={cvData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
            <Input
              label="Location"
              value={cvData.personalInfo.location}
              onChange={(e) => updatePersonalInfo("location", e.target.value)}
              placeholder="New York, NY"
            />
            <Input
              label="LinkedIn"
              value={cvData.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
            <Input
              label="Portfolio"
              value={cvData.personalInfo.portfolio}
              onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
              placeholder="johndoe.com"
            />
            <Textarea
              label="Professional Summary"
              value={cvData.personalInfo.summary}
              onChange={(e) => updatePersonalInfo("summary", e.target.value)}
              placeholder="Write a brief summary of your professional background..."
              rows={5}
            />
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6">
            {cvData.experience.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No work experience added yet</p>
              </div>
            ) : (
              cvData.experience.map((exp) => (
                <Card key={exp.id} className={formCardClassName}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold">Work Experience</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <Input
                      label="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="Company Name"
                    />
                    <Input
                      label="Position"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                      placeholder="Job Title"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        placeholder="Jan 2020"
                      />
                      <Input
                        label="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        placeholder="Present"
                        disabled={exp.current}
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                      />
                      <span className="text-sm text-gray-600">I currently work here</span>
                    </label>
                    <Textarea
                      label="Description"
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={4}
                    />
                  </div>
                </Card>
              ))
            )}
            <Button onClick={addExperience} variant="outline" className={sectionAddButtonClassName}>
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
        );

      case "education":
        return (
          <div className="space-y-6">
            {cvData.education.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No education added yet</p>
              </div>
            ) : (
              cvData.education.map((edu) => (
                <Card key={edu.id} className={formCardClassName}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold">Education</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <Input
                      label="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      placeholder="University Name"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="Bachelor's"
                      />
                      <Input
                        label="Field of Study"
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Start Date"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        placeholder="Sep 2016"
                      />
                      <Input
                        label="End Date"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        placeholder="May 2020"
                      />
                    </div>
                  </div>
                </Card>
              ))
            )}
            <Button onClick={addEducation} variant="outline" className={sectionAddButtonClassName}>
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            {cvData.skills.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No skills added yet</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={skillChipClassName}
                  >
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                      className="bg-transparent border-none outline-none text-sm w-24"
                      placeholder="Skill name"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={addSkill} variant="outline" className={sectionAddButtonClassName}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            {cvData.projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Folder className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No projects added yet</p>
              </div>
            ) : (
              cvData.projects.map((project) => (
                <Card key={project.id} className={formCardClassName}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold">Project</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(project.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <Input
                      label="Project Name"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, "name", e.target.value)}
                      placeholder="My Awesome Project"
                    />
                    <Textarea
                      label="Description"
                      value={project.description}
                      onChange={(e) => updateProject(project.id, "description", e.target.value)}
                      placeholder="Describe what you built..."
                      rows={3}
                    />
                    <Input
                      label="URL"
                      value={project.url}
                      onChange={(e) => updateProject(project.id, "url", e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </Card>
              ))
            )}
            <Button onClick={addProject} variant="outline" className={sectionAddButtonClassName}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        );

      case "certifications":
        return (
          <div className="space-y-6">
            {cvData.certifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No certifications added yet</p>
              </div>
            ) : (
              cvData.certifications.map((cert) => (
                <Card key={cert.id} className={formCardClassName}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold">Certification</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(cert.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <Input
                      label="Certification Name"
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                      placeholder="AWS Solutions Architect"
                    />
                    <Input
                      label="Issuer"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                    <Input
                      label="Date"
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                      placeholder="January 2024"
                    />
                    <Input
                      label="URL"
                      value={cert.url}
                      onChange={(e) => updateCertification(cert.id, "url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </Card>
              ))
            )}
            <Button
              onClick={addCertification}
              variant="outline"
              className={sectionAddButtonClassName}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </div>
        );

      case "languages":
        return (
          <div className="space-y-6">
            {cvData.languages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Languages className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No languages added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cvData.languages.map((lang) => (
                  <div key={lang.id} className={inlineRowClassName}>
                    <Input
                      value={lang.name}
                      onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                      placeholder="Language"
                      className="flex-1"
                    />
                    <select
                      value={lang.proficiency}
                      onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
                      className={cn("px-3 py-2 rounded-lg bg-white", chromeTheme.select)}
                    >
                      <option value="basic">Basic</option>
                      <option value="conversational">Conversational</option>
                      <option value="fluent">Fluent</option>
                      <option value="native">Native</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(lang.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={addLanguage} variant="outline" className={sectionAddButtonClassName}>
              <Plus className="w-4 h-4 mr-2" />
              Add Language
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <FormChromeProvider tone={templateId}>
      <div className={cn("h-screen flex", chromeTheme.page)}>
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Left Sidebar - Section Navigator */}
        <aside className={cn(
          "border-r flex flex-col fixed lg:relative z-50 h-full transition-transform duration-300",
          chromeTheme.sidebar,
          showMobileSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "w-64"
        )}>
          <div className={cn("p-4 border-b flex items-center justify-between", chromeTheme.sidebarHeader)}>
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg w-fit justify-start transition-colors",
                chromeTheme.backLink
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="lg:hidden p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  activeSection === section.id ? chromeTheme.navActive : chromeTheme.navInactive
                )}
              >
                <section.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content - Editor */}
        <main className={cn("flex-1 flex flex-col overflow-hidden", chromeTheme.formArea)}>
          {/* Header */}
          <header
            className={cn(
              "border-b px-4 py-3 sm:px-6 sm:py-4 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between",
              chromeTheme.header
            )}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex flex-col gap-1 sm:gap-2">
                <h1 className={cn("text-lg sm:text-xl font-semibold", chromeTheme.title)}>{cvTitle}</h1>
              <p className={cn("text-sm", chromeTheme.mutedText)}>
                Last saved:{" "}
                {lastSavedAt
                  ? new Date(lastSavedAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "Not saved yet"}
              </p>
              <div
                className={cn(
                  "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                  chromeTheme.pill
                )}
              >
                <span>
                  {session.kind === "guest"
                    ? "Guest mode"
                    : session.kind === "demo"
                    ? "Demo mode"
                    : "Signed in"}
                </span>
                <span className={cn("opacity-60", chromeTheme.mutedText)}>|</span>
                <span>{session.displayName}</span>
              </div>
            </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <span>Template</span>
                <select
                  value={templateId}
                  onChange={(event) => setTemplateId(event.target.value as TemplateId)}
                  className={cn("px-3 py-2 rounded-lg bg-white text-sm text-gray-900", chromeTheme.select)}
                >
                  {TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>
              {session.kind === "guest" ? (
                <Link href="/login">
                  <Button variant="outline" className={chromeTheme.outlineButton}>
                    Sign In
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  loading={isSigningOut}
                  className={chromeTheme.outlineButton}
                >
                  {!isSigningOut ? <LogOut className="w-4 h-4 mr-2" /> : null}
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className={chromeTheme.outlineButton}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                loading={isDownloading}
                className={chromeTheme.outlineButton}
              >
                {!isDownloading ? <Download className="w-4 h-4 mr-2" /> : null}
                {isDownloading ? "Preparing..." : "Download PDF"}
              </Button>
              <Button onClick={handleSave} loading={isSaving} className={chromeTheme.primaryButton}>
                {!isSaving ? <Save className="w-4 h-4 mr-2" /> : null}
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Form */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="max-w-2xl mx-auto">
                <div className={cn("rounded-2xl border p-4 sm:p-6", chromeTheme.formCanvas)}>
                  <h2 className={cn("text-lg font-semibold mb-4 sm:mb-6", chromeTheme.sectionTitle)}>
                    {sections.find((s) => s.id === activeSection)?.label}
                  </h2>
                  {renderSectionContent()}
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            {showPreview && (
              <div
                className={cn(
                  "w-full sm:w-[350px] md:w-[400px] border-l overflow-y-auto p-3 sm:p-4",
                  chromeTheme.previewPanel,
                  "hidden lg:block"
                )}
              >
                <ResumeLivePreview templateId={templateId} title={cvTitle} data={cvData} />
              </div>
            )}
          </div>
        </main>
      </div>
    </FormChromeProvider>
  );
}
