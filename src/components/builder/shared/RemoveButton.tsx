"use client";

interface RemoveButtonProps {
  onClick: () => void;
  small?: boolean;
}

export function RemoveButton({ onClick, small }: RemoveButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${small ? "p-0.5" : "p-1"} rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors`}
      title="Remove"
    >
      <svg
        className={small ? "w-3 h-3" : "w-3.5 h-3.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
