# Documentation Index

This index organizes the ResumeForge v1 documents in build order so the project can move from product definition to implementation without revisiting open decisions.

## 1. Product

- [PRD](01-product/prd.md): product scope, users, goals, requirements, non-goals, and success metrics
- [UX Flows](01-product/ux-flows.md): sitemap, key user journeys, screen states, and UX constraints

## 2. Technical

- [Resume Draft Payload](02-technical/resume-draft-payload.md): canonical resume content contract and field rules
- [Database Schema](02-technical/database-schema.md): logical ERD, tables, indexes, retention, and access constraints
- [Architecture Spec](02-technical/architecture.md): application structure, service boundaries, rendering flow, and observability
- [API Contract](02-technical/api-contract.md): route definitions, request and response envelopes, auth matrix, and error model

## 3. Operations

- [Security and Runbooks](03-operations/security-and-runbooks.md): controls, rate limits, incident handling, recovery, and secret rotation
- [Admin Console Spec](03-operations/admin-console-spec.md): admin scope, permissions, workflows, and audit requirements
- [Deployment Runbook](03-operations/deployment-runbook.md): environment setup, deployment, rollback, and post-deploy checks

## 4. Delivery

- [Roadmap](04-delivery/roadmap.md): implementation phases, entry and exit criteria, and scope control
- [Test Plan](04-delivery/test-plan.md): acceptance scenarios, failure cases, and staging verification

## Locked Decisions

- Anonymous users can enter the builder without signup.
- Guest work-in-progress is stored only in browser storage with a 7-day TTL.
- Downloading PDF is allowed for guests.
- Saving, versioning, dashboard access, and cross-device access require registration or login.
- v1 excludes payments, DOCX, AI writing assistance, file uploads, collaboration, and multilingual support.
