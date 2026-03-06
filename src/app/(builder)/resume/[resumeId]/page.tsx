"use client";

import { useState, useMemo, useRef, use } from "react";
import Link from "next/link";
import { useResume } from "@/hooks/use-resume";
import { getTemplateComponent, accentColorMap } from "@/components/templates";

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

export default function ResumeEditorPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = use(params);
  const resume = useResume(`resumeforge_resume_${resumeId}`);
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["personal", "summary"])
  );
  const [skillInput, setSkillInput] = useState<Record<string, string>>({});
  const previewRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
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
            {/* Header Row */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Link href="/dashboard" className="text-gray-400 hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                  </Link>
                  <h1 className="text-lg font-bold text-gray-900">Edit Resume</h1>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Auto-saved to browser</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={resume.exportJSON} className="btn-ghost text-xs px-2.5 py-1.5" title="Export JSON">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Export
                </button>
                <button onClick={() => window.print()} className="btn-secondary text-xs px-2.5 py-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008H15.75V12z" /></svg>
                  Print
                </button>
              </div>
            </div>

            {/* Completion Progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">Completion</span>
                <span className="text-xs font-semibold text-primary">{resume.completionPercent}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500" style={{ width: `${resume.completionPercent}%` }} />
              </div>
            </div>

            <div className="space-y-5">
              {/* ─── Template Selector ─── */}
              <section>
                <EditorSectionHeader title="Template" />
                <div className="grid grid-cols-2 gap-2">
                  {templateOptions.map((t) => (
                    <button key={t.key} onClick={() => resume.setTemplateKey(t.key)} className={`relative rounded-xl p-3 text-left transition-all ${resume.templateKey === t.key ? "bg-primary-50 border-2 border-primary ring-2 ring-primary/10" : "border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}>
                      <div className={`h-2 w-8 rounded-full bg-gradient-to-r ${t.color} mb-2`} />
                      <div className="text-xs font-semibold text-gray-900">{t.name}</div>
                      <div className="text-[10px] text-gray-400">{t.desc}</div>
                      {resume.templateKey === t.key && (
                        <div className="absolute top-2 right-2">
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* ─── Personal Information ─── */}
              <section>
                <EditorToggle title="Personal Information" onClick={() => toggleSection("personal")} open={isSectionOpen("personal")} />
                {isSectionOpen("personal") && (
                  <div className="space-y-3 animate-fade-in">
                    <input type="text" placeholder="Full Name *" className="input-modern" value={resume.data.basics.fullName} onChange={(e) => resume.updateBasics({ fullName: e.target.value })} />
                    <input type="email" placeholder="Email Address *" className="input-modern" value={resume.data.basics.email} onChange={(e) => resume.updateBasics({ email: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="tel" placeholder="Phone" className="input-modern" value={resume.data.basics.phone || ""} onChange={(e) => resume.updateBasics({ phone: e.target.value })} />
                      <input type="text" placeholder="Location" className="input-modern" value={resume.data.basics.location || ""} onChange={(e) => resume.updateBasics({ location: e.target.value })} />
                    </div>
                    <input type="text" placeholder="Job Title" className="input-modern" value={resume.data.basics.jobTitle || ""} onChange={(e) => resume.updateBasics({ jobTitle: e.target.value })} />
                    <input type="text" placeholder="Website / LinkedIn" className="input-modern" value={resume.data.basics.website || ""} onChange={(e) => resume.updateBasics({ website: e.target.value })} />
                  </div>
                )}
              </section>

              {/* ─── Summary ─── */}
              <section>
                <EditorToggle title="Professional Summary" onClick={() => toggleSection("summary")} open={isSectionOpen("summary")} />
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

              {/* ─── Experience ─── */}
              <section>
                <EditorCollapsible title="Experience" count={resume.data.experience.length} onAdd={resume.addExperience} onClick={() => toggleSection("experience")} open={isSectionOpen("experience")} />
                {isSectionOpen("experience") && (
                  <div className="space-y-3 animate-fade-in">
                    {resume.data.experience.length === 0 && <EditorEmpty text="Add your work experience" onClick={resume.addExperience} />}
                    {resume.data.experience.map((exp, idx) => (
                      <div key={exp.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Experience {idx + 1}</span>
                          <div className="flex gap-1">
                            <EditorMoveBtn onClick={() => resume.moveExperience(exp.id, "up")} disabled={idx === 0} direction="up" />
                            <EditorMoveBtn onClick={() => resume.moveExperience(exp.id, "down")} disabled={idx === resume.data.experience.length - 1} direction="down" />
                            <EditorRemoveBtn onClick={() => resume.removeExperience(exp.id)} />
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
                        <EditorBulletList bullets={exp.bullets} onAdd={() => resume.addBullet("experience", exp.id)} onUpdate={(i, t) => resume.updateBullet("experience", exp.id, i, t)} onRemove={(i) => resume.removeBullet("experience", exp.id, i)} max={8} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ─── Education ─── */}
              <section>
                <EditorCollapsible title="Education" count={resume.data.education.length} onAdd={resume.addEducation} onClick={() => toggleSection("education")} open={isSectionOpen("education")} />
                {isSectionOpen("education") && (
                  <div className="space-y-3 animate-fade-in">
                    {resume.data.education.length === 0 && <EditorEmpty text="Add your education" onClick={resume.addEducation} />}
                    {resume.data.education.map((edu, idx) => (
                      <div key={edu.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Education {idx + 1}</span>
                          <div className="flex gap-1">
                            <EditorMoveBtn onClick={() => resume.moveEducation(edu.id, "up")} disabled={idx === 0} direction="up" />
                            <EditorMoveBtn onClick={() => resume.moveEducation(edu.id, "down")} disabled={idx === resume.data.education.length - 1} direction="down" />
                            <EditorRemoveBtn onClick={() => resume.removeEducation(edu.id)} />
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
                        <EditorBulletList bullets={edu.bullets} onAdd={() => resume.addBullet("education", edu.id)} onUpdate={(i, t) => resume.updateBullet("education", edu.id, i, t)} onRemove={(i) => resume.removeBullet("education", edu.id, i)} max={5} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ─── Skills ─── */}
              <section>
                <EditorCollapsible title="Skills" count={resume.data.skills.length} addLabel="Add Group" onAdd={resume.addSkillGroup} onClick={() => toggleSection("skills")} open={isSectionOpen("skills")} />
                {isSectionOpen("skills") && (
                  <div className="space-y-3 animate-fade-in">
                    {resume.data.skills.length === 0 && <EditorEmpty text="Add your skill groups" onClick={resume.addSkillGroup} />}
                    {resume.data.skills.map((group, idx) => (
                      <div key={group.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Skill Group {idx + 1}</span>
                          <EditorRemoveBtn onClick={() => resume.removeSkillGroup(group.id)} />
                        </div>
                        <input type="text" placeholder="Category (e.g. Frontend)" className="input-modern" value={group.category || ""} onChange={(e) => resume.updateSkillGroup(group.id, { category: e.target.value })} />
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

              {/* ─── Projects ─── */}
              <section>
                <EditorCollapsible title="Projects" count={resume.data.projects.length} onAdd={resume.addProject} onClick={() => toggleSection("projects")} open={isSectionOpen("projects")} />
                {isSectionOpen("projects") && (
                  <div className="space-y-3 animate-fade-in">
                    {resume.data.projects.length === 0 && <EditorEmpty text="Add your projects" onClick={resume.addProject} />}
                    {resume.data.projects.map((proj, idx) => (
                      <div key={proj.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Project {idx + 1}</span>
                          <EditorRemoveBtn onClick={() => resume.removeProject(proj.id)} />
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
                        <EditorBulletList bullets={proj.bullets} onAdd={() => resume.addBullet("projects", proj.id)} onUpdate={(i, t) => resume.updateBullet("projects", proj.id, i, t)} onRemove={(i) => resume.removeBullet("projects", proj.id, i)} max={6} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ─── Certifications ─── */}
              <section>
                <EditorCollapsible title="Certifications" count={resume.data.certifications.length} onAdd={resume.addCertification} onClick={() => toggleSection("certifications")} open={isSectionOpen("certifications")} />
                {isSectionOpen("certifications") && (
                  <div className="space-y-3 animate-fade-in">
                    {resume.data.certifications.length === 0 && <EditorEmpty text="Add your certifications" onClick={resume.addCertification} />}
                    {resume.data.certifications.map((cert, idx) => (
                      <div key={cert.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Certification {idx + 1}</span>
                          <EditorRemoveBtn onClick={() => resume.removeCertification(cert.id)} />
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

              {/* ─── Links ─── */}
              <section>
                <EditorCollapsible title="Links" count={resume.data.links.length} onAdd={resume.addLink} onClick={() => toggleSection("links")} open={isSectionOpen("links")} />
                {isSectionOpen("links") && (
                  <div className="space-y-3 animate-fade-in">
                    {resume.data.links.length === 0 && <EditorEmpty text="Add relevant links" onClick={resume.addLink} />}
                    {resume.data.links.map((link) => (
                      <div key={link.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex gap-3 items-start">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input type="text" placeholder="Label (e.g. GitHub)" className="input-modern text-sm" value={link.label} onChange={(e) => resume.updateLink(link.id, { label: e.target.value })} />
                          <input type="text" placeholder="URL" className="input-modern text-sm" value={link.url} onChange={(e) => resume.updateLink(link.id, { url: e.target.value })} />
                        </div>
                        <EditorRemoveBtn onClick={() => resume.removeLink(link.id)} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ─── Custom Sections ─── */}
              <section>
                <EditorCollapsible title="Custom Sections" count={resume.data.customSections.length} addLabel="Add Section" onAdd={resume.data.customSections.length < 3 ? resume.addCustomSection : undefined} onClick={() => toggleSection("custom")} open={isSectionOpen("custom")} />
                {isSectionOpen("custom") && (
                  <div className="space-y-3 animate-fade-in">
                    {resume.data.customSections.length === 0 && <EditorEmpty text="Add a custom section (e.g. Awards, Languages)" onClick={resume.addCustomSection} />}
                    {resume.data.customSections.map((section, sIdx) => (
                      <div key={section.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Custom Section {sIdx + 1}</span>
                          <EditorRemoveBtn onClick={() => resume.removeCustomSection(section.id)} />
                        </div>
                        <input type="text" placeholder="Section Title (e.g. Awards)" className="input-modern font-medium" value={section.title} onChange={(e) => resume.updateCustomSection(section.id, { title: e.target.value })} />
                        {section.entries.map((entry, eIdx) => (
                          <div key={entry.id} className="p-3 rounded-lg border border-gray-200 bg-white space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-medium text-gray-400">Entry {eIdx + 1}</span>
                              <EditorRemoveBtn onClick={() => resume.removeCustomEntry(section.id, entry.id)} small />
                            </div>
                            <input type="text" placeholder="Heading" className="input-modern text-sm" value={entry.heading} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { heading: e.target.value })} />
                            <div className="grid grid-cols-2 gap-2">
                              <input type="text" placeholder="Subheading" className="input-modern text-sm" value={entry.subheading || ""} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { subheading: e.target.value })} />
                              <input type="text" placeholder="Date Range" className="input-modern text-sm" value={entry.dateRange || ""} onChange={(e) => resume.updateCustomEntry(section.id, entry.id, { dateRange: e.target.value })} />
                            </div>
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

              {/* ─── Style Options ─── */}
              <section>
                <EditorSectionHeader title="Style Options" />
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Font Scale</label>
                      <select className="input-modern text-sm" value={resume.styleConfig.fontScale} onChange={(e) => resume.setStyleConfig({ ...resume.styleConfig, fontScale: e.target.value as "compact" | "comfortable" })}>
                        <option value="comfortable">Comfortable</option>
                        <option value="compact">Compact</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Spacing</label>
                      <select className="input-modern text-sm" value={resume.styleConfig.spacing} onChange={(e) => resume.setStyleConfig({ ...resume.styleConfig, spacing: e.target.value as "tight" | "normal" })}>
                        <option value="normal">Normal</option>
                        <option value="tight">Tight</option>
                      </select>
                    </div>
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
            <div ref={previewRef} className="print-area bg-white shadow-xl rounded-sm w-full max-w-[210mm] min-h-[297mm] p-10 sm:p-12 relative">
              <TemplateComponent data={resume.data} styleConfig={resume.styleConfig} accentColors={accentColors} />
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
        <Link href="/dashboard" className="btn-primary flex-1 text-xs py-2.5 justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Dashboard
        </Link>
      </div>
    </div>
  );
}

/* ─── Editor Sub-components ─── */

function EditorSectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function EditorToggle({ title, onClick, open }: { title: string; onClick: () => void; open: boolean }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 mb-3 w-full text-left cursor-pointer group">
      <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      <div className="flex-1 h-px bg-gray-100" />
    </button>
  );
}

function EditorCollapsible({ title, count, addLabel = "Add", onAdd, onClick, open }: { title: string; count: number; addLabel?: string; onAdd?: () => void; onClick: () => void; open: boolean }) {
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

function EditorEmpty({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary/30 hover:text-primary/60 hover:bg-primary-50/30 transition-all cursor-pointer group text-left">
      <svg className="w-5 h-5 text-gray-300 group-hover:text-primary/40 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
      <span className="text-sm">{text}</span>
    </button>
  );
}

function EditorMoveBtn({ onClick, disabled, direction }: { onClick: () => void; disabled: boolean; direction: "up" | "down" }) {
  return (
    <button onClick={onClick} disabled={disabled} className="p-1 rounded hover:bg-gray-200 text-gray-400 disabled:opacity-30" title={`Move ${direction}`}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={direction === "up" ? "M4.5 15.75l7.5-7.5 7.5 7.5" : "M19.5 8.25l-7.5 7.5-7.5-7.5"} /></svg>
    </button>
  );
}

function EditorRemoveBtn({ onClick, small }: { onClick: () => void; small?: boolean }) {
  return (
    <button onClick={onClick} className={`${small ? "p-0.5" : "p-1"} rounded hover:bg-red-100 text-gray-400 hover:text-red-500`} title="Remove">
      <svg className={small ? "w-3 h-3" : "w-3.5 h-3.5"} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  );
}

function EditorBulletList({ bullets, onAdd, onUpdate, onRemove, max }: { bullets: string[]; onAdd: () => void; onUpdate: (i: number, text: string) => void; onRemove: (i: number) => void; max: number }) {
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
