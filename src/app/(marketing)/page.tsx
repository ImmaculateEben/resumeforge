import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Instant Start",
    description: "No signup required. Open the builder and start creating your resume immediately.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "ATS-Friendly",
    description: "All templates pass Applicant Tracking Systems with clean formatting and standard headers.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Live Preview",
    description: "See your resume update in real-time as you type. What you see is what you download.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "PDF Export",
    description: "Download a polished, print-ready PDF instantly. Optimized for both screen and print.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Cloud Save",
    description: "Create a free account to save resumes to the cloud and access them from any device.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "4 Pro Templates",
    description: "Choose from four professionally designed templates suited for different industries.",
  },
];

const templates = [
  { key: "atlas", name: "Atlas", style: "Professional & Clean", color: "from-slate-600 to-slate-800" },
  { key: "summit", name: "Summit", style: "Modern & Efficient", color: "from-blue-600 to-indigo-700" },
  { key: "quill", name: "Quill", style: "Elegant & Creative", color: "from-emerald-600 to-teal-700" },
  { key: "northstar", name: "Northstar", style: "Bold & Contemporary", color: "from-violet-600 to-purple-700" },
];

const stats = [
  { value: "100%", label: "Free to use" },
  { value: "4", label: "Pro templates" },
  { value: "<2min", label: "To first PDF" },
  { value: "ATS", label: "Optimized" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-accent/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary-dark">No signup required — start building free</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Build a resume that
              <br />
              <span className="gradient-text">lands you the job</span>
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-in-up delay-100 mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Create professional, ATS-friendly resumes in minutes. Choose a template,
              fill in your details, and download a polished PDF — completely free.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-200 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/builder"
                className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Start Building — It&apos;s Free
              </Link>
              <Link
                href="/templates"
                className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto"
              >
                View Templates
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <p className="animate-fade-in delay-300 mt-4 text-sm text-gray-400">
              No credit card · No signup · Download instantly
            </p>
          </div>

          {/* Hero Visual - Builder Preview */}
          <div className="animate-fade-in-up delay-400 mt-16 sm:mt-20 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-2xl opacity-50 animate-pulse-glow" />
              <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
                {/* Mock Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md px-3 py-1.5 text-xs text-gray-400 border border-gray-200 max-w-xs mx-auto text-center">
                      resumeforge.app/builder
                    </div>
                  </div>
                </div>
                {/* Mock Builder Preview */}
                <div className="flex min-h-[300px] sm:min-h-[400px]">
                  {/* Left - Form */}
                  <div className="w-1/2 p-6 border-r border-gray-100 hidden sm:block">
                    <div className="space-y-4">
                      <div className="h-6 w-32 bg-gray-200 rounded" />
                      <div className="space-y-2">
                        <div className="h-9 bg-gray-100 rounded-lg" />
                        <div className="h-9 bg-gray-100 rounded-lg" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-9 bg-gray-100 rounded-lg" />
                          <div className="h-9 bg-gray-100 rounded-lg" />
                        </div>
                      </div>
                      <div className="h-5 w-40 bg-gray-200 rounded mt-4" />
                      <div className="h-20 bg-gray-100 rounded-lg" />
                      <div className="h-5 w-28 bg-gray-200 rounded mt-4" />
                      <div className="h-9 bg-gray-100 rounded-lg" />
                      <div className="h-9 bg-gray-100 rounded-lg" />
                    </div>
                  </div>
                  {/* Right - Preview */}
                  <div className="flex-1 p-6 bg-gray-50/50 flex items-start justify-center">
                    <div className="bg-white shadow-lg rounded border border-gray-200 w-full max-w-[240px] p-5 space-y-3">
                      <div className="text-center space-y-1">
                        <div className="h-5 w-28 bg-primary/20 rounded mx-auto" />
                        <div className="h-3 w-36 bg-gray-200 rounded mx-auto" />
                      </div>
                      <div className="h-px bg-primary/30" />
                      <div className="space-y-1">
                        <div className="h-3 w-20 bg-primary/15 rounded" />
                        <div className="h-2 w-full bg-gray-100 rounded" />
                        <div className="h-2 w-4/5 bg-gray-100 rounded" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 w-16 bg-primary/15 rounded" />
                        <div className="h-2 w-full bg-gray-100 rounded" />
                        <div className="h-2 w-3/4 bg-gray-100 rounded" />
                        <div className="h-2 w-5/6 bg-gray-100 rounded" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 w-14 bg-primary/15 rounded" />
                        <div className="flex gap-1 flex-wrap">
                          <div className="h-4 w-12 bg-primary/10 rounded-full" />
                          <div className="h-4 w-16 bg-primary/10 rounded-full" />
                          <div className="h-4 w-10 bg-primary/10 rounded-full" />
                          <div className="h-4 w-14 bg-primary/10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Three steps to your perfect resume
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Our streamlined process gets you from blank page to polished PDF in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Pick a Template",
                description: "Choose from four ATS-optimized templates designed for different industries and career stages.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Fill Your Details",
                description: "Enter your experience, education, skills, and more with our guided editor and live preview.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Download PDF",
                description: "Export a polished, print-ready PDF instantly. Save to cloud later if you want to come back.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="card-elevated p-8 h-full text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary mb-5 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-28 section-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              We stripped away the complexity so you can focus on what matters — your content.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card p-6 group hover:border-primary/20">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Professional templates for every career
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Each template is carefully designed to be ATS-friendly and visually appealing.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {templates.map((template) => (
              <Link
                key={template.key}
                href={`/builder?template=${template.key}`}
                className="group"
              >
                <div className="card overflow-hidden">
                  <div className={`h-48 sm:h-56 bg-gradient-to-br ${template.color} flex items-center justify-center p-6`}>
                    {/* Template wireframe */}
                    <div className="bg-white/90 rounded-lg w-full h-full p-3 shadow-lg">
                      <div className="space-y-2">
                        <div className="h-3 w-16 bg-gray-300 rounded mx-auto" />
                        <div className="h-1.5 w-24 bg-gray-200 rounded mx-auto" />
                        <div className="h-px bg-gray-200 my-2" />
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-gray-100 rounded" />
                          <div className="h-1.5 w-3/4 bg-gray-100 rounded" />
                        </div>
                        <div className="space-y-1 pt-1">
                          <div className="h-1.5 w-full bg-gray-100 rounded" />
                          <div className="h-1.5 w-5/6 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{template.style}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/templates" className="btn-secondary">
              View All Templates
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="py-20 sm:py-28 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Built for job seekers
                <br />
                <span className="text-primary-light">who value their time</span>
              </h2>
              <p className="mt-6 text-gray-400 text-lg leading-relaxed">
                Most resume builders force you to create an account before you can even see the editor.
                We think that&apos;s backwards. Start building immediately, and only create an account
                when you want to save your work.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "No registration wall — build and download instantly",
                  "Your draft saves in your browser for 7 days",
                  "Create a free account anytime to save to cloud",
                  "Manage multiple resume versions from your dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-light mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl" />
              <div className="relative bg-gray-800 rounded-xl p-8 border border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div>
                      <div className="font-semibold text-white">Guest User</div>
                      <div className="text-sm text-gray-400">No account needed</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Resume progress</span>
                      <span className="text-primary-light font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-white">1</div>
                      <div className="text-xs text-gray-400">Resume</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-white">PDF</div>
                      <div className="text-xs text-gray-400">Ready</div>
                    </div>
                  </div>
                  <button className="btn-primary w-full justify-center">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-indigo-900 px-8 py-16 sm:px-16 sm:py-20 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to build your resume?
              </h2>
              <p className="text-lg text-indigo-200 max-w-xl mx-auto mb-8">
                Join thousands of job seekers who built their resumes with ResumeForge.
                Start now — it takes less than 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary-dark font-semibold text-base hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                >
                  Start Building Free
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 text-white font-semibold text-base border border-white/20 hover:bg-white/20 transition-all w-full sm:w-auto justify-center"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
