import Link from "next/link";

const templates = [
  {
    key: "atlas",
    name: "Atlas",
    description:
      "A clean, structured layout with clear section headers and professional spacing. Best for traditional industries.",
    tags: ["Professional", "Clean", "Traditional"],
  },
  {
    key: "summit",
    name: "Summit",
    description:
      "A modern two-column design that maximizes space efficiency. Great for candidates with extensive experience.",
    tags: ["Modern", "Two-column", "Space-efficient"],
  },
  {
    key: "quill",
    name: "Quill",
    description:
      "An elegant, minimalist layout with refined typography and generous whitespace. Ideal for creative professionals.",
    tags: ["Elegant", "Minimalist", "Creative"],
  },
  {
    key: "northstar",
    name: "Northstar",
    description:
      "A bold, contemporary design with strong visual hierarchy. Perfect for tech and startup roles.",
    tags: ["Bold", "Contemporary", "Tech"],
  },
];

export default function TemplatesPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Choose Your Template
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            All templates are ATS-friendly and optimized for professional use.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((template) => (
            <div
              key={template.key}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gray-100 h-64 flex items-center justify-center">
                <span className="text-gray-400 text-sm">
                  {template.name} Preview
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {template.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {template.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/builder?template=${template.key}`}
                  className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Use This Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
