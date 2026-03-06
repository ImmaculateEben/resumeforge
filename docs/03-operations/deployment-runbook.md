# Deployment Runbook

## Environments

- `local`: developer machine
- `staging`: pre-production validation
- `production`: live traffic

Each environment must use separate database, Redis, and email settings.

## Provisioning Sequence

1. Create Vercel project and configure environment separation.
2. Provision Neon Postgres for staging and production.
3. Provision Upstash Redis for rate limiting.
4. Provision Resend domain and sender identity.
5. Provision Sentry project and alert routing.
6. Store all secrets in the hosting platform secret manager.

## Required Configuration

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_DSN`

## Deployment Procedure

1. Merge approved code to the main branch.
2. Apply database migrations to staging.
3. Deploy staging.
4. Run staging smoke checks:
   - landing page loads
   - builder loads without auth
   - guest PDF export works
   - registration, login, password reset, and email verification work
   - authenticated save appears in dashboard
   - admin routes reject non-admin users and allow admins
5. Apply database migrations to production during the approved window.
6. Deploy production.
7. Run production smoke checks on the same path set.
8. Monitor logs, Sentry, and rate-limit metrics for 30 minutes after deploy.

## Rollback Procedure

1. Identify whether failure is code, migration, or provider related.
2. Roll back application deployment first if the schema remains compatible.
3. If migration caused the issue, restore database using point-in-time recovery into a verified target state.
4. Re-run smoke checks before reopening traffic.
5. Record incident summary and remediation items.

## Post-Deployment Checklist

- Confirm verification and reset emails are delivered.
- Confirm dashboard lists only the signed-in user's resumes.
- Confirm guest export leaves no new database records.
- Confirm audit logs are written for test admin actions.
- Confirm rate limits and alerts are active.

## Scheduled Operations

### Daily

- Review error and export failure trends
- Review admin audit log anomalies

### Weekly

- Review suspended accounts
- Review template activation state and preview correctness

### Monthly

- Test backup restore in staging
- Review secret age and rotate if needed
- Review rate-limit thresholds against traffic

## Release Gate

Do not deploy to production until staging has passed the smoke checklist and the security checklist in `security-and-runbooks.md`.
