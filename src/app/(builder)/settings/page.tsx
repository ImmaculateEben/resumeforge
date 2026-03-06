export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your profile and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Profile</h2>
              <p className="text-xs text-gray-400">Update your personal information</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                className="input-modern"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                className="input-modern bg-gray-50 cursor-not-allowed opacity-60"
                disabled
                placeholder="Your email"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
          </div>
          <button className="btn-primary text-sm mt-5">
            Save changes
          </button>
        </section>

        {/* Password Section */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-400">Update your account password</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current password
              </label>
              <input
                type="password"
                className="input-modern"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New password
              </label>
              <input
                type="password"
                className="input-modern"
                placeholder="Enter new password"
              />
              <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
            </div>
          </div>
          <button className="btn-primary text-sm mt-5">
            Update password
          </button>
        </section>

        {/* Danger Zone */}
        <section className="card p-6 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-red-900">Danger Zone</h2>
              <p className="text-xs text-gray-400">Irreversible actions</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Log out of your current session. You can always log back in.
          </p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all shadow-sm cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Log out
          </button>
        </section>
      </div>
    </div>
  );
}
