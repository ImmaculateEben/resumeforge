import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
        <Link
          href="/builder"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create New Resume
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white">
          Active
        </button>
        <button className="rounded-md bg-white border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Archived
        </button>
        <button className="rounded-md bg-white border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Deleted
        </button>
      </div>

      {/* Empty State */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No resumes yet
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Create your first resume or import a guest draft after building one in
          the builder.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/builder"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Open Builder
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          You can also download PDFs without saving from the{" "}
          <Link href="/builder" className="text-gray-900 underline">
            builder
          </Link>{" "}
          as a guest.
        </p>
      </div>
    </div>
  );
}
