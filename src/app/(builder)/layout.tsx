"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const isAuthenticated = !!session?.user;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", requiresAuth: true, icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    )},
    { href: "/settings", label: "Settings", requiresAuth: true, icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 glass border-b border-white/20 bg-white/80 print:hidden">
        <div className="mx-auto max-w-full px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-xs">
                R
              </div>
              <span className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                ResumeForge
              </span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.requiresAuth && !isAuthenticated) {
                  return (
                    <button
                      key={link.href}
                      onClick={() => setShowSignInPrompt(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                    >
                      {link.icon}
                      <span className="hidden sm:inline">{link.label}</span>
                    </button>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {link.icon}
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>

      {/* Sign-In Prompt Modal */}
      {showSignInPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl animate-fade-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 mx-auto">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Sign in Required</h3>
            <p className="text-sm text-gray-500 mb-5 text-center">Sign in or create an account to access your dashboard, settings, and saved resumes.</p>
            <div className="flex flex-col gap-2">
              <a href="/login" className="btn-primary text-sm text-center py-2.5 rounded-xl font-medium">Sign In</a>
              <a href="/signup" className="btn-secondary text-sm text-center py-2.5 rounded-xl font-medium">Create Account</a>
              <button onClick={() => setShowSignInPrompt(false)} className="text-sm text-gray-400 hover:text-gray-600 mt-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
