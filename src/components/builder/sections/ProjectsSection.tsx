"use client";

import type { ProjectItem } from "@/components/templates/types";
import type { ResumeAiContext } from "@/modules/validation";
import { SectionCollapsible } from "../shared/SectionCollapsible";
import { EmptyState } from "../shared/EmptyState";
import { RemoveButton } from "../shared/RemoveButton";
import { BulletList } from "../shared/BulletList";
import { InlineAiAssist } from "../shared/InlineAiAssist";

interface ProjectsSectionProps {
  projects: ProjectItem[];
  resume: ResumeAiContext;
  addProject: () => string;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  addBullet: (section: "projects", itemId: string) => void;
  updateBullet: (section: "projects", itemId: string, idx: number, text: string) => void;
  removeBullet: (section: "projects", itemId: string, idx: number) => void;
  open: boolean;
  onToggle: () => void;
}

export function ProjectsSection({
  projects, resume, addProject, updateProject, removeProject,
  addBullet, updateBullet, removeBullet, open, onToggle,
}: ProjectsSectionProps) {
  return (
    <section>
      <SectionCollapsible
        title="Projects"
        count={projects.length}
        onAdd={addProject}
        open={open}
        onClick={onToggle}
      />
      {open && (
        <div className="space-y-3 animate-fade-in">
          {projects.length === 0 && <EmptyState text="Add your projects" onClick={addProject} />}
          {projects.map((proj, idx) => (
            <div key={proj.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Project {idx + 1}</span>
                <RemoveButton onClick={() => removeProject(proj.id)} />
              </div>
              <input type="text" placeholder="Project Name" className="input-modern" value={proj.name} onChange={(e) => updateProject(proj.id, { name: e.target.value })} />
              <InlineAiAssist
                target="project_name"
                resume={resume}
                entityId={proj.id}
                labels={{
                  generate: "AI name project",
                  improve: "AI improve name",
                  tailor: "Tailor project name",
                  apply: proj.name.trim() ? "Replace name" : "Use name",
                }}
                helpText="Generates a clearer project name from this project and your broader resume context."
                onApply={(result) => {
                  if (result.kind === "text") {
                    updateProject(proj.id, { name: result.text });
                  }
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Your Role" className="input-modern" value={proj.role || ""} onChange={(e) => updateProject(proj.id, { role: e.target.value })} />
                <input type="text" placeholder="Project URL" className="input-modern" value={proj.url || ""} onChange={(e) => updateProject(proj.id, { url: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Start Date" className="input-modern" value={proj.startDate || ""} onChange={(e) => updateProject(proj.id, { startDate: e.target.value })} />
                <input type="text" placeholder="End Date" className="input-modern" value={proj.endDate || ""} onChange={(e) => updateProject(proj.id, { endDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <textarea
                  rows={3}
                  placeholder="Short project description"
                  className="input-modern resize-none text-sm"
                  value={proj.description || ""}
                  maxLength={300}
                  onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                />
                <InlineAiAssist
                  target="project_description"
                  resume={resume}
                  entityId={proj.id}
                  labels={{
                    generate: "AI draft description",
                    improve: "AI improve description",
                    tailor: "Tailor description",
                    apply: proj.description?.trim() ? "Replace description" : "Use description",
                  }}
                  helpText="Writes a short project description from the project details and the rest of your resume."
                  onApply={(result) => {
                    if (result.kind === "text") {
                      updateProject(proj.id, { description: result.text });
                    }
                  }}
                />
              </div>
              <BulletList
                bullets={proj.bullets}
                onAdd={() => addBullet("projects", proj.id)}
                onUpdate={(i, t) => updateBullet("projects", proj.id, i, t)}
                onRemove={(i) => removeBullet("projects", proj.id, i)}
                max={6}
                aiAssist={{
                  target: "project_bullets",
                  resume,
                  entityId: proj.id,
                  onApply: (bullets) => updateProject(proj.id, { bullets }),
                }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
