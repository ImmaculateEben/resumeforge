import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="animate-fade-in text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 animate-pulse-glow">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Check your email
        </h1>
        <p className="text-gray-500">
          We&apos;ve sent a verification link to your email address.
          Click the link to verify your account.
        </p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-gray-700">Waiting for verification...</span>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Didn&apos;t receive the email? Check your spam folder or request a new link.
        </p>
        <button className="btn-secondary text-sm">
          Resend verification email
        </button>
      </div>

      <Link
        href="/dashboard"
        className="text-sm font-medium text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
      >
        Continue to dashboard
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}
