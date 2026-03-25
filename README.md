# Gym Workout Management App Backend

## Status

This repository now contains the implemented auth flow and the first workout persistence flow.

Implemented now:

- NestJS backend scaffold
- Prisma schema, generated client, and auth migration
- PostgreSQL-backed `roles` and `users`
- PostgreSQL-backed `workout_plans`, `workout_days`, and `exercises`
- Google OAuth redirect start and callback
- short-lived JWT issuance
- protected `GET /auth/me`
- protected `GET /workouts`
- protected `POST /workouts`
- workout persistence scoped to the authenticated trainer
- Docker image with auto-applied Prisma migrations
- health endpoint
- unit, integration, smoke, lint, and build validation

Not implemented yet:

- availability and booking modules
- CI/CD

## Fixed Stack

- Node.js LTS
- NestJS
- PostgreSQL
- Prisma ORM

## Current Commands

- `npm run lint`
- `npm test`
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:smoke`
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:migrate`

## Docker

Local startup now uses the shared compose stack at `/Users/vadimsduboiss/Codebase/docker-compose.yml`.

- backend URL: `http://localhost:3000`
- health URL: `http://localhost:3000/health`
- postgres port: `localhost:55432`

Run from `/Users/vadimsduboiss/Codebase`:

- `docker compose up --build`

## Environment

Create `/Users/vadimsduboiss/Codebase/gym-workout-management-app-backend/.env` from `.env.example`.

Required keys:

- `PORT=3000`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:55432/gym_auth?schema=public`
- `JWT_SECRET=<long-random-secret>`
- `GOOGLE_CLIENT_ID=<google-web-client-id>`
- `GOOGLE_CLIENT_SECRET=<google-web-client-secret>`
- `GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback`
- `ALLOWED_REDIRECT_ORIGINS=http://localhost:8081,http://wellness-app.adlerclub.tech`

Compose overrides only `DATABASE_URL` internally so the backend container talks to the `postgres` service while host-side tooling still works against `localhost:55432`.
