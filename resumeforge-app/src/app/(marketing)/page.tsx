import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Build Your Resume in Minutes
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume instantly. No signup
            required — just open the builder, fill in your details, and download
            your PDF.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/builder"
              className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
            >
              Start Building
            </Link>
            <Link
              href="/templates"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
            >
              View Templates &rarr;
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Download your resume as a PDF without creating an account.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white text-lg font-bold">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Choose a Template
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Pick from four ATS-friendly templates designed for different
                industries and styles.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white text-lg font-bold">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Fill In Your Details
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Enter your experience, education, skills, and more with a guided
                editor and live preview.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white text-lg font-bold">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Download Your PDF
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Download a polished, print-ready PDF instantly. Create an
                account later to save and manage versions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want to save your work?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Create a free account to save your resumes to the cloud, manage
            multiple versions, and access them from any device.
          </p>
          <Link
            href="/signup"
            className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </>
  );
}
