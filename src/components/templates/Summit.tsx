import type { TemplateProps } from "./types";

export function SummitTemplate({ data, styleConfig, accentColors }: TemplateProps) {
  const fs = styleConfig.fontScale === "compact" ? 10.5 : 12.5;
  const gap = styleConfig.spacing === "tight" ? 10 : 16;
  const b = data.basics;

  const sidebarBg = accentColors.light;
  const sidebarText = accentColors.text;

  return (
    <div style={{ fontSize: fs, lineHeight: 1.5, color: "#1f2937", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", minHeight: "100%" }}>
      {/* Left Sidebar */}
      <div style={{ width: "32%", background: sidebarBg, padding: gap * 1.2, flexShrink: 0 }}>
        {/* Name & Title */}
        <div style={{ marginBottom: gap * 1.2 }}>
          <h1 style={{ fontSize: fs * 1.7, fontWeight: 700, color: sidebarText, margin: 0, lineHeight: 1.2 }}>
            {b.fullName || "Your Name"}
          </h1>
          {b.jobTitle && (
            <p style={{ fontSize: fs * 1.05, color: accentColors.primary, margin: "4px 0 0", fontWeight: 500 }}>
              {b.jobTitle}
            </p>
          )}
        </div>

        {/* Contact */}
        <SidebarSection title="Contact" accent={accentColors} gap={gap}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {b.email && <ContactRow icon="✉" text={b.email} />}
            {b.phone && <ContactRow icon="☎" text={b.phone} />}
            {b.location && <ContactRow icon="⌖" text={b.location} />}
            {b.website && <ContactRow icon="⊕" text={b.website} />}
          </div>
        </SidebarSection>

        {/* Skills */}
        {data.skills.length > 0 && (
          <SidebarSection title="Skills" accent={accentColors} gap={gap}>
            {data.skills.map((group) => (
              <div key={group.id} style={{ marginBottom: gap * 0.6 }}>
                {group.category && (
                  <p style={{ fontWeight: 600, color: sidebarText, margin: "0 0 3px", fontSize: fs * 0.95 }}>
                    {group.category}
                  </p>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {group.items.map((item, i) => (
                    <span
                      key={i}
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
          </SidebarSection>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <SidebarSection title="Certifications" accent={accentColors} gap={gap}>
            {data.certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: 6 }}>
                <p style={{ fontWeight: 600, color: sidebarText, margin: 0, fontSize: fs * 0.95 }}>{cert.name}</p>
                {cert.issuer && <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.85 }}>{cert.issuer}</p>}
                {cert.issueDate && <p style={{ color: "#6b7280", margin: 0, fontSize: fs * 0.8 }}>{cert.issueDate}</p>}
              </div>
            ))}
          </SidebarSection>
        )}

        {/* Links */}
        {data.links.length > 0 && (
          <SidebarSection title="Links" accent={accentColors} gap={gap}>
            {data.links.map((link) => (
              <div key={link.id} style={{ marginBottom: 4 }}>
                <p style={{ fontWeight: 500, color: sidebarText, margin: 0, fontSize: fs * 0.92 }}>{link.label}</p>
                <p style={{ color: accentColors.primary, margin: 0, fontSize: fs * 0.82 }}>{link.url}</p>
              </div>
            ))}
          </SidebarSection>
        )}
      </div>

      {/* Right Content */}
      <div style={{ flex: 1, padding: gap * 1.2 }}>
        {/* Summary */}
        {data.summary && (
          <ContentSection title="Profile" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
            <p style={{ color: "#374151", margin: 0 }}>{data.summary}</p>
          </ContentSection>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <ContentSection title="Experience" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
            {data.experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: i < data.experience.length - 1 ? gap : 0, position: "relative", paddingLeft: 14 }}>
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 6,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: accentColors.primary,
                  }}
                />
                {i < data.experience.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 2.5,
                      top: 14,
                      width: 1,
                      bottom: -gap + 2,
                      background: accentColors.light,
                    }}
                  />
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                  <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{exp.position}</h3>
                  <span style={{ fontSize: fs * 0.82, color: "#9ca3af", whiteSpace: "nowrap" }}>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate || ""}
                  </span>
                </div>
                <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0", fontWeight: 500 }}>
                  {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>
                    {exp.bullets.filter(Boolean).map((b, j) => (
                      <li key={j} style={{ marginBottom: 1.5 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </ContentSection>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <ContentSection title="Education" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 8 }}>
                <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{edu.degree}</h3>
                <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0", fontWeight: 500 }}>
                  {edu.institution}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
                </p>
                {(edu.startDate || edu.endDate) && (
                  <p style={{ fontSize: fs * 0.82, color: "#9ca3af", margin: "1px 0 0" }}>
                    {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}
                  </p>
                )}
                {edu.bullets.length > 0 && (
                  <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>
                    {edu.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </ContentSection>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <ContentSection title="Projects" accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 8 }}>
                <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>
                  {proj.name}
                  {proj.role && <span style={{ fontWeight: 400, color: "#6b7280" }}> — {proj.role}</span>}
                </h3>
                {proj.url && <p style={{ color: accentColors.primary, fontSize: fs * 0.82, margin: "1px 0 0" }}>{proj.url}</p>}
                {proj.bullets.length > 0 && (
                  <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>
                    {proj.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </ContentSection>
        )}

        {/* Custom Sections */}
        {data.customSections.map((section) => (
          <ContentSection key={section.id} title={section.title} accent={accentColors} gap={gap} dividers={styleConfig.showSectionDividers}>
            {section.entries.map((entry) => (
              <div key={entry.id} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: fs * 1.05 }}>{entry.heading}</h3>
                  {entry.dateRange && <span style={{ fontSize: fs * 0.82, color: "#9ca3af" }}>{entry.dateRange}</span>}
                </div>
                {entry.subheading && <p style={{ color: accentColors.primary, fontSize: fs * 0.92, margin: "1px 0 0" }}>{entry.subheading}</p>}
                {entry.bullets.length > 0 && (
                  <ul style={{ margin: "3px 0 0", paddingLeft: 16, color: "#374151" }}>
                    {entry.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </ContentSection>
        ))}
      </div>
    </div>
  );
}

function ContactRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.88em" }}>
      <span style={{ width: 14, textAlign: "center", opacity: 0.7 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function SidebarSection({
  title,
  accent,
  gap,
  children,
}: {
  title: string;
  accent: { primary: string; text: string };
  gap: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: gap * 1.1 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accent.primary, margin: `0 0 ${gap * 0.4}px`, paddingBottom: 4, borderBottom: `2px solid ${accent.primary}33` }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ContentSection({
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
    <div style={{ marginTop: gap * 1.1 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: accent.primary, margin: `0 0 ${gap * 0.5}px`, paddingBottom: 4, borderBottom: dividers ? `2px solid ${accent.primary}22` : "none" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
