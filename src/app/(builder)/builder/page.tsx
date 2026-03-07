"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useResume } from "@/hooks/use-resume";
import { getTemplateComponent, accentColorMap, sampleResumeData } from "@/components/templates";
import type { ResumeData, SectionKey, CustomEntryStyle } from "@/components/templates/types";

type MobileTab = "edit" | "preview";
type EditorTab = "info" | "content" | "design";

const templateOptions = [
  { key: "atlas",     name: "Atlas",     desc: "Clean & Professional",  color: "from-slate-500 to-slate-700" },
  { key: "summit",    name: "Summit",    desc: "Modern Two-Column",      color: "from-blue-500 to-indigo-600" },
  { key: "quill",     name: "Quill",     desc: "Elegant & Minimalist",   color: "from-emerald-500 to-teal-600" },
  { key: "northstar", name: "Northstar", desc: "Bold & Contemporary",    color: "from-violet-500 to-purple-600" },
];

const accentOptions = [
  { key: "slate",    label: "Slate",    cls: "bg-slate-600" },
  { key: "ocean",    label: "Ocean",    cls: "bg-blue-600" },
  { key: "forest",   label: "Forest",   cls: "bg-emerald-600" },
  { key: "charcoal", label: "Charcoal", cls: "bg-gray-800" },
  { key: "violet",   label: "Violet",   cls: "bg-violet-600" },
  { key: "rose",     label: "Rose",     cls: "bg-rose-600" },
];

const fontSizes      = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const nameFontSizes  = [18, 20, 22, 24, 26, 28, 30, 32, 36];
const titleFontSizes = [10, 11, 12, 13, 14, 15, 16, 18];

const sectionLabels: Record<SectionKey, string> = {
  summary: "Summary", experience: "Experience", education: "Education",
  skills: "Skills", projects: "Projects", certifications: "Certifications",
  links: "Links", referees: "References", custom: "Custom Sections",
};

const cvOnlySections: SectionKey[]     = ["referees"];
const resumeOnlySections: SectionKey[] = [];

const entryStyleOptions: { value: CustomEntryStyle; label: string; desc: string }[] = [
  { value: "standard",    label: "Standard",    desc: "Heading, subheading, date, bullets" },
  { value: "compact",     label: "Compact",     desc: "Single line - heading + date" },
  { value: "bullet-only", label: "Bullet List", desc: "Simple bullet points" },
  { value: "two-column",  label: "Two Column",  desc: "Heading left, details right" },
  { value: "tag-list",    label: "Tag List",    desc: "Comma-separated tags" },
];