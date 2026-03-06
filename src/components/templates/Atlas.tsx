import type { TemplateProps } from "./types";

export function AtlasTemplate({ data, styleConfig, accentColors, documentType }: TemplateProps) {
  const fs = styleConfig.fontScale === "compact" ? 11 : 13;
  const gap = styleConfig.spacing === "tight" ? 12 : 18;
  const b = data.basics;
  const isCV = documentType === "cv";

  return (
    <div style={{ fontSize: fs, lineHeight: 1.55, color: "#1f2937", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: gap }}>
        {isCV && (
          <p style={{ fontSize: fs * 0.8, fontWeight: 600, color: accentColors.primary, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 6px" }}>Curriculum Vitae</p>
        )}
        <h1 style={{ fontSize: fs * 2, fontWeight: 700, color: accentColors.text, margin: 0, letterSpacing: "-0.02em" }}>
          {b.fullName || "Your Name"}
        </h1>
        {b.jobTitle && (
          <p style={{ fontSize: fs * 1.1, color: "#6b7280", margin: "2px 0 0" }}>{b.jobTitle}</p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 6, fontSize: fs * 0.9, color: "#6b7280" }}>
          {b.email && <span>{b.email}</span>}
          {b.phone && <><span style={{ color: "#d1d5db" }}>•</span><span>{b.phone}</span></>}
          {b.location && <><span style={{ color: "#d1d5db" }}>•</span><span>{b.location}</span></>}
          {b.website && <><span style={{ color: "#d1d5db" }}>•</span><span>{b.website}</span></>}
        </div>
      </div>

      {styleConfig.showSectionDividers && <hr style={{ border: "none", borderTop: `1px solid ${accentColors.light}`, margin: `${gap}px 0` }} />}

      {/* Summary */}
      {data.summary && (
        <AtlasSection title="Summary" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          <p style={{ color: "#374151", margin: 0 }}>{data.summary}</p>
        </AtlasSection>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <AtlasSection title="Experience" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < data.experience.length - 1 ? gap * 0.7 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{exp.position}</h3>
                <span style={{ fontSize: fs * 0.85, color: "#9ca3af", whiteSpace: "nowrap" }}>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate || ""}
                </span>
              </div>
              <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: "1px 0 0", fontWeight: 500 }}>
                {exp.company}{exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                  {exp.bullets.filter(Boolean).map((b, j) => (
                    <li key={j} style={{ marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </AtlasSection>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <AtlasSection title="Education" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.education.map((edu, i) => (
            <div key={edu.id} style={{ marginBottom: i < data.education.length - 1 ? gap * 0.6 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{edu.degree}</h3>
                {(edu.startDate || edu.endDate) && (
                  <span style={{ fontSize: fs * 0.85, color: "#9ca3af" }}>
                    {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}
                  </span>
                )}
              </div>
              <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: "1px 0 0", fontWeight: 500 }}>
                {edu.institution}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}{edu.location ? ` · ${edu.location}` : ""}
              </p>
              {edu.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                  {edu.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </AtlasSection>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <AtlasSection title="Skills" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.skills.map((group) => (
            <div key={group.id} style={{ marginBottom: 6 }}>
              {group.category && (
                <span style={{ fontWeight: 600, color: "#111827", fontSize: fs * 0.95 }}>{group.category}: </span>
              )}
              <span style={{ color: "#374151" }}>{group.items.join(", ")}</span>
            </div>
          ))}
        </AtlasSection>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <AtlasSection title="Projects" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.projects.map((proj, i) => (
            <div key={proj.id} style={{ marginBottom: i < data.projects.length - 1 ? gap * 0.6 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>
                  {proj.name}{proj.role ? <span style={{ fontWeight: 400, color: "#6b7280" }}> — {proj.role}</span> : ""}
                </h3>
                {(proj.startDate || proj.endDate) && (
                  <span style={{ fontSize: fs * 0.85, color: "#9ca3af" }}>
                    {proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ""}
                  </span>
                )}
              </div>
              {proj.url && <p style={{ color: accentColors.primary, fontSize: fs * 0.85, margin: "1px 0 0" }}>{proj.url}</p>}
              {proj.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                  {proj.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </AtlasSection>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <AtlasSection title="Certifications" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: "#111827" }}>{cert.name}</span>
              {cert.issuer && <span style={{ color: "#6b7280" }}> — {cert.issuer}</span>}
              {cert.issueDate && <span style={{ color: "#9ca3af", fontSize: fs * 0.85, marginLeft: 8 }}>{cert.issueDate}</span>}
            </div>
          ))}
        </AtlasSection>
      )}

      {/* Links */}
      {data.links.length > 0 && (
        <AtlasSection title="Links" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
            {data.links.map((link) => (
              <span key={link.id}>
                <span style={{ fontWeight: 500, color: "#111827" }}>{link.label}:</span>{" "}
                <span style={{ color: accentColors.primary }}>{link.url}</span>
              </span>
            ))}
          </div>
        </AtlasSection>
      )}

      {/* Custom Sections */}
      {data.customSections.map((section) => (
        <AtlasSection key={section.id} title={section.title} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {section.entries.map((entry, i) => (
            <div key={entry.id} style={{ marginBottom: i < section.entries.length - 1 ? gap * 0.6 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{entry.heading}</h3>
                {entry.dateRange && <span style={{ fontSize: fs * 0.85, color: "#9ca3af" }}>{entry.dateRange}</span>}
              </div>
              {entry.subheading && <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: "1px 0 0" }}>{entry.subheading}</p>}
              {entry.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                  {entry.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </AtlasSection>
      ))}
    </div>
  );
}

function AtlasSection({
  title,
  accent,
  gap,
  dividers,
  children,
}: {
  title: string;
  accent: { primary: string; light: string };
  gap: number;
  dividers: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: gap }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: gap * 0.5 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: accent.primary }} />
        <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: accent.primary, margin: 0 }}>
          {title}
        </h2>
        {dividers && <div style={{ flex: 1, height: 1, background: accent.light }} />}
      </div>
      {children}
    </div>
  );
}
