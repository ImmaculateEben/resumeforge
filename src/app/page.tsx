import Link from "next/link";
import { ArrowRight, Download, Layout, Sparkles } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight animate-fade-in">
              Build Your Professional <span className="text-primary">Resume in Minutes</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 animate-fade-in delay-100">
              Create polished, ATS-friendly resumes with a focused editor, live preview, and local
              autosave in the browser.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Create Resume Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Templates
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500 animate-fade-in delay-300">
              No credit card required. Local-first workflow.
            </p>
          </div>

          <div className="mt-16 relative animate-fade-in delay-400">
            <div className="bg-gradient-to-b from-gray-100 to-white rounded-2xl p-2 md:p-4 shadow-2xl">
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="bg-gray-50 border-b border-border p-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="aspect-[16/10] bg-white p-8">
                  <div className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Resume Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything You Need to Create a Strong Resume
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              The current build focuses on the essentials that matter: edit quickly, preview live,
              and export cleanly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Layout className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Starter Templates</h3>
              <p className="text-gray-600">
                Choose from three clean starter templates built for professional resumes.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Editing</h3>
              <p className="text-gray-600">
                Work through structured sections, update content quickly, and preview changes as
                you type.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <Download className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Export to PDF</h3>
              <p className="text-gray-600">
                Download your resume as a PDF directly from the dashboard or editor when you are
                ready to apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Create your resume in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose a Template</h3>
              <p className="text-gray-600">
                Browse the starter templates and pick the layout that best fits your style.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fill in Your Details</h3>
              <p className="text-gray-600">
                Add experience, education, skills, projects, certifications, and languages in the
                editor.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Download and Share</h3>
              <p className="text-gray-600">
                Export a PDF when the resume looks right and use it anywhere you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Build Your Resume?</h2>
          <p className="mt-4 text-xl text-primary-100">
            Start with the local builder, keep drafts in your browser, and export a polished PDF.
          </p>
          <div className="mt-10">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">3</div>
              <div className="text-gray-600 mt-2">Starter Templates</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">Auto</div>
              <div className="text-gray-600 mt-2">Local Autosave</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">Live</div>
              <div className="text-gray-600 mt-2">Preview Panel</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">PDF</div>
              <div className="text-gray-600 mt-2">Export Ready</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
