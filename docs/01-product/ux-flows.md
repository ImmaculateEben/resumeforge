# ResumeForge v1 UX Flows

## Experience Principles

- Remove friction before value is proven.
- Keep editing structured and predictable.
- Preserve user progress by default.
- Make account requirements explicit only when save/persistence is requested.
- Keep admin workflows fast, searchable, and auditable.

## Sitemap

### Public routes

- `/`
- `/templates`
- `/faq`
- `/privacy`
- `/terms`
- `/builder`
- `/login`
- `/signup`
- `/forgot-password`
- `/verify-email`

### Authenticated user routes

- `/dashboard`
- `/resume/[resumeId]`
- `/settings`

### Admin routes

- `/admin`
- `/admin/templates`
- `/admin/users`
- `/admin/audit-logs`

## Global Layout Rules

- Marketing pages use a public shell with prominent builder entry points.
- Builder uses a two-column desktop layout: form editor on the left, live preview on the right.
- Mobile builder collapses into tabbed sections: `Edit`, `Preview`, `Actions`.
- Builder-triggered auth uses a modal overlay.
- Direct navigation to auth uses dedicated pages for login, signup, forgot-password, and verify-email states.

## Primary User Flows

### 1. Guest starts building

1. User lands on marketing page.
2. User clicks `Start Building`.
3. Builder opens with template selector and empty structured sections.
4. Auto-save initializes local draft metadata in browser storage.
5. User edits sections and sees live preview updates.

### 2. Guest downloads PDF

1. User completes or partially completes resume fields.
2. User clicks `Download PDF`.
3. Client validates required minimum fields for export.
4. If valid, payload is posted to the export endpoint.
5. User receives generated PDF.
6. Guest remains unauthenticated and local draft remains in browser storage.

### 3. Guest attempts to save

1. User clicks `Save`.
2. System detects no authenticated session.
3. Auth screen opens with context message: saving requires an account.
4. User registers or logs in.
5. System checks for local draft import candidate.
6. User confirms import if a local draft exists.
7. Server creates the saved resume and initial version.
8. Client clears local draft only after success and redirects to dashboard or saved resume.

### 4. Returning user manages resumes

1. User logs in and enters dashboard.
2. Dashboard lists resumes with title, template, updated date, status, and actions.
3. User can create new, open existing, duplicate, archive, restore, or delete.
4. Editing an existing resume opens `/resume/[resumeId]`.
5. Changes stay local until the user clicks `Save`.
6. Successful save writes the database update and creates the next version snapshot.

### 5. Admin moderates the platform

1. Admin logs in and enters `/admin`.
2. Admin reviews system summary and recent privileged actions.
3. Admin can inspect a user profile, suspend or unsuspend an account, and review reason history.
4. Admin can activate/deactivate templates and publish template metadata updates.
5. All actions are written to audit logs.

## Screen Requirements

## Landing page

- Clear value proposition
- Primary CTA to open builder
- Secondary CTA to review templates
- Trust and privacy messaging that download is available without signup

## Builder

- Template switcher
- Structured sections for basics, summary, experience, education, projects, skills, certifications, links, and custom sections
- Explicit `Download PDF` and `Save` actions
- Local draft recovery banner when a recoverable guest draft exists
- Validation hints without blocking editing

## Dashboard

- Resume list with filters for active, archived, and deleted
- Primary action to create a new resume
- Empty state explaining that saving requires authentication and that guest downloads are possible from the builder

## Auth

- Login and signup forms
- Password reset flow
- Email verification state
- Contextual copy when auth was triggered by a save attempt

## Admin

- Search and filter for users
- Template list with activation state and version
- Audit log table with action, actor, target, timestamp, and filters

## UX Constraints

- Do not block builder entry with auth.
- Do not write guest drafts to the server.
- Do not auto-delete local draft before verified server import.
- Do not expose admin links to non-admin users.
- Do not allow HTML-rich editing in v1.
