# ResumeForge v1 PRD

## Product Summary

ResumeForge is a web application for creating ATS-friendly resumes and CVs quickly. Users can open the builder instantly, enter structured data, preview the document live, and download a PDF without authentication. Authentication is required only for cloud save and dashboard-based management.

## Problem Statement

Most resume builders either force users into account creation too early or overload them with complex editing surfaces. ResumeForge v1 solves this by separating low-friction document creation from account-gated persistence.

## Target Users

### Primary persona: first-time job seeker

- Needs a simple, guided way to assemble a credible resume
- Is likely to abandon the product if signup is required before trying it
- Wants a clean PDF for immediate use

### Secondary persona: active professional

- Wants to maintain multiple versions of a resume for different roles
- Needs dashboard access, duplication, archiving, and version history
- Values consistency across devices after logging in

### Internal persona: operations administrator

- Manages templates, reviews abuse, suspends users when needed, and audits privileged actions

## Jobs To Be Done

- When a user has resume information but no finished document, they can turn structured information into a polished PDF quickly.
- When a guest user decides their draft is worth keeping, they can create an account and save it without re-entering data.
- When a returning user needs revisions, they can reopen, edit, duplicate, archive, and re-download saved resumes safely.
- When operations staff need to manage platform quality, they can control templates, review audit trails, and suspend abusive accounts.

## Goals

- Let first-time visitors reach the builder in one click from the marketing site.
- Make guest-to-download flow possible without authentication.
- Make guest-to-account migration reliable and one-time during registration/login.
- Deliver four ATS-friendly templates with consistent PDF rendering.
- Provide a secure authenticated dashboard and a full admin console.

## Non-Goals

- Payments, subscriptions, freemium gates, or purchase flows
- DOCX export, file uploads, profile photos, or image-heavy layouts
- AI writing suggestions, content generation, or rewriting assistance
- Real-time collaboration, team workspaces, or shared editing
- Multilingual UI or localized document content workflows in v1

## Functional Requirements

### Marketing and discovery

- Landing page explains instant builder access and account-gated saving.
- Templates page shows the four available templates with preview thumbnails.
- FAQ, privacy, and terms pages are publicly accessible.

### Builder

- Builder route is publicly accessible.
- Editing surface uses section forms with live preview.
- Resume content auto-saves to browser storage on every meaningful change.
- Guest drafts expire from browser storage after 7 days of inactivity.
- Download PDF is available to both guests and authenticated users.
- Save action opens login/signup when the user is unauthenticated.
- Server-side persistence is explicit through the `Save` action; v1 does not auto-save authenticated edits to the database.

### Authentication

- Email/password registration
- Email/password login
- Email verification
- Password reset request and reset completion
- Logout from all authenticated surfaces

### Guest to account migration

- If a guest signs up or logs in while a local draft exists, the draft is offered for import.
- Successful import creates one server-side resume record and one initial version snapshot.
- Local draft is removed only after server confirmation succeeds.
- Duplicate imports are prevented by client-side import state and server-side idempotency checks.

### Dashboard

- Authenticated users can see a list of their resumes.
- Users can create, rename, edit, duplicate, archive, soft-delete, and restore resumes.
- Permanent deletion happens through retention-based purge, not a user-triggered v1 action.
- Each successful authenticated save creates the next immutable version snapshot.
- Users can access version history and re-download any saved resume's latest approved content.

### Admin console

- Admins can view users, suspend or unsuspend accounts, and inspect account state.
- Admins can create, activate, deactivate, and update templates.
- Admins can review audit logs for privileged actions.

## Business Rules

- Guests can build and download but cannot save to the cloud.
- Dashboard access requires authentication.
- Every resume belongs to exactly one user account.
- Soft-deleted resumes are retained for 30 days before permanent purge.
- All admin actions must be recorded in immutable audit logs.

## Success Metrics

- Builder start rate from landing page
- Guest PDF download completion rate
- Guest-to-account conversion rate after save intent
- Successful local-draft import rate after authentication
- Median time from landing page to first PDF download
- Error rate for PDF generation, login, save, and dashboard load

## Constraints

- Web-only launch
- English-first content and UI
- Managed cloud deployment
- Structured JSON resume content only
- Plain text and bullet-list content only; no HTML input

## Release Acceptance Criteria

- A guest user can create and download a resume PDF without creating an account.
- A guest user attempting to save is routed through auth and can import the current local draft after login/signup.
- An authenticated user can manage only their own resumes.
- An admin can manage templates and suspension workflows with full audit logging.
- Monitoring, backups, and incident procedures are documented before production launch.
