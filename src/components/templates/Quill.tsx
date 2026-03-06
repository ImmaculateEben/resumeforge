import type { TemplateProps } from "./types";

export function QuillTemplate({ data, styleConfig, accentColors }: TemplateProps) {
  const fs = styleConfig.fontScale === "compact" ? 10.5 : 12.5;
  const gap = styleConfig.spacing === "tight" ? 14 : 22;
  const b = data.basics;

  return (
    <div style={{ fontSize: fs, lineHeight: 1.65, color: "#374151", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Elegant Header */}
      <div style={{ marginBottom: gap * 1.2 }}>
        <h1 style={{ fontSize: fs * 2.4, fontWeight: 300, color: accentColors.text, margin: 0, letterSpacing: "0.03em" }}>
          {b.fullName || "Your Name"}
        </h1>
        {b.jobTitle && (
          <p style={{ fontSize: fs * 1.15, color: accentColors.primary, margin: "2px 0 0", fontWeight: 400, letterSpacing: "0.02em" }}>
            {b.jobTitle}
          </p>
        )}
        <div style={{ width: 48, height: 2, background: accentColors.primary, margin: "10px 0", borderRadius: 1 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: fs * 0.9, color: "#6b7280" }}>
          {b.email && <span>{b.email}</span>}
          {b.phone && <span>{b.phone}</span>}
          {b.location && <span>{b.location}</span>}
          {b.website && <span>{b.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <QuillSection title="Summary" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          <p style={{ color: "#4b5563", margin: 0, fontStyle: "italic" }}>{data.summary}</p>
        </QuillSection>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <QuillSection title="Experience" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < data.experience.length - 1 ? gap * 0.8 : 0 }}>
              <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.1, letterSpacing: "-0.01em" }}>
                {exp.position}
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", marginTop: 1 }}>
                <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: 0, fontWeight: 400 }}>
                  {exp.company}{exp.location ? ` — ${exp.location}` : ""}
                </p>
                <span style={{ fontSize: fs * 0.85, color: "#9ca3af", fontStyle: "italic" }}>
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate || ""}
                </span>
              </div>
              {exp.bullets.length > 0 && (
                <ul style={{ margin: "6px 0 0", paddingLeft: 16, color: "#4b5563", listStyleType: "'–  '" }}>
                  {exp.bullets.filter(Boolean).map((b, j) => (
                    <li key={j} style={{ marginBottom: 2, paddingLeft: 4 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </QuillSection>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <QuillSection title="Education" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 10 }}>
              <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{edu.degree}</h3>
              <p style={{ color: accentColors.primary, fontSize: fs * 0.95, margin: "1px 0 0" }}>
                {edu.institution}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}
              </p>
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
        </QuillSection>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <QuillSection title="Skills" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.skills.map((group) => (
              <div key={group.id}>
                {group.category && (
                  <span style={{ fontWeight: 500, color: "#111827", fontSize: fs * 0.95 }}>{group.category}: </span>
                )}
                <span style={{ color: "#4b5563" }}>{group.items.join(" · ")}</span>
              </div>
            ))}
          </div>
        </QuillSection>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <QuillSection title="Projects" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 10 }}>
              <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>
                {proj.name}
                {proj.role && <span style={{ fontWeight: 400, color: "#6b7280" }}> — {proj.role}</span>}
              </h3>
              {proj.url && <p style={{ color: accentColors.primary, fontSize: fs * 0.82, margin: "1px 0 0" }}>{proj.url}</p>}
              {proj.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "#4b5563", listStyleType: "'–  '" }}>
                  {proj.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ paddingLeft: 4 }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </QuillSection>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <QuillSection title="Certifications" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 500, color: "#111827" }}>{cert.name}</span>
              {cert.issuer && <span style={{ color: "#6b7280" }}> — {cert.issuer}</span>}
              {cert.issueDate && <span style={{ color: "#9ca3af", fontSize: fs * 0.85, marginLeft: 6 }}>{cert.issueDate}</span>}
            </div>
          ))}
        </QuillSection>
      )}

      {/* Links */}
      {data.links.length > 0 && (
        <QuillSection title="Links" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
            {data.links.map((link) => (
              <span key={link.id} style={{ fontSize: fs * 0.95 }}>
                <span style={{ fontWeight: 500, color: "#111827" }}>{link.label}</span>{" "}
                <span style={{ color: accentColors.primary }}>{link.url}</span>
              </span>
            ))}
          </div>
        </QuillSection>
      )}

      {/* Custom Sections */}
      {data.customSections.map((section) => (
        <QuillSection key={section.id} title={section.title} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontWeight: 500, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{entry.heading}</h3>
                {entry.dateRange && <span style={{ fontSize: fs * 0.85, color: "#9ca3af", fontStyle: "italic" }}>{entry.dateRange}</span>}
              </div>
              {entry.subheading && <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0" }}>{entry.subheading}</p>}
              {entry.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 16, color: "#4b5563", listStyleType: "'–  '" }}>
                  {entry.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ paddingLeft: 4 }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </QuillSection>
      ))}
    </div>
  );
}

function QuillSection({
  title,
  accent,
  gap,
  dividers,
  children,
}: {
  title: string;
  accent: { primary: string };
  gap: number;
  dividers: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: gap }}>
      <h2
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: accent.primary,
          margin: `0 0 ${gap * 0.4}px`,
          paddingBottom: dividers ? 5 : 0,
          borderBottom: dividers ? `1px solid #e5e7eb` : "none",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
