# Admin Console Specification

## Purpose

The admin console provides operational control over users, templates, and privileged activity. It is an internal-only surface and must not be exposed to non-admin users.

## Admin Roles

- `admin`: full access to admin routes and mutations

No secondary admin roles are defined in v1. If role differentiation is needed later, add it as a separate scope decision rather than expanding ad hoc.

## Admin Modules

## Dashboard

- Surface platform summary metrics:
  - total users
  - active users in the last 30 days
  - active resumes
  - archived resumes
  - recent export failures
  - recent suspension actions

## Users

- Search by email or name
- Filter by status and role
- View account metadata:
  - email
  - verification state
  - current status
  - created date
  - last login
  - resume count
- Suspend or unsuspend accounts with mandatory reason capture

## Templates

- Create template metadata records
- Edit name, description, preview metadata, display order, and activation status
- Update rendering tokens in `layout_config_json`
- Prevent deletion of templates referenced by active resumes; use deactivation instead

## Audit Logs

- View immutable privileged action history
- Filter by actor, target type, action, and date range
- Show before and after state summaries when available

## Required Permissions

| Action | Admin |
| --- | --- |
| View admin dashboard | Yes |
| View users | Yes |
| Suspend users | Yes |
| View templates | Yes |
| Create or update templates | Yes |
| View audit logs | Yes |

## UX Requirements

- Use a distinct admin navigation shell.
- Hide admin navigation from non-admin users entirely.
- Require server-side role check for every admin page render and API call.
- Show confirmation modal for suspension and unsuspension actions.
- Include request ID and timestamp on audit-log detail views for support traceability.

## Audit Requirements

Write audit records for:

- user suspension
- user unsuspension
- template creation
- template activation or deactivation
- template metadata update
- any future privileged action added after v1

Each audit record must include:

- actor user ID
- action
- target type
- target ID
- before state summary when applicable
- after state summary when applicable
- source IP
- user agent
- timestamp

## Support Procedures

## Suspend a user

1. Find the user by email.
2. Review status, recent login, and resume count.
3. Enter suspension reason.
4. Confirm action.
5. Verify audit record creation.

## Update a template

1. Open target template.
2. Review current activation state and version.
3. Apply metadata or layout token update.
4. Increment template version.
5. Save changes and verify audit log entry.

## Non-Goals

- Direct editing of user resumes by admins
- Impersonation sessions
- Bulk upload of templates
- Billing, entitlements, or plan management
