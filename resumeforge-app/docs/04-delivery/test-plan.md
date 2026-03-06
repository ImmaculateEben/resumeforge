# Test Plan

## Test Strategy

- Validate the product by user journey, not isolated screens.
- Confirm security behavior on every privileged route.
- Verify guest workflows never leak into backend persistence.
- Run all acceptance scenarios in staging before production launch.

## Acceptance Scenarios

## Guest builder

1. Guest opens `/builder` without authentication.
2. Guest enters basics, summary, and experience data.
3. Guest refreshes the page and recovers the local draft.
4. Guest can change templates without losing structured content.

## Guest PDF export

1. Guest clicks `Download PDF`.
2. Export returns a valid PDF file.
3. Database remains unchanged after export.
4. Guest export rate limit triggers correctly after the threshold is exceeded.

## Guest save gate

1. Guest clicks `Save`.
2. Auth flow is shown.
3. After signup or login, local draft import is offered.
4. Successful import creates one resume and version `1`.
5. Repeating the same import request with the same idempotency key does not create duplicates.

## Authenticated dashboard

1. Authenticated user sees only their own resumes.
2. User can create, edit, rename, duplicate, archive, delete, and restore a resume.
3. Editing creates the next version snapshot.
4. Soft-deleted resumes disappear from the active list and can be restored within 30 days.

## Access control

1. Guest cannot call authenticated resume APIs.
2. User A cannot read or mutate User B's resume by ID.
3. Non-admin user cannot access admin pages or admin APIs.
4. Suspended user cannot create a new session or perform authenticated mutations.

## Admin console

1. Admin can search users.
2. Admin can suspend and unsuspend a user with mandatory reason entry.
3. Admin can update template metadata and activation state.
4. Each admin mutation writes a complete audit record.

## Failure and abuse cases

1. Invalid payload is rejected with `VALIDATION_ERROR`.
2. Oversized content is rejected before persistence or export.
3. Repeated failed logins trigger rate-limit responses.
4. XSS-like strings are stored and rendered as plain text, not executed.
5. CSRF attempts on cookie-based mutations are rejected.
6. PDF renderer failure returns controlled error response and logs telemetry.

## Operational Validation

- Password reset emails deliver and complete successfully.
- Email verification works and updates account state.
- Backup restore is tested in staging.
- Monitoring and alert routing trigger on simulated failures.

## Launch Gate

Production launch is blocked until:

- all acceptance scenarios pass in staging
- security checklist is complete
- rollback procedure is rehearsed
- admin audit log verification passes
