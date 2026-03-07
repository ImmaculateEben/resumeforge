"use client";

interface SectionToggleProps {
  title: string;
  open: boolean;
  onClick: () => void;
}

export function SectionToggle({ title, open, onClick }: SectionToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 mb-3 w-full text-left cursor-pointer group"
    >
      <svg
        className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      <div className="flex-1 h-px bg-gray-100" />
    </button>
  );
}
