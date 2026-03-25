# Backend API Specification Notes

## Current State

Implemented now:

- `GET /health`
- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/me`
- `GET /workouts`
- `POST /workouts`
- `POST /availability`

## Current Endpoint Surface

Authentication:

- `GET /auth/google?redirectUri=<frontend-origin>`
- `GET /auth/google/callback?code=<google-code>&state=<signed-state>`
- `GET /auth/me`
- `GET /workouts`
- `POST /workouts`
- `POST /availability`

Workout payload:

- `name: string`
- `description: string`
- `days: array`
- `days[].name: string`
- `days[].exercises: array`
- `days[].exercises[].name: string`
- `days[].exercises[].sets: integer`
- `days[].exercises[].reps: integer`

Availability payload:

- `dates: string[]`
- `startTime: string`
- `endTime: string`
- `sessionName: string`

Health:

- `GET /health`

Container runtime:

- local compose publishes backend on `http://localhost:3000`

Booking endpoints are not implemented yet.
