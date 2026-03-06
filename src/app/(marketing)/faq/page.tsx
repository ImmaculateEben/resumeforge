"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "Do I need an account to build a resume?",
    answer:
      "No. You can start building your resume immediately and download it as a PDF without creating an account. It's completely free and requires zero signup.",
  },
  {
    question: "Is ResumeForge really free?",
    answer:
      "Yes. Building and downloading resumes is completely free. Creating an account for cloud save is also free. There are no hidden fees or premium tiers.",
  },
  {
    question: "What happens to my resume if I don't create an account?",
    answer:
      "Your draft is saved in your browser for 7 days. If you return within that window, you can pick up where you left off. After 7 days, the local draft expires automatically.",
  },
  {
    question: "Why should I create an account?",
    answer:
      "An account lets you save resumes to the cloud, manage multiple versions, access your resumes from any device, and maintain version history. It's free to create.",
  },
  {
    question: "Are the templates ATS-friendly?",
    answer:
      "Yes. All four templates are designed to pass Applicant Tracking Systems with clean formatting, standard section headers, and structured content. They work with all major ATS platforms.",
  },
  {
    question: "Can I use different templates for different resumes?",
    answer:
      "Yes. Each resume can use a different template, and you can switch templates at any time without losing your content.",
  },
  {
    question: "What file format is the download?",
    answer:
      "Resumes are exported as PDF files, optimized for both screen viewing and printing. PDF is the universally accepted format for job applications.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Contact us and we will process your account deletion request. All associated data will be permanently removed within 30 days.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50/50 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-900 pr-4">{question}</h3>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isOpen ? "bg-primary text-white rotate-180" : "bg-gray-100 text-gray-500"
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 animate-fade-in">
          <p className="text-gray-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-500">
            Everything you need to know about ResumeForge. Can&apos;t find the answer you&apos;re looking for? Reach out to our team.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 animate-fade-in-up">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 card p-8 text-center bg-primary-50/30 border-primary/10">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-sm text-gray-500 mb-4">Start building for free and see for yourself.</p>
          <Link href="/builder" className="btn-primary text-sm">
            Start Building Free
          </Link>
        </div>
      </div>
    </div>
  );
}
