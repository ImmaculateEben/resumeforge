import type { TemplateProps, CustomSection } from "./types";
import { getPersonalDetailEntries, getReferenceTitle, getTrimmedHobbies } from "./helpers";

export function RegistryTemplate({
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
  const gap = styleConfig.spacing === "tight" ? 10 : 14;
  const basics = data.basics;
  const isCV = documentType === "cv";
  const titles = sectionTitles || {};
  const personalDetailEntries = getPersonalDetailEntries(data.personalDetails);
  const hobbies = getTrimmedHobbies(data.hobbies);

  const sections = sectionOrder || [
    { key: "summary" as const, visible: true },
    { key: "personalDetails" as const, visible: true },
    { key: "education" as const, visible: true },
    { key: "experience" as const, visible: true },
    { key: "skills" as const, visible: true },
    { key: "hobbies" as const, visible: true },
    { key: "referees" as const, visible: true },
    { key: "projects" as const, visible: true },
    { key: "certifications" as const, visible: true },
    { key: "links" as const, visible: true },
    { key: "custom" as const, visible: true },
  ];

  const renderSection = (key: string) => {
    switch (key) {
      case "summary":
        if (!data.summary) return null;
        return (
          <RegistrySection key="summary" title={titles.summary || "Career Objectives"} stfs={stfs} gap={gap}>
            <p style={{ margin: 0, color: "#111827", textAlign: "justify" }}>{data.summary}</p>
          </RegistrySection>
        );

      case "personalDetails":
        if (!isCV || personalDetailEntries.length === 0) return null;
        return (
          <RegistrySection key="personalDetails" title={titles.personalDetails || "Personal Details"} stfs={stfs} gap={gap}>
            <div style={{ display: "grid", gridTemplateColumns: personalDetailEntries.length > 5 ? "1fr 1fr" : "1fr", gap: "4px 28px" }}>
              {personalDetailEntries.map((entry) => (
                <div key={entry.label} style={{ display: "grid", gridTemplateColumns: "138px 1fr", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontWeight: 700 }}>{entry.label}:</span>
                  <span>{entry.value}</span>
                </div>
              ))}
            </div>
          </RegistrySection>
        );

      case "education":
        if (data.education.length === 0) return null;
        return (
          <RegistrySection key="education" title={titles.education || "Education"} stfs={stfs} gap={gap}>
            {data.education.map((edu, index) => (
              <div key={edu.id} style={{ marginBottom: index < data.education.length - 1 ? gap * 0.55 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{edu.institution}</p>
                    <p style={{ margin: "1px 0 0" }}>
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </p>
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <span style={{ whiteSpace: "nowrap" }}>
                      {edu.startDate}
                      {edu.endDate ? ` - ${edu.endDate}` : ""}
                    </span>
                  )}
                </div>
                {edu.location && <p style={{ margin: "1px 0 0", color: "#4b5563" }}>{edu.location}</p>}
                {edu.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                    {edu.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </RegistrySection>
        );

      case "experience":
        if (data.experience.length === 0) return null;
        return (
          <RegistrySection key="experience" title={titles.experience || "Work Experience"} stfs={stfs} gap={gap}>
            {data.experience.map((exp, index) => (
              <div key={exp.id} style={{ marginBottom: index < data.experience.length - 1 ? gap * 0.55 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{exp.company}</p>
                    <p style={{ margin: "1px 0 0" }}>
                      Position: {exp.position}
                      {exp.location ? `, ${exp.location}` : ""}
                    </p>
                  </div>
                  <span style={{ whiteSpace: "nowrap" }}>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                    {exp.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </RegistrySection>
        );

      case "skills":
        if (data.skills.length === 0) return null;
        return (
          <RegistrySection key="skills" title={titles.skills || "Skills"} stfs={stfs} gap={gap}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {data.skills.map((group) => (
                <li key={group.id} style={{ marginBottom: 2 }}>
                  {group.category ? `${group.category}: ` : ""}
                  {group.items.join(", ")}
                </li>
              ))}
            </ul>
          </RegistrySection>
        );

      case "projects":
        if (data.projects.length === 0) return null;
        return (
          <RegistrySection key="projects" title={titles.projects || "Projects"} stfs={stfs} gap={gap}>
            {data.projects.map((project, index) => (
              <div key={project.id} style={{ marginBottom: index < data.projects.length - 1 ? gap * 0.55 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{project.name}</p>
                    {project.role && <p style={{ margin: "1px 0 0" }}>{project.role}</p>}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <span style={{ whiteSpace: "nowrap" }}>
                      {project.startDate}
                      {project.endDate ? ` - ${project.endDate}` : ""}
                    </span>
                  )}
                </div>
                {project.url && <p style={{ margin: "1px 0 0", color: accentColors.primary }}>{project.url}</p>}
                {project.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                    {project.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </RegistrySection>
        );

      case "certifications":
        if (data.certifications.length === 0) return null;
        return (
          <RegistrySection key="certifications" title={titles.certifications || "Certifications"} stfs={stfs} gap={gap}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {data.certifications.map((certification) => (
                <li key={certification.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 700 }}>{certification.name}</span>
                  {certification.issuer ? ` - ${certification.issuer}` : ""}
                  {certification.issueDate ? ` (${certification.issueDate})` : ""}
                </li>
              ))}
            </ul>
          </RegistrySection>
        );

      case "links":
        if (data.links.length === 0) return null;
        return (
          <RegistrySection key="links" title={titles.links || "Links"} stfs={stfs} gap={gap}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {data.links.map((link) => (
                <li key={link.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 700 }}>{link.label}:</span>{" "}
                  <span style={{ color: accentColors.primary }}>{link.url}</span>
                </li>
              ))}
            </ul>
          </RegistrySection>
        );

      case "hobbies":
        if (!isCV || hobbies.length === 0) return null;
        return (
          <RegistrySection key="hobbies" title={titles.hobbies || "Hobbies"} stfs={stfs} gap={gap}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {hobbies.map((hobby) => (
                <li key={hobby} style={{ marginBottom: 2 }}>
                  {hobby}
                </li>
              ))}
            </ul>
          </RegistrySection>
        );

      case "referees":
        if (data.referees.length === 0) return null;
        return (
          <RegistrySection key="referees" title={titles.referees || getReferenceTitle(data.referees)} stfs={stfs} gap={gap}>
            <div style={{ display: "grid", gridTemplateColumns: data.referees.length > 1 ? "1fr 1fr" : "1fr", gap: gap }}>
              {data.referees.map((referee) => (
                <div key={referee.id}>
                  <p style={{ margin: 0, fontWeight: 700 }}>{referee.name}</p>
                  {referee.position && (
                    <p style={{ margin: "1px 0 0" }}>
                      {referee.position}
                      {referee.organization ? `, ${referee.organization}` : ""}
                    </p>
                  )}
                  {!referee.position && referee.organization && <p style={{ margin: "1px 0 0" }}>{referee.organization}</p>}
                  {referee.phone && <p style={{ margin: "1px 0 0" }}>Tel: {referee.phone}</p>}
                  {referee.email && <p style={{ margin: "1px 0 0", color: accentColors.primary }}>{referee.email}</p>}
                  {referee.relationship && <p style={{ margin: "1px 0 0", color: "#4b5563" }}>{referee.relationship}</p>}
                </div>
              ))}
            </div>
          </RegistrySection>
        );

      case "custom":
        if (data.customSections.length === 0) return null;
        return data.customSections.map((section) => (
          <RegistrySection key={section.id} title={section.title} stfs={stfs} gap={gap}>
            <CustomEntries section={section} accentColors={accentColors} gap={gap} />
          </RegistrySection>
        ));

      default:
        return null;
    }
  };

  const contactLines = [
    basics.location ? `Address: ${basics.location}` : "",
    basics.phone ? `Tel: ${basics.phone}` : "",
    basics.email ? `Email: ${basics.email}` : "",
    basics.website ? `Website: ${basics.website}` : "",
  ].filter(Boolean);

  return (
    <div style={{ fontSize: fs, lineHeight: 1.25, color: "#111827", fontFamily: "'Times New Roman', Georgia, serif" }}>
      <div style={{ textAlign: "center", marginBottom: gap }}>
        <h1 style={{ margin: 0, fontSize: nfs * 0.96, fontWeight: 700, textTransform: "uppercase" }}>{basics.fullName || "Your Name"}</h1>
        {basics.jobTitle && <p style={{ margin: "3px 0 0", fontSize: fs * 1.05 }}>{basics.jobTitle}</p>}
        {contactLines.map((line) => (
          <p key={line} style={{ margin: "1px 0 0", fontWeight: 700 }}>
            {line}
          </p>
        ))}
      </div>
      {sections.filter((section) => section.visible).map((section) => renderSection(section.key))}
    </div>
  );
}

function CustomEntries({
  section,
  accentColors,
  gap,
}: {
  section: CustomSection;
  accentColors: { primary: string };
  gap: number;
}) {
  switch (section.entryStyle) {
    case "compact":
      return (
        <>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <span style={{ fontWeight: 700 }}>{entry.heading}</span>
              {entry.dateRange && <span>{entry.dateRange}</span>}
            </div>
          ))}
        </>
      );

    case "bullet-only":
      return (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
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
              <span style={{ fontWeight: 700 }}>{entry.heading}</span>
              {entry.subheading && <span style={{ marginLeft: 6 }}>{entry.subheading}</span>}
              {entry.dateRange && <p style={{ margin: 0 }}>{entry.dateRange}</p>}
            </div>
          ))}
        </div>
      );

    case "tag-list":
      return (
        <>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: 6 }}>
              {entry.heading && <span style={{ fontWeight: 700 }}>{entry.heading}: </span>}
              <span>{(entry.tags || []).join(", ")}</span>
            </div>
          ))}
        </>
      );

    default:
      return (
        <>
          {section.entries.map((entry, index) => (
            <div key={entry.id} style={{ marginBottom: index < section.entries.length - 1 ? gap * 0.55 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontWeight: 700 }}>{entry.heading}</span>
                {entry.dateRange && <span>{entry.dateRange}</span>}
              </div>
              {entry.subheading && <p style={{ margin: "1px 0 0", color: accentColors.primary }}>{entry.subheading}</p>}
              {entry.description && <p style={{ margin: "2px 0 0" }}>{entry.description}</p>}
              {entry.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                  {entry.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      );
  }
}

function RegistrySection({
  title,
  stfs,
  gap,
  children,
}: {
  title: string;
  stfs: number;
  gap: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: gap }}>
      <div style={{ background: "#d1d5db", padding: "1px 8px", marginBottom: gap * 0.45 }}>
        <h2 style={{ margin: 0, fontSize: stfs * 0.9, fontWeight: 700, textTransform: "uppercase" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
