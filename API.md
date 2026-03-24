# Backend API Specification Notes

## Current State

No backend API implementation exists yet.

## Required Endpoint Surface

Authentication:

- `POST /auth/google`

Workout management:

- CRUD workout plans
- CRUD exercises

Availability:

- create slots
- update slots
- delete slots
- list slots
- backend-side repeat expansion logic

Booking:

- book slot
- list slots
- list bookings

## API Rules

- All endpoints must be validated.
- All protected endpoints must be secured.
- No fallback responses.
- Authorization must enforce role and ownership rules.
- Contract must stay aligned with the Prisma relational model.

## Constraint

This file documents the required API surface only. It must be updated to match the real implementation once backend work begins.
