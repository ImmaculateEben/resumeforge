# API Contract

## Conventions

- Base path: `/api`
- Request and response bodies use JSON except PDF downloads.
- Authenticated endpoints use database-backed session cookies.
- All mutation endpoints require CSRF validation.
- Every mutation endpoint returns a request ID in response headers for tracing.

## Response Envelope

### Success

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

### Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Payload validation failed.",
    "details": []
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

## Authorization Matrix

| Endpoint group | Guest | User | Admin |
| --- | --- | --- | --- |
| Public template read | Yes | Yes | Yes |
| Guest PDF export | Yes | Yes | Yes |
| Resume CRUD | No | Own records only | Own records only |
| Resume duplication/version history | No | Own records only | Own records only |
| Admin templates | No | No | Yes |
| Admin users | No | No | Yes |
| Admin audit logs | No | No | Yes |

## Auth Endpoints

### `POST /api/auth/register`

- Purpose: create an account with email/password
- Body: `email`, `password`, `fullName`
- Success: `201 Created`
- Side effects: creates an active user, starts a session immediately, and sends a verification email

### `POST /api/auth/login`

- Purpose: authenticate an existing user
- Body: `email`, `password`
- Success: `200 OK`
- Failure: `401 INVALID_CREDENTIALS`, `403 ACCOUNT_SUSPENDED`

### `POST /api/auth/logout`

- Purpose: revoke current session
- Auth: required
- Success: `204 No Content`

### `POST /api/auth/password/forgot`

- Purpose: issue password reset email
- Body: `email`
- Success: always `202 Accepted` to avoid email enumeration

### `POST /api/auth/password/reset`

- Purpose: complete password reset
- Body: `token`, `newPassword`
- Success: `200 OK`

### `POST /api/auth/verify-email`

- Purpose: complete email verification
- Body: `token`
- Success: `200 OK`

## Resume Endpoints

### `GET /api/resumes`

- Auth: required
- Query params: `status=active|archived|deleted`, `page`, `pageSize`
- Returns: paginated list of current user's resumes

### `POST /api/resumes`

- Auth: required
- Headers: `Idempotency-Key`
- Body:
  - `title`
  - `payload` as `ResumeDraftPayload v1`
  - `source` as `guest_import` or `dashboard_create`
- Success: `201 Created`
- Side effects: creates resume row and version `1`

### `GET /api/resumes/:resumeId`

- Auth: required
- Returns: current resume metadata and payload
- Access: owner only

### `PATCH /api/resumes/:resumeId`

- Auth: required
- Body: `title`, `payload`, `status`, `changeSummary`
- Success: `200 OK`
- Side effects: updates current row and inserts next version snapshot

### `DELETE /api/resumes/:resumeId`

- Auth: required
- Behavior: soft-delete by setting `deleted_at`
- Success: `204 No Content`

### `POST /api/resumes/:resumeId/duplicate`

- Auth: required
- Body: optional `title`
- Success: `201 Created`
- Side effects: clones latest payload into new resume and version `1`

### `POST /api/resumes/:resumeId/restore`

- Auth: required
- Behavior: restore a soft-deleted resume within retention window
- Success: `200 OK`

## Export Endpoint

### `POST /api/export/pdf`

- Auth: optional
- Body:
  - `payload` as `ResumeDraftPayload v1`
  - `fileName` optional
- Success: `200 OK` with `application/pdf`
- Failure:
  - `400 VALIDATION_ERROR`
  - `429 RATE_LIMITED`
  - `500 PDF_RENDER_FAILED`
- Rules:
  - No persistence
  - Guest rate limit by IP/session
  - Authenticated rate limit by user ID

## Admin Endpoints

### `GET /api/admin/templates`

- Auth: admin only
- Returns: template list including inactive entries

### `POST /api/admin/templates`

- Auth: admin only
- Body: `key`, `name`, `description`, `metadata`, `layoutConfig`, `isActive`
- Success: `201 Created`
- Audit: required

### `PATCH /api/admin/templates/:templateKey`

- Auth: admin only
- Body: partial update of template metadata, layout config, or activation status
- Success: `200 OK`
- Audit: required

### `GET /api/admin/users`

- Auth: admin only
- Query params: `q`, `status`, `role`, `page`, `pageSize`
- Returns: searchable user list

### `POST /api/admin/users/:userId/suspend`

- Auth: admin only
- Body: `reason`, `action` as `suspend` or `unsuspend`
- Success: `200 OK`
- Side effects: updates user status and invalidates active sessions
- Audit: required

### `GET /api/admin/audit-logs`

- Auth: admin only
- Query params: `actorUserId`, `targetType`, `action`, `from`, `to`, `page`
- Returns: paginated audit log list

## Error Codes

| Code | Meaning |
| --- | --- |
| `VALIDATION_ERROR` | Input failed schema validation |
| `UNAUTHENTICATED` | No valid session |
| `FORBIDDEN` | Authenticated but not authorized |
| `ACCOUNT_SUSPENDED` | Suspended user blocked from auth/app routes |
| `NOT_FOUND` | Record does not exist or is not visible |
| `RATE_LIMITED` | Request exceeded policy |
| `PDF_RENDER_FAILED` | Export service failed |
| `CONFLICT` | Idempotency or unique constraint conflict |

## Rate Limits

- Login, register, and reset request: 5 attempts per 15 minutes per IP and email
- Guest PDF export: 10 requests per hour per IP/session
- Authenticated save and export: 30 requests per hour per user

## Idempotency Rules

- `POST /api/resumes` requires `Idempotency-Key` when `source=guest_import`.
- Server stores a short-lived idempotency record per user and key to prevent duplicate imports after retries.
- Duplicate key with identical payload returns the existing created resume metadata.
