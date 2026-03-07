import type { TemplateProps, CustomSection } from "./types";
import { getPersonalDetailEntries, getReferenceTitle, getTrimmedHobbies } from "./helpers";

export function SummitTemplate({
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
  const gap = styleConfig.spacing === "tight" ? 10 : 16;
  const basics = data.basics;
  const isCV = documentType === "cv";
  const titles = sectionTitles || {};
  const personalDetailEntries = getPersonalDetailEntries(data.personalDetails);
  const hobbies = getTrimmedHobbies(data.hobbies);

  const sidebarBg = accentColors.light;
  const sidebarText = accentColors.text;

  const sidebarKeys = new Set(["personalDetails", "skills", "certifications", "links", "hobbies", "referees"]);
  const contentKeys = new Set(["summary", "experience", "education", "projects", "custom"]);

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
  const visibleSections = sections.filter((section) => section.visible);
  const sidebarSections = visibleSections.filter((section) => sidebarKeys.has(section.key));
  const contentSections = visibleSections.filter((section) => contentKeys.has(section.key));

  const renderSidebar = (key: string) => {
    switch (key) {
      case "personalDetails":
        if (!isCV || personalDetailEntries.length === 0) return null;
        return (
          <SBSection key="personalDetails" title={titles.personalDetails || "Personal Details"} accent={accentColors} gap={gap} stfs={stfs}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {personalDetailEntries.map((entry) => (
                <div key={entry.label}>
                  <p style={{ color: sidebarText, margin: 0, fontWeight: 600, fontSize: fs * 0.88 }}>{entry.label}</p>
                  <p style={{ color: "#475569", margin: 0, fontSize: fs * 0.85 }}>{entry.value}</p>
                </div>
              ))}
            </div>
          </SBSection>
        );

      case "skills":
        if (data.skills.length === 0) return null;
        return (
          <SBSection key="skills" title={titles.skills || "Skills"} accent={accentColors} gap={gap} stfs={stfs}>
            {data.skills.map((group) => (
              <div key={group.id} style={{ marginBottom: gap * 0.6 }}>
                {group.category && (
                  <p style={{ fontWeight: 600, color: sidebarText, margin: "0 0 3px", fontSize: fs * 0.95 }}>{group.category}</p>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {group.items.map((item, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.7)",
                        fontSize: fs * 0.88,
                        color: sidebarText,
                        border: `1px solid ${accentColors.primary}22`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </SBSection>
        );

      case "certifications":
        if (data.certifications.length === 0) return null;
        return (
          <SBSection key="certifications" title={titles.certifications || "Certifications"} accent={accentColors} gap={gap} stfs={stfs}>
            {data.certifications.map((certification) => (
              <div key={certification.id} style={{ marginBottom: 6 }}>
                <p style={{ fontWeight: 600, color: sidebarText, margin: 0, fontSize: fs * 0.95 }}>{certification.name}</p>
                {certification.issuer && <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.85 }}>{certification.issuer}</p>}
                {certification.issueDate && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.8 }}>{certification.issueDate}</p>}
              </div>
            ))}
          </SBSection>
        );

      case "links":
        if (data.links.length === 0) return null;
        return (
          <SBSection key="links" title={titles.links || "Links"} accent={accentColors} gap={gap} stfs={stfs}>
            {data.links.map((link) => (
              <div key={link.id} style={{ marginBottom: 4 }}>
                <p style={{ fontWeight: 500, color: sidebarText, margin: 0, fontSize: fs * 0.92 }}>{link.label}</p>
                <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.82 }}>{link.url}</p>
              </div>
            ))}
          </SBSection>
        );

      case "hobbies":
        if (!isCV || hobbies.length === 0) return null;
        return (
          <SBSection key="hobbies" title={titles.hobbies || "Hobbies"} accent={accentColors} gap={gap} stfs={stfs}>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#475569" }}>
              {hobbies.map((hobby) => (
                <li key={hobby} style={{ marginBottom: 2 }}>
                  {hobby}
                </li>
              ))}
            </ul>
          </SBSection>
        );

      case "referees":
        if (data.referees.length === 0) return null;
        return (
          <SBSection
            key="referees"
            title={titles.referees || getReferenceTitle(data.referees)}
            accent={accentColors}
            gap={gap}
            stfs={stfs}
          >
            {data.referees.map((referee) => (
              <div key={referee.id} style={{ marginBottom: 8 }}>
                <p style={{ fontWeight: 600, color: sidebarText, margin: 0, fontSize: fs * 0.95 }}>{referee.name}</p>
                {referee.position && <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.85 }}>{referee.position}</p>}
                {referee.organization && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.82 }}>{referee.organization}</p>}
                {referee.email && <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.82 }}>{referee.email}</p>}
                {referee.phone && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.8 }}>{referee.phone}</p>}
              </div>
            ))}
          </SBSection>
        );

      default:
        return null;
    }
  };

  const renderContent = (key: string) => {
    switch (key) {
      case "summary":
        if (!data.summary) return null;
        return (
          <CSection key="summary" title={titles.summary || "Profile"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <p style={{ color: "#374151", margin: 0 }}>{data.summary}</p>
          </CSection>
        );

      case "experience":
        if (data.experience.length === 0) return null;
        return (
          <CSection key="experience" title={titles.experience || "Experience"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.experience.map((exp, index) => (
              <div key={exp.id} style={{ marginBottom: index < data.experience.length - 1 ? gap : 0, position: "relative", paddingLeft: 14 }}>
                <div style={{ position: "absolute", left: 0, top: 6, width: 6, height: 6, borderRadius: "50%", background: accentColors.primary }} />
                {index < data.experience.length - 1 && (
                  <div style={{ position: "absolute", left: 2.5, top: 14, width: 1, bottom: -gap + 2, background: accentColors.light }} />
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{exp.position}</h3>
                  <span style={{ fontSize: fs * 0.82, color: "#9ca3af", whiteSpace: "nowrap" }}>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0", fontWeight: 500 }}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>
                    {exp.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex} style={{ marginBottom: 1.5 }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CSection>
        );

      case "education":
        if (data.education.length === 0) return null;
        return (
          <CSection key="education" title={titles.education || "Education"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 8 }}>
                <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{edu.degree}</h3>
                <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0", fontWeight: 500 }}>
                  {edu.institution}
                  {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
                </p>
                {(edu.startDate || edu.endDate) && (
                  <p style={{ fontSize: fs * 0.82, color: "#9ca3af", margin: "1px 0 0" }}>
                    {edu.startDate}
                    {edu.endDate ? ` - ${edu.endDate}` : ""}
                  </p>
                )}
                {edu.bullets.length > 0 && (
                  <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>
                    {edu.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CSection>
        );

      case "projects":
        if (data.projects.length === 0) return null;
        return (
          <CSection key="projects" title={titles.projects || "Projects"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.projects.map((project) => (
              <div key={project.id} style={{ marginBottom: 8 }}>
                <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>
                  {project.name}
                  {project.role && <span style={{ fontWeight: 400, color: "#6b7280" }}> - {project.role}</span>}
                </h3>
                {project.url && <p style={{ color: accentColors.primary, fontSize: fs * 0.82, margin: "1px 0 0" }}>{project.url}</p>}
                {project.bullets.length > 0 && (
                  <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>
                    {project.bullets.filter(Boolean).map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CSection>
        );

      case "custom":
        if (data.customSections.length === 0) return null;
        return (
          <>
            {data.customSections.map((section) => (
              <CSection key={section.id} title={section.title} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
                <CustomEntries section={section} fs={fs} accentColors={accentColors} gap={gap} />
              </CSection>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontSize: fs, lineHeight: 1.5, color: "#1f2937", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", minHeight: "100%" }}>
      <div style={{ width: "32%", background: sidebarBg, padding: gap * 1.2, flexShrink: 0 }}>
        <div style={{ marginBottom: gap * 1.2 }}>
          {isCV && (
            <p style={{ fontSize: fs * 0.75, fontWeight: 600, color: accentColors.primary, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
              Curriculum Vitae
            </p>
          )}
          <h1 style={{ fontSize: nfs * 0.85, fontWeight: 700, color: sidebarText, margin: 0, lineHeight: 1.2 }}>{basics.fullName || "Your Name"}</h1>
          {basics.jobTitle && <p style={{ fontSize: fs * 1.05, color: accentColors.primary, margin: "4px 0 0", fontWeight: 500 }}>{basics.jobTitle}</p>}
        </div>
        <SBSection title="Contact" accent={accentColors} gap={gap} stfs={stfs}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {basics.email && <ContactRow icon="Email" text={basics.email} />}
            {basics.phone && <ContactRow icon="Phone" text={basics.phone} />}
            {basics.location && <ContactRow icon="Location" text={basics.location} />}
            {basics.website && <ContactRow icon="Website" text={basics.website} />}
          </div>
        </SBSection>
        {sidebarSections.map((section) => renderSidebar(section.key))}
      </div>
      <div style={{ flex: 1, padding: gap * 1.2 }}>
        {contentSections.map((section) => renderContent(section.key))}
      </div>
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
        <ul style={{ margin: 0, paddingLeft: 16, color: "#374151" }}>
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
                {entry.dateRange && <span style={{ fontSize: fs * 0.82, color: "#9ca3af" }}>{entry.dateRange}</span>}
              </div>
              {entry.subheading && <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0" }}>{entry.subheading}</p>}
              {entry.description && <p style={{ color: "#374151", margin: "3px 0 0" }}>{entry.description}</p>}
              {entry.bullets.length > 0 && (
                <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>
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

function ContactRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <span style={{ fontSize: "0.78em", fontWeight: 600, opacity: 0.7 }}>{icon}</span>
      <span style={{ fontSize: "0.88em" }}>{text}</span>
    </div>
  );
}

function SBSection({
  title,
  accent,
  gap,
  stfs,
  children,
}: {
  title: string;
  accent: { primary: string; text: string };
  gap: number;
  stfs: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: gap * 1.1 }}>
      <h2 style={{ fontSize: stfs * 0.85, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accent.primary, margin: `0 0 ${gap * 0.4}px`, paddingBottom: 4, borderBottom: `2px solid ${accent.primary}33` }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function CSection({
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
    <div style={{ marginTop: gap * 1.1 }}>
      <h2 style={{ fontSize: stfs, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: accent.primary, margin: `0 0 ${gap * 0.5}px`, paddingBottom: 4, borderBottom: dividers ? `2px solid ${accent.primary}22` : "none" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
