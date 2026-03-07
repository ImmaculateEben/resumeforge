"use client";

import type { StyleConfig } from "@/components/templates/types";
import { templateOptions, accentOptions } from "../constants";

interface DesignTabProps {
  templateKey: string;
  setTemplateKey: (key: string) => void;
  styleConfig: StyleConfig;
  setStyleConfig: (config: StyleConfig) => void;
}

export function DesignTab({ templateKey, setTemplateKey, styleConfig, setStyleConfig }: DesignTabProps) {
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
        <div className="flex gap-2.5">
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
    </div>
  );
}
