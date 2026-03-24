# Backend Architecture

## Current State

No application code exists yet in this repository.

## Planned Module Structure

Backend modules must be limited to:

- `auth`
- `users`
- `workouts`
- `exercises`
- `availability`
- `bookings`

## Required Data Model

Strict relational model only:

- `users`
- `roles`
- `workout_plans`
- `workout_days`
- `exercises`
- `availability_slots`
- `bookings`

Required relations:

- User → Role
- Workout → Days → Exercises
- Availability → TimeSlots
- Booking → User + Slot

## Cross-Cutting Rules

- Google OAuth for authentication entry
- Short-lived JWT only
- Prisma migrations only
- Request validation on all endpoints
- Role and ownership-based authorization
- No fallback responses

## Validation Requirement

This architecture is planned only. It becomes authoritative for implementation once screenshots are provided and code work starts.
