# Backend Security

## Current State

Implemented now:

- allowed redirect-origin validation for Google auth start
- signed auth state between OAuth start and callback
- Google ID token verification
- short-lived JWT issuance only
- protected `GET /auth/me`
- role assignment fixed to `Trainer`
- browser-facing CORS limited to configured frontend origins

## Verified Now

- invalid redirect origins are rejected
- valid redirect origins enter Google OAuth flow
- backend health endpoint responds
- protected auth endpoints are implemented behind JWT auth
- local Docker runtime keeps PostgreSQL unexposed except the mapped development port
