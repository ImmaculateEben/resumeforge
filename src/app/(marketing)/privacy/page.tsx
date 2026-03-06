export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              Information We Collect
            </h2>
            <p className="text-gray-600">
              When you use ResumeForge as a guest, your resume data is stored
              only in your browser. We do not collect or store guest resume data
              on our servers. When you create an account, we collect your email
              address, name, and the resume content you choose to save.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              How We Use Your Information
            </h2>
            <p className="text-gray-600">
              We use your information to provide the resume building and
              management service, send account verification and password reset
              emails, and improve the platform. We do not sell or share your
              personal data with third parties for marketing purposes.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              Data Retention
            </h2>
            <p className="text-gray-600">
              Guest drafts are stored in your browser and expire after 7 days
              of inactivity. Saved resumes are retained until you delete them.
              Soft-deleted resumes are retained for 30 days before permanent
              removal. Audit logs are retained for a minimum of 365 days.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            <p className="text-gray-600">
              We use industry-standard security measures to protect your data,
              including encrypted connections, hashed passwords, and secure
              session management.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p className="text-gray-600">
              If you have questions about this privacy policy, please contact us
              at privacy@resumeforge.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
