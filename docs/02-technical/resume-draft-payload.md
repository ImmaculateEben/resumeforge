# ResumeDraftPayload v1

## Purpose

`ResumeDraftPayload` is the canonical document contract shared by the builder UI, PDF renderer, validation layer, persistence layer, and version history.

## Design Rules

- Store content as structured JSON, not HTML.
- Preserve display intent with small formatting metadata rather than arbitrary markup.
- Keep fields template-agnostic so multiple layouts can render the same payload.
- Default every array field to an empty array, not `null`.
- Include `schemaVersion` in every payload to support future migration.

## Type Definition

```ts
type ResumeDraftPayloadV1 = {
  schemaVersion: "1.0";
  documentType: "resume" | "cv";
  templateKey: string;
  basics: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    jobTitle?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    bullets: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    role?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    bullets: string[];
  }>;
  skills: Array<{
    id: string;
    category?: string;
    items: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer?: string;
    issueDate?: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>;
  links: Array<{
    id: string;
    label: string;
    url: string;
  }>;
  customSections: Array<{
    id: string;
    title: string;
    entries: Array<{
      id: string;
      heading: string;
      subheading?: string;
      dateRange?: string;
      bullets: string[];
    }>;
  }>;
  styleConfig: {
    fontScale: "compact" | "comfortable";
    accentTone: "slate" | "ocean" | "forest" | "charcoal";
    spacing: "tight" | "normal";
    showSectionDividers: boolean;
  };
};
```

## Field Rules

| Field | Rules |
| --- | --- |
| `schemaVersion` | Must be `1.0` for all v1 payloads. |
| `documentType` | `resume` or `cv`; affects labeling and future template rules only. |
| `templateKey` | Must match an active template in the `templates` table. |
| `basics.fullName` | Required, 2 to 120 chars. |
| `basics.email` | Required, valid email shape. |
| `summary` | Optional but recommended, max 1000 chars. |
| `experience[].bullets` | Up to 8 items, each plain text, max 220 chars. |
| `education[].bullets` | Up to 5 items, each plain text, max 220 chars. |
| `projects[].bullets` | Up to 6 items, each plain text, max 220 chars. |
| `skills[].items` | Up to 20 items per group, plain text only. |
| `customSections` | Up to 3 custom sections in v1. |
| `styleConfig` | Only whitelisted tokens; no arbitrary CSS values. |

## Validation Rules

- Reject HTML tags, inline styles, scripts, and embedded links outside explicit URL fields.
- Trim leading and trailing whitespace on all string fields.
- Collapse repeated whitespace inside bullet text.
- Normalize empty strings to omitted optional fields during persistence.
- Require at least `fullName`, `email`, and one populated section before PDF export.

## Save Policy

- Guest drafts are stored in browser storage using this exact payload shape.
- Server persistence stores the payload in `resumes.content_json`.
- Each version snapshot stores a full copy of the payload for recovery and history.

## Example

```json
{
  "schemaVersion": "1.0",
  "documentType": "resume",
  "templateKey": "atlas",
  "basics": {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+2348000000000",
    "location": "Lagos, Nigeria",
    "jobTitle": "Frontend Developer",
    "website": "https://janedoe.dev"
  },
  "summary": "Frontend developer with experience building responsive product interfaces.",
  "experience": [
    {
      "id": "exp_1",
      "company": "Acme",
      "position": "Frontend Developer",
      "location": "Remote",
      "startDate": "2024-01",
      "endDate": "2026-02",
      "bullets": [
        "Built internal product dashboards using React and TypeScript.",
        "Improved page performance and reduced time to interactive."
      ]
    }
  ],
  "education": [],
  "projects": [],
  "skills": [
    {
      "id": "skills_1",
      "category": "Frontend",
      "items": ["React", "TypeScript", "Next.js"]
    }
  ],
  "certifications": [],
  "links": [
    {
      "id": "link_1",
      "label": "Portfolio",
      "url": "https://janedoe.dev"
    }
  ],
  "customSections": [],
  "styleConfig": {
    "fontScale": "comfortable",
    "accentTone": "slate",
    "spacing": "normal",
    "showSectionDividers": true
  }
}
```
