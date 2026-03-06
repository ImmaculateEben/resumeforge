import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Resumes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and organize all your resumes</p>
        </div>
        <Link
          href="/builder"
          className="btn-primary text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create New Resume
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        {[
          { label: "Active", active: true },
          { label: "Archived", active: false },
          { label: "Deleted", active: false },
        ].map((filter) => (
          <button
            key={filter.label}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter.active
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="card p-12 sm:p-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
          <svg className="w-10 h-10 text-primary/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No resumes yet
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-8">
          Create your first resume or import a guest draft after building one in
          the builder.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/builder"
            className="btn-primary text-sm w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Open Builder
          </Link>
        </div>
        <p className="mt-6 text-xs text-gray-400">
          You can also download PDFs without saving from the{" "}
          <Link href="/builder" className="text-primary hover:text-primary-dark underline underline-offset-2 transition-colors">
            builder
          </Link>{" "}
          as a guest.
        </p>
      </div>

      {/* Draft Import Notice */}
      <div className="mt-6 card p-4 flex items-start gap-3 border-primary/20 bg-primary-50/30">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Have a guest draft?</p>
          <p className="text-xs text-gray-500 mt-0.5">
            If you built a resume as a guest, save it from the builder to import it into your account automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
