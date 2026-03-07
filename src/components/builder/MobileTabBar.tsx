"use client";

interface MobileTabBarProps {
  activeTab: "edit" | "preview";
  onTabChange: (tab: "edit" | "preview") => void;
}

export function MobileTabBar({ activeTab, onTabChange }: MobileTabBarProps) {
  return (
    <div className="lg:hidden flex border-b border-gray-200 bg-white print:hidden">
      <button
        className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${
          activeTab === "edit" ? "text-primary" : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => onTabChange("edit")}
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit
        </span>
        {activeTab === "edit" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </button>
      <button
        className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${
          activeTab === "preview" ? "text-primary" : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => onTabChange("preview")}
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Preview
        </span>
        {activeTab === "preview" && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </button>
    </div>
  );
}
