"use client";

import Link from "next/link";
import { useState } from "react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-sm">
                R
              </div>
              <span className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                ResumeForge
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/templates"
                className="btn-ghost text-sm"
              >
                Templates
              </Link>
              <Link
                href="/faq"
                className="btn-ghost text-sm"
              >
                FAQ
              </Link>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <Link
                href="/login"
                className="btn-ghost text-sm"
              >
                Log in
              </Link>
              <Link
                href="/builder"
                className="btn-primary text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Start Building
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/templates"
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </Link>
              <Link
                href="/faq"
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/login"
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <div className="pt-2">
                <Link
                  href="/builder"
                  className="btn-primary w-full text-sm justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Building
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Footer Main */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-sm">
                  R
                </div>
                <span className="text-lg font-bold">ResumeForge</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                Build stunning, ATS-friendly resumes in minutes. No signup required — start building immediately.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><Link href="/builder" className="text-sm text-gray-400 hover:text-white transition-colors">Resume Builder</Link></li>
                <li><Link href="/templates" className="text-sm text-gray-400 hover:text-white transition-colors">Templates</Link></li>
                <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ResumeForge. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Made with care for job seekers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
