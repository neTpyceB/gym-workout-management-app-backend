# Backend Architecture

## Current State

The repository contains a working auth-focused backend for screen 1.

Implemented now:

- `auth` controller/service
- Prisma-backed `users` and `roles`
- Google OAuth redirect flow
- JWT verification for protected user lookup
- `GET /health`
- Dockerized runtime with Prisma migration deployment at container start

## Current Auth Flow

1. Frontend calls `GET /auth/google` with an allowed redirect origin.
2. Backend signs auth state and redirects to Google.
3. Google redirects to `GET /auth/google/callback`.
4. Backend verifies the Google identity, upserts the user with role `Trainer`, issues a short-lived JWT, and redirects back to the frontend.
5. Frontend validates the JWT through `GET /auth/me`.

## Local Container Runtime

- Compose injects container-local PostgreSQL connectivity through `DATABASE_URL`
- Backend listens on `0.0.0.0:3000` inside the container and is published on `localhost:3000`
- Prisma migrations run before the production server starts
