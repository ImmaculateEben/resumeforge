import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { CVData, TemplateId } from "@/types";

const styles = StyleSheet.create({
  modernPage: {
    padding: 32,
    fontSize: 10,
    color: "#0f172a",
    fontFamily: "Helvetica",
  },
  modernHeader: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#4f46e5",
  },
  modernName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modernContact: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 2,
  },
  modernSection: {
    marginBottom: 14,
  },
  modernSectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 6,
    color: "#3730a3",
  },
  modernItem: {
    marginBottom: 6,
  },
  modernItemTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  modernItemSubtitle: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 2,
  },
  modernBody: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#334155",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  modernChip: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#e0e7ff",
    fontSize: 9,
    marginRight: 4,
    marginBottom: 4,
    color: "#3730a3",
  },
  classicPage: {
    paddingTop: 36,
    paddingHorizontal: 42,
    paddingBottom: 36,
    fontSize: 10,
    color: "#1e293b",
    fontFamily: "Times-Roman",
  },
  classicHeader: {
    alignItems: "center",
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#94a3b8",
  },
  classicName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  classicContact: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 2,
  },
  classicSummary: {
    fontSize: 10,
    lineHeight: 1.5,
    marginTop: 6,
    textAlign: "center",
    color: "#334155",
  },
  classicSection: {
    marginBottom: 16,
  },
  classicSectionTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
    color: "#334155",
  },
  classicDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    marginBottom: 6,
  },
  classicItem: {
    marginBottom: 8,
  },
  classicItemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  classicItemTitle: {
    fontSize: 11,
    fontWeight: "bold",
  },
  classicItemDate: {
    fontSize: 9,
    color: "#64748b",
  },
  classicItemSubtitle: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 2,
  },
  classicBody: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#334155",
  },
  classicChip: {
    fontSize: 9,
    marginRight: 10,
    marginBottom: 4,
    color: "#334155",
  },
  creativePage: {
    flexDirection: "row",
    fontSize: 10,
    color: "#0f172a",
    fontFamily: "Helvetica",
  },
  creativeSidebar: {
    width: 180,
    backgroundColor: "#0f766e",
    paddingTop: 36,
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  creativeSidebarName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  creativeSidebarContact: {
    fontSize: 9,
    color: "#ccfbf1",
    marginBottom: 3,
  },
  creativeSidebarSection: {
    marginTop: 18,
  },
  creativeSidebarTitle: {
    fontSize: 11,
    color: "#ffffff",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  creativeSidebarText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#ccfbf1",
    marginBottom: 4,
  },
  creativeMain: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  creativeAccentBar: {
    width: 56,
    borderBottomWidth: 3,
    borderBottomColor: "#14b8a6",
    marginBottom: 10,
  },
  creativeSummary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#334155",
    marginBottom: 16,
  },
  creativeSection: {
    marginBottom: 14,
  },
  creativeSectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f766e",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  creativeItem: {
    marginBottom: 8,
  },
  creativeItemTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  creativeItemSubtitle: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 2,
  },
  creativeBody: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#334155",
  },
});

function getFullName(title: string, data: CVData): string {
  return `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim() || title;
}

function buildContactItems(data: CVData): string[] {
  return [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.portfolio,
  ].filter(Boolean);
}

function formatDateRange(startDate: string, endDate: string, current?: boolean): string {
  const values = [startDate, current ? "Present" : endDate].filter(Boolean);
  return values.join(" - ");
}

interface SharedTemplateProps {
  title: string;
  data: CVData;
}

function ModernTemplate({ title, data }: SharedTemplateProps) {
  const fullName = getFullName(title, data);
  const contactLine = buildContactItems(data).join(" | ");

  return (
    <Page size="A4" style={styles.modernPage}>
      <View style={styles.modernHeader}>
        <Text style={styles.modernName}>{fullName}</Text>
        {contactLine ? <Text style={styles.modernContact}>{contactLine}</Text> : null}
        {data.personalInfo.summary ? (
          <Text style={styles.modernBody}>{data.personalInfo.summary}</Text>
        ) : null}
      </View>

      <MainBody layout="modern" data={data} />
    </Page>
  );
}

function ClassicTemplate({ title, data }: SharedTemplateProps) {
  const fullName = getFullName(title, data);
  const contactLine = buildContactItems(data).join(" | ");

  return (
    <Page size="A4" style={styles.classicPage}>
      <View style={styles.classicHeader}>
        <Text style={styles.classicName}>{fullName}</Text>
        {contactLine ? <Text style={styles.classicContact}>{contactLine}</Text> : null}
        {data.personalInfo.summary ? (
          <Text style={styles.classicSummary}>{data.personalInfo.summary}</Text>
        ) : null}
      </View>

      <MainBody layout="classic" data={data} />
    </Page>
  );
}

function CreativeTemplate({ title, data }: SharedTemplateProps) {
  const fullName = getFullName(title, data);
  const contactItems = buildContactItems(data);

  return (
    <Page size="A4" style={styles.creativePage}>
      <View style={styles.creativeSidebar}>
        <Text style={styles.creativeSidebarName}>{fullName}</Text>
        {contactItems.map((item) => (
          <Text key={item} style={styles.creativeSidebarContact}>
            {item}
          </Text>
        ))}

        {data.skills.length > 0 ? (
          <View style={styles.creativeSidebarSection}>
            <Text style={styles.creativeSidebarTitle}>Skills</Text>
            {data.skills.map((skill) => (
              <Text key={skill.id} style={styles.creativeSidebarText}>
                {skill.name || "Skill"}
              </Text>
            ))}
          </View>
        ) : null}

        {data.languages.length > 0 ? (
          <View style={styles.creativeSidebarSection}>
            <Text style={styles.creativeSidebarTitle}>Languages</Text>
            {data.languages.map((language) => (
              <Text key={language.id} style={styles.creativeSidebarText}>
                {[language.name, language.proficiency].filter(Boolean).join(" - ")}
              </Text>
            ))}
          </View>
        ) : null}

        {data.certifications.length > 0 ? (
          <View style={styles.creativeSidebarSection}>
            <Text style={styles.creativeSidebarTitle}>Certifications</Text>
            {data.certifications.map((certification) => (
              <Text key={certification.id} style={styles.creativeSidebarText}>
                {certification.name || "Certification"}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.creativeMain}>
        <View style={styles.creativeAccentBar} />
        {data.personalInfo.summary ? (
          <Text style={styles.creativeSummary}>{data.personalInfo.summary}</Text>
        ) : null}

        <MainBody layout="creative" data={data} hideSkills hideLanguages hideCertifications />
      </View>
    </Page>
  );
}

type LayoutMode = "modern" | "classic" | "creative";

interface MainBodyProps {
  layout: LayoutMode;
  data: CVData;
  hideSkills?: boolean;
  hideLanguages?: boolean;
  hideCertifications?: boolean;
}

function MainBody({
  layout,
  data,
  hideSkills = false,
  hideLanguages = false,
  hideCertifications = false,
}: MainBodyProps) {
  const isModern = layout === "modern";
  const isClassic = layout === "classic";

  return (
    <>
      {data.experience.length > 0 ? (
        <Section layout={layout} title="Experience">
          {data.experience.map((experience) => (
            <ItemBlock
              key={experience.id}
              layout={layout}
              title={experience.position || "Role"}
              subtitle={experience.company}
              tertiary={formatDateRange(experience.startDate, experience.endDate, experience.current)}
              body={experience.description}
            />
          ))}
        </Section>
      ) : null}

      {data.education.length > 0 ? (
        <Section layout={layout} title="Education">
          {data.education.map((education) => (
            <ItemBlock
              key={education.id}
              layout={layout}
              title={[education.degree, education.field].filter(Boolean).join(" in ") || "Education"}
              subtitle={education.institution}
              tertiary={formatDateRange(education.startDate, education.endDate, education.current)}
              body={education.description}
            />
          ))}
        </Section>
      ) : null}

      {data.projects.length > 0 ? (
        <Section layout={layout} title="Projects">
          {data.projects.map((project) => (
            <ItemBlock
              key={project.id}
              layout={layout}
              title={project.name || "Project"}
              subtitle={project.url}
              tertiary={project.technologies.join(", ")}
              body={project.description}
            />
          ))}
        </Section>
      ) : null}

      {!hideSkills && data.skills.length > 0 ? (
        <Section layout={layout} title="Skills">
          <View style={styles.chips}>
            {data.skills.map((skill) => (
              <Text
                key={skill.id}
                style={isModern ? styles.modernChip : isClassic ? styles.classicChip : styles.modernChip}
              >
                {skill.name || "Skill"}
              </Text>
            ))}
          </View>
        </Section>
      ) : null}

      {!hideCertifications && data.certifications.length > 0 ? (
        <Section layout={layout} title="Certifications">
          {data.certifications.map((certification) => (
            <ItemBlock
              key={certification.id}
              layout={layout}
              title={certification.name || "Certification"}
              subtitle={certification.issuer}
              tertiary={certification.date}
            />
          ))}
        </Section>
      ) : null}

      {!hideLanguages && data.languages.length > 0 ? (
        <Section layout={layout} title="Languages">
          <View style={styles.chips}>
            {data.languages.map((language) => (
              <Text
                key={language.id}
                style={isModern ? styles.modernChip : isClassic ? styles.classicChip : styles.modernChip}
              >
                {[language.name, language.proficiency].filter(Boolean).join(" - ")}
              </Text>
            ))}
          </View>
        </Section>
      ) : null}
    </>
  );
}

interface SectionProps {
  layout: LayoutMode;
  title: string;
  children: React.ReactNode;
}

function Section({ layout, title, children }: SectionProps) {
  if (layout === "classic") {
    return (
      <View style={styles.classicSection}>
        <Text style={styles.classicSectionTitle}>{title}</Text>
        <View style={styles.classicDivider} />
        {children}
      </View>
    );
  }

  if (layout === "creative") {
    return (
      <View style={styles.creativeSection}>
        <Text style={styles.creativeSectionTitle}>{title}</Text>
        {children}
      </View>
    );
  }

  return (
    <View style={styles.modernSection}>
      <Text style={styles.modernSectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

interface ItemBlockProps {
  layout: LayoutMode;
  title: string;
  subtitle?: string;
  tertiary?: string;
  body?: string;
}

function ItemBlock({ layout, title, subtitle, tertiary, body }: ItemBlockProps) {
  if (layout === "classic") {
    return (
      <View style={styles.classicItem}>
        <View style={styles.classicItemTitleRow}>
          <Text style={styles.classicItemTitle}>{title}</Text>
          {tertiary ? <Text style={styles.classicItemDate}>{tertiary}</Text> : null}
        </View>
        {subtitle ? <Text style={styles.classicItemSubtitle}>{subtitle}</Text> : null}
        {body ? <Text style={styles.classicBody}>{body}</Text> : null}
      </View>
    );
  }

  if (layout === "creative") {
    return (
      <View style={styles.creativeItem}>
        <Text style={styles.creativeItemTitle}>{title}</Text>
        {subtitle ? <Text style={styles.creativeItemSubtitle}>{subtitle}</Text> : null}
        {tertiary ? <Text style={styles.creativeItemSubtitle}>{tertiary}</Text> : null}
        {body ? <Text style={styles.creativeBody}>{body}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.modernItem}>
      <Text style={styles.modernItemTitle}>{title}</Text>
      {subtitle ? <Text style={styles.modernItemSubtitle}>{subtitle}</Text> : null}
      {tertiary ? <Text style={styles.modernItemSubtitle}>{tertiary}</Text> : null}
      {body ? <Text style={styles.modernBody}>{body}</Text> : null}
    </View>
  );
}

interface CVPdfDocumentProps {
  title: string;
  data: CVData;
  templateId: TemplateId;
}

export function CVPdfDocument({ title, data, templateId }: CVPdfDocumentProps) {
  return (
    <Document title={title}>
      {templateId === "classic" ? (
        <ClassicTemplate title={title} data={data} />
      ) : templateId === "creative" ? (
        <CreativeTemplate title={title} data={data} />
      ) : (
        <ModernTemplate title={title} data={data} />
      )}
    </Document>
  );
}
