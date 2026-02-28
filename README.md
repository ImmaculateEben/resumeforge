# ResumeForge - CV Builder

ResumeForge is a modern, feature-rich CV builder built with Next.js 14, TypeScript, and Tailwind CSS. Create professional resumes with ease using our intuitive editor and live preview functionality.

![ResumeForge](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat-square&logo=tailwind-css)

## Features

- 📝 **Intuitive CV Editor** - Fill in your information with easy-to-use forms
- 👁️ **Live Preview** - See your CV update in real-time as you type
- 📄 **Multiple Templates** - Choose from modern, classic, and creative designs
- 💾 **Auto-Save** - Your progress is automatically saved
- 📥 **PDF Export** - Download your finished CV as a professional PDF
- 🔐 **Authentication** - Create an account to save and manage multiple CVs

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **PDF Generation:** @react-pdf/renderer
- **Authentication:** Supabase (optional)
- **State Management:** React Context + LocalStorage

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ImmaculateEben/resumeforge.git
cd resumeforge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
resume-forge/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/         # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/   # Protected dashboard pages
│   │   │   ├── dashboard/
│   │   │   └── editor/
│   │   └── templates/      # Template gallery
│   ├── components/         # React components
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript type definitions
├── supabase/               # Database schema
└── public/                 # Static assets
```

## CV Sections

ResumeForge supports the following resume sections:

- **Personal Information** - Name, email, phone, location, LinkedIn, portfolio
- **Professional Summary** - Career objective or summary
- **Work Experience** - Job title, company, dates, responsibilities
- **Education** - Degree, institution, graduation year
- **Skills** - Technical and soft skills
- **Projects** - Project name, description, technologies, links
- **Certifications** - Certification name, issuer, date
- **Languages** - Language proficiency levels

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

- GitHub: [ImmaculateEben](https://github.com/ImmaculateEben)

---

Made with ❤️ using Next.js
