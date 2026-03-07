import type { TemplateProps, CustomSection } from "./types";

export function NorthstarTemplate({ data, styleConfig, accentColors, documentType, sectionOrder, sectionTitles }: TemplateProps) {
  const fs = styleConfig.fontSize;
  const nfs = styleConfig.nameFontSize;
  const stfs = styleConfig.sectionTitleFontSize;
  const gap = styleConfig.spacing === "tight" ? 12 : 18;
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
          <NSection key="summary" title={titles.summary || "About"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <p style={{ color: "#374151", margin: 0, borderLeft: `3px solid ${accentColors.primary}33`, paddingLeft: 12, fontStyle: "italic" }}>{data.summary}</p>
          </NSection>
        );
      case "experience":
        if (data.experience.length === 0) return null;
        return (
          <NSection key="experience" title={titles.experience || "Experience"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: i < data.experience.length - 1 ? gap : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                  <h3 style={{ fontWeight: 700, color: "#111827", margin: 0, fontSize: fs * 1.1 }}>{exp.position}</h3>
                  <span style={{ fontSize: fs * 0.78, color: accentColors.primary, background: accentColors.light, padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate || ""}</span>
                </div>
                <p style={{ color: "#6b7280", fontSize: fs * 0.95, margin: "2px 0 0", fontWeight: 500 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                {exp.bullets.length > 0 && <ul style={{ margin: "5px 0 0", paddingLeft: 18, color: "#374151" }}>{exp.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ marginBottom: 2 }}>{b}</li>)}</ul>}
              </div>
            ))}
          </NSection>
        );
      case "education":
        if (data.education.length === 0) return null;
        return (
          <NSection key="education" title={titles.education || "Education"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <h3 style={{ fontWeight: 700, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{edu.degree}</h3>
                <p style={{ color: "#6b7280", fontSize: fs * 0.95, margin: "1px 0 0" }}>{edu.institution}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}</p>
                {(edu.startDate || edu.endDate || edu.location) && (
                  <p style={{ fontSize: fs * 0.82, color: "#9ca3af", margin: "1px 0 0" }}>{[edu.location, [edu.startDate, edu.endDate].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}</p>
                )}
                {edu.bullets.length > 0 && <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>{edu.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}</ul>}
              </div>
            ))}
          </NSection>
        );
      case "skills":
        if (data.skills.length === 0) return null;
        return (
          <NSection key="skills" title={titles.skills || "Skills"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.skills.map((group) => (
              <div key={group.id} style={{ marginBottom: 8 }}>
                {group.category && <p style={{ fontWeight: 700, color: "#111827", margin: "0 0 4px", fontSize: fs * 0.95 }}>{group.category}</p>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {group.items.map((item, i) => (
                    <span key={i} style={{ display: "inline-block", padding: "3px 10px", borderRadius: 6, background: accentColors.light, color: accentColors.text, fontSize: fs * 0.88, fontWeight: 500, border: `1px solid ${accentColors.primary}20` }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </NSection>
        );
      case "projects":
        if (data.projects.length === 0) return null;
        return (
          <NSection key="projects" title={titles.projects || "Projects"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 10 }}>
                <h3 style={{ fontWeight: 700, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{proj.name}{proj.role && <span style={{ fontWeight: 400, color: "#6b7280" }}> — {proj.role}</span>}</h3>
                {proj.url && <p style={{ color: accentColors.primary, fontSize: fs * 0.82, margin: "1px 0 0" }}>{proj.url}</p>}
                {proj.bullets.length > 0 && <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>{proj.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}</ul>}
              </div>
            ))}
          </NSection>
        );
      case "certifications":
        if (data.certifications.length === 0) return null;
        return (
          <NSection key="certifications" title={titles.certifications || "Certifications"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.certifications.map((cert) => (
              <div key={cert.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: accentColors.primary, flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 600, color: "#111827" }}>{cert.name}</span>
                  {cert.issuer && <span style={{ color: "#6b7280" }}> — {cert.issuer}</span>}
                  {cert.issueDate && <span style={{ color: "#9ca3af", fontSize: fs * 0.85, marginLeft: 6 }}>{cert.issueDate}</span>}
                </div>
              </div>
            ))}
          </NSection>
        );
      case "links":
        if (data.links.length === 0) return null;
        return (
          <NSection key="links" title={titles.links || "Links"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {data.links.map((link) => (
                <span key={link.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 6, background: accentColors.light, fontSize: fs * 0.9 }}>
                  <span style={{ fontWeight: 600, color: accentColors.text }}>{link.label}</span>
                  <span style={{ color: accentColors.primary }}>{link.url}</span>
                </span>
              ))}
            </div>
          </NSection>
        );
      case "referees":
        if (data.referees.length === 0) return null;
        return (
          <NSection key="referees" title={titles.referees || "References"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <div style={{ display: "grid", gridTemplateColumns: data.referees.length > 1 ? "1fr 1fr" : "1fr", gap: gap * 0.8 }}>
              {data.referees.map((ref) => (
                <div key={ref.id} style={{ padding: "8px 12px", borderRadius: 8, background: accentColors.light, border: `1px solid ${accentColors.primary}15` }}>
                  <p style={{ fontWeight: 700, color: "#111827", margin: 0 }}>{ref.name}</p>
                  {ref.position && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.92 }}>{ref.position}{ref.organization ? `, ${ref.organization}` : ""}</p>}
                  {!ref.position && ref.organization && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.92 }}>{ref.organization}</p>}
                  {ref.email && <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.88 }}>{ref.email}</p>}
                  {ref.phone && <p style={{ color: "#9ca3af", margin: 0, fontSize: fs * 0.88 }}>{ref.phone}</p>}
                </div>
              ))}
            </div>
          </NSection>
        );
      case "custom":
        if (data.customSections.length === 0) return null;
        return <>{data.customSections.map((section) => (
          <NSection key={section.id} title={section.title} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <CustomEntries section={section} fs={fs} accentColors={accentColors} gap={gap} />
          </NSection>
        ))}</>;
      default: return null;
    }
  };

  return (
    <div style={{ fontSize: fs, lineHeight: 1.55, color: "#1f2937", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: `linear-gradient(135deg, ${accentColors.text}, ${accentColors.primary})`, color: "white", padding: `${gap * 1.4}px ${gap * 1.2}px`, margin: "-40px -40px 0", marginBottom: gap }}>
        {isCV && <p style={{ fontSize: fs * 0.78, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", margin: "0 0 4px", opacity: 0.75 }}>Curriculum Vitae</p>}
        <h1 style={{ fontSize: nfs, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>{b.fullName || "Your Name"}</h1>
        {b.jobTitle && <p style={{ fontSize: fs * 1.2, margin: "4px 0 0", opacity: 0.9, fontWeight: 400 }}>{b.jobTitle}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 10, fontSize: fs * 0.88, opacity: 0.85 }}>
          {b.email && <span>✉ {b.email}</span>}
          {b.phone && <span>☎ {b.phone}</span>}
          {b.location && <span>⌖ {b.location}</span>}
          {b.website && <span>⊕ {b.website}</span>}
        </div>
      </div>
      {sections.filter(s => s.visible).map(s => renderSection(s.key))}
    </div>
  );
}

function CustomEntries({ section, fs, accentColors, gap }: { section: CustomSection; fs: number; accentColors: { primary: string; light: string; text: string }; gap: number }) {
  switch (section.entryStyle) {
    case "compact":
      return <>{section.entries.map((e) => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontWeight: 700, color: "#111827" }}>{e.heading}</span>
          {e.dateRange && <span style={{ fontSize: fs * 0.78, color: accentColors.primary, background: accentColors.light, padding: "2px 8px", borderRadius: 4 }}>{e.dateRange}</span>}
        </div>
      ))}</>;
    case "bullet-only":
      return <ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>{section.entries.map((e) => <li key={e.id} style={{ marginBottom: 2 }}>{e.heading}</li>)}</ul>;
    case "two-column":
      return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: gap * 0.5 }}>{section.entries.map((e) => (
        <div key={e.id} style={{ padding: "4px 8px", borderRadius: 6, background: accentColors.light }}>
          <span style={{ fontWeight: 700, color: "#111827" }}>{e.heading}</span>
          {e.subheading && <span style={{ color: "#6b7280", marginLeft: 6 }}>{e.subheading}</span>}
          {e.dateRange && <p style={{ fontSize: fs * 0.82, color: "#9ca3af", margin: 0 }}>{e.dateRange}</p>}
        </div>
      ))}</div>;
    case "tag-list":
      return <>{section.entries.map((e) => (
        <div key={e.id} style={{ marginBottom: 6 }}>
          {e.heading && <span style={{ fontWeight: 700, color: "#111827", fontSize: fs * 0.95 }}>{e.heading}: </span>}
          <span>{(e.tags || []).map((tag, i) => (
            <span key={i} style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, background: accentColors.light, color: accentColors.text, fontSize: fs * 0.88, fontWeight: 500, marginRight: 4, marginBottom: 2 }}>{tag}</span>
          ))}</span>
        </div>
      ))}</>;
    default:
      return <>{section.entries.map((e, i) => (
        <div key={e.id} style={{ marginBottom: i < section.entries.length - 1 ? gap * 0.6 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
            <h3 style={{ fontWeight: 700, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{e.heading}</h3>
            {e.dateRange && <span style={{ fontSize: fs * 0.78, color: accentColors.primary, background: accentColors.light, padding: "2px 8px", borderRadius: 4 }}>{e.dateRange}</span>}
          </div>
          {e.subheading && <p style={{ color: "#6b7280", fontSize: fs * 0.92, margin: "1px 0 0" }}>{e.subheading}</p>}
          {e.description && <p style={{ color: "#374151", margin: "3px 0 0" }}>{e.description}</p>}
          {e.bullets.length > 0 && <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>{e.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}</ul>}
        </div>
      ))}</>;
  }
}

function NSection({ title, accent, gap, dividers, stfs, children }: { title: string; accent: { primary: string; text: string }; gap: number; dividers: boolean; stfs: number; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: gap * 1.1 }}>
      <h2 style={{ fontSize: stfs, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: accent.text, margin: `0 0 ${gap * 0.5}px`, paddingBottom: 4, borderBottom: dividers ? `2px solid ${accent.primary}` : "none" }}>{title}</h2>
      {children}
    </div>
  );
}