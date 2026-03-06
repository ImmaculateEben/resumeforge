import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Reset your password
      </h1>
      <p className="text-sm text-gray-600 text-center mb-8">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Send reset link
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        <Link
          href="/login"
          className="font-medium text-gray-900 hover:text-gray-700"
        >
          Back to login
        </Link>
      </p>
    </div>
  );
}
