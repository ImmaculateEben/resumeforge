"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Layout, Palette, X, Zap } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TEMPLATES, Template } from "@/types";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (!selectedTemplate) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTemplate(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTemplate]);

  const categories = [
    { id: "all", label: "All Templates", icon: Layout },
    { id: "modern", label: "Modern", icon: Zap },
    { id: "classic", label: "Classic", icon: Layout },
    { id: "creative", label: "Creative", icon: Palette },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? TEMPLATES
      : TEMPLATES.filter((template) => template.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-[72px]">
        <section className="bg-gradient-to-b from-primary/5 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Choose Your Template</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Browse the current starter templates and preview each layout before you start
              editing.
            </p>
          </div>
        </section>

        <section className="py-8 border-b border-border bg-white sticky top-[72px] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  variant="elevated"
                  className="overflow-hidden group"
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white m-4 rounded border border-border shadow-sm">
                        <div className="p-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                          <div className="h-px bg-gray-200 my-3" />
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-100 rounded" />
                            <div className="h-2 bg-gray-100 rounded w-4/5" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-medium">
                          Preview
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  </button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Need to start editing right away?</h2>
            <p className="mt-4 text-gray-600">
              Start a new resume with one of these templates, then switch templates again in the editor.
            </p>
            <div className="mt-8">
              <Link href="/editor?template=modern">
                <Button size="lg">
                  Create Your Resume
                  <Check className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {selectedTemplate ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-preview-title"
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 id="template-preview-title" className="text-xl font-semibold">
                  {selectedTemplate.name}
                </h3>
                <p className="text-gray-500">{selectedTemplate.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close template preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg max-w-sm mx-auto" />
            </div>
            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Close
              </Button>
              <Link href={`/editor?template=${selectedTemplate.id}`}>
                <Button>Use This Template</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
