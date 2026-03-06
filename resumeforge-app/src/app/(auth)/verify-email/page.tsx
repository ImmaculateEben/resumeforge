import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Verify your email
      </h1>
      <p className="text-sm text-gray-600 mb-8">
        We&apos;ve sent a verification link to your email address. Click the
        link in the email to verify your account.
      </p>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Didn&apos;t receive the email? Check your spam folder or request a new
          link.
        </p>
        <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
          Resend verification email
        </button>
      </div>
      <p className="mt-6 text-sm text-gray-600">
        <Link
          href="/dashboard"
          className="font-medium text-gray-900 hover:text-gray-700"
        >
          Continue to dashboard
        </Link>
      </p>
    </div>
  );
}
