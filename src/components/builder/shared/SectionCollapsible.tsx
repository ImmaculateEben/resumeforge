"use client";

interface SectionCollapsibleProps {
  title: string;
  count: number;
  addLabel?: string;
  onAdd?: () => void;
  open: boolean;
  onClick: () => void;
}

export function SectionCollapsible({
  title,
  count,
  addLabel = "Add",
  onAdd,
  open,
  onClick,
}: SectionCollapsibleProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 cursor-pointer group"
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
        {count > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {count}
          </span>
        )}
      </button>
      {onAdd && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors px-2 py-1 rounded-md hover:bg-primary-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}
