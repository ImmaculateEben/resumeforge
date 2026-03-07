"use client";

import { useState, useRef, use } from "react";
import Link from "next/link";
import { useResume } from "@/hooks/use-resume";
import { EditorSidebar } from "@/components/builder/EditorSidebar";
import { PreviewPanel } from "@/components/builder/PreviewPanel";
import { MobileTabBar } from "@/components/builder/MobileTabBar";

type MobileTab = "edit" | "preview";

export default function ResumeEditorPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = use(params);
  const resume = useResume(`resumeforge_resume_${resumeId}`);
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const previewRef = useRef<HTMLDivElement>(null);

  if (!resume.loaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="w-8 h-8 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Mobile Tab Bar */}
      <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Sidebar */}
        <div
          className={`w-full lg:w-[480px] xl:w-[520px] overflow-y-auto border-r border-gray-200 bg-white custom-scrollbar print:hidden ${
            mobileTab !== "edit" ? "hidden lg:block" : ""
          }`}
        >
          <EditorSidebar resume={resume} />
        </div>

        {/* Preview Panel */}
        <div
          className={`flex-1 overflow-y-auto bg-gray-100/80 custom-scrollbar ${
            mobileTab !== "preview" ? "hidden lg:block" : ""
          }`}
        >
          <PreviewPanel resume={resume} previewRef={previewRef} />
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 flex gap-2 print:hidden">
        <button
          onClick={() => window.print()}
          className="btn-secondary flex-1 text-xs py-2.5 justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008H15.75V12z" />
          </svg>
          Print / PDF
        </button>
        <Link href="/dashboard" className="btn-primary flex-1 text-xs py-2.5 justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Dashboard
        </Link>
      </div>
    </div>
  );
}
