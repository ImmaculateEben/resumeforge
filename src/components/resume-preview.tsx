import { CVData, TemplateId } from "@/types";
import { cn } from "@/lib/utils";

interface TemplateThumbnailProps {
  templateId: TemplateId;
  className?: string;
}

interface ResumeLivePreviewProps {
  templateId: TemplateId;
  title: string;
  data: CVData;
}

function getDisplayName(title: string, data: CVData): string {
  return `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim() || title;
}

function getContactItems(data: CVData): string[] {
  return [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.portfolio,
  ].filter(Boolean);
}

function getSummary(title: string, data: CVData): string {
  return data.personalInfo.summary || `A concise ${title.toLowerCase()} summary goes here.`;
}

function renderMiniLines(lineClasses: string[]) {
  return (
    <div className="space-y-1.5">
      {lineClasses.map((lineClassName, index) => (
        <div key={`${lineClassName}-${index}`} className={lineClassName} />
      ))}
    </div>
  );
}

export function TemplateThumbnail({ templateId, className }: TemplateThumbnailProps) {
  if (templateId === "classic") {
    return (
      <div className={cn("absolute inset-0 bg-[#f8fafc] m-3 rounded border border-slate-300 p-3", className)}>
        <div className="text-center mb-3">
          <div className="h-3 bg-slate-500/80 rounded-sm w-2/3 mx-auto" />
          <div className="h-px bg-slate-300 mt-2" />
        </div>
        {renderMiniLines([
          "h-1.5 bg-slate-200 rounded-sm w-full",
          "h-1.5 bg-slate-200 rounded-sm w-5/6",
          "h-1.5 bg-slate-200 rounded-sm w-4/5",
        ])}
        <div className="mt-3 h-px bg-slate-300" />
        <div className="mt-3 space-y-2">
          <div className="h-1.5 bg-slate-400/70 rounded-sm w-1/3" />
          {renderMiniLines([
            "h-1.5 bg-slate-200 rounded-sm w-full",
            "h-1.5 bg-slate-200 rounded-sm w-4/5",
          ])}
        </div>
      </div>
    );
  }

  if (templateId === "creative") {
    return (
      <div className={cn("absolute inset-0 bg-white m-3 rounded shadow-sm overflow-hidden", className)}>
        <div className="flex h-full">
          <div className="w-1/3 bg-teal-700 p-2 space-y-2">
            <div className="h-2.5 bg-white/80 rounded w-4/5" />
            <div className="h-1.5 bg-teal-200/70 rounded w-full" />
            <div className="h-1.5 bg-teal-200/70 rounded w-5/6" />
            <div className="pt-2 space-y-1.5">
              <div className="h-1.5 bg-white/70 rounded w-2/3" />
              <div className="h-1.5 bg-teal-200/70 rounded w-full" />
              <div className="h-1.5 bg-teal-200/70 rounded w-4/5" />
            </div>
          </div>
          <div className="flex-1 p-3">
            <div className="h-1 bg-teal-500 rounded w-10 mb-3" />
            {renderMiniLines([
              "h-1.5 bg-slate-200 rounded w-full",
              "h-1.5 bg-slate-200 rounded w-5/6",
              "h-1.5 bg-slate-200 rounded w-4/5",
            ])}
            <div className="mt-3 space-y-2">
              <div className="h-1.5 bg-teal-700/80 rounded w-1/3" />
              {renderMiniLines([
                "h-1.5 bg-slate-200 rounded w-full",
                "h-1.5 bg-slate-200 rounded w-3/4",
              ])}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 bg-white m-3 rounded shadow-sm border-t-4 border-indigo-600 p-3", className)}>
      <div className="space-y-1.5">
        <div className="h-3 bg-indigo-200 rounded w-3/4" />
        <div className="h-2 bg-slate-100 rounded w-1/2" />
        <div className="h-px bg-indigo-100 my-2" />
      </div>
      {renderMiniLines([
        "h-1.5 bg-slate-100 rounded w-full",
        "h-1.5 bg-slate-100 rounded w-4/5",
        "h-1.5 bg-slate-100 rounded w-5/6",
      ])}
      <div className="mt-3 flex flex-wrap gap-1">
        <div className="h-2 w-10 rounded-full bg-indigo-100" />
        <div className="h-2 w-12 rounded-full bg-indigo-100" />
        <div className="h-2 w-8 rounded-full bg-indigo-100" />
      </div>
    </div>
  );
}

export function ResumeLivePreview({ templateId, title, data }: ResumeLivePreviewProps) {
  const displayName = getDisplayName(title, data);
  const contactItems = getContactItems(data);
  const summary = getSummary(title, data);

  if (templateId === "classic") {
    return (
      <div className="bg-[#fdfcf9] rounded-lg shadow-lg aspect-[3/4] max-h-[800px] overflow-y-auto border border-slate-300">
        <div className="p-6">
          <div className="text-center border-b border-slate-300 pb-4 mb-5">
            <h2 className="text-2xl font-serif tracking-[0.2em] uppercase text-slate-800">
              {displayName}
            </h2>
            {contactItems.length > 0 ? (
              <p className="text-xs text-slate-500 mt-2">{contactItems.join(" | ")}</p>
            ) : null}
            <p className="text-sm text-slate-600 mt-3 leading-6">{summary}</p>
          </div>
          <PreviewSections layout="classic" data={data} />
        </div>
      </div>
    );
  }

  if (templateId === "creative") {
    return (
      <div className="bg-white rounded-lg shadow-lg aspect-[3/4] max-h-[800px] overflow-y-auto">
        <div className="grid grid-cols-[140px_1fr] min-h-full">
          <aside className="bg-teal-700 p-4 text-white">
            <h2 className="text-xl font-bold leading-tight">{displayName}</h2>
            <div className="mt-4 space-y-2 text-[11px] text-teal-100">
              {contactItems.length > 0 ? (
                contactItems.map((item) => <p key={item}>{item}</p>)
              ) : (
                <p>Add contact details</p>
              )}
            </div>
            {data.skills.length > 0 ? (
              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/80 mb-2">Skills</p>
                <div className="space-y-1.5 text-[11px] text-teal-100">
                  {data.skills.map((skill) => (
                    <p key={skill.id}>{skill.name || "Skill"}</p>
                  ))}
                </div>
              </div>
            ) : null}
            {data.languages.length > 0 ? (
              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/80 mb-2">Languages</p>
                <div className="space-y-1.5 text-[11px] text-teal-100">
                  {data.languages.map((language) => (
                    <p key={language.id}>
                      {[language.name, language.proficiency].filter(Boolean).join(" - ")}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
          <div className="p-6">
            <div className="w-12 h-1 rounded-full bg-teal-500 mb-4" />
            <p className="text-sm text-slate-600 leading-6 mb-5">{summary}</p>
            <PreviewSections
              layout="creative"
              data={data}
              hideSkills
              hideLanguages
              hideCertifications={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg aspect-[3/4] max-h-[800px] overflow-y-auto border-t-4 border-indigo-600">
      <div className="p-6">
        <div className="border-b border-indigo-100 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-slate-900">{displayName}</h2>
          {contactItems.length > 0 ? (
            <p className="text-sm text-slate-500 mt-1">{contactItems.join(" | ")}</p>
          ) : (
            <p className="text-sm text-slate-500 mt-1">Add your contact information</p>
          )}
          <p className="text-sm text-slate-600 mt-3 leading-6">{summary}</p>
        </div>
        <PreviewSections layout="modern" data={data} />
      </div>
    </div>
  );
}

type PreviewLayout = "modern" | "classic" | "creative";

interface PreviewSectionsProps {
  layout: PreviewLayout;
  data: CVData;
  hideSkills?: boolean;
  hideLanguages?: boolean;
  hideCertifications?: boolean;
}

function PreviewSections({
  layout,
  data,
  hideSkills = false,
  hideLanguages = false,
  hideCertifications = false,
}: PreviewSectionsProps) {
  const sections = [
    {
      key: "experience",
      title: "Experience",
      hidden: data.experience.length === 0,
      content: data.experience.map((experience) => ({
        key: experience.id,
        title: experience.position || "Role",
        subtitle: experience.company,
        meta: [experience.startDate, experience.current ? "Present" : experience.endDate]
          .filter(Boolean)
          .join(" - "),
        body: experience.description,
      })),
    },
    {
      key: "education",
      title: "Education",
      hidden: data.education.length === 0,
      content: data.education.map((education) => ({
        key: education.id,
        title: [education.degree, education.field].filter(Boolean).join(" in ") || "Education",
        subtitle: education.institution,
        meta: [education.startDate, education.current ? "Present" : education.endDate]
          .filter(Boolean)
          .join(" - "),
        body: education.description,
      })),
    },
    {
      key: "projects",
      title: "Projects",
      hidden: data.projects.length === 0,
      content: data.projects.map((project) => ({
        key: project.id,
        title: project.name || "Project",
        subtitle: project.url,
        meta: project.technologies.join(", "),
        body: project.description,
      })),
    },
    {
      key: "certifications",
      title: "Certifications",
      hidden: hideCertifications || data.certifications.length === 0,
      content: data.certifications.map((certification) => ({
        key: certification.id,
        title: certification.name || "Certification",
        subtitle: certification.issuer,
        meta: certification.date,
        body: "",
      })),
    },
  ];

  return (
    <div className="space-y-4">
      {sections.filter((section) => !section.hidden).map((section) => (
        <div key={section.key}>
          <PreviewSectionHeading layout={layout} title={section.title} />
          <div className="space-y-3 mt-2">
            {section.content.map((item) => (
              <div key={item.key}>
                <div className={cn("flex gap-2", layout === "classic" ? "justify-between" : "flex-col")}>
                  <p className={cn("font-medium", layout === "classic" ? "text-[11px] font-serif text-slate-800" : "text-xs text-slate-900")}>
                    {item.title}
                  </p>
                  {layout === "classic" && item.meta ? (
                    <p className="text-[10px] text-slate-500">{item.meta}</p>
                  ) : null}
                </div>
                {item.subtitle ? (
                  <p className="text-[11px] text-slate-600 mt-0.5">{item.subtitle}</p>
                ) : null}
                {layout !== "classic" && item.meta ? (
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.meta}</p>
                ) : null}
                {item.body ? (
                  <p className="text-[11px] text-slate-600 leading-5 mt-1">{item.body}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}

      {!hideSkills && data.skills.length > 0 ? (
        <div>
          <PreviewSectionHeading layout={layout} title="Skills" />
          <div className="flex flex-wrap gap-2 mt-2">
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                className={cn(
                  "text-[10px] px-2 py-1 rounded-full",
                  layout === "creative"
                    ? "bg-teal-50 text-teal-700"
                    : layout === "classic"
                    ? "border border-slate-300 text-slate-700 rounded-sm"
                    : "bg-indigo-50 text-indigo-700"
                )}
              >
                {skill.name || "Skill"}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {!hideLanguages && data.languages.length > 0 ? (
        <div>
          <PreviewSectionHeading layout={layout} title="Languages" />
          <div className="flex flex-wrap gap-2 mt-2">
            {data.languages.map((language) => (
              <span
                key={language.id}
                className={cn(
                  "text-[10px] px-2 py-1 rounded-full",
                  layout === "creative"
                    ? "bg-teal-50 text-teal-700"
                    : layout === "classic"
                    ? "border border-slate-300 text-slate-700 rounded-sm"
                    : "bg-indigo-50 text-indigo-700"
                )}
              >
                {[language.name, language.proficiency].filter(Boolean).join(" - ")}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface PreviewSectionHeadingProps {
  layout: PreviewLayout;
  title: string;
}

function PreviewSectionHeading({ layout, title }: PreviewSectionHeadingProps) {
  if (layout === "classic") {
    return (
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-700 font-medium">{title}</p>
        <div className="h-px bg-slate-300 mt-1" />
      </div>
    );
  }

  if (layout === "creative") {
    return <p className="text-[11px] uppercase tracking-[0.2em] text-teal-700 font-semibold">{title}</p>;
  }

  return <p className="text-[11px] uppercase tracking-[0.2em] text-indigo-700 font-semibold">{title}</p>;
}
