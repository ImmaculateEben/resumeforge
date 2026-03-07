import type { TemplateProps, CustomSection } from "./types";

export function SummitTemplate({ data, styleConfig, accentColors, documentType, sectionOrder, sectionTitles }: TemplateProps) {
  const fs = styleConfig.fontSize;
  const nfs = styleConfig.nameFontSize;
  const stfs = styleConfig.sectionTitleFontSize;
  const gap = styleConfig.spacing === "tight" ? 10 : 16;
  const b = data.basics;
  const isCV = documentType === "cv";
  const titles = sectionTitles || {};

  const sidebarBg = accentColors.light;
  const sidebarText = accentColors.text;

  // Sidebar sections: skills, certifications, links, referees
  const sidebarKeys = new Set(["skills", "certifications", "links", "referees"]);
  // Content sections: summary, experience, education, projects, custom
  const contentKeys = new Set(["summary", "experience", "education", "projects", "custom"]);

  const sections = sectionOrder || [
    { key: "summary" as const, visible: true }, { key: "experience" as const, visible: true },
    { key: "education" as const, visible: true }, { key: "skills" as const, visible: true },
    { key: "projects" as const, visible: true }, { key: "certifications" as const, visible: true },
    { key: "links" as const, visible: true }, { key: "referees" as const, visible: true },
    { key: "custom" as const, visible: true },
  ];
  const visible = sections.filter(s => s.visible);
  const sidebarSections = visible.filter(s => sidebarKeys.has(s.key));
  const contentSections = visible.filter(s => contentKeys.has(s.key));

  const renderSidebar = (key: string) => {
    switch (key) {
      case "skills":
        if (data.skills.length === 0) return null;
        return (
          <SBSection key="skills" title={titles.skills || "Skills"} accent={accentColors} gap={gap} stfs={stfs}>
            {data.skills.map((group) => (
              <div key={group.id} style={{ marginBottom: gap * 0.6 }}>
                {group.category && <p style={{ fontWeight: 600, color: sidebarText, margin: "0 0 3px", fontSize: fs * 0.95 }}>{group.category}</p>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {group.items.map((item, i) => (
                    <span key={i} style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.7)", fontSize: fs * 0.88, color: sidebarText, border: `1px solid ${accentColors.primary}22` }}>{item}</span>
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
            {data.certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: 6 }}>
                <p style={{ fontWeight: 600, color: sidebarText, margin: 0, fontSize: fs * 0.95 }}>{cert.name}</p>
                {cert.issuer && <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.85 }}>{cert.issuer}</p>}
                {cert.issueDate && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.8 }}>{cert.issueDate}</p>}
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
      case "referees":
        if (data.referees.length === 0) return null;
        return (
          <SBSection key="referees" title={titles.referees || "References"} accent={accentColors} gap={gap} stfs={stfs}>
            {data.referees.map((ref) => (
              <div key={ref.id} style={{ marginBottom: 8 }}>
                <p style={{ fontWeight: 600, color: sidebarText, margin: 0, fontSize: fs * 0.95 }}>{ref.name}</p>
                {ref.position && <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.85 }}>{ref.position}</p>}
                {ref.organization && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.82 }}>{ref.organization}</p>}
                {ref.email && <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.82 }}>{ref.email}</p>}
                {ref.phone && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.8 }}>{ref.phone}</p>}
              </div>
            ))}
          </SBSection>
        );
      default: return null;
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
            {data.experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: i < data.experience.length - 1 ? gap : 0, position: "relative", paddingLeft: 14 }}>
                <div style={{ position: "absolute", left: 0, top: 6, width: 6, height: 6, borderRadius: "50%", background: accentColors.primary }} />
                {i < data.experience.length - 1 && <div style={{ position: "absolute", left: 2.5, top: 14, width: 1, bottom: -gap + 2, background: accentColors.light }} />}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{exp.position}</h3>
                  <span style={{ fontSize: fs * 0.82, color: "#9ca3af", whiteSpace: "nowrap" }}>{exp.startDate} – {exp.current ? "Present" : exp.endDate || ""}</span>
                </div>
                <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0", fontWeight: 500 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                {exp.bullets.length > 0 && <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>{exp.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ marginBottom: 1.5 }}>{b}</li>)}</ul>}
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
                <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0", fontWeight: 500 }}>{edu.institution}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}</p>
                {(edu.startDate || edu.endDate) && <p style={{ fontSize: fs * 0.82, color: "#9ca3af", margin: "1px 0 0" }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</p>}
                {edu.bullets.length > 0 && <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>{edu.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}</ul>}
              </div>
            ))}
          </CSection>
        );
      case "projects":
        if (data.projects.length === 0) return null;
        return (
          <CSection key="projects" title={titles.projects || "Projects"} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 8 }}>
                <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{proj.name}{proj.role && <span style={{ fontWeight: 400, color: "#6b7280" }}> — {proj.role}</span>}</h3>
                {proj.url && <p style={{ color: accentColors.primary, fontSize: fs * 0.82, margin: "1px 0 0" }}>{proj.url}</p>}
                {proj.bullets.length > 0 && <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>{proj.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}</ul>}
              </div>
            ))}
          </CSection>
        );
      case "custom":
        if (data.customSections.length === 0) return null;
        return <>{data.customSections.map((section) => (
          <CSection key={section.id} title={section.title} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers} stfs={stfs}>
            <CustomEntries section={section} fs={fs} accentColors={accentColors} gap={gap} />
          </CSection>
        ))}</>;
      default: return null;
    }
  };

  return (
    <div style={{ fontSize: fs, lineHeight: 1.5, color: "#1f2937", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", minHeight: "100%" }}>
      <div style={{ width: "32%", background: sidebarBg, padding: gap * 1.2, flexShrink: 0 }}>
        <div style={{ marginBottom: gap * 1.2 }}>
          {isCV && <p style={{ fontSize: fs * 0.75, fontWeight: 600, color: accentColors.primary, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>Curriculum Vitae</p>}
          <h1 style={{ fontSize: nfs * 0.85, fontWeight: 700, color: sidebarText, margin: 0, lineHeight: 1.2 }}>{b.fullName || "Your Name"}</h1>
          {b.jobTitle && <p style={{ fontSize: fs * 1.05, color: accentColors.primary, margin: "4px 0 0", fontWeight: 500 }}>{b.jobTitle}</p>}
        </div>
        <SBSection title="Contact" accent={accentColors} gap={gap} stfs={stfs}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {b.email && <CRow icon="✉" text={b.email} />}
            {b.phone && <CRow icon="☎" text={b.phone} />}
            {b.location && <CRow icon="⌖" text={b.location} />}
            {b.website && <CRow icon="⊕" text={b.website} />}
          </div>
        </SBSection>
        {sidebarSections.map(s => renderSidebar(s.key))}
      </div>
      <div style={{ flex: 1, padding: gap * 1.2 }}>
        {contentSections.map(s => renderContent(s.key))}
      </div>
    </div>
  );
}

function CustomEntries({ section, fs, accentColors, gap }: { section: CustomSection; fs: number; accentColors: { primary: string }; gap: number }) {
  switch (section.entryStyle) {
    case "compact":
      return <>{section.entries.map((e) => (
        <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
          <span style={{ fontWeight: 600, color: "#111827" }}>{e.heading}</span>
          {e.dateRange && <span style={{ fontSize: fs * 0.85, color: "#9ca3af" }}>{e.dateRange}</span>}
        </div>
      ))}</>;
    case "bullet-only":
      return <ul style={{ margin: 0, paddingLeft: 16, color: "#374151" }}>{section.entries.map((e) => <li key={e.id} style={{ marginBottom: 2 }}>{e.heading}</li>)}</ul>;
    case "two-column":
      return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: gap * 0.5 }}>{section.entries.map((e) => (
        <div key={e.id}>
          <span style={{ fontWeight: 600, color: "#111827" }}>{e.heading}</span>
          {e.subheading && <span style={{ color: "#6b7280", marginLeft: 6 }}>{e.subheading}</span>}
          {e.dateRange && <p style={{ fontSize: fs * 0.85, color: "#9ca3af", margin: 0 }}>{e.dateRange}</p>}
        </div>
      ))}</div>;
    case "tag-list":
      return <>{section.entries.map((e) => (
        <div key={e.id} style={{ marginBottom: 6 }}>
          {e.heading && <span style={{ fontWeight: 600, color: "#111827", fontSize: fs * 0.95 }}>{e.heading}: </span>}
          <span style={{ color: "#374151" }}>{(e.tags || []).join(", ")}</span>
        </div>
      ))}</>;
    default:
      return <>{section.entries.map((e, i) => (
        <div key={e.id} style={{ marginBottom: i < section.entries.length - 1 ? gap * 0.6 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{e.heading}</h3>
            {e.dateRange && <span style={{ fontSize: fs * 0.82, color: "#9ca3af" }}>{e.dateRange}</span>}
          </div>
          {e.subheading && <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0" }}>{e.subheading}</p>}
          {e.description && <p style={{ color: "#374151", margin: "3px 0 0" }}>{e.description}</p>}
          {e.bullets.length > 0 && <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>{e.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}</ul>}
        </div>
      ))}</>;
  }
}

function CRow({ icon, text }: { icon: string; text: string }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.88em" }}><span style={{ width: 14, textAlign: "center", opacity: 0.7 }}>{icon}</span><span>{text}</span></div>;
}

function SBSection({ title, accent, gap, stfs, children }: { title: string; accent: { primary: string; text: string }; gap: number; stfs: number; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: gap * 1.1 }}>
      <h2 style={{ fontSize: stfs * 0.85, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accent.primary, margin: `0 0 ${gap * 0.4}px`, paddingBottom: 4, borderBottom: `2px solid ${accent.primary}33` }}>{title}</h2>
      {children}
    </div>
  );
}

function CSection({ title, accent, gap, dividers, stfs, children }: { title: string; accent: { primary: string; light: string }; gap: number; dividers: boolean; stfs: number; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: gap * 1.1 }}>
      <h2 style={{ fontSize: stfs, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: accent.primary, margin: `0 0 ${gap * 0.5}px`, paddingBottom: 4, borderBottom: dividers ? `2px solid ${accent.primary}22` : "none" }}>{title}</h2>
      {children}
    </div>
  );
}