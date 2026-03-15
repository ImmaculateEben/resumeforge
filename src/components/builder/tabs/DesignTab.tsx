"use client";

import type { StyleConfig } from "@/components/templates/types";
import { accentColorMap, isCustomAccentTone, parseAccentToneColor, resolveAccentColors } from "@/components/templates";
import { templateOptions, accentOptions, paperSizeOptions } from "../constants";

interface DesignTabProps {
  templateKey: string;
  setTemplateKey: (key: string) => void;
  styleConfig: StyleConfig;
  setStyleConfig: (config: StyleConfig) => void;
}

export function DesignTab({ templateKey, setTemplateKey, styleConfig, setStyleConfig }: DesignTabProps) {
  const selectedAccentColors = resolveAccentColors(styleConfig.accentTone);
  const customAccentSelected = isCustomAccentTone(styleConfig.accentTone);
  const customAccentValue = customAccentSelected
    ? selectedAccentColors.primary
    : accentColorMap[styleConfig.accentTone]?.primary || accentColorMap.slate.primary;
  const customAccentRgb = parseAccentToneColor(customAccentValue);

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Template</h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {templateOptions.map((t) => (
            <button
              key={t.key}
              onClick={() => setTemplateKey(t.key)}
              className={`relative rounded-xl p-3 text-left transition-all ${
                templateKey === t.key
                  ? "bg-primary-50 border-2 border-primary ring-2 ring-primary/10"
                  : "border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className={`h-2 w-8 rounded-full bg-gradient-to-r ${t.color} mb-2`} />
              <div className="text-xs font-semibold text-gray-900">{t.name}</div>
              <div className="text-[10px] text-gray-400">{t.desc}</div>
              {templateKey === t.key && (
                <div className="absolute top-2 right-2">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Accent Color */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Accent Color</h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="flex flex-wrap gap-2.5">
          {accentOptions.map((c) => (
            <button
              key={c.key}
              onClick={() => setStyleConfig({ ...styleConfig, accentTone: c.key })}
              className={`w-8 h-8 rounded-full ${c.className} transition-all ${
                styleConfig.accentTone === c.key
                  ? "ring-2 ring-offset-2 ring-primary scale-110"
                  : "hover:scale-110"
              }`}
              title={c.label}
            />
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Custom RGB Color</p>
              <p className="mt-1 text-sm text-gray-600">
                Pick any accent color for headings, highlights, and section accents.
              </p>
            </div>
            <div
              className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border-2 ${
                customAccentSelected ? "border-primary ring-2 ring-primary/10" : "border-gray-200"
              }`}
              style={{ backgroundColor: customAccentValue }}
            >
              <input
                type="color"
                value={customAccentValue}
                onChange={(e) => setStyleConfig({ ...styleConfig, accentTone: e.target.value })}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Choose a custom accent color"
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStyleConfig({ ...styleConfig, accentTone: customAccentValue })}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                customAccentSelected
                  ? "bg-primary-50 text-primary"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Use custom color
            </button>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {customAccentValue.toUpperCase()}
            </span>
            {customAccentRgb && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                RGB {customAccentRgb.r}, {customAccentRgb.g}, {customAccentRgb.b}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Typography</h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
              <span>Body Font Size</span>
              <span className="text-primary font-semibold">{styleConfig.fontSize || 13}pt</span>
            </label>
            <input
              type="range"
              min={8}
              max={16}
              step={0.5}
              value={styleConfig.fontSize || 13}
              onChange={(e) => setStyleConfig({ ...styleConfig, fontSize: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
              <span>Name Font Size</span>
              <span className="text-primary font-semibold">{styleConfig.nameFontSize || 26}pt</span>
            </label>
            <input
              type="range"
              min={18}
              max={36}
              step={1}
              value={styleConfig.nameFontSize || 26}
              onChange={(e) => setStyleConfig({ ...styleConfig, nameFontSize: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
              <span>Section Title Size</span>
              <span className="text-primary font-semibold">{styleConfig.sectionTitleFontSize || 14}pt</span>
            </label>
            <input
              type="range"
              min={10}
              max={18}
              step={0.5}
              value={styleConfig.sectionTitleFontSize || 14}
              onChange={(e) => setStyleConfig({ ...styleConfig, sectionTitleFontSize: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </section>

      {/* Layout Options */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Layout</h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Spacing</label>
            <select
              className="input-modern text-sm"
              value={styleConfig.spacing}
              onChange={(e) => setStyleConfig({ ...styleConfig, spacing: e.target.value as "tight" | "normal" })}
            >
              <option value="normal">Normal</option>
              <option value="tight">Tight</option>
            </select>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={styleConfig.showSectionDividers}
              onChange={(e) => setStyleConfig({ ...styleConfig, showSectionDividers: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              Show section dividers
            </span>
          </label>
        </div>
      </section>

      {/* Paper Size */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Paper Size</h2>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="space-y-2">
          {paperSizeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStyleConfig({ ...styleConfig, paperSize: option.value as StyleConfig["paperSize"] })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                (styleConfig.paperSize || "a4") === option.value
                  ? "bg-primary-50 border-2 border-primary ring-1 ring-primary/10"
                  : "border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div>
                <span className="text-sm font-medium text-gray-900">{option.label}</span>
                <span className="text-xs text-gray-400 ml-2">{option.dimensions}</span>
              </div>
              {(styleConfig.paperSize || "a4") === option.value && (
                <svg className="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-amber-600 mt-2 flex items-start gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>A4 is recommended for most use cases. Only change this if you have a specific requirement for a different paper size.</span>
        </p>
      </section>
    </div>
  );
}
