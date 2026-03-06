export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Account Settings
      </h1>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50"
                disabled
                placeholder="Your email"
              />
            </div>
          </div>
          <button className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Save changes
          </button>
        </section>

        {/* Password Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current password
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
            </div>
          </div>
          <button className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Update password
          </button>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-lg border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Log out of your current session.
          </p>
          <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Log out
          </button>
        </section>
      </div>
    </div>
  );
}
