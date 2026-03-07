import type { TemplateProps, CustomSection } from "./types";
import { getPersonalDetailEntries, getReferenceTitle, getTrimmedHobbies } from "./helpers";

export function AtlasTemplate({
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
  const gap = styleConfig.spacing === "tight" ? 12 : 18;
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
          <AtlasSection
            key="summary"
            title={titles.summary || "Summary"}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            <p style={{ color: "#374151", margin: 0 }}>{data.summary}</p>
          </AtlasSection>
        );

      case "personalDetails":
        if (!isCV || personalDetailEntries.length === 0) return null;
        return (
          <AtlasSection
            key="personalDetails"
            title={titles.personalDetails || "Personal Details"}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            <div style={{ display: "grid", gridTemplateColumns: personalDetailEntries.length > 4 ? "1fr 1fr" : "1fr", gap: "6px 24px" }}>
              {personalDetailEntries.map((entry) => (
                <div key={entry.label} style={{ display: "grid", gridTemplateColumns: "132px 1fr", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: "#111827" }}>{entry.label}:</span>
                  <span style={{ color: "#374151" }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </AtlasSection>
        );

      case "experience":
        if (data.experience.length === 0) return null;
        return (
          <AtlasSection
            key="experience"
            title={titles.experience || "Experience"}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            {data.experience.map((exp, index) => (
              <div key={exp.id} style={{ marginBottom: index < data.experience.length - 1 ? gap * 0.7 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{exp.position}</h3>
                  <span style={{ fontSize: fs * 0.85, color: "#9ca3af", whiteSpace: "nowrap" }}>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: "1px 0 0", fontWeight: 500 }}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                    {exp.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex} style={{ marginBottom: 2 }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </AtlasSection>
        );

      case "education":
        if (data.education.length === 0) return null;
        return (
          <AtlasSection
            key="education"
            title={titles.education || "Education"}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            {data.education.map((edu, index) => (
              <div key={edu.id} style={{ marginBottom: index < data.education.length - 1 ? gap * 0.6 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{edu.degree}</h3>
                  {(edu.startDate || edu.endDate) && (
                    <span style={{ fontSize: fs * 0.85, color: "#9ca3af" }}>
                      {edu.startDate}
                      {edu.endDate ? ` - ${edu.endDate}` : ""}
                    </span>
                  )}
                </div>
                <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: "1px 0 0", fontWeight: 500 }}>
                  {edu.institution}
                  {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
                  {edu.location ? ` · ${edu.location}` : ""}
                </p>
                {edu.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                    {edu.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex} style={{ marginBottom: 2 }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </AtlasSection>
        );

      case "skills":
        if (data.skills.length === 0) return null;
        return (
          <AtlasSection
            key="skills"
            title={titles.skills || "Skills"}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            {data.skills.map((group) => (
              <div key={group.id} style={{ marginBottom: 6 }}>
                {group.category && (
                  <span style={{ fontWeight: 600, color: "#111827", fontSize: fs * 0.95 }}>{group.category}: </span>
                )}
                <span style={{ color: "#374151" }}>{group.items.join(", ")}</span>
              </div>
            ))}
          </AtlasSection>
        );

      case "projects":
        if (data.projects.length === 0) return null;
        return (
          <AtlasSection
            key="projects"
            title={titles.projects || "Projects"}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            {data.projects.map((project, index) => (
              <div key={project.id} style={{ marginBottom: index < data.projects.length - 1 ? gap * 0.6 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>
                    {project.name}
                    {project.role ? <span style={{ fontWeight: 400, color: "#6b7280" }}> - {project.role}</span> : null}
                  </h3>
                  {(project.startDate || project.endDate) && (
                    <span style={{ fontSize: fs * 0.85, color: "#9ca3af" }}>
                      {project.startDate}
                      {project.endDate ? ` - ${project.endDate}` : ""}
                    </span>
                  )}
                </div>
                {project.url && <p style={{ color: accentColors.primary, fontSize: fs * 0.85, margin: "1px 0 0" }}>{project.url}</p>}
                {project.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                    {project.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex} style={{ marginBottom: 2 }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </AtlasSection>
        );

      case "certifications":
        if (data.certifications.length === 0) return null;
        return (
          <AtlasSection
            key="certifications"
            title={titles.certifications || "Certifications"}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            {data.certifications.map((certification) => (
              <div key={certification.id} style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: "#111827" }}>{certification.name}</span>
                {certification.issuer && <span style={{ color: "#6b7280" }}> - {certification.issuer}</span>}
                {certification.issueDate && (
                  <span style={{ color: "#9ca3af", fontSize: fs * 0.85, marginLeft: 8 }}>{certification.issueDate}</span>
                )}
              </div>
            ))}
          </AtlasSection>
        );

      case "links":
        if (data.links.length === 0) return null;
        return (
          <AtlasSection
            key="links"
            title={titles.links || "Links"}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
              {data.links.map((link) => (
                <span key={link.id}>
                  <span style={{ fontWeight: 500, color: "#111827" }}>{link.label}:</span>{" "}
                  <span style={{ color: accentColors.primary }}>{link.url}</span>
                </span>
              ))}
            </div>
          </AtlasSection>
        );

      case "hobbies":
        if (!isCV || hobbies.length === 0) return null;
        return (
          <AtlasSection
            key="hobbies"
            title={titles.hobbies || "Hobbies"}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            <ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
              {hobbies.map((hobby) => (
                <li key={hobby} style={{ marginBottom: 2 }}>
                  {hobby}
                </li>
              ))}
            </ul>
          </AtlasSection>
        );

      case "referees":
        if (data.referees.length === 0) return null;
        return (
          <AtlasSection
            key="referees"
            title={titles.referees || getReferenceTitle(data.referees)}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            <div style={{ display: "grid", gridTemplateColumns: data.referees.length > 1 ? "1fr 1fr" : "1fr", gap: gap * 0.8 }}>
              {data.referees.map((referee) => (
                <div key={referee.id}>
                  <p style={{ fontWeight: 600, color: "#111827", margin: 0 }}>{referee.name}</p>
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
                    <p style={{ color: "#9ca3af", margin: 0, fontSize: fs * 0.82, fontStyle: "italic" }}>
                      {referee.relationship}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </AtlasSection>
        );

      case "custom":
        if (data.customSections.length === 0) return null;
        return data.customSections.map((section) => (
          <AtlasSection
            key={section.id}
            title={section.title}
            accent={accentColors}
            gap={gap}
            dividers={styleConfig.showSectionDividers}
            stfs={stfs}
          >
            <CustomEntries section={section} fs={fs} accentColors={accentColors} gap={gap} />
          </AtlasSection>
        ));

      default:
        return null;
    }
  };

  return (
    <div style={{ fontSize: fs, lineHeight: 1.55, color: "#1f2937", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: gap }}>
        {isCV && (
          <p
            style={{
              fontSize: fs * 0.8,
              fontWeight: 600,
              color: accentColors.primary,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              margin: "0 0 6px",
            }}
          >
            Curriculum Vitae
          </p>
        )}
        <h1 style={{ fontSize: nfs, fontWeight: 700, color: accentColors.text, margin: 0, letterSpacing: "-0.02em" }}>
          {basics.fullName || "Your Name"}
        </h1>
        {basics.jobTitle && <p style={{ fontSize: fs * 1.1, color: "#6b7280", margin: "2px 0 0" }}>{basics.jobTitle}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 6, fontSize: fs * 0.9, color: "#6b7280" }}>
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && (
            <>
              <span style={{ color: "#d1d5db" }}>&middot;</span>
              <span>{basics.phone}</span>
            </>
          )}
          {basics.location && (
            <>
              <span style={{ color: "#d1d5db" }}>&middot;</span>
              <span>{basics.location}</span>
            </>
          )}
          {basics.website && (
            <>
              <span style={{ color: "#d1d5db" }}>&middot;</span>
              <span>{basics.website}</span>
            </>
          )}
        </div>
      </div>
      {styleConfig.showSectionDividers && (
        <hr style={{ border: "none", borderTop: `1px solid ${accentColors.light}`, margin: `${gap}px 0` }} />
      )}
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
              <span style={{ fontWeight: 600, color: "#111827" }}>{entry.heading}</span>
              {entry.dateRange && <span style={{ fontSize: fs * 0.85, color: "#9ca3af" }}>{entry.dateRange}</span>}
            </div>
          ))}
        </>
      );

    case "bullet-only":
      return (
        <ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
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
              <span style={{ fontWeight: 600, color: "#111827" }}>{entry.heading}</span>
              {entry.subheading && <span style={{ color: "#6b7280", marginLeft: 6 }}>{entry.subheading}</span>}
              {entry.dateRange && <p style={{ fontSize: fs * 0.85, color: "#9ca3af", margin: 0 }}>{entry.dateRange}</p>}
            </div>
          ))}
        </div>
      );

    case "tag-list":
      return (
        <>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: 6 }}>
              {entry.heading && <span style={{ fontWeight: 600, color: "#111827", fontSize: fs * 0.95 }}>{entry.heading}: </span>}
              <span style={{ color: "#374151" }}>{(entry.tags || []).join(", ")}</span>
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
                <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{entry.heading}</h3>
                {entry.dateRange && <span style={{ fontSize: fs * 0.85, color: "#9ca3af" }}>{entry.dateRange}</span>}
              </div>
              {entry.subheading && <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: "1px 0 0" }}>{entry.subheading}</p>}
              {entry.description && <p style={{ color: "#374151", margin: "3px 0 0" }}>{entry.description}</p>}
              {entry.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                  {entry.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                    <li key={bulletIndex} style={{ marginBottom: 2 }}>
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

function AtlasSection({
  title,
  accent,
  gap,
  dividers,
  stfs,
  children,
}: {
  title: string;
  accent: { primary: string; light: string };
  gap: number;
  dividers: boolean;
  stfs: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: gap }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: gap * 0.5 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: accent.primary }} />
        <h2 style={{ fontSize: stfs, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: accent.primary, margin: 0 }}>
          {title}
        </h2>
        {dividers && <div style={{ flex: 1, height: 1, background: accent.light }} />}
      </div>
      {children}
    </div>
  );
}
