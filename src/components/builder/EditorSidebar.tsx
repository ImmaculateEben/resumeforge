"use client";

import { useState } from "react";
import Link from "next/link";
import type { useResume } from "@/hooks/use-resume";
import { printResumeDocument } from "@/lib/print";
import type { EditorTab } from "./constants";
import { ContentTab } from "./tabs/ContentTab";
import { DesignTab } from "./tabs/DesignTab";
import { SettingsTab } from "./tabs/SettingsTab";

interface EditorSidebarProps {
  resume: ReturnType<typeof useResume>;
}

const tabs: { key: EditorTab; label: string; icon: React.ReactNode }[] = [
  {
    key: "content",
    label: "Content",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    key: "design",
    label: "Design",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
];

export function EditorSidebar({ resume }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>("content");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["personal", "summary"])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:p-5 pb-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </Link>
              <h1 className="text-lg font-bold text-gray-900">Edit Resume</h1>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Auto-saved to browser</p>
          </div>
          <button
            onClick={() => printResumeDocument(resume.styleConfig.paperSize)}
            className="btn-secondary text-xs px-2.5 py-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008H15.75V12z" />
            </svg>
            Print
          </button>
        </div>

        {/* Completion Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">Completion</span>
            <span className="text-xs font-semibold text-primary">{resume.completionPercent}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
              style={{ width: `${resume.completionPercent}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 -mx-4 sm:-mx-5 px-4 sm:px-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors relative ${
                activeTab === tab.key
                  ? "text-primary"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5">
        {activeTab === "content" && (
          <ContentTab
            resume={resume}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
        {activeTab === "design" && (
          <DesignTab
            templateKey={resume.templateKey}
            setTemplateKey={resume.setTemplateKey}
            styleConfig={resume.styleConfig}
            setStyleConfig={resume.setStyleConfig}
          />
        )}
        {activeTab === "settings" && (
          <SettingsTab
            documentType={resume.documentType}
            setDocumentType={resume.setDocumentType}
            sectionOrder={resume.sectionOrder}
            moveSection={resume.moveSection}
            toggleSectionVisibility={resume.toggleSectionVisibility}
            sectionTitles={resume.sectionTitles}
            updateSectionTitle={resume.updateSectionTitle}
            exportJSON={resume.exportJSON}
            importJSON={resume.importJSON}
            clearAll={resume.clearAll}
            customSections={resume.data.customSections}
            updateCustomSection={resume.updateCustomSection}
          />
        )}
      </div>
    </div>
  );
}
