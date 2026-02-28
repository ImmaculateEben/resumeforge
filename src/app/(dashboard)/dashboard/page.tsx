"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TemplateThumbnail } from "@/components/resume-preview";
import { createLoginRedirectPath, REQUIRE_SIGN_IN_FOR_APP } from "@/lib/auth-redirect";
import {
  Clock,
  Copy,
  Download,
  Edit,
  FileText,
  LogOut,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { CV, TEMPLATES, TemplateId } from "@/types";
import { downloadCVPdf } from "@/lib/cv-pdf";
import { signOutAppSession, useAppSession } from "@/hooks/use-app-session";
import {
  createCVRecord,
  duplicateCVRecord,
  loadCVsFromStorage,
  saveCVsToStorage,
} from "@/lib/cv-storage";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isLoading: isSessionLoading } = useAppSession();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCVTitle, setNewCVTitle] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>("modern");
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [downloadingCvId, setDownloadingCvId] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (isSessionLoading) {
      return;
    }

    if (REQUIRE_SIGN_IN_FOR_APP && session.kind === "guest") {
      router.replace(createLoginRedirectPath(pathname || "/dashboard"));
      return;
    }

    setCvs(loadCVsFromStorage());
    setIsLoading(false);
  }, [isSessionLoading, pathname, router, session.kind]);

  useEffect(() => {
    if (!showCreateModal) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCreateModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCreateModal]);

  useEffect(() => {
    if (!openMenuId) {
      return;
    }

    const handleWindowClick = () => {
      setOpenMenuId(null);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [openMenuId]);

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewCVTitle("");
    setSelectedTemplateId("modern");
  };

  const handleCreateCV = () => {
    const newCV = createCVRecord(newCVTitle || "Untitled Resume", selectedTemplateId);
    const updatedCVs = [newCV, ...cvs];

    setCvs(updatedCVs);
    saveCVsToStorage(updatedCVs);
    closeCreateModal();
    router.push(`/editor?id=${newCV.id}`);
  };

  const handleDeleteCV = (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    const updatedCVs = cvs.filter((cv) => cv.id !== id);
    setCvs(updatedCVs);
    setOpenMenuId(null);
    saveCVsToStorage(updatedCVs);
  };

  const handleDuplicateCV = (cv: CV) => {
    const duplicatedCV = duplicateCVRecord(cv);
    const updatedCVs = [duplicatedCV, ...cvs];

    setCvs(updatedCVs);
    setOpenMenuId(null);
    saveCVsToStorage(updatedCVs);
  };

  const handleDownloadCV = async (cv: CV) => {
    setDownloadingCvId(cv.id);

    try {
      await downloadCVPdf(cv.title, cv.data, cv.templateId);
      setOpenMenuId(null);
    } finally {
      setDownloadingCvId(null);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOutAppSession();
      router.push("/login");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading || isSessionLoading || (REQUIRE_SIGN_IN_FOR_APP && session.kind === "guest")) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          {REQUIRE_SIGN_IN_FOR_APP && session.kind === "guest"
            ? "Redirecting to sign in..."
            : "Loading dashboard..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
              <p className="text-gray-500 mt-1">Create, edit, duplicate, and export your resumes locally.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-xl border border-border bg-gray-50 px-4 py-2">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
                  {session.kind === "guest"
                    ? "Guest"
                    : session.kind === "demo"
                    ? "Demo Mode"
                    : "Signed In"}
                </p>
                <p className="text-sm font-medium text-gray-900">{session.displayName}</p>
              </div>
              {session.kind === "guest" ? (
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={handleSignOut} loading={isSigningOut}>
                  {!isSigningOut ? <LogOut className="w-4 h-4 mr-2" /> : null}
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </Button>
              )}
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Resume
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cvs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h2>
            <p className="text-gray-500 mb-6">Create your first resume to get started.</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create Resume
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <Card key={cv.id} variant="elevated" className="p-5">
                <Link
                  href={`/editor?id=${cv.id}`}
                  className="block aspect-[3/4] bg-gray-100 rounded-lg mb-4 overflow-hidden relative"
                >
                  <TemplateThumbnail templateId={cv.templateId} />
                </Link>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/editor?id=${cv.id}`}
                      className="font-semibold text-gray-900 hover:text-primary transition-colors block truncate"
                    >
                      {cv.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Updated {formatDate(cv.updatedAt)}</span>
                    </div>
                    <span className="inline-flex mt-2 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {TEMPLATES.find((template) => template.id === cv.templateId)?.name || "Template"}
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      aria-label={`Open actions for ${cv.title}`}
                      aria-haspopup="menu"
                      aria-expanded={openMenuId === cv.id}
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenMenuId((currentId) => (currentId === cv.id ? null : cv.id));
                      }}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>

                    {openMenuId === cv.id ? (
                      <div
                        role="menu"
                        className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-border py-1 z-10 min-w-[180px]"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Link
                          href={`/editor?id=${cv.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDuplicateCV(cv)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadCV(cv)}
                          disabled={downloadingCvId === cv.id}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed w-full"
                        >
                          <Download className="w-4 h-4" />
                          {downloadingCvId === cv.id ? "Generating PDF..." : "Download PDF"}
                        </button>
                        <hr className="my-1" />
                        <button
                          type="button"
                          onClick={() => handleDeleteCV(cv.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {showCreateModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={closeCreateModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-resume-title"
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="create-resume-title" className="text-xl font-semibold text-gray-900 mb-4">
              Create New Resume
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Resume Title
              </label>
              <input
                type="text"
                value={newCVTitle}
                onChange={(event) => setNewCVTitle(event.target.value)}
                placeholder="e.g., Software Engineer Resume"
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                autoFocus
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Template
              </label>
              <select
                value={selectedTemplateId}
                onChange={(event) => setSelectedTemplateId(event.target.value as TemplateId)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                {TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={closeCreateModal}>
                Cancel
              </Button>
              <Button onClick={handleCreateCV}>Create Resume</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
