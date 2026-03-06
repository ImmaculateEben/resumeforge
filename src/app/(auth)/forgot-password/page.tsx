import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Reset your password
        </h1>
        <p className="text-gray-500">
          Enter your email and we&apos;ll send you a link to reset your password.
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
        <button
          type="submit"
          className="btn-primary w-full py-2.5 text-sm justify-center"
        >
          Send reset link
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
