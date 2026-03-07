import type { TemplateProps, CustomSection } from "./types";

export function QuillTemplate({ data, styleConfig, accentColors, documentType, sectionOrder, sectionTitles }: TemplateProps) {
  const fs = styleConfig.fontSize;
  const nfs = styleConfig.nameFontSize;
  const stfs = styleConfig.sectionTitleFontSize;
  const gap = styleConfig.spacing === "tight" ? 14 : 22;
  const b = data.basics;
  const isCV = documentType === "cv";
  const titles = sectionTitles || {};

  const sections = sectionOrder || [
    { key: "summary" as const, visible: true }, { key: "experience" as const, visible: true },
    { key: "education" as const, visible: true }, { key: "skills" as const, visible: true },
    { key: "projects" as const, visible: true }, { key: "certifications" as const, visible: true },
    { key: "links" as const, visible: true }, { key: "referees" as const, visible: true },
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
      case "experience":
        if (data.experience.length === 0) return null;
        return (
          <QSection key="experience" title={titles.experience || "Experience"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: i < data.experience.length - 1 ? gap * 0.8 : 0 }}>
                <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.1, letterSpacing: "-0.01em" }}>{exp.position}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", marginTop: 1 }}>
                  <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: 0, fontWeight: 400 }}>{exp.company}{exp.location ? ` — ${exp.location}` : ""}</p>
                  <span style={{ fontSize: fs * 0.85, color: "#9ca3af", fontStyle: "italic" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate || ""}</span>
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: "6px 0 0", paddingLeft: 16, color: "#4b5563", listStyleType: "'–  '" }}>
                    {exp.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ marginBottom: 2, paddingLeft: 4 }}>{b}</li>)}
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
                <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: "1px 0 0" }}>{edu.institution}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}</p>
                {(edu.startDate || edu.endDate || edu.location) && (
                  <p style={{ fontSize: fs * 0.85, color: "#9ca3af", margin: "1px 0 0", fontStyle: "italic" }}>
                    {[edu.location, [edu.startDate, edu.endDate].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
                  </p>
                )}
                {edu.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "#4b5563", listStyleType: "'–  '" }}>
                    {edu.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ paddingLeft: 4 }}>{b}</li>)}
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
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 10 }}>
                <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{proj.name}{proj.role && <span style={{ fontWeight: 400, color: "#6b7280" }}> — {proj.role}</span>}</h3>
                {proj.url && <p style={{ color: accentColors.primary, fontSize: fs * 0.82, margin: "1px 0 0" }}>{proj.url}</p>}
                {proj.bullets.length > 0 && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "#4b5563", listStyleType: "'–  '" }}>
                    {proj.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ paddingLeft: 4 }}>{b}</li>)}
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
            {data.certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: 6 }}>
                <span style={{ fontWeight: 500, color: "#111827" }}>{cert.name}</span>
                {cert.issuer && <span style={{ color: "#6b7280" }}> — {cert.issuer}</span>}
                {cert.issueDate && <span style={{ color: "#9ca3af", fontSize: fs * 0.85, marginLeft: 6 }}>{cert.issueDate}</span>}
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
      case "referees":
        if (data.referees.length === 0) return null;
        return (
          <QSection key="referees" title={titles.referees || "References"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <div style={{ display: "grid", gridTemplateColumns: data.referees.length > 1 ? "1fr 1fr" : "1fr", gap: gap * 0.8 }}>
              {data.referees.map((ref) => (
                <div key={ref.id}>
                  <p style={{ fontWeight: 500, color: "#111827", margin: 0 }}>{ref.name}</p>
                  {ref.position && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.92 }}>{ref.position}{ref.organization ? `, ${ref.organization}` : ""}</p>}
                  {!ref.position && ref.organization && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.92 }}>{ref.organization}</p>}
                  {ref.email && <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.88 }}>{ref.email}</p>}
                  {ref.phone && <p style={{ color: "#9ca3af", margin: 0, fontSize: fs * 0.88 }}>{ref.phone}</p>}
                  {ref.relationship && <p style={{ color: "#9ca3af", margin: 0, fontSize: fs * 0.82, fontStyle: "italic" }}>{ref.relationship}</p>}
                </div>
              ))}
            </div>
          </QSection>
        );
      case "custom":
        if (data.customSections.length === 0) return null;
        return <>{data.customSections.map((section) => (
          <QSection key={section.id} title={section.title} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <CustomEntries section={section} fs={fs} accentColors={accentColors} gap={gap} />
          </QSection>
        ))}</>;
      default: return null;
    }
  };

  return (
    <div style={{ fontSize: fs, lineHeight: 1.65, color: "#374151", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: gap * 1.2 }}>
        {isCV && <p style={{ fontSize: fs * 0.8, fontWeight: 400, color: accentColors.primary, textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 6px" }}>Curriculum Vitae</p>}
        <h1 style={{ fontSize: nfs, fontWeight: 300, color: accentColors.text, margin: 0, letterSpacing: "0.03em" }}>{b.fullName || "Your Name"}</h1>
        {b.jobTitle && <p style={{ fontSize: fs * 1.15, color: accentColors.primary, margin: "2px 0 0", fontWeight: 400, letterSpacing: "0.02em" }}>{b.jobTitle}</p>}
        <div style={{ width: 48, height: 2, background: accentColors.primary, margin: "10px 0", borderRadius: 1 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: fs * 0.9, color: "#6b7280" }}>
          {b.email && <span>{b.email}</span>}
          {b.phone && <span>{b.phone}</span>}
          {b.location && <span>{b.location}</span>}
          {b.website && <span>{b.website}</span>}
        </div>
      </div>
      {sections.filter(s => s.visible).map(s => renderSection(s.key))}
    </div>
  );
}

function CustomEntries({ section, fs, accentColors, gap }: { section: CustomSection; fs: number; accentColors: { primary: string }; gap: number }) {
  switch (section.entryStyle) {
    case "compact":
      return <>{section.entries.map((e) => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
          <span style={{ fontWeight: 500, color: "#111827" }}>{e.heading}</span>
          {e.dateRange && <span style={{ fontSize: fs * 0.85, color: "#9ca3af", fontStyle: "italic" }}>{e.dateRange}</span>}
        </div>
      ))}</>;
    case "bullet-only":
      return <ul style={{ margin: 0, paddingLeft: 16, color: "#4b5563", listStyleType: "'–  '" }}>{section.entries.map((e) => <li key={e.id} style={{ paddingLeft: 4, marginBottom: 2 }}>{e.heading}</li>)}</ul>;
    case "two-column":
      return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: gap * 0.5 }}>{section.entries.map((e) => (
        <div key={e.id}>
          <span style={{ fontWeight: 500, color: "#111827" }}>{e.heading}</span>
          {e.subheading && <span style={{ color: "#6b7280", marginLeft: 6 }}>{e.subheading}</span>}
          {e.dateRange && <p style={{ fontSize: fs * 0.85, color: "#9ca3af", margin: 0, fontStyle: "italic" }}>{e.dateRange}</p>}
        </div>
      ))}</div>;
    case "tag-list":
      return <>{section.entries.map((e) => (
        <div key={e.id} style={{ marginBottom: 6 }}>
          {e.heading && <span style={{ fontWeight: 500, color: "#111827", fontSize: fs * 0.95 }}>{e.heading}: </span>}
          <span style={{ color: "#4b5563" }}>{(e.tags || []).join(" · ")}</span>
        </div>
      ))}</>;
    default:
      return <>{section.entries.map((e, i) => (
        <div key={e.id} style={{ marginBottom: i < section.entries.length - 1 ? gap * 0.6 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{e.heading}</h3>
            {e.dateRange && <span style={{ fontSize: fs * 0.85, color: "#9ca3af", fontStyle: "italic" }}>{e.dateRange}</span>}
          </div>
          {e.subheading && <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0" }}>{e.subheading}</p>}
          {e.description && <p style={{ color: "#4b5563", margin: "3px 0 0", fontStyle: "italic" }}>{e.description}</p>}
          {e.bullets.length > 0 && <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "#4b5563", listStyleType: "'–  '" }}>{e.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ paddingLeft: 4 }}>{b}</li>)}</ul>}
        </div>
      ))}</>;
  }
}

function QSection({ title, accent, gap, dividers, stfs, children }: { title: string; accent: { primary: string }; gap: number; dividers: boolean; stfs: number; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: gap }}>
      <h2 style={{ fontSize: stfs * 0.85, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: accent.primary, margin: `0 0 ${gap * 0.4}px`, paddingBottom: dividers ? 5 : 0, borderBottom: dividers ? "1px solid #e5e7eb" : "none" }}>{title}</h2>
      {children}
    </div>
  );
}