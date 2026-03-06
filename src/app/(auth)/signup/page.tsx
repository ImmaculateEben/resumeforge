import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-gray-500">
          Save your resumes to the cloud and access them from any device.
        </p>
      </div>

      <form className="space-y-5">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="input-modern"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input-modern"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="input-modern"
            placeholder="At least 8 characters"
          />
          <p className="mt-1.5 text-xs text-gray-400">Must be at least 8 characters long</p>
        </div>
        <button
          type="submit"
          className="btn-primary w-full py-2.5 text-sm justify-center"
        >
          Create account
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Log in
          </Link>
        </p>
        <p className="text-center text-sm text-gray-400 mt-3">
          Or{" "}
          <Link
            href="/builder"
            className="text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors"
          >
            continue as guest
          </Link>
        </p>
      </div>
    </div>
  );
}
