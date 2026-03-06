export default function AdminAuditLogsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Audit Logs</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">All actions</option>
          <option value="user.suspend">User Suspended</option>
          <option value="user.unsuspend">User Unsuspended</option>
          <option value="template.create">Template Created</option>
          <option value="template.update">Template Updated</option>
          <option value="template.activate">Template Activated</option>
          <option value="template.deactivate">Template Deactivated</option>
        </select>
        <select className="rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">All target types</option>
          <option value="user">User</option>
          <option value="template">Template</option>
        </select>
        <input
          type="date"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="From"
        />
        <input
          type="date"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="To"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Timestamp
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Action
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Actor
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Target
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                No audit logs found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
