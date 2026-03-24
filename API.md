# Backend API Specification Notes

## Current State

Implemented now:

- `GET /health`
- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/me`

## Current Endpoint Surface

Authentication:

- `GET /auth/google?redirectUri=<frontend-origin>`
- `GET /auth/google/callback?code=<google-code>&state=<signed-state>`
- `GET /auth/me`

Health:

- `GET /health`

Container runtime:

- local compose publishes backend on `http://localhost:3000`

Workout, availability, and booking endpoints are not implemented yet.
