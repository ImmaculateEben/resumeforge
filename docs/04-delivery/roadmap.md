# Delivery Roadmap

## Delivery Principles

- Freeze interfaces early.
- Ship the guest value path before dashboard complexity.
- Add operations and admin capabilities before launch, not after.
- Keep scope disciplined around the locked v1 exclusions.

## Phase 1: Foundations

### Deliverables

- Project scaffold
- Shared design tokens and template inventory
- Auth foundation
- Canonical `ResumeDraftPayload` validation
- Base database schema and migrations

### Exit Criteria

- Auth tables exist
- Template seed data exists
- Shared validation schemas compile and pass unit tests

## Phase 2: Guest Builder And PDF Export

### Deliverables

- Public builder route
- Section-form editor with live preview
- Browser storage auto-save and recovery
- PDF export endpoint and rendering path
- Export analytics and rate limits

### Exit Criteria

- Guest can build and download without auth
- Guest refresh recovers local draft
- Export creates no database writes

## Phase 3: Authenticated Save And Dashboard

### Deliverables

- Registration, login, logout, verification, and reset flows
- Guest-draft import after auth
- Resume CRUD, duplication, archive, delete, and restore
- Dashboard list and resume detail/editor routes
- Resume version history

### Exit Criteria

- Save requires auth
- Imported guest draft appears exactly once in the dashboard
- User cannot access another user's resume

## Phase 4: Admin Console

### Deliverables

- Admin dashboard
- User search and suspension
- Template management
- Audit log viewer

### Exit Criteria

- Non-admin users are blocked from admin routes
- All admin mutations create audit records

## Phase 5: Hardening And Launch Readiness

### Deliverables

- Monitoring and alerting
- Security validation and runbook walkthroughs
- Backup and restore drill
- Staging signoff and production deployment prep

### Exit Criteria

- Test plan passes in staging
- Security checklist is complete
- Rollback steps are validated

## Scope Control

Explicitly defer these to post-v1 unless separately approved:

- payments or subscriptions
- DOCX export
- AI writing assistance
- file uploads or profile photos
- multilingual UI
- collaboration or team accounts
