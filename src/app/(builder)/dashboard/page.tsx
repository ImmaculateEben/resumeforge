"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface LocalResume {
  key: string;
  id: string;
  name: string;
  template: string;
  completion: number;
}

function getLocalResumes(): LocalResume[] {
  const resumes: LocalResume[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("resumeforge_resume_")) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const id = key.replace("resumeforge_resume_", "");
        const name = parsed.basics?.fullName || "Untitled Resume";
        const template = parsed.templateKey || "atlas";

        let filled = 0;
        if (parsed.basics?.fullName && parsed.basics?.email) filled++;
        if (parsed.summary && parsed.summary.length > 10) filled++;
        if (parsed.experience && parsed.experience.length > 0) filled++;
        if (parsed.education && parsed.education.length > 0) filled++;
        if (parsed.skills && parsed.skills.length > 0) filled++;
        const completion = Math.round((filled / 5) * 100);

        resumes.push({ key, id, name, template, completion });
      }
    }
  } catch {
    // ignore
  }
  return resumes;
}

export default function DashboardPage() {
  const session = useSession()?.data;
  const [activeFilter, setActiveFilter] = useState("active");
  const [localResumes, setLocalResumes] = useState<LocalResume[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLocalResumes(getLocalResumes());
  }, []);

  if (!session?.user) {
    return (
      <div className="max-w-md mx-auto py-12 sm:py-16 px-4 text-center animate-fade-in">
        <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mb-5 sm:mb-6 mx-auto">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Sign in to access Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">Create an account to save, manage, and organize your resumes in the cloud.</p>
        <div className="flex flex-col gap-2">
          <Link href="/login" className="btn-primary text-sm py-2.5 text-center">Sign In</Link>
          <Link href="/signup" className="btn-secondary text-sm py-2.5 text-center">Create Account</Link>
          <Link href="/builder" className="text-sm text-gray-400 hover:text-gray-600 mt-2">Back to Builder</Link>
        </div>

        {localResumes.length > 0 && (
          <div className="mt-8 text-left">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Your Local Drafts</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <p className="text-xs text-gray-400 mb-3">These are saved in your browser. Sign in to save them to the cloud.</p>
            <div className="space-y-2">
              {localResumes.map((r) => (
                <Link
                  key={r.id}
                  href={`/resume/${r.id}`}
                  className="card p-3 flex items-center gap-3 hover:border-primary/30 transition-colors block"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{r.template} template</p>
                  </div>
                  <div className="text-xs font-medium text-primary">{r.completion}%</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const userName = session.user.name || "there";

  const filteredResumes = localResumes.filter((r) => {
    if (search) {
      return r.name.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Welcome back,</p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{userName}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1">Manage and organize all your resumes</p>
        </div>
        <Link href="/builder" className="btn-primary text-sm shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New Resume
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
        {[
          { label: "Total Resumes", value: String(localResumes.length), icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", color: "text-primary bg-primary/10" },
          { label: "Active", value: String(localResumes.length), icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-emerald-600 bg-emerald-50" },
          { label: "Downloads", value: "0", icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3", color: "text-blue-600 bg-blue-50" },
          { label: "Last Edited", value: "\u2014", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-amber-600 bg-amber-50" },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} /></svg>
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex gap-1.5">
          {["active", "archived"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all capitalize ${activeFilter === filter ? "bg-primary text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input
            type="text"
            placeholder="Search resumes..."
            className="input-modern text-sm py-1.5 w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Resume List or Empty State */}
      {filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredResumes.map((r) => (
            <Link
              key={r.id}
              href={`/resume/${r.id}`}
              className="card p-4 sm:p-5 hover:border-primary/30 transition-all group block"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                  {r.template}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">{r.name}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Local draft</p>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400">Completion</span>
                  <span className="text-[10px] font-semibold text-primary">{r.completion}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                    style={{ width: `${r.completion}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card p-10 sm:p-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 mb-5 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No resumes yet</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6 sm:mb-8">
            Start building your first resume in the builder, then save it here to access it anytime.
          </p>
          <Link href="/builder" className="btn-primary text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Open Builder
          </Link>
        </div>
      )}

      {/* Guest Draft Notice */}
      <div className="mt-5 sm:mt-6 card p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3 border-primary/20 bg-primary-50/30">
        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-800">Have a guest draft?</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">If you built a resume as a guest, click &quot;Save&quot; in the builder to import it into your account.</p>
        </div>
      </div>
    </div>
  );
}
