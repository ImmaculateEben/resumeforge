export default function TermsPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content:
        "By using ResumeForge, you agree to these terms of service. If you do not agree, please do not use the service.",
    },
    {
      title: "Service Description",
      content:
        "ResumeForge provides a web-based resume and CV builder. Guest users can create and download resumes as PDF without an account. Registered users can save, manage, and version their resumes.",
    },
    {
      title: "User Responsibilities",
      content:
        "You are responsible for the accuracy of information in your resumes. You agree not to use the service for any unlawful purpose, submit content that violates third-party rights, or attempt to interfere with the service.",
    },
    {
      title: "Account Termination",
      content:
        "We reserve the right to suspend or terminate accounts that violate these terms. Suspended users will be notified and may appeal through the provided channels.",
    },
    {
      title: "Limitation of Liability",
      content:
        "ResumeForge is provided as-is. We do not guarantee the accuracy of PDF rendering across all devices and are not liable for employment outcomes resulting from use of the service.",
    },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 mb-4">
            Last updated: March 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-500">
            Please read these terms carefully before using ResumeForge.
          </p>
        </div>
        <div className="space-y-8 animate-fade-in-up">
          {sections.map((section, index) => (
            <section key={index} className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                {section.title}
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
