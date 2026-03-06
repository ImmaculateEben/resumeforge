# Security And Runbooks

## Security Objectives

- Protect account credentials and saved resume data.
- Minimize stored data by keeping guest drafts out of the backend.
- Prevent abuse of auth and export endpoints.
- Ensure all privileged actions are attributable and recoverable.

## Baseline Controls

### Authentication and sessions

- Passwords are hashed with `Argon2id`.
- Session cookies must be `HttpOnly`, `Secure`, and `SameSite=Lax`.
- New sessions store IP and user agent metadata for audit and anomaly review.
- Suspended users are denied new sessions and active sessions are revoked.

### Input validation

- All request bodies use shared Zod validation on the server.
- Resume text fields allow plain text only.
- URL fields require protocol allowlisting for `https://` and `http://`.
- Payload size limits are enforced before parsing large bodies.

### Abuse prevention

- Rate-limit auth, export, and save endpoints using Upstash.
- Add bot checks on registration, password reset, and guest export.
- Emit security log events for brute-force indicators and repeated export failures.

### Access control

- Authenticated data access is always filtered by `user_id`.
- Admin access requires `role=admin` and must be re-checked on every admin API route.
- All admin mutations write to `admin_audit_logs`.

### Data protection

- Guest drafts remain in browser storage only.
- Saved resumes are stored in PostgreSQL with least-privilege database access.
- Password reset and verification tokens are stored as hashes, never plaintext.
- Backups use managed point-in-time restore and encrypted storage.

## Rate-Limit Policy

| Flow | Limit | Key |
| --- | --- | --- |
| Register | 5 per 15 minutes | IP + email |
| Login | 5 per 15 minutes | IP + email |
| Password reset request | 5 per 15 minutes | IP + email |
| Guest PDF export | 10 per hour | IP + session fingerprint |
| Authenticated save/export | 30 per hour | user ID |
| Admin mutations | 60 per hour | admin user ID |

## Security Checklist Before Launch

- Verify CSRF protection on all cookie-based mutations.
- Verify secure cookie flags in production.
- Verify password hashing uses current Argon2 parameters.
- Verify rate limits return consistent `429` responses.
- Verify audit logs are written for every admin mutation.
- Verify suspended users cannot create new sessions.
- Verify guest export does not create database records.
- Verify soft-delete purge job excludes active resumes.
- Verify backup restore works in staging.
- Verify error tracking and alert routing are live.

## Operational Procedures

## Account suspension

1. Admin opens the user record in `/admin/users`.
2. Admin selects `Suspend`.
3. Admin enters a required reason.
4. System updates user status to `suspended`.
5. System revokes active sessions.
6. System writes an audit log with actor, target, reason, and timestamp.

## Account unsuspension

1. Admin opens a suspended user record.
2. Admin selects `Unsuspend`.
3. Admin records the reason for reversal.
4. System updates user status to `active`.
5. System writes the reversal audit log.

## Password reset

1. User requests reset from the auth screen.
2. System rate-limits and accepts the request without revealing account existence.
3. System sends a reset email with a single-use token.
4. User submits a new password.
5. System validates token, updates password hash, invalidates old sessions, and marks the token consumed.

## Backup and restore

1. Confirm Neon point-in-time restore is enabled.
2. Record the target recovery timestamp.
3. Restore to a staging clone first.
4. Validate auth, templates, resumes, and admin logs in the restored clone.
5. If production recovery is required, follow provider failover guidance and communicate downtime.

## Secret rotation

1. Rotate one secret at a time per environment.
2. Update provider secret store.
3. Redeploy affected services.
4. Verify auth, email, and rate-limit integrations.
5. Revoke the prior secret after successful validation.

## Incident Response

### Severity 1 examples

- Authentication outage
- Data exposure
- PDF export outage affecting most users
- Admin authorization bypass

### Response steps

1. Acknowledge the incident and assign an incident lead.
2. Freeze non-essential deployments.
3. Identify affected endpoints and time window.
4. Mitigate by feature flag, rate-limit change, suspension, or rollback.
5. Validate service recovery in production.
6. Write a post-incident review with root cause and follow-up actions.

## Monitoring And Alerts

- Alert on elevated login failure rate.
- Alert on repeated `429` spikes for export.
- Alert on elevated PDF render failures.
- Alert on admin privilege changes and suspension events.
- Alert on application exceptions affecting dashboard, builder, or admin routes.
