export default function FAQPage() {
  const faqs = [
    {
      question: "Do I need an account to build a resume?",
      answer:
        "No. You can start building your resume immediately and download it as a PDF without creating an account.",
    },
    {
      question: "Is ResumeForge really free?",
      answer:
        "Yes. Building and downloading resumes is completely free. Creating an account for cloud save is also free.",
    },
    {
      question: "What happens to my resume if I don't create an account?",
      answer:
        "Your draft is saved in your browser for 7 days. If you return within that window, you can pick up where you left off. After 7 days, the local draft expires.",
    },
    {
      question: "Why should I create an account?",
      answer:
        "An account lets you save resumes to the cloud, manage multiple versions, access your resumes from any device, and maintain version history.",
    },
    {
      question: "Are the templates ATS-friendly?",
      answer:
        "Yes. All four templates are designed to pass Applicant Tracking Systems with clean formatting, standard section headers, and structured content.",
    },
    {
      question: "Can I use different templates for different resumes?",
      answer:
        "Yes. Each resume can use a different template, and you can switch templates at any time.",
    },
    {
      question: "What file format is the download?",
      answer: "Resumes are exported as PDF files, optimized for both screen viewing and printing.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "Contact us and we will process your account deletion request. All associated data will be permanently removed.",
    },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Frequently Asked Questions
        </h1>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900">
                {faq.question}
              </h3>
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
