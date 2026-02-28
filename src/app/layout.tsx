import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeForge - Build Professional CVs",
  description: "Create stunning professional resumes with ResumeForge. Choose from beautiful templates, customize easily, and export to PDF.",
  keywords: ["CV builder", "Resume maker", "Resume builder", "Create CV", "Free resume templates"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
