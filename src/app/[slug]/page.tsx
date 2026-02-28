import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

const PAGE_CONTENT: Record<
  string,
  {
    title: string;
    description: string;
    body: string;
    primaryHref: string;
    primaryLabel: string;
  }
> = {
  about: {
    title: "About ResumeForge",
    description: "ResumeForge is focused on a fast, local-first resume-building workflow.",
    body:
      "The current app is intentionally lightweight: create resumes in the browser, keep them in local storage, preview changes live, and export a PDF when you are ready.",
    primaryHref: "/dashboard",
    primaryLabel: "Open Dashboard",
  },
  pricing: {
    title: "Pricing",
    description: "The current build is available as a free local-first experience.",
    body:
      "There is no paid tier wired into this version yet. You can create resumes, save them in your browser, and export PDFs without a billing flow.",
    primaryHref: "/dashboard",
    primaryLabel: "Start Building",
  },
  blog: {
    title: "Blog",
    description: "Content publishing is not live yet, but the product is ready to use.",
    body:
      "A dedicated blog has not been launched in this build. For now, the main focus is the resume editor and export flow.",
    primaryHref: "/",
    primaryLabel: "Back Home",
  },
  careers: {
    title: "Careers",
    description: "There is no public careers board in this build yet.",
    body:
      "This link is now routed so it no longer breaks navigation, but job listings are not being published from the app right now.",
    primaryHref: "/",
    primaryLabel: "Back Home",
  },
  help: {
    title: "Help Center",
    description: "The quickest way to recover is to keep using the local dashboard flow.",
    body:
      "Your resumes are stored in this browser. Use the dashboard to create or reopen a resume, then continue editing from the editor screen.",
    primaryHref: "/dashboard",
    primaryLabel: "Open Dashboard",
  },
  contact: {
    title: "Contact",
    description: "A dedicated contact form is not available in this build yet.",
    body:
      "This placeholder page keeps navigation stable while the core editor remains the priority. The main usable workflow is still the dashboard and editor.",
    primaryHref: "/dashboard",
    primaryLabel: "Open Dashboard",
  },
  privacy: {
    title: "Privacy Policy",
    description: "This build stores resume data locally in your browser.",
    body:
      "Resume data is saved to local storage on this device unless you wire up a backend. Clearing site data or switching browsers will remove local-only content.",
    primaryHref: "/dashboard",
    primaryLabel: "Manage Resumes",
  },
  terms: {
    title: "Terms of Service",
    description: "This local-first build is provided as-is.",
    body:
      "The current implementation is a browser-based resume builder. You are responsible for reviewing exported documents before using them.",
    primaryHref: "/dashboard",
    primaryLabel: "Open Dashboard",
  },
  "forgot-password": {
    title: "Forgot Password",
    description: "Password reset depends on backend authentication being configured.",
    body:
      "If Supabase authentication is not configured, the app runs in local-only mode and there is no remote password to reset. You can still return to the login screen or continue to the dashboard.",
    primaryHref: "/login",
    primaryLabel: "Back to Login",
  },
};

interface InfoPageProps {
  params: {
    slug: string;
  };
}

export default function InfoPage({ params }: InfoPageProps) {
  const content = PAGE_CONTENT[params.slug];

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-[72px]">
        <section className="bg-gradient-to-b from-primary/5 to-white py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-primary uppercase tracking-[0.2em]">ResumeForge</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">{content.title}</h1>
            <p className="text-lg text-gray-600 mt-4">{content.description}</p>
            <div className="mt-10 bg-white border border-border rounded-2xl p-8 shadow-sm">
              <p className="text-gray-700 leading-7">{content.body}</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href={content.primaryHref}>
                  <Button>{content.primaryLabel}</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
