import Link from "next/link";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-full px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="text-lg font-bold text-gray-900">
              ResumeForge
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
