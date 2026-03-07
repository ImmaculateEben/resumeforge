import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppSessionProvider } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeForge - Build ATS-Friendly Resumes Instantly",
  description:
    "Create professional, ATS-friendly resumes and CVs in minutes. Build and download a polished PDF without signing up — completely free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppSessionProvider>{children}</AppSessionProvider>
      </body>
    </html>
  );
}
