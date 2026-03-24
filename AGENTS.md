# Backend Agent Instructions

## Purpose

Persist project instructions for future AI and human contributors.

## Non-Negotiable Rules

- Create a plan before implementing anything.
- Follow the plan strictly unless architecture or logic requires adjustment.
- Keep [`ROADMAP.md`](./ROADMAP.md) updated at all times.
- Implement only the behavior shown in screenshots and written project instructions.
- Do not add extra features.
- Use latest stable versions when dependencies are introduced.
- Keep code minimal, clean, and without redundant abstractions.
- Functionality must fully work or fail clearly.
- Do not keep partial fallback logic.

## Fixed Backend Stack

- Node.js LTS
- NestJS
- PostgreSQL
- Prisma ORM
- Google OAuth
- JWT

## Functional Scope

- Google Sign-In entry endpoint
- Users and roles
- Workout plan CRUD
- Exercise CRUD
- Availability slot create, update, delete, and repeat handling
- Booking create and list flows

## Testing And Validation

When code exists:

- 100% of code must be covered by unit, integration, e2e, and smoke tests.
- Run all relevant tests after every change.
- Do not continue if tests fail.
- Validate backend behavior using real API calls.
- Validate full end-to-end flow with the frontend.
- Do not treat application startup as proof of correctness.

## Documentation Requirements

Keep these files accurate at all times:

- [`README.md`](./README.md)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- [`ROADMAP.md`](./ROADMAP.md)
- [`AGENTS.md`](./AGENTS.md)
- [`SECURITY.md`](./SECURITY.md)
- [`MAKEFILE.md`](./MAKEFILE.md)
- [`API.md`](./API.md)

## Current Repository State

This repository currently contains documentation and `.gitignore` only. No backend implementation has started yet.
