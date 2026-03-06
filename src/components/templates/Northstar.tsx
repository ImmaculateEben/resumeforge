import type { TemplateProps } from "./types";

export function NorthstarTemplate({ data, styleConfig, accentColors, documentType }: TemplateProps) {
  const fs = styleConfig.fontScale === "compact" ? 10.5 : 12.5;
  const gap = styleConfig.spacing === "tight" ? 12 : 18;
  const b = data.basics;
  const isCV = documentType === "cv";

  return (
    <div style={{ fontSize: fs, lineHeight: 1.55, color: "#1f2937", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Bold Header Block */}
      <div
        style={{
          background: `linear-gradient(135deg, ${accentColors.text}, ${accentColors.primary})`,
          color: "white",
          padding: `${gap * 1.4}px ${gap * 1.2}px`,
          margin: "-40px -40px 0",
          marginBottom: gap,
        }}
      >
        {isCV && (
          <p style={{ fontSize: fs * 0.78, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", margin: "0 0 4px", opacity: 0.75 }}>Curriculum Vitae</p>
        )}
        <h1 style={{ fontSize: fs * 2.2, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
          {b.fullName || "Your Name"}
        </h1>
        {b.jobTitle && (
          <p style={{ fontSize: fs * 1.2, margin: "4px 0 0", opacity: 0.9, fontWeight: 400 }}>{b.jobTitle}</p>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px 12px",
            marginTop: 10,
            fontSize: fs * 0.88,
            opacity: 0.85,
          }}
        >
          {b.email && <span>✉ {b.email}</span>}
          {b.phone && <span>☎ {b.phone}</span>}
          {b.location && <span>⌖ {b.location}</span>}
          {b.website && <span>⊕ {b.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <NorthstarSection title="About" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          <p style={{ color: "#374151", margin: 0, borderLeft: `3px solid ${accentColors.primary}33`, paddingLeft: 12, fontStyle: "italic" }}>
            {data.summary}
          </p>
        </NorthstarSection>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <NorthstarSection title="Experience" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < data.experience.length - 1 ? gap : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                <h3 style={{ fontWeight: 700, color: "#111827", margin: 0, fontSize: fs * 1.1 }}>{exp.position}</h3>
                <span
                  style={{
                    fontSize: fs * 0.78,
                    color: accentColors.primary,
                    background: accentColors.light,
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontWeight: 500,
                  }}
                >
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate || ""}
                </span>
              </div>
              <p style={{ color: "#6b7280", fontSize: fs * 0.95, margin: "2px 0 0", fontWeight: 500 }}>
                {exp.company}{exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.bullets.length > 0 && (
                <ul style={{ margin: "5px 0 0", paddingLeft: 18, color: "#374151" }}>
                  {exp.bullets.filter(Boolean).map((b, j) => (
                    <li key={j} style={{ marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </NorthstarSection>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <NorthstarSection title="Education" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 10 }}>
              <h3 style={{ fontWeight: 700, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{edu.degree}</h3>
              <p style={{ color: "#6b7280", fontSize: fs * 0.95, margin: "1px 0 0" }}>
                {edu.institution}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}
              </p>
              {(edu.startDate || edu.endDate || edu.location) && (
                <p style={{ fontSize: fs * 0.82, color: "#9ca3af", margin: "1px 0 0" }}>
                  {[edu.location, [edu.startDate, edu.endDate].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
                </p>
              )}
              {edu.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                  {edu.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </NorthstarSection>
      )}

      {/* Skills as Tags */}
      {data.skills.length > 0 && (
        <NorthstarSection title="Skills" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.skills.map((group) => (
            <div key={group.id} style={{ marginBottom: 8 }}>
              {group.category && (
                <p style={{ fontWeight: 700, color: "#111827", margin: "0 0 4px", fontSize: fs * 0.95 }}>{group.category}</p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {group.items.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: accentColors.light,
                      color: accentColors.text,
                      fontSize: fs * 0.88,
                      fontWeight: 500,
                      border: `1px solid ${accentColors.primary}20`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </NorthstarSection>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <NorthstarSection title="Projects" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 10 }}>
              <h3 style={{ fontWeight: 700, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>
                {proj.name}
                {proj.role && <span style={{ fontWeight: 400, color: "#6b7280" }}> — {proj.role}</span>}
              </h3>
              {proj.url && <p style={{ color: accentColors.primary, fontSize: fs * 0.82, margin: "1px 0 0" }}>{proj.url}</p>}
              {proj.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                  {proj.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </NorthstarSection>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <NorthstarSection title="Certifications" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
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
        </NorthstarSection>
      )}

      {/* Links */}
      {data.links.length > 0 && (
        <NorthstarSection title="Links" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.links.map((link) => (
              <span
                key={link.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 10px",
                  borderRadius: 6,
                  background: accentColors.light,
                  fontSize: fs * 0.9,
                }}
              >
                <span style={{ fontWeight: 600, color: accentColors.text }}>{link.label}</span>
                <span style={{ color: accentColors.primary }}>{link.url}</span>
              </span>
            ))}
          </div>
        </NorthstarSection>
      )}

      {/* Custom Sections */}
      {data.customSections.map((section) => (
        <NorthstarSection key={section.id} title={section.title} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                <h3 style={{ fontWeight: 700, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{entry.heading}</h3>
                {entry.dateRange && (
                  <span style={{ fontSize: fs * 0.78, color: accentColors.primary, background: accentColors.light, padding: "2px 8px", borderRadius: 4 }}>
                    {entry.dateRange}
                  </span>
                )}
              </div>
              {entry.subheading && <p style={{ color: "#6b7280", fontSize: fs * 0.92, margin: "1px 0 0" }}>{entry.subheading}</p>}
              {entry.bullets.length > 0 && (
                <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "#374151" }}>
                  {entry.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </NorthstarSection>
      ))}
    </div>
  );
}

function NorthstarSection({
  title,
  accent,
  gap,
  dividers,
  children,
}: {
  title: string;
  accent: { primary: string; text: string };
  gap: number;
  dividers: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: gap * 1.1 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: accent.text,
          margin: `0 0 ${gap * 0.5}px`,
          paddingBottom: 4,
          borderBottom: dividers ? `2px solid ${accent.primary}` : "none",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
