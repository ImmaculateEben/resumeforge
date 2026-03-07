"use client";

interface EmptyStateProps {
  text: string;
  onClick?: () => void;
}

export function EmptyState({ text, onClick }: EmptyStateProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary/30 hover:text-primary/60 hover:bg-primary-50/30 transition-all cursor-pointer group text-left"
    >
      <svg
        className="w-5 h-5 text-gray-300 group-hover:text-primary/40 transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span className="text-sm">{text}</span>
    </button>
  );
}
