import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/admin" className="text-lg font-bold">
            ResumeForge Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Users
          </Link>
          <Link
            href="/admin/templates"
            className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Templates
          </Link>
          <Link
            href="/admin/audit-logs"
            className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Audit Logs
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/"
            className="block text-sm text-gray-400 hover:text-white"
          >
            &larr; Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
