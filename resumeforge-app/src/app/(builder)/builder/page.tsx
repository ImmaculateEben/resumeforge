"use client";

export default function BuilderPage() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
      {/* Editor Panel */}
      <div className="w-full lg:w-1/2 overflow-y-auto border-r border-gray-200 bg-white p-6">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
            <div className="flex gap-2">
              <button className="rounded-md bg-white border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Download PDF
              </button>
              <button className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800">
                Save
              </button>
            </div>
          </div>

          {/* Template Selector */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Template
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {["Atlas", "Summit", "Quill", "Northstar"].map((name) => (
                <button
                  key={name}
                  className="border border-gray-200 rounded-md p-2 text-xs text-gray-700 hover:border-gray-400 text-center"
                >
                  {name}
                </button>
              ))}
            </div>
          </section>

          {/* Basics Section */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Personal Information
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Location (optional)"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Job Title (optional)"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
              <input
                type="url"
                placeholder="Website (optional)"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
            </div>
          </section>

          {/* Summary Section */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Professional Summary
            </h2>
            <textarea
              placeholder="Write a brief professional summary..."
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none resize-none"
            />
          </section>

          {/* Experience Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Experience
              </h2>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                + Add
              </button>
            </div>
            <p className="text-sm text-gray-500">
              No experience entries yet. Click &quot;+ Add&quot; to add your
              work experience.
            </p>
          </section>

          {/* Education Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Education
              </h2>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                + Add
              </button>
            </div>
            <p className="text-sm text-gray-500">
              No education entries yet. Click &quot;+ Add&quot; to add your
              education.
            </p>
          </section>

          {/* Skills Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Skills</h2>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                + Add Group
              </button>
            </div>
            <p className="text-sm text-gray-500">
              No skill groups yet. Click &quot;+ Add Group&quot; to add your
              skills.
            </p>
          </section>

          {/* Projects Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Projects</h2>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                + Add
              </button>
            </div>
            <p className="text-sm text-gray-500">
              No projects yet. Click &quot;+ Add&quot; to add your projects.
            </p>
          </section>

          {/* Certifications Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Certifications
              </h2>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                + Add
              </button>
            </div>
            <p className="text-sm text-gray-500">
              No certifications yet. Click &quot;+ Add&quot; to add your
              certifications.
            </p>
          </section>

          {/* Links Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Links</h2>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                + Add
              </button>
            </div>
            <p className="text-sm text-gray-500">
              No links yet. Click &quot;+ Add&quot; to add your links.
            </p>
          </section>

          {/* Style Config */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Style Options
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Font Scale
                </label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Spacing
                </label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="normal">Normal</option>
                  <option value="tight">Tight</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Accent Tone
                </label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="slate">Slate</option>
                  <option value="ocean">Ocean</option>
                  <option value="forest">Forest</option>
                  <option value="charcoal">Charcoal</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Section dividers
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-100 p-6">
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg rounded-sm min-h-[297mm] p-12">
          <p className="text-center text-gray-400 mt-32 text-sm">
            Your resume preview will appear here as you fill in the form.
          </p>
        </div>
      </div>
    </div>
  );
}
