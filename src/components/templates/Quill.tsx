import type { TemplateProps, CustomSection } from "./types";
import { getPersonalDetailEntries, getReferenceTitle, getTrimmedHobbies } from "./helpers";

export function QuillTemplate({
  data,
  styleConfig,
  accentColors,
  documentType,
  sectionOrder,
  sectionTitles,
}: TemplateProps) {
  const fs = styleConfig.fontSize;
  const nfs = styleConfig.nameFontSize;
  const stfs = styleConfig.sectionTitleFontSize;
  const gap = styleConfig.spacing === "tight" ? 14 : 22;
  const basics = data.basics;
  const isCV = documentType === "cv";
  const titles = sectionTitles || {};
  const personalDetailEntries = getPersonalDetailEntries(data.personalDetails);
  const hobbies = getTrimmedHobbies(data.hobbies);

  const sections = sectionOrder || [
    { key: "summary" as const, visible: true },
    { key: "personalDetails" as const, visible: true },
    { key: "experience" as const, visible: true },
    { key: "education" as const, visible: true },
    { key: "skills" as const, visible: true },
    { key: "projects" as const, visible: true },
    { key: "certifications" as const, visible: true },
    { key: "links" as const, visible: true },
    { key: "hobbies" as const, visible: true },
    { key: "referees" as const, visible: true },
    { key: "custom" as const, visible: true },
  ];

  const renderSection = (key: string) => {
    switch (key) {
      case "summary":
        if (!data.summary) return null;
        return (
          <QSection key="summary" title={titles.summary || "Summary"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <p style={{ color: "#4b5563", margin: 0, fontStyle: "italic" }}>{data.summary}</p>
          </QSection>
        );

      case "personalDetails":
        if (!isCV || personalDetailEntries.length === 0) return null;
        return (
          <QSection key="personalDetails" title={titles.personalDetails || "Personal Details"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
              {personalDetailEntries.map((entry) => (
                <div key={entry.label}>
                  <p style={{ color: "#111827", margin: 0, fontWeight: 500 }}>{entry.label}</p>
                  <p style={{ color: "#6b7280", margin: "2px 0 0", fontStyle: "italic" }}>{entry.value}</p>
                </div>
              ))}
            </div>
          </QSection>
        );

      case "experience":
        if (data.experience.length === 0) return null;
        return (
          <QSection key="experience" title={titles.experience || "Experience"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.experience.map((exp, index) => (
              <div key={exp.id} style={{ marginBottom: index < data.experience.length - 1 ? gap * 0.8 : 0 }}>
                <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.1, letterSpacing: "-0.01em" }}>{exp.position}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", marginTop: 1 }}>
                  <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: 0, fontWeight: 400 }}>
                    {exp.company}
                    {exp.location ? ` - ${exp.location}` : ""}
                  </p>
                  <span style={{ fontSize: fs * 0.85, color: "#9ca3af", fontStyle: "italic" }}>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: "6px 0 0", paddingLeft: 16, color: "#4b5563" }}>
                    {exp.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex} style={{ marginBottom: 2 }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </QSection>
        );

      case "education":
        if (data.education.length === 0) return null;
        return (
          <QSection key="education" title={titles.education || "Education"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{edu.degree}</h3>
                <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: "1px 0 0" }}>
                  {edu.institution}
                  {edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ""}
                </p>
                {(edu.startDate || edu.endDate || edu.location) && (
                  <p style={{ fontSize: fs * 0.85, color: "#9ca3af", margin: "1px 0 0", fontStyle: "italic" }}>
                    {[edu.location, [edu.startDate, edu.endDate].filter(Boolean).join(" - ")].filter(Boolean).join(" · ")}
                  </p>
                )}
                {edu.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "#4b5563" }}>
                    {edu.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </QSection>
        );

      case "skills":
        if (data.skills.length === 0) return null;
        return (
          <QSection key="skills" title={titles.skills || "Skills"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.skills.map((group) => (
                <div key={group.id}>
                  {group.category && <span style={{ fontWeight: 500, color: "#111827", fontSize: fs * 0.95 }}>{group.category}: </span>}
                  <span style={{ color: "#4b5563" }}>{group.items.join(" · ")}</span>
                </div>
              ))}
            </div>
          </QSection>
        );

      case "projects":
        if (data.projects.length === 0) return null;
        return (
          <QSection key="projects" title={titles.projects || "Projects"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.projects.map((project) => (
              <div key={project.id} style={{ marginBottom: 10 }}>
                <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>
                  {project.name}
                  {project.role && <span style={{ fontWeight: 400, color: "#6b7280" }}> - {project.role}</span>}
                </h3>
                {project.description && <p style={{ color: "#4b5563", margin: "2px 0 0", fontStyle: "italic" }}>{project.description}</p>}
                {project.url && <p style={{ color: accentColors.primary, fontSize: fs * 0.82, margin: "1px 0 0" }}>{project.url}</p>}
                {project.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "#4b5563" }}>
                    {project.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </QSection>
        );

      case "certifications":
        if (data.certifications.length === 0) return null;
        return (
          <QSection key="certifications" title={titles.certifications || "Certifications"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.certifications.map((certification) => (
              <div key={certification.id} style={{ marginBottom: 6 }}>
                <span style={{ fontWeight: 500, color: "#111827" }}>{certification.name}</span>
                {certification.issuer && <span style={{ color: "#6b7280" }}> - {certification.issuer}</span>}
                {certification.issueDate && <span style={{ color: "#9ca3af", fontSize: fs * 0.85, marginLeft: 6 }}>{certification.issueDate}</span>}
              </div>
            ))}
          </QSection>
        );

      case "links":
        if (data.links.length === 0) return null;
        return (
          <QSection key="links" title={titles.links || "Links"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
              {data.links.map((link) => (
                <span key={link.id} style={{ fontSize: fs * 0.95 }}>
                  <span style={{ fontWeight: 500, color: "#111827" }}>{link.label}</span>{" "}
                  <span style={{ color: accentColors.primary }}>{link.url}</span>
                </span>
              ))}
            </div>
          </QSection>
        );

      case "hobbies":
        if (!isCV || hobbies.length === 0) return null;
        return (
          <QSection key="hobbies" title={titles.hobbies || "Hobbies"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <ul style={{ margin: 0, paddingLeft: 16, color: "#4b5563" }}>
              {hobbies.map((hobby) => (
                <li key={hobby} style={{ marginBottom: 2 }}>
                  {hobby}
                </li>
              ))}
            </ul>
          </QSection>
        );

      case "referees":
        if (data.referees.length === 0) return null;
        return (
          <QSection key="referees" title={titles.referees || getReferenceTitle(data.referees)} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <div style={{ display: "grid", gridTemplateColumns: data.referees.length > 1 ? "1fr 1fr" : "1fr", gap: gap * 0.8 }}>
              {data.referees.map((referee) => (
                <div key={referee.id}>
                  <p style={{ fontWeight: 500, color: "#111827", margin: 0 }}>{referee.name}</p>
                  {referee.position && (
                    <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.92 }}>
                      {referee.position}
                      {referee.organization ? `, ${referee.organization}` : ""}
                    </p>
                  )}
                  {!referee.position && referee.organization && (
                    <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.92 }}>{referee.organization}</p>
                  )}
                  {referee.email && <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.88 }}>{referee.email}</p>}
                  {referee.phone && <p style={{ color: "#9ca3af", margin: 0, fontSize: fs * 0.88 }}>{referee.phone}</p>}
                  {referee.relationship && (
                    <p style={{ color: "#9ca3af", margin: 0, fontSize: fs * 0.82, fontStyle: "italic" }}>{referee.relationship}</p>
                  )}
                </div>
              ))}
            </div>
          </QSection>
        );

      case "custom":
        if (data.customSections.length === 0) return null;
        return (
          <>
            {data.customSections.map((section) => (
              <QSection key={section.id} title={section.title} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
                <CustomEntries section={section} fs={fs} accentColors={accentColors} gap={gap} />
              </QSection>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontSize: fs, lineHeight: 1.65, color: "#374151", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: gap * 1.2 }}>
        {isCV && (
          <p style={{ fontSize: fs * 0.8, fontWeight: 400, color: accentColors.primary, textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 6px" }}>
            Curriculum Vitae
          </p>
        )}
        <h1 style={{ fontSize: nfs, fontWeight: 300, color: accentColors.text, margin: 0, letterSpacing: "0.03em" }}>{basics.fullName || "Your Name"}</h1>
        {basics.jobTitle && <p style={{ fontSize: fs * 1.15, color: accentColors.primary, margin: "2px 0 0", fontWeight: 400, letterSpacing: "0.02em" }}>{basics.jobTitle}</p>}
        <div style={{ width: 48, height: 2, background: accentColors.primary, margin: "10px 0", borderRadius: 1 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: fs * 0.9, color: "#6b7280" }}>
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.location && <span>{basics.location}</span>}
          {basics.website && <span>{basics.website}</span>}
        </div>
      </div>
      {sections.filter((section) => section.visible).map((section) => renderSection(section.key))}
    </div>
  );
}

function CustomEntries({
  section,
  fs,
  accentColors,
  gap,
}: {
  section: CustomSection;
  fs: number;
  accentColors: { primary: string };
  gap: number;
}) {
  switch (section.entryStyle) {
    case "compact":
      return (
        <>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <span style={{ fontWeight: 500, color: "#111827" }}>{entry.heading}</span>
              {entry.dateRange && <span style={{ fontSize: fs * 0.85, color: "#9ca3af", fontStyle: "italic" }}>{entry.dateRange}</span>}
            </div>
          ))}
        </>
      );

    case "bullet-only":
      return (
        <ul style={{ margin: 0, paddingLeft: 16, color: "#4b5563" }}>
          {section.entries.map((entry) => (
            <li key={entry.id} style={{ marginBottom: 2 }}>
              {entry.heading}
            </li>
          ))}
        </ul>
      );

    case "two-column":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: gap * 0.5 }}>
          {section.entries.map((entry) => (
            <div key={entry.id}>
              <span style={{ fontWeight: 500, color: "#111827" }}>{entry.heading}</span>
              {entry.subheading && <span style={{ color: "#6b7280", marginLeft: 6 }}>{entry.subheading}</span>}
              {entry.dateRange && <p style={{ fontSize: fs * 0.85, color: "#9ca3af", margin: 0, fontStyle: "italic" }}>{entry.dateRange}</p>}
            </div>
          ))}
        </div>
      );

    case "tag-list":
      return (
        <>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: 6 }}>
              {entry.heading && <span style={{ fontWeight: 500, color: "#111827", fontSize: fs * 0.95 }}>{entry.heading}: </span>}
              <span style={{ color: "#4b5563" }}>{(entry.tags || []).join(" · ")}</span>
            </div>
          ))}
        </>
      );

    default:
      return (
        <>
          {section.entries.map((entry, index) => (
            <div key={entry.id} style={{ marginBottom: index < section.entries.length - 1 ? gap * 0.6 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{entry.heading}</h3>
                {entry.dateRange && <span style={{ fontSize: fs * 0.85, color: "#9ca3af", fontStyle: "italic" }}>{entry.dateRange}</span>}
              </div>
              {entry.subheading && <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0" }}>{entry.subheading}</p>}
              {entry.description && <p style={{ color: "#4b5563", margin: "3px 0 0", fontStyle: "italic" }}>{entry.description}</p>}
              {entry.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "#4b5563" }}>
                  {entry.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      );
  }
}

function QSection({
  title,
  accent,
  gap,
  dividers,
  stfs,
  children,
}: {
  title: string;
  accent: { primary: string };
  gap: number;
  dividers: boolean;
  stfs: number;
  children: React.ReactNode;
}) {
  return (
    <div data-print-section="true" style={{ marginTop: gap }}>
      <h2 style={{ fontSize: stfs * 0.85, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: accent.primary, margin: `0 0 ${gap * 0.4}px`, paddingBottom: dividers ? 5 : 0, borderBottom: dividers ? "1px solid #e5e7eb" : "none" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
