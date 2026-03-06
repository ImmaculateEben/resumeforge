import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900">
              ResumeForge
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/templates"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Templates
              </Link>
              <Link
                href="/faq"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                FAQ
              </Link>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Log in
              </Link>
              <Link
                href="/builder"
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Start Building
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ResumeForge. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
