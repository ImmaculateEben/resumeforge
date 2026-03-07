"use client";

import type { useResume } from "@/hooks/use-resume";
import { PersonalInfoSection } from "../sections/PersonalInfoSection";
import { PersonalDetailsSection } from "../sections/PersonalDetailsSection";
import { SummarySection } from "../sections/SummarySection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { EducationSection } from "../sections/EducationSection";
import { SkillsSection } from "../sections/SkillsSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { CertificationsSection } from "../sections/CertificationsSection";
import { LinksSection } from "../sections/LinksSection";
import { HobbiesSection } from "../sections/HobbiesSection";
import { RefereesSection } from "../sections/RefereesSection";
import { CustomSectionsSection } from "../sections/CustomSectionsSection";

interface ContentTabProps {
  resume: ReturnType<typeof useResume>;
  expandedSections: Set<string>;
  toggleSection: (section: string) => void;
}

export function ContentTab({ resume, expandedSections, toggleSection }: ContentTabProps) {
  const isOpen = (key: string) => expandedSections.has(key);

  return (
    <div className="space-y-5">
      <PersonalInfoSection
        basics={resume.data.basics}
        updateBasics={resume.updateBasics}
        open={isOpen("personal")}
        onToggle={() => toggleSection("personal")}
      />

      <SummarySection
        summary={resume.data.summary}
        updateSummary={resume.updateSummary}
        open={isOpen("summary")}
        onToggle={() => toggleSection("summary")}
      />

      {resume.documentType === "cv" && (
        <PersonalDetailsSection
          personalDetails={resume.data.personalDetails}
          updatePersonalDetails={resume.updatePersonalDetails}
          addPersonalDetailRow={resume.addPersonalDetailRow}
          updatePersonalDetailRow={resume.updatePersonalDetailRow}
          removePersonalDetailRow={resume.removePersonalDetailRow}
          open={isOpen("personalDetails")}
          onToggle={() => toggleSection("personalDetails")}
        />
      )}

      <ExperienceSection
        experience={resume.data.experience}
        addExperience={resume.addExperience}
        updateExperience={resume.updateExperience}
        removeExperience={resume.removeExperience}
        moveExperience={resume.moveExperience}
        addBullet={resume.addBullet}
        updateBullet={resume.updateBullet}
        removeBullet={resume.removeBullet}
        open={isOpen("experience")}
        onToggle={() => toggleSection("experience")}
      />

      <EducationSection
        education={resume.data.education}
        addEducation={resume.addEducation}
        updateEducation={resume.updateEducation}
        removeEducation={resume.removeEducation}
        moveEducation={resume.moveEducation}
        addBullet={resume.addBullet}
        updateBullet={resume.updateBullet}
        removeBullet={resume.removeBullet}
        open={isOpen("education")}
        onToggle={() => toggleSection("education")}
      />

      <SkillsSection
        skills={resume.data.skills}
        addSkillGroup={resume.addSkillGroup}
        updateSkillGroup={resume.updateSkillGroup}
        removeSkillGroup={resume.removeSkillGroup}
        addSkillItem={resume.addSkillItem}
        removeSkillItem={resume.removeSkillItem}
        open={isOpen("skills")}
        onToggle={() => toggleSection("skills")}
      />

      <ProjectsSection
        projects={resume.data.projects}
        addProject={resume.addProject}
        updateProject={resume.updateProject}
        removeProject={resume.removeProject}
        addBullet={resume.addBullet}
        updateBullet={resume.updateBullet}
        removeBullet={resume.removeBullet}
        open={isOpen("projects")}
        onToggle={() => toggleSection("projects")}
      />

      <CertificationsSection
        certifications={resume.data.certifications}
        addCertification={resume.addCertification}
        updateCertification={resume.updateCertification}
        removeCertification={resume.removeCertification}
        open={isOpen("certifications")}
        onToggle={() => toggleSection("certifications")}
      />

      <LinksSection
        links={resume.data.links}
        addLink={resume.addLink}
        updateLink={resume.updateLink}
        removeLink={resume.removeLink}
        open={isOpen("links")}
        onToggle={() => toggleSection("links")}
      />

      {resume.documentType === "cv" && (
        <HobbiesSection
          hobbies={resume.data.hobbies}
          addHobby={resume.addHobby}
          updateHobby={resume.updateHobby}
          removeHobby={resume.removeHobby}
          open={isOpen("hobbies")}
          onToggle={() => toggleSection("hobbies")}
        />
      )}

      {resume.documentType === "cv" && (
        <RefereesSection
          referees={resume.data.referees}
          addReferee={resume.addReferee}
          updateReferee={resume.updateReferee}
          removeReferee={resume.removeReferee}
          open={isOpen("referees")}
          onToggle={() => toggleSection("referees")}
        />
      )}

      <CustomSectionsSection
        customSections={resume.data.customSections}
        addCustomSection={resume.addCustomSection}
        updateCustomSection={resume.updateCustomSection}
        removeCustomSection={resume.removeCustomSection}
        addCustomEntry={resume.addCustomEntry}
        updateCustomEntry={resume.updateCustomEntry}
        removeCustomEntry={resume.removeCustomEntry}
        open={isOpen("custom")}
        onToggle={() => toggleSection("custom")}
      />
    </div>
  );
}
