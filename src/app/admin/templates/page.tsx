export default function AdminTemplatesPage() {
  const templates = [
    {
      key: "atlas",
      name: "Atlas",
      active: true,
      version: 1,
      order: 1,
    },
    {
      key: "summit",
      name: "Summit",
      active: true,
      version: 1,
      order: 2,
    },
    {
      key: "quill",
      name: "Quill",
      active: true,
      version: 1,
      order: 3,
    },
    {
      key: "northstar",
      name: "Northstar",
      active: true,
      version: 1,
      order: 4,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          Add Template
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Key
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Version
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Order
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {templates.map((t) => (
              <tr key={t.key}>
                <td className="px-4 py-3 font-mono text-xs">{t.key}</td>
                <td className="px-4 py-3">{t.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      t.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {t.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">v{t.version}</td>
                <td className="px-4 py-3">{t.order}</td>
                <td className="px-4 py-3">
                  <button className="text-gray-600 hover:text-gray-900 text-sm">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
