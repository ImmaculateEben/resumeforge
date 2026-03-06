export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content:
        "When you use ResumeForge as a guest, your resume data is stored only in your browser. We do not collect or store guest resume data on our servers. When you create an account, we collect your email address, name, and the resume content you choose to save.",
    },
    {
      title: "How We Use Your Information",
      content:
        "We use your information to provide the resume building and management service, send account verification and password reset emails, and improve the platform. We do not sell or share your personal data with third parties for marketing purposes.",
    },
    {
      title: "Data Retention",
      content:
        "Guest drafts are stored in your browser and expire after 7 days of inactivity. Saved resumes are retained until you delete them. Soft-deleted resumes are retained for 30 days before permanent removal. Audit logs are retained for a minimum of 365 days.",
    },
    {
      title: "Security",
      content:
        "We use industry-standard security measures to protect your data, including encrypted connections, hashed passwords, and secure session management.",
    },
    {
      title: "Contact",
      content:
        "If you have questions about this privacy policy, please contact us at privacy@resumeforge.com.",
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
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-500">
            Your privacy matters to us. Here&apos;s how we handle your data.
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
