import * as React from "react";
import { cn } from "@/lib/utils";

type FormChromeTone = "default" | "modern" | "classic" | "creative";

interface FormChromeTheme {
  label: string;
  helperText: string;
  field: string;
}

const FORM_CHROME_THEMES: Record<FormChromeTone, FormChromeTheme> = {
  default: {
    label: "text-gray-700",
    helperText: "text-gray-500",
    field:
      "bg-white text-gray-900 placeholder:text-gray-400 border-border focus:border-primary focus:ring-primary/20",
  },
  modern: {
    label: "text-slate-700",
    helperText: "text-slate-500",
    field:
      "bg-white text-slate-900 placeholder:text-slate-400 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-100",
  },
  classic: {
    label: "text-stone-700",
    helperText: "text-stone-600",
    field:
      "bg-[#fffdf8] text-stone-900 placeholder:text-stone-400 border-stone-300 focus:border-stone-500 focus:ring-stone-200",
  },
  creative: {
    label: "text-teal-700",
    helperText: "text-slate-500",
    field:
      "bg-white text-slate-900 placeholder:text-slate-400 border-teal-200 focus:border-teal-500 focus:ring-teal-100",
  },
};

const FormChromeContext = React.createContext<FormChromeTone>("default");

export function FormChromeProvider({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: FormChromeTone;
}) {
  return <FormChromeContext.Provider value={tone}>{children}</FormChromeContext.Provider>;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const tone = React.useContext(FormChromeContext);
    const theme = FORM_CHROME_THEMES[tone];

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn("block text-sm font-medium mb-1.5", theme.label)}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 rounded-lg border",
            "focus:outline-none focus:ring-2 transition-all duration-200",
            error ? "bg-white text-gray-900 placeholder:text-gray-400 border-red-500 focus:border-red-500 focus:ring-red-100" : theme.field,
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className={cn("mt-1.5 text-sm", theme.helperText)}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const tone = React.useContext(FormChromeContext);
    const theme = FORM_CHROME_THEMES[tone];

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn("block text-sm font-medium mb-1.5", theme.label)}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 rounded-lg border",
            "focus:outline-none focus:ring-2 transition-all duration-200",
            "resize-none",
            error ? "bg-white text-gray-900 placeholder:text-gray-400 border-red-500 focus:border-red-500 focus:ring-red-100" : theme.field,
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className={cn("mt-1.5 text-sm", theme.helperText)}>{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
