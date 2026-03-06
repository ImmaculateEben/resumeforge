# Architecture Specification

## Technical Baseline

- Framework: Next.js App Router with TypeScript
- ORM: Prisma
- Database: Neon PostgreSQL
- Authentication: Auth.js credentials provider with database sessions
- Validation: Zod
- PDF rendering: Playwright running a print-specific preview page
- Rate limiting: Upstash Redis
- Email: Resend
- Monitoring: Sentry

## System Context

The system has three runtime surfaces:

- Public surface for marketing pages and the guest builder
- Authenticated user surface for dashboard and saved resume editing
- Admin surface for templates, users, and audit review

External dependencies:

- Vercel for deployment and serverless hosting
- Neon for PostgreSQL
- Upstash for rate limiting and low-volume operational counters
- Resend for verification and reset emails
- Sentry for exceptions, tracing, and release monitoring

## Proposed Application Structure

```text
app/
  (marketing)/
    page.tsx
    templates/page.tsx
    faq/page.tsx
    privacy/page.tsx
    terms/page.tsx
  (auth)/
    login/page.tsx
    signup/page.tsx
    forgot-password/page.tsx
    verify-email/page.tsx
  (builder)/
    builder/page.tsx
    resume/[resumeId]/page.tsx
    dashboard/page.tsx
    settings/page.tsx
  admin/
    page.tsx
    templates/page.tsx
    users/page.tsx
    audit-logs/page.tsx
  api/
    auth/
    export/pdf/
    resumes/
    admin/
src/
  modules/
    auth/
    resumes/
    templates/
    pdf/
    admin/
    rate-limit/
    audit/
    validation/
  lib/
    db.ts
    env.ts
    logger.ts
    sentry.ts
```

## Module Responsibilities

## `auth`

- Registration, login, logout, password reset, email verification
- Session hydration and route protection
- Account status checks for `suspended`
- Email verification state is tracked separately and surfaced in the UI, but it does not block core save/dashboard access in v1

## `resumes`

- Payload validation
- CRUD for saved resumes
- Version creation and restore logic
- Guest-draft import logic after auth

## `templates`

- Public template listing
- Active template retrieval for builder
- Admin template CRUD and activation

## `pdf`

- Validates export payload
- Renders the print preview route in Playwright
- Streams PDF response
- Collects export duration and failure telemetry

## `admin`

- Permission checks
- User search and suspension workflows
- Template management
- Audit-log retrieval

## `rate-limit`

- Key generation per IP, email, session, and user
- Policy enforcement for auth and export endpoints
- Consistent error responses and logging

## Client Architecture

- Builder state is managed client-side and persisted to browser storage.
- Live preview renders from the same canonical payload as the form state.
- Authenticated resume editor loads persisted payload from the server and still keeps a local working copy for crash recovery.
- Import-from-guest flow is client-initiated after successful auth session creation.
- Database writes happen only on explicit save actions in v1.

## Request Flows

## Guest PDF export

1. Builder validates minimum export requirements in the client.
2. Client submits `ResumeDraftPayload` to `POST /api/export/pdf`.
3. Server re-validates payload, checks guest export rate limit, and renders a print page in Playwright.
4. PDF binary is returned directly; no database write occurs.

## Guest save after auth

1. Guest clicks `Save` in the builder.
2. Auth UI completes registration or login.
3. Client detects authenticated session and existing local draft.
4. Client posts the payload to `POST /api/resumes` with an idempotency key.
5. Server creates `resumes` row and version `1`.
6. Client clears local guest draft after success and routes to `/dashboard` or `/resume/[resumeId]`.

## Authenticated save

1. Authenticated user edits a saved resume.
2. Client sends a save mutation to `PATCH /api/resumes/:id`.
3. Server validates ownership, updates the current row, increments version counter, and inserts a `resume_versions` snapshot.
4. Updated metadata returns to the client.

## Rendering Strategy

- Builder preview uses the same template renderer contract as PDF generation.
- PDF generation uses a print-specific page to ensure browser and export layouts remain aligned.
- Template layout rules are token-based and selected by `templateKey`.

## Security Boundaries

- Public builder routes have no access to resume persistence APIs.
- Authenticated routes require a valid session and a non-suspended user.
- Admin routes require `role=admin` at both UI and API layers.
- All server mutations validate payloads with shared schemas.

## Observability

- Capture Sentry traces for auth, save, export, and admin mutations.
- Emit structured logs with request ID, user ID if present, route, duration, and result.
- Track core metrics: login failures, export failures, save latency, import success rate, and admin actions.

## Environment Variables

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_DSN`
- `PLAYWRIGHT_CHROMIUM_PATH` when required by deployment target

## Architectural Constraints

- Do not persist guest drafts on the server.
- Do not permit rich HTML content in the payload.
- Do not couple templates to database columns beyond `templateKey`.
- Do not let admin operations bypass audit logging.
