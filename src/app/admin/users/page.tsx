export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Users</h1>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by email or name..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Joined
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
