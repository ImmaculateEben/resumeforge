"use client";

interface MoveButtonProps {
  onClick: () => void;
  disabled: boolean;
  direction: "up" | "down";
}

export function MoveButton({ onClick, disabled, direction }: MoveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-1 rounded hover:bg-gray-200 text-gray-400 disabled:opacity-30 transition-colors"
      title={`Move ${direction}`}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={direction === "up" ? "M4.5 15.75l7.5-7.5 7.5 7.5" : "M19.5 8.25l-7.5 7.5-7.5-7.5"}
        />
      </svg>
    </button>
  );
}
