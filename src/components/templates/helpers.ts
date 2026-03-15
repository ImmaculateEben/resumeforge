import type { PersonalDetails, RefereeItem } from "./types";

export interface PersonalDetailEntry {
  label: string;
  value: string;
}

const fixedPersonalDetails: Array<{ key: keyof Omit<PersonalDetails, "extraDetails" | "layout">; label: string }> = [
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "stateOfOrigin", label: "State of Origin" },
  { key: "localGovernmentArea", label: "Local Government Area" },
  { key: "sex", label: "Sex" },
  { key: "maritalStatus", label: "Marital Status" },
  { key: "nationality", label: "Nationality" },
  { key: "religion", label: "Religion" },
];

export function getPersonalDetailEntries(personalDetails: PersonalDetails): PersonalDetailEntry[] {
  const fixedEntries = fixedPersonalDetails
    .map(({ key, label }) => ({ label, value: personalDetails[key]?.trim() || "" }))
    .filter((entry) => entry.value.length > 0);

  const extraEntries = personalDetails.extraDetails
    .map((detail) => ({
      label: detail.label.trim(),
      value: detail.value.trim(),
    }))
    .filter((detail) => detail.label.length > 0 && detail.value.length > 0);

  return [...fixedEntries, ...extraEntries];
}

export function hasPersonalDetails(personalDetails: PersonalDetails): boolean {
  return getPersonalDetailEntries(personalDetails).length > 0;
}

export function getPersonalDetailsColumnCount(personalDetails: PersonalDetails): 1 | 2 {
  return personalDetails.layout === "one-column" ? 1 : 2;
}

export function getTrimmedHobbies(hobbies: string[]): string[] {
  return hobbies.map((hobby) => hobby.trim()).filter(Boolean);
}

export function getReferenceTitle(referees: RefereeItem[]): string {
  return referees.length === 1 ? "Reference" : "References";
}
