export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              Acceptance of Terms
            </h2>
            <p className="text-gray-600">
              By using ResumeForge, you agree to these terms of service. If you
              do not agree, please do not use the service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              Service Description
            </h2>
            <p className="text-gray-600">
              ResumeForge provides a web-based resume and CV builder. Guest
              users can create and download resumes as PDF without an account.
              Registered users can save, manage, and version their resumes.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              User Responsibilities
            </h2>
            <p className="text-gray-600">
              You are responsible for the accuracy of information in your
              resumes. You agree not to use the service for any unlawful
              purpose, submit content that violates third-party rights, or
              attempt to interfere with the service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              Account Termination
            </h2>
            <p className="text-gray-600">
              We reserve the right to suspend or terminate accounts that violate
              these terms. Suspended users will be notified and may appeal
              through the provided channels.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              Limitation of Liability
            </h2>
            <p className="text-gray-600">
              ResumeForge is provided as-is. We do not guarantee the accuracy of
              PDF rendering across all devices and are not liable for
              employment outcomes resulting from use of the service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
