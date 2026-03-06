"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  getTemplateComponent,
  sampleResumeData,
  accentColorMap,
} from "@/components/templates";
import type { AccentColors } from "@/components/templates/types";

const templates = [
  {
    key: "atlas",
    name: "Atlas",
    description:
      "A clean, structured layout with clear section headers and professional spacing. Best for traditional industries like finance, law, and healthcare.",
    tags: ["Professional", "Clean", "Traditional"],
    color: "from-slate-600 to-slate-800",
    popular: true,
    bestFor: "Finance, Law, Healthcare, Government",
  },
  {
    key: "summit",
    name: "Summit",
    description:
      "A modern two-column design that maximizes space efficiency. Great for candidates with extensive experience who need to fit more content.",
    tags: ["Modern", "Two-column", "Space-efficient"],
    color: "from-blue-600 to-indigo-700",
    popular: false,
    bestFor: "Business, Marketing, Consulting, Management",
  },
  {
    key: "quill",
    name: "Quill",
    description:
      "An elegant, minimalist layout with refined typography and generous whitespace. Ideal for creative professionals and designers.",
    tags: ["Elegant", "Minimalist", "Creative"],
    color: "from-emerald-600 to-teal-700",
    popular: false,
    bestFor: "Design, Writing, Arts, Architecture",
  },
  {
    key: "northstar",
    name: "Northstar",
    description:
      "A bold, contemporary design with strong visual hierarchy. Perfect for tech, startup, and innovation-focused roles.",
    tags: ["Bold", "Contemporary", "Tech"],
    color: "from-violet-600 to-purple-700",
    popular: false,
    bestFor: "Technology, Engineering, Startups, Product",
  },
];

const accentOptions = [
  { key: "slate", label: "Slate", class: "bg-slate-600" },
  { key: "ocean", label: "Ocean", class: "bg-blue-600" },
  { key: "forest", label: "Forest", class: "bg-emerald-600" },
  { key: "charcoal", label: "Charcoal", class: "bg-gray-800" },
  { key: "violet", label: "Violet", class: "bg-violet-600" },
  { key: "rose", label: "Rose", class: "bg-rose-600" },
];

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: "ATS-Optimized",
    desc: "All templates pass major applicant tracking systems.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "Fully Customizable",
    desc: "6 accent colors, 2 font scales, spacing options.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008H15.75V12z" />
      </svg>
    ),
    title: "Print-Ready",
    desc: "Export as PDF directly from your browser.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
    title: "JSON Import/Export",
    desc: "Backup and transfer your resume data easily.",
  },
];

export default function TemplatesPage() {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [previewAccent, setPreviewAccent] = useState("slate");

  const previewColors = useMemo<AccentColors>(
    () => accentColorMap[previewAccent] || accentColorMap.slate,
    [previewAccent]
  );

  const PreviewComponent = useMemo(
    () => (previewTemplate ? getTemplateComponent(previewTemplate) : null),
    [previewTemplate]
  );

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-6">
            <span className="text-sm font-medium text-primary-dark">4 professional templates — 100% free</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Choose Your Template
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            All templates are ATS-friendly and optimized for different industries. <br className="hidden sm:block" />
            Pick one and start building — you can always switch later.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-14 animate-fade-in">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="text-primary mt-0.5">{f.icon}</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
          {templates.map((template) => {
            const TemplateCard = getTemplateComponent(template.key);
            return (
              <div key={template.key} className="card overflow-hidden group">
                {/* Live Template Preview */}
                <div className={`relative bg-gradient-to-br ${template.color} p-6 sm:p-8`}>
                  {template.popular && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  )}
                  <div
                    className="bg-white rounded-lg shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                    onClick={() => setPreviewTemplate(template.key)}
                  >
                    <div className="p-5 sm:p-6" style={{ fontSize: "5.5px", lineHeight: 1.4 }}>
                      <TemplateCard
                        data={sampleResumeData}
                        styleConfig={{
                          fontScale: "compact",
                          accentTone: "slate",
                          spacing: "tight",
                          showSectionDividers: true,
                        }}
                        accentColors={accentColorMap.slate}
                      />
                    </div>
                  </div>
                  {/* Click to expand hint */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Click to preview full size
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    {template.description}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    <span className="font-medium text-gray-500">Best for:</span> {template.bestFor}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {template.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/builder?template=${template.key}`} className="btn-primary text-sm w-full justify-center">
                    Use {template.name}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Color Showcase */}
        <div className="mt-20 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">6 Accent Colors</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">Every template supports all accent colors. Match your personal brand or industry expectations.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {accentOptions.map((c) => (
              <div key={c.key} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${c.class} shadow-md`} />
                <span className="text-xs text-gray-500 font-medium">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="card p-8 sm:p-12 bg-gradient-to-br from-primary-50 to-white border-primary-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to build your resume?</h2>
            <p className="text-gray-500 mb-6">
              Start with any template — you can switch anytime. No account required.
            </p>
            <Link href="/builder" className="btn-primary text-base px-8 py-3">
              Start Building
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Full-size Preview Modal */}
      {previewTemplate && PreviewComponent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4" onClick={() => setPreviewTemplate(null)}>
          <div className="relative w-full max-w-[210mm] animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-t-xl px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 capitalize">{previewTemplate} Template</h3>
                <p className="text-xs text-gray-400">Full-size preview with sample data</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {accentOptions.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setPreviewAccent(c.key)}
                      className={`w-5 h-5 rounded-full ${c.class} transition-all ${previewAccent === c.key ? "ring-2 ring-offset-1 ring-primary scale-110" : "hover:scale-110"}`}
                      title={c.label}
                    />
                  ))}
                </div>
                <Link href={`/builder?template=${previewTemplate}`} className="btn-primary text-xs px-4 py-2">
                  Use Template
                </Link>
                <button onClick={() => setPreviewTemplate(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Preview Body */}
            <div className="bg-white rounded-b-xl p-10 sm:p-12 shadow-2xl min-h-[297mm]">
              <PreviewComponent
                data={sampleResumeData}
                styleConfig={{
                  fontScale: "comfortable",
                  accentTone: previewAccent,
                  spacing: "normal",
                  showSectionDividers: true,
                }}
                accentColors={previewColors}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
