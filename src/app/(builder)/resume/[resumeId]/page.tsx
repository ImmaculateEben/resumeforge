"use client";

export default function ResumeEditorPage() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
      {/* Editor Panel */}
      <div className="w-full lg:w-1/2 overflow-y-auto border-r border-gray-200 bg-white p-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900">Edit Resume</h1>
            <div className="flex gap-2">
              <button className="rounded-md bg-white border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Download PDF
              </button>
              <button className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800">
                Save
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Loading resume data...
          </p>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-100 p-6">
        <div className="max-w-[210mm] mx-auto bg-white shadow-lg rounded-sm min-h-[297mm] p-12">
          <p className="text-center text-gray-400 mt-32 text-sm">
            Resume preview loading...
          </p>
        </div>
      </div>
    </div>
  );
}
