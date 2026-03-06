import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Welcome back
        </h1>
        <p className="text-gray-500">
          Log in to access your saved resumes and continue building.
        </p>
      </div>

      <form className="space-y-5">
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
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input-modern"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full py-2.5 text-sm justify-center"
        >
          Log in
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Sign up for free
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
