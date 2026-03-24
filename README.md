# Gym Workout Management App Backend

## Status

This repository currently contains project documentation and repository hygiene files only.

Not implemented yet:

- NestJS application scaffold
- Prisma schema and migrations
- PostgreSQL integration
- Authentication
- REST API endpoints
- Tests
- Docker assets
- CI/CD

## Fixed Scope

Backend scope is limited to the behavior required by the screenshots and project instructions.

Allowed functional areas:

- Google Sign-In
- JWT authentication
- Users and roles
- Workout plan CRUD
- Exercise CRUD
- Availability slot management with repeat handling
- Booking flow

No extra features are allowed beyond the screenshots.

## Fixed Stack

- Node.js LTS
- NestJS
- PostgreSQL
- Prisma ORM

## Delivery Rules

- Create a plan before implementation.
- Keep [`ROADMAP.md`](./ROADMAP.md) updated with completed, current, and next steps.
- Keep all mandatory docs aligned with the real repository state.
- Use Prisma migrations only.
- Run full validation after every change once code exists.

## Source Of Truth

- Screenshots provided by the user
- [`AGENTS.md`](./AGENTS.md)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- [`API.md`](./API.md)
