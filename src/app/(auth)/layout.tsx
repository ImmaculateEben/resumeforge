import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary-dark to-indigo-900 items-center justify-center p-12">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute top-1/4 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2" />

        <div className="relative max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 text-white font-bold text-lg">
              R
            </div>
            <span className="text-2xl font-bold">ResumeForge</span>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight mb-4">
            Build resumes that open doors
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed mb-8">
            Create professional, ATS-friendly resumes in minutes. Save your work, manage versions, and access from anywhere.
          </p>
          <div className="space-y-4">
            {[
              "Free forever — no hidden fees",
              "Download PDFs instantly",
              "Cloud save with version history",
              "4 professional templates",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-indigo-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 bg-background">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-sm">
              R
            </div>
            <span className="text-lg font-bold text-gray-900">ResumeForge</span>
          </Link>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
