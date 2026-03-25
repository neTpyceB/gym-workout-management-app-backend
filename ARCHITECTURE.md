# Backend Architecture

## Current State

The repository contains a working auth backend plus the first workout module.

Implemented now:

- `auth` controller/service
- Prisma-backed `users` and `roles`
- Prisma-backed `workout_plans`, `workout_days`, and `exercises`
- Google OAuth redirect flow
- JWT verification for protected user lookup
- protected workout create/list endpoints
- `GET /health`
- Dockerized runtime with Prisma migration deployment at container start

## Current Auth Flow

1. Frontend calls `GET /auth/google` with an allowed redirect origin.
2. Backend signs auth state and redirects to Google.
3. Google redirects to `GET /auth/google/callback`.
4. Backend verifies the Google identity, upserts the user with role `Trainer`, issues a short-lived JWT, and redirects back to the frontend.
5. Frontend validates the JWT through `GET /auth/me`.
6. Authenticated workout requests are scoped to the JWT user id.

## Current Workout Flow

1. Frontend calls `GET /workouts` with the trainer JWT.
2. Backend lists only the workout plans belonging to that trainer.
3. Frontend calls `POST /workouts` with workout name, description, days, and exercises.
4. Backend validates the payload and persists the relational workout structure through Prisma.

## Local Container Runtime

- Compose injects container-local PostgreSQL connectivity through `DATABASE_URL`
- Backend listens on `0.0.0.0:3000` inside the container and is published on `localhost:3000`
- Prisma migrations run before the production server starts
